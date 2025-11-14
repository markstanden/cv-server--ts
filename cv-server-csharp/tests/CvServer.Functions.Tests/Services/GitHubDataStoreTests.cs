using CvServer.Functions.Services;
using Shouldly;
using Xunit;

namespace CvServer.Functions.Tests.Services;

/// <summary>
/// Unit tests for GitHubDataStore
/// Note: Integration tests would require actual GitHub credentials
/// </summary>
public class GitHubDataStoreTests
{
    [Fact]
    public void Constructor_NullOwner_ThrowsArgumentException()
    {
        // Act & Assert
        Should.Throw<ArgumentException>(() => new GitHubDataStore(null!, "repo", "token"))
            .Message.ShouldContain("owner");
    }

    [Fact]
    public void Constructor_NullRepository_ThrowsArgumentException()
    {
        // Act & Assert
        Should.Throw<ArgumentException>(() => new GitHubDataStore("owner", null!, "token"))
            .Message.ShouldContain("repository");
    }

    [Fact]
    public void Constructor_NullToken_ThrowsArgumentException()
    {
        // Act & Assert
        Should.Throw<ArgumentException>(() => new GitHubDataStore("owner", "repo", null!))
            .Message.ShouldContain("token");
    }

    [Fact]
    public void Constructor_ValidParameters_CreatesInstance()
    {
        // Act
        var store = new GitHubDataStore("owner", "repo", "token");

        // Assert
        store.ShouldNotBeNull();
    }

    [Fact]
    public void Constructor_WithOptionalParameters_CreatesInstance()
    {
        // Act
        var store = new GitHubDataStore("owner", "repo", "token", "subdir", "custom.json");

        // Assert
        store.ShouldNotBeNull();
    }

    [Fact]
    public async Task GetByIdAsync_NullBranchName_ThrowsArgumentException()
    {
        // Arrange
        var store = new GitHubDataStore("owner", "repo", "token");

        // Act & Assert
        await Should.ThrowAsync<ArgumentException>(async () => await store.GetByIdAsync(null!));
    }

    [Fact]
    public async Task GetByIdAsync_EmptyBranchName_ThrowsArgumentException()
    {
        // Arrange
        var store = new GitHubDataStore("owner", "repo", "token");

        // Act & Assert
        await Should.ThrowAsync<ArgumentException>(async () => await store.GetByIdAsync(string.Empty));
    }

    [Fact]
    public void CreateFromEnvironment_MissingUsername_ThrowsInvalidOperationException()
    {
        // Arrange
        Environment.SetEnvironmentVariable("GITHUB_USERNAME", null);
        Environment.SetEnvironmentVariable("GITHUB_REPO", "repo");
        Environment.SetEnvironmentVariable("GITHUB_API_KEY", "token");

        // Act & Assert
        Should.Throw<InvalidOperationException>(() => GitHubDataStore.CreateFromEnvironment())
            .Message.ShouldContain("GITHUB_USERNAME");

        // Cleanup
        Environment.SetEnvironmentVariable("GITHUB_REPO", null);
        Environment.SetEnvironmentVariable("GITHUB_API_KEY", null);
    }
}
