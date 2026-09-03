#!/bin/bash

JSON="$1"

PATH_DESTINO=$(jq -r '.meta.data.source.path' "$JSON")
NOMBRE_DESTINO=$(jq -r '.meta.data.source.file' "$JSON")

DESTINO="$PATH_DESTINO/$NOMBRE_DESTINO"

if [ -f "$DESTINO" ]; then
    echo "El archivo ya existe:"
    echo "$DESTINO"
    echo

    diff -u \
        <(jq -S . "$DESTINO") \
        <(jq -S . "$JSON")

    echo
    read -p "¿Reemplazar? (s/n): " RESP

    if [ "$RESP" != "s" ]; then
        echo "Cancelado"
        exit 0
    fi
fi

mkdir -p "$PATH_DESTINO"
mv "$JSON" "$DESTINO"

echo "Movido a $DESTINO"
