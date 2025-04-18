prefix = "devopsVM-"

pool_path = "/var/lib/libvirt/"

image = {
  name = "ubuntu-focal"
  url  = "https://cloud-images.ubuntu.com/focal/current/focal-server-cloudimg-amd64-disk-kvm.img"
}

vm = {
  bridge = "br0"
  cpu    = 1
  disk   = 20 * 1024 * 1024 * 1024
  ram    = 512
}