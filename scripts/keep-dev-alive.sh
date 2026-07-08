#!/bin/bash
# Persistent dev server launcher
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting next dev..."
  npx next dev -p 3000 2>&1 | tee -a dev.log
  echo "[$(date)] Server exited, restarting in 3s..."
  sleep 3
done
