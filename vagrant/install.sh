#!/bin/sh

# Setup SSL Certificate
if [ ! -e /tmp/ssl-created ]; then
  mkdir -p /etc/ssl/beam.local
  echo "Generating RSA Key for SSL..."
  openssl genrsa -out "/etc/ssl/beam.local/beam.local.key" 2048 >/dev/null 2>&1
  echo "Generating Certificate Signing Request..."
  openssl req -new -key "/etc/ssl/beam.local/beam.local.key" \
    -out "/etc/ssl/beam.local/beam.local.csr" \
    -subj "/C=DE/ST=NRW/L=Cologne/O=Beam/CN=beam.local"
  echo "Generating SSL Certificate..."
  openssl x509 -req -days 999 \
    -in "/etc/ssl/beam.local/beam.local.csr" \
    -signkey "/etc/ssl/beam.local/beam.local.key" \
    -out "/etc/ssl/beam.local/beam.local.crt"

  touch /tmp/ssl-created
fi

# Upgdate puppet to a more recent version
if [ ! -e /tmp/puppet-updated ]; then
  wget -O /tmp/puppetlabs-release-precise.deb http://apt.puppetlabs.com/puppetlabs-release-precise.deb
  dpkg -i /tmp/puppetlabs-release-precise.deb
  apt-get update
  apt-get --assume-yes install puppet
  touch /tmp/puppet-updated
fi

# Custom puppet modules
mkdir -p /etc/puppet/modules
puppet module install puppet-nodejs
puppet module install puppetlabs-apt
puppet module install puppetlabs-postgresql

# Install nodejs if it's not there
if [ ! -e /tmp/nodejs600-installed ]; then
  sudo apt-get install -y curl
  curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
  sudo apt-get install -y nodejs
  touch /tmp/nodejs600-installed
fi
