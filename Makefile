export COMPOSE_PROJECT_NAME = ca-web-ui
export RUN_COMMAND ?= npm start
export NODE_ENV ?= development

SHELL = /bin/bash

.PHONY: dev
dev: setup
	@docker-compose -f _docker/docker-compose.yml up -d
	@docker-compose -f _docker/docker-compose.yml logs -f; true && \
	make halt

.PHONY: halt
halt:
	@docker-compose -f _docker/docker-compose.yml down

.PHONY: setup
setup:
ifneq ($(wildcard ./node_modules/.*),)
	@echo "Initial setup complete; run make npm-install to reinstall npm mods"
else
	make npm-install
endif

.PHONY: npm-install
npm-install: RUN_COMMAND = npm install
npm-install:
	make dockerize

.PHONY: dockerize
dockerize:
	@docker-compose -f _docker/docker-compose.yml run \
		--no-deps \
		--rm \
		box \
		$(RUN_COMMAND)

####################################################
# Execute specific commands within container
####################################################
.PHONY: gen-indexes
gen-indexes: RUN_COMMAND = node ./bin/gen-indexes
gen-indexes:
	make dockerize; true

####################################################
# Production build
####################################################
.PHONY: build-prod
build-prod: NODE_ENV = production
build-prod: RUN_COMMAND = npm run-script build
build-prod:
	make dockerize; true && make halt

####################################################
# Test
####################################################
.PHONY: test
test: NODE_ENV = test
test: RUN_COMMAND = npm test
test:
	make dockerize; true && make halt

####################################################
# Utilities and debugging
####################################################
.PHONY: login-container
login-container:
	docker exec -it cawebui_box_1 /bin/sh

.PHONY: inspect-docker-compose-config
inspect-docker-compose-config:
	docker-compose -f _docker/docker-compose.yml config
