using System.Net;
using CvServer.Functions.Functions;
using CvServer.Functions.Interfaces;
using CvServer.Functions.Models;
using FluentAssertions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using RazorLight;
using Xunit;

namespace CvServer.Functions.Tests.Functions;

/// <summary>
/// TDD Tests for GetCvFunction
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
        response.StatusCode.Should().Be(HttpStatusCode.OK);
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
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
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
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        _mockDataStore.Verify(d => d.GetByIdAsync(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task Run_InvalidCharacters_Returns400()
    {
        // Arrange
        var branchName = "../../etc/passwd";
        var sanitizedBranch = ""; // Sanitiser removes all invalid chars

        _mockSanitiser.Setup(s => s.Sanitise(branchName)).Returns(sanitizedBranch);
        var mockRequest = CreateMockHttpRequest();

        // Act
        var response = await _function.Run(mockRequest.Object, branchName);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
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
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
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
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }

    [Theory]
    [InlineData("feature-branch", "feature-branch")]
    [InlineData("release_v1", "release_v1")]
    [InlineData("hotfix/bug-123", "hotfixbug-123")]
    public async Task Run_VariousBranchNames_SanitizesCorrectly(string input, string sanitized)
    {
        // Arrange
        var cvData = CreateSampleCv();
        var expectedHtml = "<html><body>CV Content</body></html>";

        _mockSanitiser.Setup(s => s.Sanitise(input)).Returns(sanitized);
        _mockDataStore.Setup(d => d.GetByIdAsync(sanitized)).ReturnsAsync(cvData);
        _mockRazorEngine.Setup(r => r.CompileRenderAsync("CvTemplate", cvData, null))
            .ReturnsAsync(expectedHtml);

        var mockRequest = CreateMockHttpRequest();

        // Act
        var response = await _function.Run(mockRequest.Object, input);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        _mockSanitiser.Verify(s => s.Sanitise(input), Times.Once);
        _mockDataStore.Verify(d => d.GetByIdAsync(sanitized), Times.Once);
    }

    [Fact]
    public void Constructor_NullDataStore_ThrowsArgumentNullException()
    {
        // Act
        Action act = () => new GetCvFunction(
            null!,
            _mockSanitiser.Object,
            _mockRazorEngine.Object,
            _mockLogger.Object);

        // Assert
        act.Should().Throw<ArgumentNullException>().WithParameterName("dataStore");
    }

    [Fact]
    public void Constructor_NullSanitiser_ThrowsArgumentNullException()
    {
        // Act
        Action act = () => new GetCvFunction(
            _mockDataStore.Object,
            null!,
            _mockRazorEngine.Object,
            _mockLogger.Object);

        // Assert
        act.Should().Throw<ArgumentNullException>().WithParameterName("sanitiser");
    }

    [Fact]
    public void Constructor_NullRazorEngine_ThrowsArgumentNullException()
    {
        // Act
        Action act = () => new GetCvFunction(
            _mockDataStore.Object,
            _mockSanitiser.Object,
            null!,
            _mockLogger.Object);

        // Assert
        act.Should().Throw<ArgumentNullException>().WithParameterName("razorEngine");
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
