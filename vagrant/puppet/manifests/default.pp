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
  notify => Service['nginx'],
}

file { 'default-nginx-disable':
  path => '/etc/nginx/sites-enabled/default',
  ensure => abstent,
  require => Package['nginx'],
}

file { '/etc/ssl/beam.local':
  ensure => 'directory',
}

file { 'ssl-certificate':
  path => '/etc/ssl/beam.local/beam.local.crt',
  ensure => file,
  replace => true,
  source => 'puppet:///modules/ssl/beam.local.crt',
  require => Package['nginx'],
}

file { 'ssl-key':
  path => '/etc/ssl/beam.local/beam.local.key',
  ensure => file,
  replace => true,
  source => 'puppet:///modules/ssl/beam.local.key',
  require => File['ssl-certificate'],
  notify => Service['nginx'],
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

class { 'postgresql::server':
  ip_mask_deny_postgres_user => '0.0.0.0/32',
  ip_mask_allow_all_users    => '0.0.0.0/0',
  listen_addresses           => '*',
  encoding                   => 'UTF-8',
  locale                     => 'en_US.UTF-8',
}

postgresql::server::db { 'beam':
  user => 'beam',
  password => postgresql_password('beam', 'securepassword'),
}
