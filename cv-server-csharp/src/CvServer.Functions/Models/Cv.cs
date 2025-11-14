namespace CvServer.Functions.Models;

/// <summary>
/// Represents a complete CV (Curriculum Vitae) document
/// </summary>
public record Cv(
    UserData User,
    CoverLetter CoverLetter,
    Experience ExperienceSection,
    IReadOnlyList<General> Sections
);

/// <summary>
/// User personal and contact information
/// </summary>
public record UserData(
    string Name,
    Location Location,
    Contact Contact,
    IReadOnlyList<Link> Links
);

/// <summary>
/// Geographic location information
/// </summary>
public record Location(
    string City,
    string Country
);

/// <summary>
/// Contact details
/// </summary>
public record Contact(
    string Phone,
    string Email
);

/// <summary>
/// External link (portfolio, LinkedIn, GitHub, etc.)
/// </summary>
public record Link(
    string Title,
    string Url
);

/// <summary>
/// Cover letter content
/// </summary>
public record CoverLetter(
    string Greeting,
    IReadOnlyList<string> Paragraphs,
    string SignOff
);

/// <summary>
/// Work experience section
/// </summary>
public record Experience(
    string Title,
    IReadOnlyList<ExperienceItem> Items
);

/// <summary>
/// Individual job/role entry
/// </summary>
public record ExperienceItem(
    string Title,
    Business Business,
    string Dates,
    IReadOnlyList<string> Content
);

/// <summary>
/// Company/business information
/// </summary>
public record Business(
    string Title,
    string Link,
    Location Location,
    string Department
);

/// <summary>
/// General CV section (Skills, Education, Projects, etc.)
/// </summary>
public record General(
    string Title,
    IReadOnlyList<GeneralItem> Items
);

/// <summary>
/// Individual item within a general section
/// </summary>
public record GeneralItem(
    string Title,
    string? Link,
    string? Dates,
    IReadOnlyList<string> Content
);
