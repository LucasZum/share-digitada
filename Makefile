.PHONY: build up down dev logs

# Carrega o .env.local e exporta as variáveis para o docker compose build
build:
	@set -a && . ./.env.local && set +a && docker compose build

up:
	@set -a && . ./.env.local && set +a && docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

dev:
	npm run dev
