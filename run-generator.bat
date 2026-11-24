@echo off
cd /d "%~dp0"
echo ============================================================
echo   Generador Autonomo de Pruebas OpenAPI / Swagger
echo ============================================================
echo.

call npm run generate:api -- --file openapi-sample.json

echo.
echo ============================================================
echo   Listo. Presiona cualquier tecla para cerrar esta ventana...
echo ============================================================
pause
