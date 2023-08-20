docker-all: docker-update docker-restart

docker-start:
	docker compose up -d
	@sudo chown 1000:1000 .tmp

docker-stop:
	docker compose stop

docker-restart: docker-stop docker-start

docker-update:
	docker compose pull

docker-logs:
	docker compose logs --follow