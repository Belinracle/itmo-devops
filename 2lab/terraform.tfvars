prefix = "devopsVM-"

pool_path = "/var/lib/libvirt/"

image = {
  name = "ubuntu-22_04"
  url  = "https://releases.ubuntu.com/22.04/ubuntu-22.04.5-live-server-amd64.iso"
}

vm = {
  bridge = "br0"
  cpu    = 1
  disk   = 10 * 1024 * 1024 * 1024
  ram    = 512
}