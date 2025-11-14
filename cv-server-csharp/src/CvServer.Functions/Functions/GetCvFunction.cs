using System.Net;
using CvServer.Functions.Interfaces;
using CvServer.Functions.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using RazorLight;

namespace CvServer.Functions.Functions;

/// <summary>
/// Azure Function that renders CV data as HTML using Razor templates
/// Endpoint: GET /{branchName}
/// Example: GET /main returns CV from the 'main' branch
/// </summary>
public class GetCvFunction
{
    private readonly IDataStore<Cv> _dataStore;
    private readonly ISanitiser _sanitiser;
    private readonly IRazorLightEngine _razorEngine;
    private readonly ILogger<GetCvFunction> _logger;

    public GetCvFunction(
        IDataStore<Cv> dataStore,
        ISanitiser sanitiser,
        IRazorLightEngine razorEngine,
        ILogger<GetCvFunction> logger)
    {
        _dataStore = dataStore ?? throw new ArgumentNullException(nameof(dataStore));
        _sanitiser = sanitiser ?? throw new ArgumentNullException(nameof(sanitiser));
        _razorEngine = razorEngine ?? throw new ArgumentNullException(nameof(razorEngine));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// HTTP GET endpoint that returns rendered CV HTML
    /// </summary>
    /// <param name="req">HTTP request</param>
    /// <param name="branchName">Git branch name from URL route</param>
    /// <returns>HTML response with rendered CV or error page</returns>
    [Function("GetCv")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "{branchName}")]
        HttpRequestData req,
        string branchName)
    {
        _logger.LogInformation("CV request received for branch: {BranchName}", branchName);

        // Validate branch name is provided
        if (string.IsNullOrWhiteSpace(branchName))
        {
            _logger.LogWarning("Branch name was not provided");
            return await CreateErrorResponse(req, HttpStatusCode.BadRequest, "Branch name is required");
        }

        // Sanitize branch name to prevent path traversal and injection attacks
        var sanitizedBranchName = _sanitiser.Sanitise(branchName);

        if (string.IsNullOrWhiteSpace(sanitizedBranchName))
        {
            _logger.LogWarning("Branch name contained only invalid characters: {BranchName}", branchName);
            return await CreateErrorResponse(
                req,
                HttpStatusCode.BadRequest,
                "Branch name contains invalid characters");
        }

        if (sanitizedBranchName != branchName)
        {
            _logger.LogWarning(
                "Branch name was sanitized from '{Original}' to '{Sanitized}'",
                branchName,
                sanitizedBranchName);
        }

        try
        {
            // Fetch CV data from GitHub
            var cvData = await _dataStore.GetByIdAsync(sanitizedBranchName);

            if (cvData == null)
            {
                _logger.LogWarning("CV data not found for branch: {BranchName}", sanitizedBranchName);
                return await CreateErrorResponse(
                    req,
                    HttpStatusCode.NotFound,
                    $"CV data not found for branch '{sanitizedBranchName}'");
            }

            // Render HTML using Razor template
            var html = await _razorEngine.CompileRenderAsync("CvTemplate", cvData);

            // Return HTML response
            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "text/html; charset=utf-8");

            // Add cache headers for performance (cache for 5 minutes)
            response.Headers.Add("Cache-Control", "public, max-age=300");

            await response.WriteStringAsync(html);

            _logger.LogInformation("Successfully rendered CV for branch: {BranchName}", sanitizedBranchName);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rendering CV for branch: {BranchName}", sanitizedBranchName);
            return await CreateErrorResponse(
                req,
                HttpStatusCode.InternalServerError,
                "An error occurred while rendering your CV");
        }
    }

    /// <summary>
    /// Creates a standardized error response with HTML
    /// </summary>
    private async Task<HttpResponseData> CreateErrorResponse(
        HttpRequestData req,
        HttpStatusCode statusCode,
        string message)
    {
        var response = req.CreateResponse(statusCode);
        response.Headers.Add("Content-Type", "text/html; charset=utf-8");

        var errorHtml = $@"
<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Error {(int)statusCode}</title>
    <style>
        body {{ font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; }}
        .error {{ background: #fee; border: 2px solid #c33; border-radius: 8px; padding: 20px; }}
        h1 {{ color: #c33; margin-top: 0; }}
        code {{ background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }}
    </style>
</head>
<body>
    <div class=""error"">
        <h1>Error {(int)statusCode}</h1>
        <p>{message}</p>
        <p><small>Try accessing a valid branch name, e.g., <code>/main</code> or <code>/develop</code></small></p>
    </div>
</body>
</html>";

        await response.WriteStringAsync(errorHtml);
        return response;
    }
}
