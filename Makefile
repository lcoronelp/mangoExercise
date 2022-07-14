#!make
.DEFAULT_GOAL := dev

dev:
	yarn start

installAndDev:
	yarn install --silient && yarn start

prod:
	docker-compose -f docker-compose_prod.yml up -d --build

test:
	yarn test $(ARGS)
