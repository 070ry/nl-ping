@echo off
title Neverland RPG Ping Bot
cls
echo Starting...
:a
node index.js
echo Restarting...
timeout /nobreak /t 1 > nul
goto a