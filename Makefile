.PHONY: all
all: build start

.PHONY: build
build: ## Build the docker image
	@docker image build -t adriankumpf/findmeaflat .

.PHONY: start
start: ## Start the docker container
	@docker container run \
		--init \
		--name findmeaflat \
		--rm \
		-v $$(pwd)/conf/config.json:/app/conf/config.json \
		-v findmeaflat:/app/db \
		adriankumpf/findmeaflat

.PHONY: dev
dev: ## Start the docker container for development
	@ docker container run \
		--init \
		--rm \
		-it \
		-u root \
		-v $$(pwd)/conf:/app/conf \
		-v $$(pwd)/db:/app/db \
		-v $$(pwd)/index.js:/app/index.js \
		-v $$(pwd)/lib:/app/lib \
		adriankumpf/findmeaflat

