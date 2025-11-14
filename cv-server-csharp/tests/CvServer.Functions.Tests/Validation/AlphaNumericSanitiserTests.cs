using CvServer.Functions.Validation;
using FluentAssertions;
using Xunit;

namespace CvServer.Functions.Tests.Validation;

/// <summary>
/// TDD Tests for AlphaNumericSanitiser - written BEFORE implementation
/// Validates input sanitization behavior
/// </summary>
public class AlphaNumericSanitiserTests
{
    [Theory]
    [InlineData("main", "main")]
    [InlineData("develop", "develop")]
    [InlineData("feature123", "feature123")]
    [InlineData("PRODUCTION", "PRODUCTION")]
    [InlineData("MixedCase123", "MixedCase123")]
    public void Sanitise_AlphaNumericInput_ReturnsUnchanged(string input, string expected)
    {
        // Arrange
        var sanitiser = new AlphaNumericSanitiser();

        // Act
        var result = sanitiser.Sanitise(input);

        // Assert
        result.Should().Be(expected, "alphanumeric characters should pass through unchanged");
    }

    [Theory]
    [InlineData("feature-branch", "feature-branch")]
    [InlineData("my_branch", "my_branch")]
    [InlineData("release-v1_2", "release-v1_2")]
    public void Sanitise_AllowedSpecialCharacters_ReturnsUnchanged(string input, string expected)
    {
        // Arrange
        var sanitiser = new AlphaNumericSanitiser(allowHyphens: true, allowUnderscores: true);

        // Act
        var result = sanitiser.Sanitise(input);

        // Assert
        result.Should().Be(expected, "hyphens and underscores should be allowed when configured");
    }

    [Theory]
    [InlineData("test@branch", "testbranch")]
    [InlineData("feature!123", "feature123")]
    [InlineData("my<branch>", "mybranch")]
    [InlineData("data?query", "dataquery")]
    [InlineData("../../../etc/passwd", "etcpasswd")]
    [InlineData("branch;rm -rf /", "branchrm-rf")]
    public void Sanitise_DangerousCharacters_RemovesThem(string input, string expected)
    {
        // Arrange
        var sanitiser = new AlphaNumericSanitiser(allowHyphens: true);

        // Act
        var result = sanitiser.Sanitise(input);

        // Assert
        result.Should().Be(expected, "dangerous characters must be removed for security");
    }

    [Theory]
    [InlineData("", "")]
    [InlineData("   ", "")]
    [InlineData("@#$%", "")]
    public void Sanitise_EmptyOrInvalidInput_ReturnsEmpty(string input, string expected)
    {
        // Arrange
        var sanitiser = new AlphaNumericSanitiser();

        // Act
        var result = sanitiser.Sanitise(input);

        // Assert
        result.Should().Be(expected, "invalid-only input should result in empty string");
    }

    [Theory]
    [InlineData("feature-branch", "featurebranch")]
    [InlineData("my_test", "mytest")]
    [InlineData("a-b_c-d", "abcd")]
    public void Sanitise_StrictMode_RemovesHyphensAndUnderscores(string input, string expected)
    {
        // Arrange
        var sanitiser = new AlphaNumericSanitiser(allowHyphens: false, allowUnderscores: false);

        // Act
        var result = sanitiser.Sanitise(input);

        // Assert
        result.Should().Be(expected, "strict mode should remove all special characters");
    }

    [Fact]
    public void Sanitise_MultipleConsecutiveSpecialChars_RemovesAll()
    {
        // Arrange
        var sanitiser = new AlphaNumericSanitiser();
        var input = "test@@@###!!!branch";

        // Act
        var result = sanitiser.Sanitise(input);

        // Assert
        result.Should().Be("testbranch", "multiple consecutive special chars should all be removed");
    }

    [Theory]
    [InlineData("@test", "test")]
    [InlineData("test@", "test")]
    [InlineData("@test@", "test")]
    public void Sanitise_SpecialCharsAtStartOrEnd_RemovesThem(string input, string expected)
    {
        // Arrange
        var sanitiser = new AlphaNumericSanitiser();

        // Act
        var result = sanitiser.Sanitise(input);

        // Assert
        result.Should().Be(expected, "special characters at boundaries should be removed");
    }

    [Fact]
    public void Sanitise_NullInput_ThrowsArgumentNullException()
    {
        // Arrange
        var sanitiser = new AlphaNumericSanitiser();

        // Act
        Action act = () => sanitiser.Sanitise(null!);

        // Assert
        act.Should().Throw<ArgumentNullException>()
            .WithMessage("*input*", "null input should throw ArgumentNullException");
    }
}
