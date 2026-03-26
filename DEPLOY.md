# Deploy — Share Venda Digitada
### Ubuntu Linux + Nginx + SSL (Let's Encrypt)

> **Subdomínio alvo:** `digitada.shareinvesitmentos.com.br`
> **Stack:** Next.js 14 · Docker · Nginx (container) · Certbot

---

## Pré-requisitos

Antes de começar, confirme:

- [ ] Servidor Ubuntu 20.04 / 22.04 / 24.04 com IP público
- [ ] DNS configurado: registro **A** `digitada.shareinvesitmentos.com.br` → IP do servidor
  - A propagação DNS pode levar até 24h; verifique com `dig digitada.shareinvesitmentos.com.br`
- [ ] Portas **22**, **80** e **443** abertas no firewall/security group da nuvem (AWS, GCP, DigitalOcean etc.)
- [ ] Chaves Stripe disponíveis: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`

---

## 1. Preparar o servidor Ubuntu

Acesse o servidor via SSH e execute:

```bash
# Atualizar o sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
sudo apt install -y git curl ca-certificates gnupg lsb-release ufw

# ── Instalar Docker Engine (script oficial) ──────────────────────────────────
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh

# Adicionar o usuário atual ao grupo docker (evita precisar de sudo)
sudo usermod -aG docker $USER

# Aplicar grupo sem fazer logout (para a sessão atual)
newgrp docker

# Verificar instalação
docker --version
docker compose version
```

### Configurar o firewall (UFW)

```bash
# Permitir SSH, HTTP e HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ativar firewall
sudo ufw enable

# Verificar regras
sudo ufw status
```

---

## 2. Fazer upload do projeto

### Opção A — Git clone (recomendado)

```bash
# Acesse o diretório onde vai ficar o projeto
cd /opt

# Clone do repositório (ajuste a URL)
sudo git clone https://github.com/SEU_USUARIO/share-digitada.git
sudo chown -R $USER:$USER share-digitada
cd share-digitada
```

### Opção B — Upload via SCP (da sua máquina local)

```bash
# Execute no seu Mac/PC local, não no servidor:
scp -r /Users/lucasqueiroz/Documents/share-digitada usuario@IP_DO_SERVIDOR:/opt/share-digitada
```

### Criar o arquivo `.env.local` no servidor

```bash
cd /opt/share-digitada

# Criar o arquivo de variáveis de ambiente
nano .env.local
```

Cole o conteúdo abaixo, substituindo pelos valores reais:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_SUBSTITUA_AQUI
STRIPE_SECRET_KEY=sk_live_SUBSTITUA_AQUI
STRIPE_WEBHOOK_SECRET=whsec_SUBSTITUA_AQUI
```

Salve com `Ctrl+O`, `Enter`, `Ctrl+X`.

---

## 3. Criar estrutura de infraestrutura

Os arquivos `docker-compose.prod.yml`, `nginx/conf.d/app.conf` já estão no repositório.
Crie apenas os diretórios de volume do Certbot:

```bash
cd /opt/share-digitada

mkdir -p certbot/conf certbot/www

# Confirmar estrutura
ls -la nginx/conf.d/
# deve listar: app.conf
```

---

## 4. Subir app + nginx em HTTP (Fase 1)

Neste passo o nginx sobe com a config HTTP-only para permitir o desafio ACME do Certbot.

```bash
cd /opt/share-digitada

# Carregar variáveis de ambiente e subir os containers
set -a && . ./.env.local && set +a
docker compose -f docker-compose.prod.yml up -d --build app nginx
```

Acompanhe os logs do build:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

Aguarde a mensagem `✓ Ready in ...ms` do container `app`.

Teste o acesso HTTP (deve retornar redirect 301):

```bash
curl -I http://digitada.shareinvesitmentos.com.br
# Esperado: HTTP/1.1 301 Moved Permanently
```

---

## 5. Obter o certificado SSL (Certbot)

### 5.1 — Baixar parâmetros DH necessários para a config HTTPS do Nginx

```bash
mkdir -p certbot/conf

# Download dos parâmetros recomendados pelo Certbot
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
  -o certbot/conf/options-ssl-nginx.conf

curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem \
  -o certbot/conf/ssl-dhparams.pem
```

### 5.2 — Solicitar o certificado

Substitua `seu@email.com` pelo seu e-mail real (para notificações de expiração):

```bash
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d digitada.shareinvesitmentos.com.br \
  --email seu@email.com \
  --agree-tos \
  --no-eff-email
```

