param(
  [string]$Repository = "quill-markdown",
  [ValidateSet("public", "private")]
  [string]$Visibility = "public"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "git was not found in PATH."
}
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI (gh) was not found. Install it and run 'gh auth login' first."
}

if (-not (Test-Path ".git")) {
  git init
  git branch -M main
}

git add .
if (-not (git status --porcelain)) {
  Write-Host "No uncommitted changes."
} else {
  git commit -m "Initial Quill v0.1.0 prototype"
}

$visibilityFlag = if ($Visibility -eq "private") { "--private" } else { "--public" }
& gh repo create $Repository $visibilityFlag --source=. --remote=origin --push

Write-Host "Repository created and pushed."
Write-Host "Run the Windows build with:"
Write-Host "  gh workflow run 'Windows x64 Build'"
