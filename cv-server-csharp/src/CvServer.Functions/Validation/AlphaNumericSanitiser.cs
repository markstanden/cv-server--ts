using System.Text;
using System.Text.RegularExpressions;
using CvServer.Functions.Interfaces;

namespace CvServer.Functions.Validation;

/// <summary>
/// Sanitizes input strings by removing all characters except alphanumerics and optionally hyphens/underscores
/// This prevents path traversal, command injection, and other input-based attacks
/// </summary>
public partial class AlphaNumericSanitiser : ISanitiser
{
    private readonly bool _allowHyphens;
    private readonly bool _allowUnderscores;
    private readonly Regex _sanitizationRegex;

    /// <summary>
    /// Creates a new sanitiser with configurable character allowances
    /// </summary>
    /// <param name="allowHyphens">Whether to allow hyphen (-) characters</param>
    /// <param name="allowUnderscores">Whether to allow underscore (_) characters</param>
    public AlphaNumericSanitiser(bool allowHyphens = true, bool allowUnderscores = true)
    {
        _allowHyphens = allowHyphens;
        _allowUnderscores = allowUnderscores;
        _sanitizationRegex = BuildRegex(allowHyphens, allowUnderscores);
    }

    /// <summary>
    /// Removes all characters except alphanumerics and configured special characters
    /// </summary>
    /// <param name="input">Input string to sanitize</param>
    /// <returns>Sanitized string safe for use in file paths, branch names, etc.</returns>
    /// <exception cref="ArgumentNullException">Thrown when input is null</exception>
    public string Sanitise(string input)
    {
        ArgumentNullException.ThrowIfNull(input);

        return _sanitizationRegex.Replace(input, string.Empty);
    }

    /// <summary>
    /// Builds a regex pattern based on allowed characters
    /// Uses source-generated regex for performance (.NET 7+)
    /// </summary>
    private static Regex BuildRegex(bool allowHyphens, bool allowUnderscores)
    {
        var pattern = new StringBuilder("[^a-zA-Z0-9");

        if (allowHyphens)
            pattern.Append('-');

        if (allowUnderscores)
            pattern.Append('_');

        pattern.Append(']');

        return new Regex(pattern.ToString(), RegexOptions.Compiled);
    }

    /// <summary>
    /// Factory method: Creates a strict sanitiser (alphanumeric only)
    /// </summary>
    public static AlphaNumericSanitiser Strict() => new(allowHyphens: false, allowUnderscores: false);

    /// <summary>
    /// Factory method: Creates a permissive sanitiser (allows hyphens and underscores)
    /// </summary>
    public static AlphaNumericSanitiser Permissive() => new(allowHyphens: true, allowUnderscores: true);
}
