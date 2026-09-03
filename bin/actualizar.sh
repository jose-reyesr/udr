#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Proyecto: $PROJECT_DIR"

mv \
    "$HOME/Downloads/update.json" \
    "$PROJECT_DIR/data/"