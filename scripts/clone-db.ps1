param(
  [string]$SourceEnvFile = "apps/api/.env.local",
  [string]$DumpFile = ".local-db/source.dump"
)

$ErrorActionPreference = "Stop"

function Assert-NativeSuccess([string]$Operation) {
  if ($LASTEXITCODE -ne 0) {
    throw "$Operation failed with exit code $LASTEXITCODE"
  }
}

if (-not (Test-Path -LiteralPath $SourceEnvFile)) {
  throw "Source environment file not found: $SourceEnvFile"
}

$databaseLine = Get-Content -LiteralPath $SourceEnvFile | Where-Object {
  $_ -match '^\s*DATABASE_URL\s*='
} | Select-Object -First 1

if (-not $databaseLine) {
  throw "DATABASE_URL is not configured in $SourceEnvFile"
}

$sourceUrl = ($databaseLine -replace '^\s*DATABASE_URL\s*=\s*', '').Trim().Trim('"').Trim("'")
if (-not ($sourceUrl -match '^postgres(?:ql)?://')) {
  throw "DATABASE_URL in $SourceEnvFile is not a PostgreSQL URL"
}

$dumpPath = [IO.Path]::GetFullPath($DumpFile)
$dumpDirectory = Split-Path -Parent $dumpPath
New-Item -ItemType Directory -Force -Path $dumpDirectory | Out-Null

Write-Host "Starting local PostgreSQL..."
docker compose up -d db
Assert-NativeSuccess "Starting local PostgreSQL"

Write-Host "Creating dump from source database..."
docker run --rm `
  -e "SOURCE_DATABASE_URL=$sourceUrl" `
  -v "${dumpDirectory}:/backup" `
  postgres:17-alpine `
  sh -c 'pg_dump --dbname="$SOURCE_DATABASE_URL" --format=custom --no-owner --no-acl --file=/backup/source.dump'
Assert-NativeSuccess "Creating source dump"

$containerId = (docker compose ps -q db).Trim()
if (-not $containerId) {
  throw "Could not find the local PostgreSQL container"
}

Write-Host "Restoring dump into local database..."
docker cp $dumpPath "${containerId}:/tmp/source.dump"
Assert-NativeSuccess "Copying dump into local PostgreSQL"
docker compose exec -T db pg_restore `
  --clean `
  --if-exists `
  --no-owner `
  --no-acl `
  --schema=public `
  --schema=drizzle `
  -U btctu `
  -d btctu `
  /tmp/source.dump
Assert-NativeSuccess "Restoring source dump"

docker compose exec -T db psql -U btctu -d btctu -c "select current_database(), current_user;"
Assert-NativeSuccess "Checking restored database"
Write-Host "Clone complete. Dump saved at $DumpFile"
Write-Host "Local DATABASE_URL: postgresql://btctu:btctu_local@localhost:5437/btctu"
