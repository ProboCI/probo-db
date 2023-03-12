#!/bin/sh

if [ ! -e "/etc/probo/db-initialized" ]; then
  sh ./bin/migrate -c /etc/probo/db.yaml -k /etc/probo/knexfile.js
  touch "/etc/probo/db-initialized"
fi

exec sh ./bin/probo-db -c /etc/probo/db.yaml -k /etc/probo/knexfile.js
