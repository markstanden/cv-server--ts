using System.Net;
using CvServer.Functions.Functions;
using CvServer.Functions.Interfaces;
using CvServer.Functions.Models;
using Shouldly;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using RazorLight;
using Xunit;

namespace CvServer.Functions.Tests.Functions;

/// <summary>
/// TDD Tests for GetCvFunction
/// Matches TypeScript getData behavior - rejects requests if sanitization changes input
/// Tests the HTTP endpoint behavior, validation, and error handling
/// </summary>
public class GetCvFunctionTests
{
    private readonly Mock<IDataStore<Cv>> _mockDataStore;
    private readonly Mock<ISanitiser> _mockSanitiser;
    private readonly Mock<IRazorLightEngine> _mockRazorEngine;
    private readonly Mock<ILogger<GetCvFunction>> _mockLogger;
    private readonly GetCvFunction _function;

    public GetCvFunctionTests()
    {
        _mockDataStore = new Mock<IDataStore<Cv>>();
        _mockSanitiser = new Mock<ISanitiser>();
        _mockRazorEngine = new Mock<IRazorLightEngine>();
        _mockLogger = new Mock<ILogger<GetCvFunction>>();

        _function = new GetCvFunction(
            _mockDataStore.Object,
            _mockSanitiser.Object,
            _mockRazorEngine.Object,
            _mockLogger.Object);
    }

    [Fact]
    public async Task Run_ValidBranch_Returns200WithHtml()
    {
        // Arrange
        var branchName = "main";
        var cvData = CreateSampleCv();
        var expectedHtml = "<html><body>CV Content</body></html>";

        _mockSanitiser.Setup(s => s.Sanitise(branchName)).Returns(branchName);
        _mockDataStore.Setup(d => d.GetByIdAsync(branchName)).ReturnsAsync(cvData);
        _mockRazorEngine.Setup(r => r.CompileRenderAsync("CvTemplate", cvData, null))
            .ReturnsAsync(expectedHtml);

        var mockRequest = CreateMockHttpRequest();

        // Act
        var response = await _function.Run(mockRequest.Object, branchName);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        _mockDataStore.Verify(d => d.GetByIdAsync(branchName), Times.Once);
        _mockRazorEngine.Verify(r => r.CompileRenderAsync("CvTemplate", cvData, null), Times.Once);
    }

