provider "libvirt" {
  uri = "qemu:///system"
}

resource "libvirt_pool" "pool" {
  name = "${var.prefix}pool"
  type = "dir"
  path = "${var.pool_path}${var.prefix}pool"
}

resource "libvirt_volume" "image" {
  name   = var.image.name
  format = "qcow2"
  pool   = libvirt_pool.pool.name
  source = var.image.url
}

resource "libvirt_volume" "root" {
  name           = "${var.prefix}root"
  pool           = libvirt_pool.pool.name
  base_volume_id = libvirt_volume.image.id
  size           = var.vm.disk
}

data "template_file" "user_data" {
  template = file("${path.module}/cloud_init.cfg")
}

data "template_file" "network_config" {
  template = file("${path.module}/network_config.cfg")
}

resource "libvirt_cloudinit_disk" "commoninit" {
  name           = "commoninit.iso"
  pool           = libvirt_pool.pool.name
  user_data      = data.template_file.user_data.rendered
  network_config = data.template_file.network_config.rendered
}

resource "libvirt_network" "vm_network" {
  name      = "vm-network"
  mode      = "nat"
  autostart = true

  addresses = ["192.168.122.0/24"]
  dhcp {
    enabled = true
  }
}

resource "libvirt_domain" "vm" {
  name   = "${var.prefix}master"
  memory = var.vm.ram
  vcpu   = var.vm.cpu

  cpu {
    mode = "host-passthrough"
  }

  cloudinit = libvirt_cloudinit_disk.commoninit.id

  disk {
    volume_id = libvirt_volume.root.id
  }

  network_interface {
    network_id = libvirt_network.vm_network.id
    wait_for_lease = true
  }

  console {
    type        = "pty"
    target_type = "serial"
    target_port = "0"
  }

  graphics {
    type        = "vnc"
    listen_type = "address"
  }
}
