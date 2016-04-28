#!/bin/sh

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
if ! type "$foobar_command_name" > /dev/null; then
  sudo apt-get install -y curl
  curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
