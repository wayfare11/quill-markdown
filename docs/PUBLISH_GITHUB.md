# Publish Quill to GitHub

Recommended repository name:

```text
quill-markdown
```

The product display name can remain `Quill` while repository/package names stay more specific to avoid confusion with other software named Quill.

## Option A - GitHub website

1. Create a new empty repository named `quill-markdown`.
2. Do not add a README, `.gitignore`, or license during creation because this source tree already includes them.
3. From this folder run:

```powershell
git init
git branch -M main
git add .
git commit -m "Initial Quill v0.1.0 prototype"
git remote add origin https://github.com/YOUR_USERNAME/quill-markdown.git
git push -u origin main
```

Then open GitHub Actions and run `Windows x64 Build`.

## Option B - GitHub CLI

If `gh` is installed and authenticated:

```powershell
git init
git branch -M main
git add .
git commit -m "Initial Quill v0.1.0 prototype"
gh repo create quill-markdown --public --source=. --remote=origin --push
```

Then:

```powershell
gh workflow run "Windows x64 Build"
```

## Create release v0.1.0

After the first successful build:

```powershell
git tag v0.1.0
git push origin v0.1.0
```

The tag build is configured to create a GitHub Release and attach generated Windows installers.
