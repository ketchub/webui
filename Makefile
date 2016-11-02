export COMPOSE_PROJECT_NAME = catchalongwebui
export RUN_COMMAND ?= npm start
export NODE_ENV ?= development

SHELL = /bin/bash

dev: setup
	@docker-compose -f _docker/docker-compose.yml up -d
	@docker-compose -f _docker/docker-compose.yml logs -f; true && \
	make halt

gen-indexes: RUN_COMMAND = node ./bin/gen-indexes
gen-indexes:
	make exec-buildsystem; true

halt:
	@docker-compose -f _docker/docker-compose.yml down

setup:
ifneq ($(wildcard ./node_modules/.*),)
	@echo "Initial setup complete; run make dev-npm-install to reinstall npm mods"
else
	make npm-install
endif

npm-install: RUN_COMMAND = npm install
npm-install:
	make exec-buildsystem

build-prod: NODE_ENV = production
build-prod: RUN_COMMAND = npm run-script build
build-prod:
	make exec-buildsystem; true && make halt

exec-buildsystem:
	@docker-compose -f _docker/docker-compose.yml run \
	--no-deps \
	--rm \
	buildsystem \
	$(RUN_COMMAND)

inspect-docker-compose-config:
	docker-compose -f _docker/docker-compose.yml config
