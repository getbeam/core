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

  config.vm.synced_folder "./", "/opt/beam", type: "nfs"

  config.vm.provision "shell", path: "vagrant/install.sh"

  config.vm.provision "puppet" do |puppet|
    puppet.manifests_path = "vagrant/puppet/manifests"
    puppet.manifest_file  = "default.pp"
    puppet.module_path = "vagrant/puppet/modules"
  end

  config.vm.provision "shell", path: "vagrant/startup.sh",
    run: "always", privileged: false
end
