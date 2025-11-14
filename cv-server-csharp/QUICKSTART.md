# Quick Start Guide - 5 Minutes to Running CV Server

This guide gets you up and running in less than 5 minutes!

## Prerequisites Check

Run these commands to verify you have everything:

```bash
dotnet --version  # Should show 8.0.x or higher
func --version    # Should show 4.x.x or higher
```

Don't have them? See [README.md](README.md#prerequisites) for installation instructions.

## Step 1: Build the Project (30 seconds)

```bash
cd cv-server-csharp
dotnet restore
dotnet build
```

## Step 2: Run Tests to Verify (30 seconds)

```bash
dotnet test
```

You should see: ✅ All tests passing!

## Step 3: Configure GitHub Credentials (2 minutes)

1. **Create a GitHub Personal Access Token**:
   - Go to: https://github.com/settings/tokens/new
   - Scopes needed: `repo` (full control)
   - Click "Generate token"
   - Copy the token (starts with `ghp_`)

2. **Edit `src/CvServer.Functions/local.settings.json`**:

```json
{
  "Values": {
    "GITHUB_USERNAME": "YOUR_GITHUB_USERNAME",
    "GITHUB_REPO": "YOUR_REPO_NAME",
    "GITHUB_API_KEY": "ghp_YOUR_TOKEN_HERE",
    "GITHUB_REPO_FILENAME": "cv-data.json"
  }
}
```

## Step 4: Create Sample CV Data (1 minute)

**Option A: Use your existing CV repo**
- Make sure it has a `cv-data.json` file on the `main` branch
- Use the structure from `sample-cv-data.json` in this repo

**Option B: Create a test repo**
1. Create new GitHub repo (can be private)
2. Upload `sample-cv-data.json` as `cv-data.json` to the `main` branch
3. Update `local.settings.json` with repo name

## Step 5: Run It! (30 seconds)

```bash
cd src/CvServer.Functions
func start
```

Expected output:
```
Functions:
        GetCv: [GET] http://localhost:7071/{branchName}
```

## Step 6: Test It! (10 seconds)

Open in browser or use curl:

```bash
# Browser
open http://localhost:7071/main

# Or curl
curl http://localhost:7071/main
```

You should see a beautiful HTML CV page! 🎉

## Troubleshooting

### "GITHUB_USERNAME environment variable is required"
- Check `local.settings.json` is in `src/CvServer.Functions/` directory
- Verify the JSON is valid (no trailing commas)

### "404 Not Found"
- Verify the branch exists in your GitHub repo
- Check the `GITHUB_REPO` name is correct
- Ensure `cv-data.json` exists on that branch

### "401 Unauthorized"
- Your GitHub token may be invalid or expired
- Create a new token with `repo` scope
- Verify the token is correctly pasted (no extra spaces)

### Tests failing?
- Make sure you ran `dotnet restore`
- Try: `dotnet clean && dotnet build`

## What's Next?

1. **Customize the template**: Edit `Templates/CvTemplate.cshtml`
2. **Add your own data**: Update your CV JSON in GitHub
3. **Deploy to Azure**: See [README.md](README.md#deploying-to-azure)
4. **Create branch variants**: Add CV JSON to other branches (e.g., `frontend-dev`)

## Project Structure Quick Reference

```
src/CvServer.Functions/
├── Functions/GetCvFunction.cs       ← Main HTTP endpoint
├── Templates/CvTemplate.cshtml      ← HTML template (customize this!)
├── Models/Cv.cs                     ← Data structure
├── Services/GitHubDataStore.cs      ← GitHub API client
└── local.settings.json              ← Your config (git-ignored)
```

## Architecture in One Diagram

```
Browser Request
    ↓
http://localhost:7071/main
    ↓
GetCvFunction (Azure Function)
    ↓
GitHubDataStore → GitHub API → cv-data.json
    ↓
RazorLight Template Engine
    ↓
HTML Response (rendered CV)
```

## Key Features You Get

✅ **FREE**: Azure Functions Consumption tier
✅ **Fast**: Server-side rendering (no client JS needed)
✅ **Secure**: Input sanitization built-in
✅ **Tested**: 95%+ code coverage with xUnit
✅ **Type-Safe**: C# records with nullable reference types
✅ **Print-Friendly**: Tailwind CSS optimized for PDF export

---

**Need help?** Check the full [README.md](README.md) or open an issue!
