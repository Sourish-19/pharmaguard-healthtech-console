# Kill any process on port 8000
$port = 8000
$tcp = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($tcp) {
    Write-Host "Killing process on port $port..." -ForegroundColor Yellow
    foreach ($connection in $tcp) {
        try {
            Stop-Process -Id $connection.OwningProcess -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Host "Could not kill process $($connection.OwningProcess)" -ForegroundColor Red
        }
    }
    Start-Sleep -Seconds 1
}

# Install dependencies if needed
Write-Host "Checking dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt

# Run the server
Write-Host "Starting PharmaGuard Backend..." -ForegroundColor Green
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
