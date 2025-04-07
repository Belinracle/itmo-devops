terraform {
  required_providers {
    libvirt = {
      source  = "dmacvicar/libvirt"
      version = "~> 0.8.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "libvirt" {
  uri = "qemu:///system"
}

# Создание пула хранения (или используйте имя существующего пула)
resource "libvirt_pool" "default" {
  name = "default"
  type = "dir"
  path = "/var/lib/libvirt/images"
}

# Загрузка ISO-образа операционной системы
resource "libvirt_volume" "ubuntu-qcow2" {
  name   = "ubuntu.qcow2"
  pool   = libvirt_pool.default.name
  format = "qcow2"
  source = "https://releases.ubuntu.com/22.04/ubuntu-22.04.5-live-server-amd64.iso"
}

# Создание новой сети (или используйте UUID существующей)
resource "libvirt_network" "vm_network" {
  name      = "vm-network"
  mode      = "nat"
  autostart = true

  addresses = ["192.168.122.0/24"]
  dhcp {
    enabled = true
  }
}

# Настройка Cloud-Init с уникальным именем ISO
resource "libvirt_cloudinit_disk" "common_init" {
  name           = "commoninit-${random_string.suffix.result}.iso"
  pool           = libvirt_pool.default.name
  user_data      = data.template_file.user_data.rendered
  network_config = <<EOF
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: true
EOF
}

# Генерация случайного суффикса
resource "random_string" "suffix" {
  length  = 8
  special = false
}

# Виртуальная машина
resource "libvirt_domain" "vm" {
  name = "my-vm"

  memory = 2048
  vcpu   = 2

  # Назначение сети
  network_interface {
    network_id = libvirt_network.vm_network.id
  }

  # Диск для виртуальной машины
  disk {
    volume_id = libvirt_volume.ubuntu-qcow2.id
  }

  # Подключение Cloud-Init ISO
  disk {
    volume_id = libvirt_cloudinit_disk.common_init.id
  }

  # Графический вывод (опционально)
  graphics {
    type        = "spice"
    listen_type = "address"
    autoport    = true
  }
}

# Шаблон Cloud-Init для настройки пользователя с паролем
data "template_file" "user_data" {
  template = <<EOF
#cloud-config
users:
  - name: ubuntu
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    groups: sudo
    shell: /bin/bash
    passwd: "$6$rounds=4096$GTyL8/A2Rl6XWgSP$DGo8nKsZwv5Fh7L.XqKjVmPcmbJfh9ncEeEcE1kp/4fJ3UPjDQ3h2dhdWWblf0njmbrRytqgT8LE/He45pw/N0" # Хэш пароля
EOF
}