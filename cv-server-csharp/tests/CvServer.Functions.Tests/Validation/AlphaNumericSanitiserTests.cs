using CvServer.Functions.Validation;
using Shouldly;
using Xunit;

namespace CvServer.Functions.Tests.Validation;

/// <summary>
/// TDD Tests for AlphaNumericSanitiser
/// C# port of TypeScript OnlyAlphas tests
/// Validates input sanitization behavior using filter approach
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
        var sanitiser = AlphaNumericSanitiser.Strict();

        // Act
        var result = sanitiser.Sanitise(input);

        // Assert
        result.ShouldBe(expected, "alphanumeric characters should pass through unchanged");
    }

    [Theory]
    [InlineData("feature-branch", "feature-branch")]
    [InlineData("my_branch", "my_branch")]
    [InlineData("release-v1_2", "release-v1_2")]
    public void Sanitise_WithAdditionalMatchers_AllowsSpecifiedChars(string input, string expected)
    {
        // Arrange - matches TypeScript: OnlyAlphas.and(/[-_]/)
        var sanitiser = AlphaNumericSanitiser.And("[-_]");

        // Act
        var result = sanitiser.Sanitise(input);

        // Assert
        result.ShouldBe(expected, "hyphens and underscores should be allowed when using And()");
    }

    [Theory]
    [InlineData("test@branch", "testbranch")]
    [InlineData("feature!123", "feature123")]
    [InlineData("my<branch>", "mybranch")]
    [InlineData("data?query", "dataquery")]
    [InlineData("../../../etc/passwd", "etcpasswd")]
    [InlineData("branch;rm -rf /", "branchrm")]
    public void Sanitise_DangerousCharacters_RemovesThem(string input, string expected)
    {
        // Arrange
        var sanitiser = AlphaNumericSanitiser.Strict();

        // Act
        var result = sanitiser.Sanitise(input);

        // Assert
        result.ShouldBe(expected, "dangerous characters must be removed for security");
    }

    [Theory]
    [InlineData("", "")]
    [InlineData("   ", "")]
    [InlineData("@#$%", "")]
    public void Sanitise_EmptyOrInvalidInput_ReturnsEmpty(string input, string expected)
    {
        // Arrange
        var sanitiser = AlphaNumericSanitiser.Strict();

        // Act
        var result = sanitiser.Sanitise(input);

        // Assert
        result.ShouldBe(expected, "invalid-only input should result in empty string");
    }

    [Theory]
    [InlineData("feature-branch", "featurebranch")]
    [InlineData("my_test", "mytest")]
    [InlineData("a-b_c-d", "abcd")]
    public void Sanitise_StrictMode_RemovesHyphensAndUnderscores(string input, string expected)
    {
        // Arrange - strict mode removes all non-alphanumeric
        var sanitiser = AlphaNumericSanitiser.Strict();

        // Act
        var result = sanitiser.Sanitise(input);

        // Assert
        result.ShouldBe(expected, "strict mode should remove all special characters");
    }

    [Fact]
    public void Sanitise_MultipleConsecutiveSpecialChars_RemovesAll()
    {
        // Arrange
        var sanitiser = AlphaNumericSanitiser.Strict();
        var input = "test@@@###!!!branch";

        // Act
        var result = sanitiser.Sanitise(input);

        // Assert
        result.ShouldBe("testbranch", "multiple consecutive special chars should all be removed");
    }

    [Theory]
    [InlineData("@test", "test")]
    [InlineData("test@", "test")]
    [InlineData("@test@", "test")]
    public void Sanitise_SpecialCharsAtStartOrEnd_RemovesThem(string input, string expected)
    {
        // Arrange
        var sanitiser = AlphaNumericSanitiser.Strict();

        // Act
        var result = sanitiser.Sanitise(input);

        // Assert
        result.ShouldBe(expected, "special characters at boundaries should be removed");
    }

    [Fact]
    public void Sanitise_NullInput_ThrowsArgumentNullException()
    {
        // Arrange
        var sanitiser = AlphaNumericSanitiser.Strict();

        // Act & Assert
        Should.Throw<ArgumentNullException>(() => sanitiser.Sanitise(null!))
            .ParamName.ShouldBe("input", "null input should throw ArgumentNullException with correct parameter name");
    }

    [Fact]
    public void Strict_CreatesStrictSanitiser()
    {
        // Arrange & Act
        var sanitiser = AlphaNumericSanitiser.Strict();

        // Assert
        sanitiser.ShouldNotBeNull();
        sanitiser.Sanitise("test-123").ShouldBe("test123", "strict sanitiser should remove hyphens");
    }

    [Fact]
    public void And_WithHyphensAndUnderscores_AllowsBoth()
    {
        // Arrange & Act - matches TypeScript: OnlyAlphas.and(/[-_]/)
        var sanitiser = AlphaNumericSanitiser.And("[-_]");

        // Assert
        sanitiser.Sanitise("test-with_special").ShouldBe("test-with_special");
        sanitiser.Sanitise("remove@this").ShouldBe("removethis");
    }

    [Fact]
    public void And_WithCustomPattern_AllowsSpecifiedChars()
    {
        // Arrange & Act - allow dots
        var sanitiser = AlphaNumericSanitiser.And("[.]");

        // Assert
        sanitiser.Sanitise("file.txt").ShouldBe("file.txt");
        sanitiser.Sanitise("remove@this").ShouldBe("removethis");
    }
}
