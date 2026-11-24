@echo off
cd /d "%~dp0"
echo ============================================================
echo   Ejecutando Pruebas Generadas con Playwright
echo ============================================================
echo.

call npm run test:generated

echo.
echo ============================================================
echo   Listo. Presiona cualquier tecla para cerrar esta ventana...
echo ============================================================
pause
