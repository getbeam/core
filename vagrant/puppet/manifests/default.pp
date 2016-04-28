group { 'puppet':
  ensure => present,
}

exec { 'apt-get update':
  command => '/usr/bin/apt-get update',
}

package { 'nginx':
  ensure => present,
  require => Exec['apt-get update'],
}

service { 'nginx':
  ensure => running,
  require => Package['nginx'],
}

file { 'vagrant-nginx':
  path => '/etc/nginx/sites-available/beam.local',
  ensure => file,
  replace => true,
  require => Package['nginx'],
  source => 'puppet:///modules/nginx/beam.local',
  notify => Service['nginx']
}

file { 'default-nginx-disable':
  path => '/etc/nginx/sites-enabled/default',
  ensure => abstent,
  require => Package['nginx'],
}

file { 'default-nginx-enable':
  path => '/etc/nginx/sites-enabled/beam.local',
  target => '/etc/nginx/sites-available/beam.local',
  ensure => link,
  notify => Service['nginx'],
  require => [
    File['vagrant-nginx'],
    File['default-nginx-disable']
  ],
}

package { 'pm2':
  ensure => 'present',
  provider => 'npm',
}

class { 'postgresql::server': }

postgresql::server::db { 'beam':
  user => 'beam',
  password => postgresql_password('beam', 'securepassword'),
}