Saída esperada ao final:
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/digitada.shareinvesitmentos.com.br/fullchain.pem
```

---

## 6. Ativar HTTPS no Nginx (Fase 2)

Edite o arquivo de configuração do Nginx para ativar o bloco HTTPS:

```bash
nano /opt/share-digitada/nginx/conf.d/app.conf
```

**Substitua todo o conteúdo do arquivo pelo bloco abaixo:**

```nginx
server {
    listen 80;
    server_name digitada.shareinvesitmentos.com.br;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl;
    http2 on;
    server_name digitada.shareinvesitmentos.com.br;

    ssl_certificate     /etc/letsencrypt/live/digitada.shareinvesitmentos.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/digitada.shareinvesitmentos.com.br/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 10M;

    location / {
        proxy_pass         http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Salve o arquivo e recarregue o Nginx:

```bash
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

Verifique o acesso HTTPS:

```bash
curl -I https://digitada.shareinvesitmentos.com.br
# Esperado: HTTP/2 200
```

---

## 7. Subir o certbot em modo de renovação automática

```bash
docker compose -f docker-compose.prod.yml up -d certbot
```

Confirme que todos os 3 containers estão rodando:

```bash
docker compose -f docker-compose.prod.yml ps
# NAME       STATUS
# app        running
# nginx      running
# certbot    running
```

Acesse no navegador: **https://digitada.shareinvesitmentos.com.br** ✓

---

## 8. Configurar Webhook Stripe

O Stripe precisa de uma URL pública HTTPS para enviar eventos de pagamento.

1. Acesse o [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Clique em **"Add endpoint"**
3. Configure:
   - **Endpoint URL:** `https://digitada.shareinvesitmentos.com.br/api/webhook`
   - **Events to listen:** selecione os 3 eventos abaixo:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `payment_intent.created`
4. Clique em **"Add endpoint"**
5. Na página do endpoint criado, clique em **"Reveal"** ao lado de **Signing secret**
6. Copie o valor `whsec_...`

Atualize o `.env.local` no servidor:

```bash
nano /opt/share-digitada/.env.local
# Altere a linha STRIPE_WEBHOOK_SECRET= com o valor copiado
```

Faça o rebuild do container `app` para aplicar a variável:

```bash
cd /opt/share-digitada
set -a && . ./.env.local && set +a
docker compose -f docker-compose.prod.yml up -d --build app
```

Teste o webhook (opcional — requer Stripe CLI instalado localmente):

```bash
stripe trigger payment_intent.succeeded
# Verifique os logs: docker compose -f docker-compose.prod.yml logs -f app
```

---

## 9. Auto-renovação do certificado SSL

O certificado Let's Encrypt expira a cada 90 dias. Configure um cron para renovar automaticamente:

```bash
crontab -e
```

Adicione a linha abaixo ao final do arquivo (renovação às 3h da manhã, todo dia):

```
0 3 * * * cd /opt/share-digitada && docker compose -f docker-compose.prod.yml run --rm certbot renew --quiet && docker compose -f docker-compose.prod.yml exec nginx nginx -s reload >> /var/log/certbot-renew.log 2>&1
```

Teste a renovação em modo dry-run (sem alterar o certificado):

```bash
docker compose -f docker-compose.prod.yml run --rm certbot renew --dry-run
```

---

## 10. Comandos de manutenção

### Ver logs em tempo real

```bash
# Todos os containers
docker compose -f docker-compose.prod.yml logs -f

# Apenas a aplicação Next.js
docker compose -f docker-compose.prod.yml logs -f app

# Apenas o nginx
docker compose -f docker-compose.prod.yml logs -f nginx
```

### Status dos containers

```bash
docker compose -f docker-compose.prod.yml ps
```

### Reiniciar a aplicação

```bash
docker compose -f docker-compose.prod.yml restart app
```

### Redeploy (novo código)

```bash
cd /opt/share-digitada

# Puxar atualizações do git (se usando git clone)
git pull

# Rebuild e restart apenas do app
set -a && . ./.env.local && set +a
docker compose -f docker-compose.prod.yml up -d --build app
```

### Parar tudo

```bash
docker compose -f docker-compose.prod.yml down
```

### Parar e remover volumes

```bash
docker compose -f docker-compose.prod.yml down -v
```

### Ver informações do certificado SSL

```bash
docker compose -f docker-compose.prod.yml run --rm certbot certificates
```

### Forçar renovação do certificado

```bash
docker compose -f docker-compose.prod.yml run --rm certbot renew --force-renewal
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

### Verificar uso de disco e imagens Docker

```bash
docker system df
docker images
```

### Limpar imagens antigas (após rebuilds)

```bash
docker image prune -f
```

---

## Resumo do fluxo completo

```
1. apt update + instalar Docker + UFW
2. Upload do projeto → criar .env.local
3. mkdir certbot/conf certbot/www
4. docker compose up -d --build app nginx   ← HTTP only
5. curl certbot → obter certificado
6. editar nginx/conf.d/app.conf → Fase 2 HTTPS
7. nginx -s reload
8. docker compose up -d certbot
9. Dashboard Stripe → configurar webhook
10. crontab → renovação automática
```

---

> Este arquivo foi gerado automaticamente. Manter `.env.local` fora do controle de versão.
> Nunca commitar chaves Stripe no repositório.
