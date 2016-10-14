SHELL = /bin/bash
NODE_ENV ?= development
DOCKER_IMAGE_NAME = catchalongwebui

dev: RUN_COMMAND = npm start
dev: run

build: NODE_ENV = production
build: RUN_COMMAND = npm run-script build
build: run

run: setup
	@docker run -it --rm \
	-p 8080:8080 \
	-v $$PWD:/app \
	-w /app \
	-e NODE_ENV=$(NODE_ENV) \
	$(DOCKER_IMAGE_NAME) \
	$(RUN_COMMAND)

setup: ensure-docker-image
ifneq ($(wildcard ./node_modules/.*),)
	@echo "NPM setup OK; run make npm-setup to rebuild node modules."
else
	make npm-setup
endif

npm-setup: ensure-docker-image
	@echo "Setting up with intermediate container..."
	docker run -it --rm -v $$PWD:/app -w /app $(DOCKER_IMAGE_NAME) npm install
	docker run -it --rm -v $$PWD:/app -w /app $(DOCKER_IMAGE_NAME) npm rebuild

ensure-docker-image:
	@if [ "$$(docker images -q $(DOCKER_IMAGE_NAME))" == "" ]; then \
		echo "Building $(DOCKER_IMAGE_NAME)..."; \
		docker build -t $(DOCKER_IMAGE_NAME) .; \
	fi
