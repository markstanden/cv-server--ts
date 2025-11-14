# CV Server - C# Azure Functions with RazorLight

A serverless CV rendering system that fetches CV data from GitHub and renders it as beautiful, print-friendly HTML using Azure Functions and Razor templates.

## 🎯 Key Features

- **Serverless Architecture**: Pure Azure Functions (Consumption tier - FREE)
- **Server-Side Rendering**: HTML generated on the server using RazorLight
- **TDD Approach**: Comprehensive unit tests with xUnit, Moq, and FluentAssertions
- **Branch-Based Variants**: Different CV versions per Git branch
- **Type-Safe**: C# 12 with nullable reference types and records
- **Print-Optimized**: Tailwind CSS with print media queries
- **Secure**: Input sanitization prevents injection attacks

## 📁 Project Structure

```
cv-server-csharp/
├── src/
│   └── CvServer.Functions/              # Azure Functions project
│       ├── Functions/
│       │   └── GetCvFunction.cs         # HTTP trigger endpoint
│       ├── Interfaces/
│       │   ├── IDataStore.cs            # Data access abstraction
│       │   └── ISanitiser.cs            # Input validation abstraction
│       ├── Models/
│       │   └── Cv.cs                    # CV data models (records)
│       ├── Services/
│       │   └── GitHubDataStore.cs       # GitHub API client
│       ├── Validation/
│       │   └── AlphaNumericSanitiser.cs # Input sanitizer
│       ├── Templates/
│       │   └── CvTemplate.cshtml        # Razor template
│       ├── Program.cs                   # Dependency injection setup
│       ├── host.json                    # Azure Functions configuration
│       └── local.settings.json          # Environment variables
│
├── tests/
│   └── CvServer.Functions.Tests/        # Unit tests
│       ├── Functions/
│       │   └── GetCvFunctionTests.cs
│       ├── Services/
│       │   └── GitHubDataStoreTests.cs
│       └── Validation/
│           └── AlphaNumericSanitiserTests.cs
│
└── CvServer.sln                         # Solution file
```

## 🚀 Getting Started

### Prerequisites

