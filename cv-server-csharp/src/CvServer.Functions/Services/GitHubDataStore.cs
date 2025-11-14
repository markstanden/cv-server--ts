using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using CvServer.Functions.Interfaces;
using CvServer.Functions.Models;
using Octokit;

namespace CvServer.Functions.Services;

/// <summary>
/// Data store implementation that fetches CV data from a GitHub repository
/// Supports branch-specific CV variants stored as JSON files
/// </summary>
public partial class GitHubDataStore : IDataStore<Cv>
{
    private readonly GitHubClient _client;
    private readonly string _owner;
    private readonly string _repository;
    private readonly string _directory;
    private readonly string _filename;

    /// <summary>
    /// Creates a new GitHub data store
    /// </summary>
    /// <param name="owner">GitHub repository owner (username or organization)</param>
    /// <param name="repository">Repository name</param>
    /// <param name="token">GitHub Personal Access Token</param>
    /// <param name="directory">Optional subdirectory path within the repository</param>
    /// <param name="filename">JSON filename (default: cv-data.json)</param>
    public GitHubDataStore(
        string owner,
        string repository,
        string token,
        string? directory = null,
        string? filename = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(owner);
        ArgumentException.ThrowIfNullOrWhiteSpace(repository);
        ArgumentException.ThrowIfNullOrWhiteSpace(token);

        _owner = owner;
        _repository = repository;
        _directory = directory ?? string.Empty;
        _filename = filename ?? "cv-data.json";

        _client = new GitHubClient(new ProductHeaderValue("CvServer"))
        {
            Credentials = new Credentials(token)
        };
    }

    /// <summary>
    /// Retrieves CV data for a specific Git branch
    /// </summary>
    /// <param name="branchName">Git branch name (e.g., "main", "feature-frontend")</param>
    /// <returns>CV data if found, null if branch or file doesn't exist</returns>
    public async Task<Cv?> GetByIdAsync(string branchName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(branchName);

        try
        {
            // Build file path
            var filePath = string.IsNullOrEmpty(_directory)
                ? _filename
                : $"{_directory.TrimEnd('/')}/{_filename}";

            // Fetch file content from GitHub API
            var contents = await _client.Repository.Content.GetAllContentsByRef(
                _owner,
                _repository,
                filePath,
                branchName
            );

            if (contents == null || contents.Count == 0)
                return null;

            var fileContent = contents[0];

            // Decode Base64 content
            var jsonContent = Encoding.UTF8.GetString(Convert.FromBase64String(fileContent.Content));

            // Replace %BRANCH_NAME% placeholder (similar to TypeScript implementation)
            jsonContent = ReplaceBranchNamePlaceholder(jsonContent, branchName);

            // Deserialize to CV model
            var cv = JsonSerializer.Deserialize<Cv>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return cv;
        }
        catch (NotFoundException)
        {
            // Branch or file doesn't exist
            return null;
        }
        catch (ApiException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    /// <summary>
    /// Replaces %BRANCH_NAME% placeholders in content with actual branch name
    /// Useful for branch-specific URLs or references in CV data
    /// </summary>
    private static string ReplaceBranchNamePlaceholder(string content, string branchName)
    {
        return BranchNamePlaceholderRegex().Replace(content, branchName);
    }

    [GeneratedRegex("%BRANCH_NAME%", RegexOptions.IgnoreCase)]
    private static partial Regex BranchNamePlaceholderRegex();

    /// <summary>
    /// Factory method: Creates GitHubDataStore from environment variables
    /// </summary>
    public static GitHubDataStore CreateFromEnvironment()
    {
        var owner = Environment.GetEnvironmentVariable("GITHUB_USERNAME")
            ?? throw new InvalidOperationException("GITHUB_USERNAME environment variable is required");

        var repo = Environment.GetEnvironmentVariable("GITHUB_REPO")
            ?? throw new InvalidOperationException("GITHUB_REPO environment variable is required");

        var token = Environment.GetEnvironmentVariable("GITHUB_API_KEY")
            ?? throw new InvalidOperationException("GITHUB_API_KEY environment variable is required");

        var directory = Environment.GetEnvironmentVariable("GITHUB_REPO_DIRECTORY");
        var filename = Environment.GetEnvironmentVariable("GITHUB_REPO_FILENAME");

        return new GitHubDataStore(owner, repo, token, directory, filename);
    }
}
