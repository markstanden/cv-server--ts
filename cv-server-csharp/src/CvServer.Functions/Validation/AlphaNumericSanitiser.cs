using System.Text.RegularExpressions;
using CvServer.Functions.Interfaces;

namespace CvServer.Functions.Validation;

/// <summary>
/// Sanitizes input strings by filtering characters based on a matcher pattern
/// C# port of TypeScript OnlyAlphas class using split-filter-join approach
/// This prevents path traversal, command injection, and other input-based attacks
/// </summary>
public class AlphaNumericSanitiser : ISanitiser
{
    private static readonly Regex BaseMatcher = new("[a-zA-Z0-9]", RegexOptions.Compiled);
    private readonly Regex _matcher;

    /// <summary>
    /// Creates a new sanitiser with the specified matcher pattern
    /// </summary>
    /// <param name="matcher">Regex pattern to match allowed characters</param>
    private AlphaNumericSanitiser(Regex? matcher = null)
    {
        _matcher = matcher ?? BaseMatcher;
    }

    /// <summary>
    /// Filters input string to only include characters matching the configured pattern
    /// TypeScript equivalent: input.split('').filter(letter => letter.match(matcher)).join('')
    /// </summary>
    /// <param name="input">Input string to sanitize</param>
    /// <returns>Sanitized string containing only allowed characters</returns>
    /// <exception cref="ArgumentNullException">Thrown when input is null</exception>
    public string Sanitise(string input)
    {
        ArgumentNullException.ThrowIfNull(input);

        // Match TypeScript filter approach: split, filter by matcher, join
        return string.Concat(
            input.Where(c => _matcher.IsMatch(c.ToString()))
        );
    }

    /// <summary>
    /// Factory method: Creates a strict sanitiser (alphanumeric only)
    /// TypeScript equivalent: OnlyAlphas.strict()
    /// </summary>
    public static AlphaNumericSanitiser Strict() => new();

    /// <summary>
    /// Factory method: Creates a sanitiser with additional allowed characters
    /// TypeScript equivalent: OnlyAlphas.and(additionalMatchers)
    /// </summary>
    /// <param name="additionalPattern">Additional regex pattern (e.g., "[-_]" for hyphens and underscores)</param>
    public static AlphaNumericSanitiser And(string additionalPattern)
    {
        // Combine: (baseMatcher|additionalPattern) - matches TypeScript OR logic
        var combinedPattern = $"({BaseMatcher}|{additionalPattern})";
        var combinedMatcher = new Regex(combinedPattern, RegexOptions.Compiled);
        return new AlphaNumericSanitiser(combinedMatcher);
    }
}
