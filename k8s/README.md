полезные команды

kubectl describe hpa devops-backend-hpa
kubectl get nodes
kubectl get deployments
kubectl get pods
kubectl get hpa
kubectl get events

запустить миникуб minikube start --driver=docker

проверить доступен ли кластер kubectl cluster-info  

minikube ip

![img.png](img.png)


раскатить последний лейтест kubectl rollout restart deployment/devops-frontend

прокидка портов:

kubectl port-forward svc/grafana-service 3000:3000
kubectl port-forward svc/prometheus-service 9090:9090