# ModuMentor Project Startup Script
Write-Host "🚀 Starting ModuMentor Project..." -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (-not (Test-Path "agent\.env") -and -not (Test-Path ".env")) {
    Write-Host "⚠️  WARNING: No .env file found!" -ForegroundColor Yellow
    Write-Host "   The application may not work without proper environment variables." -ForegroundColor Yellow
    Write-Host "   Required variables: GEMINI_API_KEY, GOOGLE_SHEETS_ID (optional)" -ForegroundColor Yellow
    Write-Host ""
}

# Start Node.js Server (Port 5000)
Write-Host "📦 Starting Node.js Server (Port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm start" -WindowStyle Normal

# Wait a bit for server to start
Start-Sleep -Seconds 3

# Start React Frontend (Port 3000)
Write-Host "⚛️  Starting React Frontend (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Services starting..." -ForegroundColor Green
Write-Host ""
Write-Host "📍 Server: http://localhost:5000" -ForegroundColor White
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Note: The Python agent will be called via the Node.js bridge." -ForegroundColor Yellow
Write-Host "Make sure Python dependencies are installed:" -ForegroundColor Yellow
Write-Host "cd agent; pip install -r requirements.txt" -ForegroundColor Yellow
Write-Host ""

