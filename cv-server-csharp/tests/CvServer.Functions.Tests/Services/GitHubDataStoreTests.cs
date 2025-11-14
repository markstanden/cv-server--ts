using CvServer.Functions.Services;
using FluentAssertions;
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
        // Act
        Action act = () => new GitHubDataStore(null!, "repo", "token");

        // Assert
        act.Should().Throw<ArgumentException>()
            .WithMessage("*owner*");
    }

    [Fact]
    public void Constructor_NullRepository_ThrowsArgumentException()
    {
        // Act
        Action act = () => new GitHubDataStore("owner", null!, "token");

        // Assert
        act.Should().Throw<ArgumentException>()
            .WithMessage("*repository*");
    }

    [Fact]
    public void Constructor_NullToken_ThrowsArgumentException()
    {
        // Act
        Action act = () => new GitHubDataStore("owner", "repo", null!);

        // Assert
        act.Should().Throw<ArgumentException>()
            .WithMessage("*token*");
    }

    [Fact]
    public void Constructor_ValidParameters_CreatesInstance()
    {
        // Act
        var store = new GitHubDataStore("owner", "repo", "token");

        // Assert
        store.Should().NotBeNull();
    }

    [Fact]
    public void Constructor_WithOptionalParameters_CreatesInstance()
    {
        // Act
        var store = new GitHubDataStore("owner", "repo", "token", "subdir", "custom.json");

        // Assert
        store.Should().NotBeNull();
    }

    [Fact]
    public async Task GetByIdAsync_NullBranchName_ThrowsArgumentException()
    {
        // Arrange
        var store = new GitHubDataStore("owner", "repo", "token");

        // Act
        Func<Task> act = async () => await store.GetByIdAsync(null!);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*branchName*");
    }

    [Fact]
    public async Task GetByIdAsync_EmptyBranchName_ThrowsArgumentException()
    {
        // Arrange
        var store = new GitHubDataStore("owner", "repo", "token");

        // Act
        Func<Task> act = async () => await store.GetByIdAsync(string.Empty);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*branchName*");
    }

    [Fact]
    public void CreateFromEnvironment_MissingUsername_ThrowsInvalidOperationException()
    {
        // Arrange
        Environment.SetEnvironmentVariable("GITHUB_USERNAME", null);
        Environment.SetEnvironmentVariable("GITHUB_REPO", "repo");
        Environment.SetEnvironmentVariable("GITHUB_API_KEY", "token");

        // Act
        Action act = () => GitHubDataStore.CreateFromEnvironment();

        // Assert
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("*GITHUB_USERNAME*");

        // Cleanup
        Environment.SetEnvironmentVariable("GITHUB_REPO", null);
        Environment.SetEnvironmentVariable("GITHUB_API_KEY", null);
    }
}
