#!/bin/bash

if [ ! -e "/etc/probo/db-initialized" ]; then
  /home/probo/app/bin/migrate -c /etc/probo/db.yaml -k /etc/probo/knexfile.js
  touch "/etc/probo/db-initialized"
fi

exec /home/probo/app/bin/probo-db -c /etc/probo/db.yaml -k /etc/probo/knexfile.js
