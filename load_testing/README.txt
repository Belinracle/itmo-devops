# запуск через докер

docker run -v $(pwd):/var/load-test -it direvius/yandex-tank - не работает

hey -z 5m -q 10 -c 10 http://<ingress-ip>/backend/api/some-endpoint должно работать

прометеус пароль prom-operator