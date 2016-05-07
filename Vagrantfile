INSTALL = <<-SCRIPT
apt-get install -y software-properties-common
apt-add-repository -y ppa:ansible/ansible
apt-get update
apt-get install -y ansible
ansible-playbook /opt/beam/vagrant/playbook.yml -e main_user=vagrant -c local -i /opt/beam/vagrant/inventory
SCRIPT

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.hostname = "beambox"
  config.vm.network :private_network, ip: "192.168.25.113"

  config.vm.provider :virtualbox do |vb|
    vb.customize ["modifyvm", :id, "--memory", 1024]
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
  end

  config.vm.synced_folder "./", "/opt/beam", type: "nfs"

  config.vm.network "forwarded_port", guest: 5432, host: 5432, auto_correct: true

  config.vm.provision "shell", inline: INSTALL

  config.vm.provision "shell", path: "vagrant/startup.sh",
    run: "always", privileged: false
end
