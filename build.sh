#!/bin/bash

echo ""
echo "-----------------------------------------------------"
echo "Building Probo DB Image"
echo "-----------------------------------------------------"

help() {
  echo "build.sh - script to build the postgresql database handler image"
  echo ""
  echo "Usage:"
  echo "./build.sh <repository_name> <tag>"
  echo ""
  echo "Example: To build an image tagged 'dev' for DockerHub on my account:"
  echo "./build.sh mbagnall dev\n"
  echo ""
  echo "Example: To build an image tagged 'dev' on a private registry with"
  echo "the 'probo' namespace:"
  echo "./build.sh docker.example.com/probo dev"
  echo ""
  exit 1;
}

if [ -n "$2" ]; then
  export tag=$2
else
  help
fi

if [ -z "$1" ]; then
  help
fi

echo -n "Hash: "
docker build . -q -t $1/db:$tag
echo -n  "Repo: "
docker push -q $1/db:$tag
echo ""
