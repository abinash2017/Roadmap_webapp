@echo off
cd /d "%~dp0backend"
start "" powershell -WindowStyle Hidden -Command "Start-Sleep 3; Start-Process 'http://127.0.0.1:8000'"
"%~dp0backend\.venv\Scripts\python.exe" main.py
