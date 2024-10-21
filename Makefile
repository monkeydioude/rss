.PHONY: docker-all
docker-all: docker-update docker-restart

.PHONY: dev
dev: docker-start
	npm run expo:start --clear -- --port 8082

.PHONY: test
test:
	npm run test

.PHONY: docker-start
docker-start:
	docker compose up -d

.PHONY: docker-stop
docker-stop:
	docker compose stop

.PHONY: docker-restart
docker-restart: docker-stop docker-start

.PHONY: docker-update
docker-update:
	docker compose pull

.PHONY: docker-logs
docker-logs:
	docker compose logs --follow

.PHONY: adb
adb:
	adb reverse tcp:8100 tcp:8100 && adb reverse tcp:8083 tcp:8083
