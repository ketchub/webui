export COMPOSE_PROJECT_NAME = ca-web-ui
export RUN_COMMAND ?= npm start
export NODE_ENV ?= development

SHELL = /bin/bash

dev: setup
	@docker-compose -f _docker/docker-compose.yml up -d
	@docker-compose -f _docker/docker-compose.yml logs -f; true && \
	make halt

halt:
	@docker-compose -f _docker/docker-compose.yml down

setup:
ifneq ($(wildcard ./node_modules/.*),)
	@echo "Initial setup complete; run make npm-install to reinstall npm mods"
else
	make npm-install
endif

npm-install: RUN_COMMAND = npm install
npm-install:
	make dockerize

dockerize:
	@docker-compose -f _docker/docker-compose.yml run \
		--no-deps \
		--rm \
		box \
		$(RUN_COMMAND)

####################################################
# Execute specific commands within container
####################################################
gen-indexes: RUN_COMMAND = node ./bin/gen-indexes
gen-indexes:
	make dockerize; true

####################################################
# Production build
####################################################
build-prod: NODE_ENV = production
build-prod: RUN_COMMAND = npm run-script build
build-prod:
	make dockerize; true && make halt

####################################################
# Utilities and debugging
####################################################
inspect-docker-compose-config:
	docker-compose -f _docker/docker-compose.yml config
