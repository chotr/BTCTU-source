param(
  [switch]$RestoreDump,
  [string]$DumpFile = "database/source.dump"
)

$ErrorActionPreference = "Stop"

function Assert-NativeSuccess([string]$Operation) {
  if ($LASTEXITCODE -ne 0) {
    throw "$Operation failed with exit code $LASTEXITCODE"
  }
}

function New-RandomSecret {
  $bytes = New-Object byte[] 32
  [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  return [Convert]::ToBase64String($bytes)
}

$dbPort = $env:BTCTU_DB_PORT
if (-not $dbPort) {
  $dbPort = "5437"
}

if (-not $RestoreDump -and (Test-Path -LiteralPath $DumpFile)) {
  $RestoreDump = $true
}

if (-not (Test-Path -LiteralPath "apps/api/.env.local")) {
  $apiEnv = @(
    "PORT=8787"
    "ENVIRONMENT=local"
    "CORS_ORIGINS=http://localhost:3000"
    "PUBLIC_BASE_URL=http://localhost:8787"
    "PROBLEM_TYPE_BASE=http://localhost:8787/problems"
    "REQUEST_BODY_LIMIT=1mb"
    "DATABASE_URL=postgresql://btctu:btctu_local@localhost:$dbPort/btctu"
    "JWT_ACCESS_SECRET=$(New-RandomSecret)"
    "JWT_ACCESS_ISSUER=btctu-api"
    "JWT_ACCESS_AUDIENCE=btctu-web"
    "JWT_ACCESS_TTL_SECONDS=900"
    "REFRESH_TOKEN_TTL_SECONDS=604800"
    "AUTH_COOKIE_SECURE=false"
    "AUTH_COOKIE_SAME_SITE=Strict"
  )
  [IO.File]::WriteAllLines((Join-Path (Get-Location) "apps/api/.env.local"), $apiEnv)
  Write-Host "Created apps/api/.env.local with a new local JWT secret."
}

if (-not (Test-Path -LiteralPath "apps/web/.env.local")) {
  $webEnv = @(
    "NEXT_PUBLIC_DATA_SOURCE=api"
    "NEXT_PUBLIC_API_BASE_URL=http://localhost:8787"
    "NEXT_PUBLIC_APP_ENV=local"
    "ENABLE_MOCK_ROUTES=true"
  )
  [IO.File]::WriteAllLines((Join-Path (Get-Location) "apps/web/.env.local"), $webEnv)
  Write-Host "Created apps/web/.env.local."
}

Write-Host "Starting local PostgreSQL..."
docker compose up -d db
Assert-NativeSuccess "Starting local PostgreSQL"

if ($RestoreDump) {
  if (-not (Test-Path -LiteralPath $DumpFile)) {
    throw "Dump file not found: $DumpFile"
  }

  $containerId = (docker compose ps -q db).Trim()
  Assert-NativeSuccess "Finding local PostgreSQL container"
  docker cp (Resolve-Path -LiteralPath $DumpFile) "${containerId}:/tmp/source.dump"
  Assert-NativeSuccess "Copying database dump"
  docker compose exec -T db pg_restore --clean --if-exists --no-owner --no-acl --schema=public --schema=drizzle -U btctu -d btctu /tmp/source.dump
  Assert-NativeSuccess "Restoring database dump"
} else {
  Write-Host "Applying committed migrations..."
  pnpm --filter @btctu/api db:migrate
  Assert-NativeSuccess "Applying database migrations"
}

Write-Host "Local setup complete. Run 'pnpm dev' to start the application."
