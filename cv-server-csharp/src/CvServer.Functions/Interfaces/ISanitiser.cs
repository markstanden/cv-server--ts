namespace CvServer.Functions.Interfaces;

/// <summary>
/// Defines a contract for input sanitization
/// </summary>
public interface ISanitiser
{
    /// <summary>
    /// Sanitizes the provided input string according to implementation rules
    /// </summary>
    /// <param name="input">Raw input string to sanitize</param>
    /// <returns>Sanitized string with invalid characters removed</returns>
    string Sanitise(string input);
}
