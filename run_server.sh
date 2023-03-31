#!/bin/sh
echo "service restarting ..."
docker-compose up -d --build
echo "shutdown core server ..."
docker-compose exec -T briefcast_core pkill deno
echo "start server ..."
docker-compose exec -T briefcast_core ./run_dev.sh &
docker-compose exec -T briefcast npm run serve &
