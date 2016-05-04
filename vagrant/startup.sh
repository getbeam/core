#!/bin/sh

cd /opt/beam/app/
echo "Checking npm modules..."

npm install

echo "Starting beam in pm2!"
npm start
