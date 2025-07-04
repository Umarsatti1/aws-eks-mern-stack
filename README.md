# MERN Stack Deployment on AWS EKS

This guide walks you through deploying a **MERN Stack application** (MongoDB, Express.js, React, Node.js) on **AWS EKS** using **Docker**, **Kubernetes**, **Helm**, and **AWS Load Balancer Controller**.

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/Umarsatti1/simple-mern-app.git
cd aws-eks-mern-stack
```

---

## Step 2: Dockerize and Test Locally

### Frontend:
```bash
cd frontend
docker build -t mern-app-frontend .
docker run -d -p 3000:3000 mern-app-frontend:latest
```

### Backend:
```bash
cd backend
docker build -t mern-app-backend .
```

Verify:
```bash
docker images
docker ps
```

---

## Step 3: Push Docker Images to ECR

### Frontend:
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag mern-app-frontend:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/mern-app-frontend:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/mern-app-frontend:latest
```

### Backend:
```bash
# Tag and push
docker tag mern-app-backend:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/mern-app-backend:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/mern-app-backend:latest
```

---

## Step 4: Install `eksctl` and `kubectl`

Install and verify:
```bash
# eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
eksctl version

# kubectl
curl -O https://s3.us-west-2.amazonaws.com/amazon-eks/1.32.3/2025-04-17/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin
kubectl version --client
```

---

## Step 5: Create an EKS Cluster

```bash
eksctl create cluster --name mern-app-cluster --region us-east-1 --version 1.32 --node-type=t2.small --nodes-min 2 --nodes-max 2
aws eks update-kubeconfig --region us-east-1 --name mern-app-cluster
kubectl get nodes -A
```

---

## Step 6: Deploy Kubernetes Manifests

```bash
kubectl create namespace mern-app
kubectl apply -f <manifest>.yml
```

Manifests:
- MongoDB: `deployment.yml`, `service.yml`
- Backend: `deployment.yml`, `service.yml`
- Frontend: `deployment.yml`, `service.yml`
- Secrets: `secrets.yml`

---

## Step 7: Configure IAM for AWS Load Balancer Controller

```bash
eksctl utils associate-iam-oidc-provider --region us-east-1 --cluster mern-app-cluster --approve

curl -o iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json
aws iam create-policy --policy-name EKSMernAppAWSLBControllerIAMPolicy --policy-document file://iam-policy.json

eksctl create iamserviceaccount \
  --cluster=mern-app-cluster \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name=EKSMernAppAWSLBControllerIAMRole \
  --attach-policy-arn=arn:aws:iam::<ACCOUNT_ID>:policy/EKSMernAppAWSLBControllerIAMPolicy \
  --region=us-east-1 \
  --approve
```

---

## Step 9: Install Helm

```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

---

## Step 10: Deploy AWS Load Balancer Controller

```bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update eks

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=mern-app-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --version 1.13.0

kubectl get deployment -n kube-system aws-load-balancer-controller
```

---

## Step 11: Apply Ingress Controller

```bash
kubectl apply -f app_ingress.yml
kubectl get ingress app-ingress -n mern-app
```

### Configure Local Hostname Mapping

#### For Linux:
```bash
dig +short <ALB_DNS>
sudo vim /etc/hosts
# Add line
35.171.212.240 mernapp.local
sudo nmcli general reload dns-cache
```

#### For Windows:
- Edit `C:\Windows\System32\drivers\etc\hosts` with Admin rights
- Add:
```
35.171.212.240 mernapp.local
```
- Run:
```cmd
ipconfig /flushdns
```

Access app via [http://mernapp.local](http://mernapp.local)

---

## Step 12: Clean Up

```bash
eksctl delete cluster --name mern-app-cluster --region us-east-1
```

---

## Done!

You’ve successfully deployed a containerized MERN app on AWS EKS with Ingress, Helm, and Load Balancer Controller.
