export COMPOSE_PROJECT_NAME = catchalongwebui

SHELL = /bin/bash

dev: export NODE_ENV = development
dev: dev-setup
	docker-compose -f _docker/docker-compose.yml up -d
	docker-compose -f _docker/docker-compose.yml logs -f; true && \
	make dev-halt

dev-halt:
	docker-compose -f _docker/docker-compose.yml down

dev-setup:
ifneq ($(wildcard ./node_modules/.*),)
	@echo "Initial setup complete; run make dev-npm-install to reinstall npm mods"
else
	make dev-npm-install
endif

dev-npm-install:
	echo "Setting up with intermediate container..."
	docker run -it --rm -v $$PWD:/app -w /app mhart/alpine-node:6.7.0 npm install && npm rebuild