- **.NET 8 SDK** (or later): [Download](https://dotnet.microsoft.com/download)
- **Azure Functions Core Tools**: [Installation Guide](https://learn.microsoft.com/azure/azure-functions/functions-run-local)
- **GitHub Personal Access Token** with `repo` scope

#### Install Azure Functions Core Tools

```bash
# macOS (via Homebrew)
brew tap azure/functions
brew install azure-functions-core-tools@4

# Windows (via npm)
npm install -g azure-functions-core-tools@4

# Ubuntu/Debian
wget -q https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update
sudo apt-get install azure-functions-core-tools-4
```

### 1. Clone and Build

```bash
cd cv-server-csharp

# Restore dependencies
dotnet restore

# Build the solution
dotnet build

# Run tests
dotnet test
```

### 2. Configure Environment Variables

Edit `src/CvServer.Functions/local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "GITHUB_USERNAME": "your-github-username",
    "GITHUB_REPO": "your-private-cv-repo",
    "GITHUB_API_KEY": "ghp_xxxxxxxxxxxxxxxxxxxx",
    "GITHUB_REPO_DIRECTORY": "",
    "GITHUB_REPO_FILENAME": "cv-data.json"
  }
}
```

### 3. Create CV Data in GitHub

Create a private GitHub repository with a JSON file (e.g., `cv-data.json`) on the `main` branch:

```json
{
  "user": {
    "name": "John Doe",
    "location": {
      "city": "London",
      "country": "UK"
    },
    "contact": {
      "phone": "+44 123 456 7890",
      "email": "john.doe@example.com"
    },
    "links": [
      {
        "title": "Portfolio",
        "url": "https://johndoe.com"
      },
      {
        "title": "GitHub",
        "url": "https://github.com/johndoe"
      }
    ]
  },
  "coverLetter": {
    "greeting": "Dear Hiring Manager,",
    "paragraphs": [
      "I am writing to express my strong interest in the position...",
      "With over 10 years of experience in software development..."
    ],
    "signOff": "Yours sincerely,"
  },
  "experienceSection": {
    "title": "Work Experience",
    "items": [
      {
        "title": "Senior Software Engineer",
        "business": {
          "title": "Tech Corp",
          "link": "https://techcorp.com",
          "location": {
            "city": "London",
            "country": "UK"
          },
          "department": "Engineering"
        },
        "dates": "2020 - Present",
        "content": [
          "Led development of cloud-native microservices using C# and Azure",
          "Implemented CI/CD pipelines using Azure DevOps",
          "Mentored team of 5 junior developers"
        ]
      }
    ]
  },
  "sections": [
    {
      "title": "Skills",
      "items": [
        {
          "title": "Programming Languages",
          "link": null,
          "dates": null,
          "content": [
            "C# (.NET 8)",
            "TypeScript",
            "Python"
          ]
        },
        {
          "title": "Cloud Platforms",
          "link": null,
          "dates": null,
          "content": [
            "Azure (Functions, Static Web Apps, DevOps)",
            "AWS (Lambda, S3, CloudFront)"
          ]
        }
      ]
    },
    {
      "title": "Education",
      "items": [
        {
          "title": "BSc Computer Science",
          "link": "https://university.edu",
          "dates": "2010 - 2014",
          "content": [
            "First Class Honours",
            "Dissertation: Distributed Systems Performance"
          ]
        }
      ]
    }
  ]
}
```

### 4. Run Locally

```bash
cd src/CvServer.Functions
func start
```

You should see output like:

```
Azure Functions Core Tools
Core Tools Version:       4.x.xxxx
Function Runtime Version: 4.x.x

Functions:

        GetCv: [GET] http://localhost:7071/{branchName}
```

### 5. Test the Endpoint

Open your browser or use curl:

```bash
# Fetch CV from 'main' branch
curl http://localhost:7071/main

# Fetch CV from 'feature-frontend' branch
curl http://localhost:7071/feature-frontend
```

You'll receive a fully-rendered HTML page!

## 🧪 Running Tests

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=lcov

# Run specific test class
dotnet test --filter "FullyQualifiedName~AlphaNumericSanitiserTests"

# Run tests with detailed output
dotnet test --logger "console;verbosity=detailed"
```

## 🎨 Customizing the Template

Edit `src/CvServer.Functions/Templates/CvTemplate.cshtml` to customize the HTML output:

```cshtml
@model CvServer.Functions.Models.Cv

<!DOCTYPE html>
<html>
<head>
    <title>@Model.User.Name - CV</title>
    <!-- Your custom CSS here -->
</head>
<body>
    <h1>@Model.User.Name</h1>
    <!-- Your custom layout here -->
</body>
</html>
```

## 🚢 Deploying to Azure

### Option 1: Azure Portal Deployment

1. Create an Azure Function App:
   - Runtime: .NET 8 (Isolated)
   - Plan: Consumption (Free tier)

2. Configure Application Settings in Azure Portal:
   ```
   GITHUB_USERNAME=your-username
   GITHUB_REPO=your-repo
   GITHUB_API_KEY=<stored in Azure Key Vault>
   GITHUB_REPO_DIRECTORY=
   GITHUB_REPO_FILENAME=cv-data.json
   ```

3. Deploy using VS Code Azure Functions extension or CLI:
   ```bash
   func azure functionapp publish <YOUR_FUNCTION_APP_NAME>
   ```

### Option 2: Azure Static Web Apps (Recommended)

Azure Static Web Apps can host both static content AND Azure Functions for free.

Create `staticwebapp.config.json`:

```json
{
  "routes": [
    {
      "route": "/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/main"
  }
}
```

Deploy via GitHub Actions (auto-generated when creating SWA).

## 🔒 Security Features

### Input Sanitization

The `AlphaNumericSanitiser` prevents:
- Path traversal attacks (`../../etc/passwd`)
- Command injection (`; rm -rf /`)
- XSS attempts (`<script>alert('xss')</script>`)

```csharp
// Only allows: a-z, A-Z, 0-9, hyphens, underscores
var sanitiser = AlphaNumericSanitiser.Permissive();
sanitiser.Sanitise("feature-branch"); // ✅ "feature-branch"
sanitiser.Sanitise("../../../etc"); // ✅ "etc" (safe!)
```

### GitHub Token Security

- Store tokens in Azure Key Vault
- Use Managed Identity for production
- Never commit `local.settings.json`

## 📊 Architecture Comparison

| Feature | TypeScript/Netlify | C#/Azure Functions |
|---------|-------------------|-------------------|
| **Cost** | FREE | FREE (Consumption) |
| **Rendering** | Client-side (JavaScript) | Server-side (Razor) |
| **SEO** | Poor (CSR) | Excellent (SSR) |
| **Initial Load** | ~200KB JS + API call | ~50KB HTML (pre-rendered) |
| **Type Safety** | TypeScript | C# (stricter) |
| **Testing** | Vitest | xUnit (industry standard) |
| **DI** | Manual | Built-in DI container |
| **Debugging** | Browser DevTools | Visual Studio / Rider |

## 🛠️ Development Workflow (TDD)

This project follows Test-Driven Development:

1. **Write test first** (red phase):
   ```csharp
   [Fact]
   public void Sanitise_InvalidChars_RemovesThem()
   {
       var sanitiser = new AlphaNumericSanitiser();
       var result = sanitiser.Sanitise("test@#$");
       result.Should().Be("test");
   }
   ```

2. **Implement minimal code** (green phase):
   ```csharp
   public string Sanitise(string input)
   {
       return Regex.Replace(input, "[^a-zA-Z0-9-_]", "");
   }
   ```

3. **Refactor** while keeping tests green

## 📚 Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Runtime** | .NET | 8.0+ |
| **Functions** | Azure Functions | v4 (Isolated) |
| **Templating** | RazorLight | 2.3.1 |
| **GitHub API** | Octokit | 13.0.1 |
| **Testing** | xUnit | 2.7.0 |
| **Mocking** | Moq | 4.20.70 |
| **Assertions** | FluentAssertions | 6.12.0 |
| **Styling** | Tailwind CSS | CDN (4.x) |

## 🔄 Migration from TypeScript

Key differences when migrating:

1. **Models**: TypeScript interfaces → C# records
2. **Validation**: `OnlyAlphas.ts` → `AlphaNumericSanitiser.cs`
3. **Data Access**: `GithubRepoDataStore.ts` → `GitHubDataStore.cs`
4. **Rendering**: Vite SPA → RazorLight SSR
5. **Testing**: Vitest → xUnit

## 📝 License

MIT

## 🙋 Support

For issues, please check:
1. Environment variables are set correctly
2. GitHub token has `repo` scope
3. Branch exists in your repository
4. JSON structure matches the CV model

## 🎯 Next Steps

- [ ] Add Application Insights for monitoring
- [ ] Implement response caching (Redis)
- [ ] Add PDF export functionality
- [ ] Create GitHub Actions CI/CD pipeline
- [ ] Add integration tests with real GitHub API
- [ ] Implement custom domain support

---

**Built with ❤️ using C#, Azure Functions, and RazorLight**
