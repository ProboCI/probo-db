#!/bin/sh

if [ ! -e "/etc/probo/db-initialized" ]; then
  sh ./bin/migrate -c /etc/probo/db.yaml
  touch "/etc/probo/db-initialized"
fi

exec ./bin/probo-db -c /etc/probo/db.yaml
