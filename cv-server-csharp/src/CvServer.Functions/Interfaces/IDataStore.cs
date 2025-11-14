namespace CvServer.Functions.Interfaces;

/// <summary>
/// Defines a contract for data retrieval operations
/// </summary>
/// <typeparam name="T">The type of data to retrieve</typeparam>
public interface IDataStore<T>
{
    /// <summary>
    /// Retrieves data by unique identifier
    /// </summary>
    /// <param name="id">Unique identifier (e.g., branch name)</param>
    /// <returns>Data object if found, null otherwise</returns>
    Task<T?> GetByIdAsync(string id);
}
