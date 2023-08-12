start:
	docker compose up -d

stop:
	docker compose stop

logs:
	docker compose logs --follow