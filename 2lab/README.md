удалить существующий пул

sudo virsh pool-destroy default

sudo virsh pool-undefine default

удалить существующую сеть 

sudo virsh net-destroy default

sudo virsh net-undefine default

создание пула 

# Определение пула
sudo virsh pool-define-as default dir - - - - "/var/lib/libvirt/images"

# Создание структуры пула
sudo virsh pool-build default

# Запуск пула
sudo virsh pool-start default

# Включение автозапуска (опционально)
sudo virsh pool-autostart default

# Проверка состояния пула
sudo virsh pool-list --all