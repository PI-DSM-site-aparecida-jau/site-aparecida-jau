# Kubernetes local (Docker Desktop)

Este guia executa o site da Paróquia em um cluster Kubernetes local do Docker Desktop.
Os manifests ficam em `kubernetes/paroquia.yaml`.

## O que será iniciado

- React + Nginx: acesso pelo navegador em `http://localhost:31730`.
- API ASP.NET Core: Service interno na porta 8080. Para o navegador acessar a API sem alterar os endereços atuais do frontend, mantenha o encaminhamento abaixo ativo; a API ficará em `http://localhost:5220` e Swagger em `http://localhost:5220/swagger`.
- MySQL 8 e MongoDB 6: serviços internos do cluster.
- Volumes persistentes para MySQL, MongoDB e arquivos enviados para `wwwroot`.

> Use Docker Compose **ou** Kubernetes para cada execução. Não suba os dois ambientes ao mesmo tempo: eles tentam usar as mesmas portas locais e criam instâncias separadas dos bancos.

## 1. Preparar o Docker Desktop

1. Abra o Docker Desktop.
2. Entre em **Settings > Kubernetes** e habilite **Enable Kubernetes**.
3. Aguarde o cluster ficar pronto.
4. No PowerShell, confira o contexto:
   ```powershell
   kubectl config get-contexts
   kubectl config use-context docker-desktop
   kubectl get nodes
   ```

## 2. Criar as imagens

Execute os comandos na pasta raiz do repositório (a pasta que contém `backend`, `frontend` e `kubernetes`):

```powershell
docker build -t paroquia-api:latest -f backend/api-aparecida-jau/Dockerfile backend/api-aparecida-jau
docker build -t paroquia-frontend:latest -f frontend/site-aparecida-jau/Dockerfile frontend/site-aparecida-jau
```

## 3. Criar as credenciais do cluster

O arquivo YAML **não contém senhas**. Crie o Secret localmente no PowerShell. Use senhas fortes, de preferência com letras e números (a connection string do MongoDB exige codificação especial para alguns caracteres reservados):

```powershell
kubectl create namespace paroquia

$env:MYSQL_ROOT_PASSWORD = Read-Host "Senha root do MySQL"
$env:MONGO_ROOT_PASSWORD = Read-Host "Senha root do MongoDB"

kubectl create secret generic paroquia-secrets -n paroquia --from-literal=MYSQL_ROOT_PASSWORD="$env:MYSQL_ROOT_PASSWORD" --from-literal=MONGO_ROOT_PASSWORD="$env:MONGO_ROOT_PASSWORD"

Remove-Item Env:MYSQL_ROOT_PASSWORD
Remove-Item Env:MONGO_ROOT_PASSWORD
```

O Secret do Kubernetes evita colocar as senhas no Git, mas os Secrets padrão são apenas codificados em base64; não equivalem a um cofre de senhas. Não publique esses valores.

Se o Secret já existir e você precisar trocar as senhas, remova e recrie o Secret **somente se souber como as credenciais dos bancos existentes foram inicializadas**. Alterar o Secret não altera automaticamente as senhas já gravadas nos volumes dos bancos.

## 4. Aplicar os recursos

Na raiz do repositório:

```powershell
kubectl apply -f kubernetes/paroquia.yaml
kubectl get pods -n paroquia -w
```

Aguarde os pods ficarem `Running` e `Ready`. A primeira inicialização pode demorar enquanto os bancos criam seus diretórios e a API aplica as migrations.

## 5. Acessar o site e a API

Abra um segundo PowerShell e mantenha este comando rodando:

```powershell
kubectl port-forward -n paroquia svc/api 5220:8080
```

Depois acesse:

- Site: http://localhost:31730
- Swagger: http://localhost:5220/swagger

O encaminhamento da API é necessário porque o frontend atual usa URLs absolutas com `localhost:5220`. Em um cluster local, o navegador do usuário não consegue resolver o nome interno `api` do Kubernetes. Esse encaminhamento mantém o código atual funcionando sem alterar as chamadas existentes.

## Comandos úteis

```powershell
kubectl get pods -n paroquia
kubectl get services -n paroquia
kubectl logs -n paroquia deployment/api
kubectl describe pod -n paroquia <nome-do-pod>
```

Para parar o encaminhamento, pressione **Ctrl+C** no terminal em que `kubectl port-forward` está rodando.

Para remover os recursos do manifesto:

```powershell
kubectl delete -f kubernetes/paroquia.yaml
```

**Atenção aos dados:** não exclua os PVCs nem o namespace se quiser preservar bancos e uploads. Excluir o namespace `paroquia` também exclui os volumes persistentes associados. Para uma limpeza total de laboratório, faça isso somente depois de exportar tudo o que deseja guardar.

## Observações

- Esta configuração é para desenvolvimento/apresentação local em um cluster de nó único, não é uma implantação de produção.
- MySQL e MongoDB usam volumes persistentes; o armazenamento disponível depende do Docker Desktop.
- A API executa as migrations do Entity Framework ao iniciar, conforme o `Program.cs` do projeto.
- O Swagger permanece habilitado porque o ambiente está definido como `Development`. Para produção, configure ambiente, HTTPS, segredos, CORS e observabilidade adequadamente.
