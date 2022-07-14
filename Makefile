#!make
.DEFAULT_GOAL := dev

dev:
	yarn start

test:
	yarn test $(ARGS)
