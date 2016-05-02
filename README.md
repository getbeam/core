# beam/core

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Setup](#setup)
	- [Requirements](#requirements)
	- [Installation](#installation)
- [Developing](#developing)
	- [Auto Reload the beam core](#auto-reload-the-beam-core)
	- [Inspecting Logs](#inspecting-logs)
	- [Vagrant Box](#vagrant-box)
		- [Shutting down](#shutting-down)
		- [Resuming](#resuming)
		- [PostgreSQL](#postgresql)
		- [Inside the vm](#inside-the-vm)

<!-- /TOC -->

## Setup

### Requirements

* Node.js ([official](https://nodejs.org/en/) or give [nvm](https://github.com/creationix/nvm) a try)
  * There may be problems with v6.x and some used packages.
  * *Note: You don't need Node.js installed locally in order to run beam, but all scripts (setup, watch, logs) are written in JavaScript, because why not.*
* [Vagrant](https://www.vagrantup.com/)

### Installation

```sh
npm run setup
```

This will set up everything for you. Our friendly installer will explain everything. It can automatically configure the hostname, SSH and SSL. At the end you'll be able to request https://beam.local and have a full functioning beam core available.

Before it will change something in your configurations, it will explain the necessary steps and give you the choice to do it yourself or let the installer do it. But don't panic, these are all simple configurations. Nothing crazy.

*Note: The setup will call `vagrant up`, which installs and configures the Vagrant Box (Virtual Machine). It's completely normal if the first `vagrant up` takes at least 10 minutes. It's also normal if you see some red output. Red output doesn't automatically mean something is failing; often deprecations or progress is streamed to stderr. If the setup fails, Vagrant will tell you it failed.*

## Developing

### Auto Reload the beam core

If you change something in beam's core, you'll want the app to reload. Changes in `app/**/*.{js,json}` will cause a fast reload with the following command:

```sh
npm run watch
```

Type `r` to manually reload the app.  
Type `q` or `ctrl-c` to exit.

You also can directly execute `scripts/watch`.

**Behind the scenes.** The watch script will open a ssh connection to the vm and simultaneously watch your files locally for changes. If a file-change is detected, `pm2 reload beam-core` will be executed on the vm through the ssh connection.

### Inspecting Logs

While developing it's always good to see the logs. Everyone likes to debug with `console.log`. Stream the logs with the following command:

```sh
npm run logs
```

You also can directly execute `scripts/log`.

**Behind the scenes.** The log script will open a ssh connection to the vm. It will call `pm2 logs beam-core` and stream its output to your tty.

### Vagrant Box

Everything related to Vagrant's CLI explained here is way more detailed in explained in [Vagrant's documentation](https://www.vagrantup.com/docs/cli/).

#### Shutting down

If you're done with developing for the day, call one of the following:

* `vagrant suspend`: doesn't completely shut down the vm; fast reload (no reboot); requires more disk-space
* `vagrant halt`: shut down vm; machine needs to boot if you want to continue
* `vagrant destory`: destroys the vm like if it wasn't there at all, needs to be installed if you want to continue

#### Resuming

* `vagrant reload` if you suspended the vm
* `vagrant up` if you've shut down or destroyed the vm

#### PostgreSQL

PostgreSQL is installed on the virtual machine. Its port is shared with your computer. For debugging (or just viewing the database) you can connect to PostgreSQL on the vm **through your local machine**. It's like magic.

  * Host: `localhost`
  * Port: `5432`
  * User: `beam`
  * Password: `securepassword`
  * Database: `beam`

[Postico](https://eggerapps.at/postico/) is a nice PostgreSQL client for OS X.

#### Inside the vm

* The beam-core is located in `/opt/beam` in the vm
* The beam-core is managed by [pm2](https://github.com/Unitech/pm2)
* `vagrant up` will automatically call `npm start`, which starts beam through pm2
