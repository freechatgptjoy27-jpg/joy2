# Deploying CiviSpark Season 1.0 to GitHub & GitHub Pages

This guide provides step-by-step instructions to upload your project to GitHub and deploy it live on **GitHub Pages** (or Vercel / Netlify).

---

## Prerequisites: Install Git (If not already installed)

If you do not have Git installed on your Windows machine:
1. Download and install Git from: **https://git-scm.com/download/win**  
   *(or run in PowerShell as Administrator: `winget install --id Git.Git -e --source winget`)*
2. Once installed, close and reopen your terminal.

---

## Option 1: Deploy with Git & GitHub Actions (Recommended)

### Step 1: Create a New Repository on GitHub
1. Log in to [GitHub](https://github.com).
2. Click **New** (or go to `https://github.com/new`).
3. Repository name: `civispark-season-1` (or your preferred name).
4. Set visibility: **Public** (required for free GitHub Pages) or **Private**.
5. Do **NOT** check "Initialize with README", `.gitignore`, or license (the project already includes them).
6. Click **Create repository**.

### Step 2: Initialize and Push from Your Computer
Open PowerShell in the `civispark` directory:
```powershell
cd "C:\Users\Tech Farazi\Downloads\civispark"
```

Run the following commands:
```powershell
# 1. Initialize local Git repository
git init

# 2. Add all project files
git add .

# 3. Commit the project
git commit -m "Initial commit: CiviSpark Season 1.0 full platform"

# 4. Set default branch to main
git branch -M main

# 5. Link your GitHub repository (replace with your actual GitHub URL)
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git

# 6. Push to GitHub
git push -u origin main
```

---

### Step 3: Enable GitHub Pages

The repository already includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`).

1. In your GitHub repository, click on the **Settings** tab.
2. In the left sidebar, click on **Pages** (under "Code and automation").
3. Under **Build and deployment** > **Source**, select:
   * **GitHub Actions**
4. That's it! GitHub will automatically trigger the build workflow.
5. Within 1–2 minutes, your website will be live at:
   `https://<YOUR-GITHUB-USERNAME>.github.io/<YOUR-REPO-NAME>/`

---

## Option 2: Upload Without Terminal (GitHub Web Upload)

If you prefer not to use the command line:
1. Create a new repository on GitHub: `https://github.com/new`.
2. On the new repository page, click **uploading an existing file**.
3. Drag and drop the files from `C:\Users\Tech Farazi\Downloads\civispark` into GitHub.
4. Click **Commit changes**.
5. Go to **Settings** > **Pages** > Select **GitHub Actions** as source.

---

## Option 3: Continuous Deployment with Vercel or Netlify (Fastest Full-Stack Host)

Because CiviSpark is built with Vite, React, and Supabase:
1. Push your repository to GitHub following Option 1.
2. Go to **[vercel.com](https://vercel.com)** or **[netlify.com](https://netlify.com)** and sign in with GitHub.
3. Click **Add New Project** and select your `civispark-season-1` repository.
4. Add your environment variables (optional for preview mode, required for live Supabase):
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel/Netlify will build and provide a custom SSL URL (e.g. `https://civispark.vercel.app`) in under 60 seconds!

---

## Troubleshooting: GitHub Actions Build Errors & Solutions

If your GitHub Actions tab shows a red ❌ and reports a build error, here is how to resolve the most common causes:

### 1. `Error: Dependencies lock file is not found`
* **Why it happens:** The workflow attempted to cache npm using `package-lock.json`, but no lock file was committed to the repository.
* **Fix applied:** We removed `cache: 'npm'` and updated the command to `npm install --legacy-peer-deps` in `.github/workflows/deploy.yml`. Commit and push this change to resolve.

### 2. `error TS6307` or `tsc` compilation errors during `npm run build`
* **Why it happens:** Running `tsc` during CI build without matching project references fails.
* **Fix applied:** We updated `package.json` build script to `"build": "vite build"`. Vite compiles with esbuild directly and generates the production bundle into `/dist` in seconds.

### 3. `npm ERR! enoent ENOENT: no such file or directory, open 'package.json'`
* **Why it happens:** The files were pushed with a wrapper `civispark/` folder inside the repository rather than having `package.json` directly at the repository root.
* **Fix:** Make sure you initialize git inside `C:\Users\Tech Farazi\Downloads\civispark`, or move all files to the root of your GitHub repository.

### 4. `Error: Get Pages site failed: HttpError: Not Found` or `Resource not accessible by integration`
* **Why it happens:** GitHub Pages is set to default "Deploy from a branch" instead of "GitHub Actions".
* **Fix:** Go to your GitHub repository > **Settings** > **Pages** > change **Source** to **GitHub Actions**, then re-run the failed job.

### 5. 404 on page refresh on GitHub Pages
* **Why it happens:** Static file servers do not know React Router SPA sub-paths.
* **Fix applied:** The workflow automatically runs `cp dist/index.html dist/404.html` so all route deep-links work flawlessly.

