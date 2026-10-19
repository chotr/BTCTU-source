param(
  [string]$OutputFile = "btctu-local.zip",
  [switch]$IncludeDatabase
)

$ErrorActionPreference = "Stop"
$outputPath = [IO.Path]::GetFullPath($OutputFile)
$stagePath = Join-Path ([IO.Path]::GetTempPath()) ("btctu-package-" + [Guid]::NewGuid().ToString("N"))

New-Item -ItemType Directory -Force -Path $stagePath | Out-Null
try {
  robocopy (Get-Location) $stagePath /E /XD .git node_modules .next .local-db /XF .env .env.local .env.development .env.production .env.test .dev.vars /NFL /NDL /NJH /NJS /NP | Out-Null
  if ($LASTEXITCODE -gt 7) {
    throw "Copying source files failed with exit code $LASTEXITCODE"
  }

  Get-ChildItem -Path $stagePath -Recurse -Force -File | Where-Object {
    ($_.Name -eq ".env" -or ($_.Name -like ".env.*" -and $_.Name -notlike "*.example")) -or $_.Extension -eq ".log"
  } | Remove-Item -Force

  if ((Test-Path -LiteralPath "database/source.dump") -and -not $IncludeDatabase) {
    Write-Host "Database dump found in source and will be included."
  }

  if (Test-Path -LiteralPath $outputPath) {
    Remove-Item -LiteralPath $outputPath -Force
  }
  Compress-Archive -Path (Join-Path $stagePath "*") -DestinationPath $outputPath -CompressionLevel Optimal
  Write-Host "Package created: $outputPath"
  if (Test-Path -LiteralPath (Join-Path $stagePath "database/source.dump")) {
    Write-Host "The package includes the database dump; treat it as sensitive data."
  } else {
    Write-Host "Package excludes database data. Use migrations on the target machine."
  }
} finally {
  Remove-Item -LiteralPath $stagePath -Recurse -Force -ErrorAction SilentlyContinue
}
