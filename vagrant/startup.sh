#!/bin/sh

cd /opt/beam/app/
echo "Checking npm modules..."
npm install

echo "Starting beam in pm2!"
npm start

echo ""
echo ""
echo "#"
echo "#"
echo "# To start watching for file changes, run:"
echo "#    vagrant gatling-rsync-auto"
echo "# You'll most likely want to run this in a separate tab"
echo "#"
echo "#"
echo ""
echo ""