    [Fact]
    public async Task Run_EmptyBranchName_Returns400()
    {
        // Arrange
        var mockRequest = CreateMockHttpRequest();

        // Act
        var response = await _function.Run(mockRequest.Object, string.Empty);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        _mockDataStore.Verify(d => d.GetByIdAsync(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task Run_WhitespaceBranchName_Returns400()
    {
        // Arrange
        var mockRequest = CreateMockHttpRequest();

        // Act
        var response = await _function.Run(mockRequest.Object, "   ");

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        _mockDataStore.Verify(d => d.GetByIdAsync(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task Run_InvalidCharacters_Returns400()
    {
        // Arrange - matches TypeScript: if (sanitisedId !== id) return 400
        var branchName = "../../etc/passwd";
        var sanitizedBranch = "etcpasswd"; // Sanitiser changes the input

        _mockSanitiser.Setup(s => s.Sanitise(branchName)).Returns(sanitizedBranch);
        var mockRequest = CreateMockHttpRequest();

        // Act
        var response = await _function.Run(mockRequest.Object, branchName);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest, "sanitization changed input - should reject");
        _mockDataStore.Verify(d => d.GetByIdAsync(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task Run_BranchNotFound_Returns404()
    {
        // Arrange
        var branchName = "nonexistent";

        _mockSanitiser.Setup(s => s.Sanitise(branchName)).Returns(branchName);
        _mockDataStore.Setup(d => d.GetByIdAsync(branchName)).ReturnsAsync((Cv?)null);

        var mockRequest = CreateMockHttpRequest();

        // Act
        var response = await _function.Run(mockRequest.Object, branchName);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.NotFound);
        _mockDataStore.Verify(d => d.GetByIdAsync(branchName), Times.Once);
        _mockRazorEngine.Verify(r => r.CompileRenderAsync(It.IsAny<string>(), It.IsAny<object>(), null), Times.Never);
    }

    [Fact]
    public async Task Run_DataStoreThrowsException_Returns500()
    {
        // Arrange
        var branchName = "main";

        _mockSanitiser.Setup(s => s.Sanitise(branchName)).Returns(branchName);
        _mockDataStore.Setup(d => d.GetByIdAsync(branchName))
            .ThrowsAsync(new Exception("GitHub API error"));

        var mockRequest = CreateMockHttpRequest();

        // Act
        var response = await _function.Run(mockRequest.Object, branchName);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.InternalServerError);
    }

    [Theory]
    [InlineData("feature123", "feature123")] // Valid - unchanged
    [InlineData("main", "main")]             // Valid - unchanged
    [InlineData("PRODUCTION", "PRODUCTION")] // Valid - unchanged
    public async Task Run_ValidBranchNames_Succeeds(string branchName, string sanitized)
    {
        // Arrange - sanitization doesn't change the input, so it's valid
        var cvData = CreateSampleCv();
        var expectedHtml = "<html><body>CV Content</body></html>";

        _mockSanitiser.Setup(s => s.Sanitise(branchName)).Returns(sanitized);
        _mockDataStore.Setup(d => d.GetByIdAsync(sanitized)).ReturnsAsync(cvData);
        _mockRazorEngine.Setup(r => r.CompileRenderAsync("CvTemplate", cvData, null))
            .ReturnsAsync(expectedHtml);

        var mockRequest = CreateMockHttpRequest();

        // Act
        var response = await _function.Run(mockRequest.Object, branchName);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.OK, "unchanged by sanitization - should accept");
        _mockSanitiser.Verify(s => s.Sanitise(branchName), Times.Once);
        _mockDataStore.Verify(d => d.GetByIdAsync(sanitized), Times.Once);
    }

    [Theory]
    [InlineData("feature-branch", "featurebranch")] // Changed - reject
    [InlineData("release_v1", "releasev1")]         // Changed - reject
    [InlineData("hotfix/bug-123", "hotfixbug123")]  // Changed - reject
    public async Task Run_InvalidBranchNames_Returns400(string input, string sanitized)
    {
        // Arrange - sanitization CHANGES the input, so reject (matches TypeScript logic)
        _mockSanitiser.Setup(s => s.Sanitise(input)).Returns(sanitized);
        var mockRequest = CreateMockHttpRequest();

        // Act
        var response = await _function.Run(mockRequest.Object, input);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest, "sanitization changed input - should reject");
        _mockSanitiser.Verify(s => s.Sanitise(input), Times.Once);
        _mockDataStore.Verify(d => d.GetByIdAsync(It.IsAny<string>()), Times.Never, "should not call dataStore if validation fails");
    }

    [Fact]
    public void Constructor_NullDataStore_ThrowsArgumentNullException()
    {
        // Act & Assert
        Should.Throw<ArgumentNullException>(() => new GetCvFunction(
                null!,
                _mockSanitiser.Object,
                _mockRazorEngine.Object,
                _mockLogger.Object))
            .ParamName.ShouldBe("dataStore");
    }

    [Fact]
    public void Constructor_NullSanitiser_ThrowsArgumentNullException()
    {
        // Act & Assert
        Should.Throw<ArgumentNullException>(() => new GetCvFunction(
                _mockDataStore.Object,
                null!,
                _mockRazorEngine.Object,
                _mockLogger.Object))
            .ParamName.ShouldBe("sanitiser");
    }

    [Fact]
    public void Constructor_NullRazorEngine_ThrowsArgumentNullException()
    {
        // Act & Assert
        Should.Throw<ArgumentNullException>(() => new GetCvFunction(
                _mockDataStore.Object,
                _mockSanitiser.Object,
                null!,
                _mockLogger.Object))
            .ParamName.ShouldBe("razorEngine");
    }

    // Helper Methods

    private static Mock<HttpRequestData> CreateMockHttpRequest()
    {
        var mockRequest = new Mock<HttpRequestData>(Mock.Of<FunctionContext>());

        mockRequest.Setup(r => r.CreateResponse()).Returns(() =>
        {
            var mockResponse = new Mock<HttpResponseData>(Mock.Of<FunctionContext>());
            mockResponse.SetupProperty(r => r.StatusCode);
            mockResponse.Setup(r => r.Headers).Returns(new HttpHeadersCollection());
            mockResponse.Setup(r => r.WriteStringAsync(It.IsAny<string>())).Returns(Task.CompletedTask);
            return mockResponse.Object;
        });

        return mockRequest;
    }

    private static Cv CreateSampleCv()
    {
        return new Cv(
            User: new UserData(
                Name: "John Doe",
                Location: new Location("London", "UK"),
                Contact: new Contact("+44 123 456 7890", "john@example.com"),
                Links: new List<Link>
                {
                    new("Portfolio", "https://johndoe.com"),
                    new("GitHub", "https://github.com/johndoe")
                }
            ),
            CoverLetter: new CoverLetter(
                Greeting: "Dear Hiring Manager,",
                Paragraphs: new List<string>
                {
                    "I am writing to express my interest in the position.",
                    "With over 10 years of experience in software development..."
                },
                SignOff: "Yours sincerely,"
            ),
            ExperienceSection: new Experience(
                Title: "Work Experience",
                Items: new List<ExperienceItem>
                {
                    new(
                        Title: "Senior Software Engineer",
                        Business: new Business(
                            Title: "Tech Corp",
                            Link: "https://techcorp.com",
                            Location: new Location("London", "UK"),
                            Department: "Engineering"
                        ),
                        Dates: "2020 - Present",
                        Content: new List<string>
                        {
                            "Led development of microservices architecture",
                            "Mentored junior developers"
                        }
                    )
                }
            ),
            Sections: new List<General>
            {
                new(
                    Title: "Skills",
                    Items: new List<GeneralItem>
                    {
                        new(
                            Title: "Programming Languages",
                            Link: null,
                            Dates: null,
                            Content: new List<string> { "C#", "TypeScript", "Python" }
                        )
                    }
                )
            }
        );
    }
}
