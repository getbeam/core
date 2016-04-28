# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "hashicorp/precise64"

  config.vm.box_url = "http://files.vagrantup.com/precise64.box"
  config.vm.hostname = "beambox"
  config.vm.network :private_network, ip: "192.168.25.113"

  config.vm.provider :virtualbox do |vb|
    vb.customize [
       "modifyvm", :id,
       "--memory", 1024
    ]
  end

  config.vm.synced_folder "./app", "/opt/beam/app", type: "rsync",
    rsync__args: ["-a"]

  config.vm.synced_folder "./node", "/opt/beam/node", type: "nfs"


  # Configure the window for gatling to coalesce writes.
  if Vagrant.has_plugin?("vagrant-gatling-rsync")
    config.gatling.latency = 0.2
    config.gatling.time_format = "%H:%M:%S"
  end

  # Don't automatically sync machine.
  config.gatling.rsync_on_startup = false

  config.vm.provision "shell", path: "vagrant/before-puppet.sh"

  config.vm.provision "puppet" do |puppet|
    puppet.manifests_path = "vagrant/puppet/manifests"
    puppet.manifest_file  = "default.pp"
    puppet.module_path = "vagrant/puppet/modules"
  end

  config.vm.provision "shell", path: "vagrant/after-puppet.sh"

  config.vm.provision "shell", path: "vagrant/startup.sh",
    run: "always", privileged: false
end
