# GitHub Pages Setup Instructions

Follow these steps to host your TimeSheet app on GitHub Pages:

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it `TimeSheet` (or any name you prefer)
5. Make it **Public** (required for free GitHub Pages)
6. **Don't** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Push Your Code to GitHub

Run these commands in your terminal (PowerShell):

```powershell
# Make sure you're in the project directory
cd "C:\Users\bbailey\OneDrive - TJ Inspection, Inc\Desktop\Projects\TimeSheet"

# Add all files
git add .

# Commit the files
git commit -m "Initial commit: TimeSheet app"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/TimeSheet.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** You'll need to authenticate with GitHub. You may need to:
- Use a Personal Access Token instead of password
- Or use GitHub CLI (`gh auth login`)

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

## Step 4: Access Your Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/TimeSheet/
```

It may take a few minutes for the site to be available after enabling Pages.

## Updating Your Site

Whenever you make changes:

```powershell
git add .
git commit -m "Description of changes"
git push
```

Changes will be live within a few minutes!

## Troubleshooting

- **Site not loading?** Wait 5-10 minutes after first setup
- **404 Error?** Make sure `index.html` is in the root directory
- **Authentication issues?** Use a Personal Access Token or GitHub CLI

