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

проверить жива ли вм 

sudo virsh dominfo my-vm

получить айпишник вмки 

sudo virsh domifaddr my-vm


# Управление виртуальными машинами (доменами)
virsh list --all                          # Показать все виртуальные машины (запущенные и остановленные)
virsh start <имя_машины>                  # Запустить виртуальную машину
virsh shutdown <имя_машины>               # Корректно завершить работу виртуальной машины
virsh destroy <имя_машины>                # Принудительно остановить виртуальную машину
virsh reboot <имя_машины>                 # Перезагрузить виртуальную машину
virsh undefine <имя_машины>               # Удалить конфигурацию виртуальной машины (не удаляет диски)
virsh undefine <имя_машины> --remove-all-storage  # Удалить виртуальную машину вместе с дисками
virsh dominfo <имя_машины>                # Получить информацию о виртуальной машине
virsh console <имя_машины>                # Подключиться к консоли виртуальной машины (выход: Ctrl+])
virsh suspend <имя_машины>                # Приостановить виртуальную машину
virsh resume <имя_машины>                 # Возобновить работу приостановленной виртуальной машины
virsh domifaddr <имя_машины>              # Получить IP-адрес виртуальной машины

# Управление сетями
virsh net-list --all                      # Показать все сети (активные и неактивные)
virsh net-start <имя_сети>                # Запустить сеть
virsh net-destroy <имя_сети>              # Остановить сеть
virsh net-undefine <имя_сети>             # Удалить сеть
virsh net-define <путь_к_XML_файлу>       # Создать сеть из XML-файла
virsh net-autostart <имя_сети>            # Включить автозапуск сети

# Управление пулами хранения
virsh pool-list --all                     # Показать все пулы хранения (активные и неактивные)
virsh pool-define-as <имя_пула> dir - - - - "<путь_к_каталогу>"  # Создать пул хранения
virsh pool-build <имя_пула>               # Создать структуру пула хранения
virsh pool-start <имя_пула>               # Запустить пул хранения
virsh pool-destroy <имя_пула>             # Остановить пул хранения
virsh pool-undefine <имя_пула>            # Удалить пул хранения
virsh vol-list <имя_пула>                 # Показать тома в пуле хранения
virsh vol-delete <имя_тома> --pool <имя_пула>  # Удалить том из пула хранения
virsh vol-create-as <имя_пула> <имя_диска> <размер> --format qcow2  # Создать новый диск в пуле

# Дополнительные команды
virsh migrate <имя_машины> qemu+ssh://<хост>/system  # Переместить виртуальную машину на другой хост
virsh dumpxml <имя_машины> > vm_config.xml           # Экспортировать конфигурацию виртуальной машины в XML
virsh edit <имя_машины>                              # Редактировать конфигурацию виртуальной машины
virsh domstate <имя_машины>                          # Проверить состояние виртуальной машины
virsh net-dumpxml <имя_сети>                         # Экспортировать конфигурацию сети в XML
virsh pool-dumpxml <имя_пула>                        # Экспортировать конфигурацию пула хранения в XML