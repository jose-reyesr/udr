#!/bin/bash

###############################################################################
# UDR Library
#
# Funciones compartidas para:
#   - normalización de nombres
#   - generación de IDs globales
#
# Uso:
#   source ./bin/udr-lib.sh
#
###############################################################################

SEQUENCE_FILE="data/.sequence.json"

normalizar() {

    echo "$1" \
        | iconv -f UTF-8 -t ASCII//TRANSLIT \
        | tr '[:upper:]' '[:lower:]' \
        | sed 's/[^a-z0-9 ]//g' \
        | sed 's/[[:space:]]\+/-/g' \
        | sed 's/^-//g' \
        | sed 's/-$//g'
}

init_sequence() {

    if [ ! -f "$SEQUENCE_FILE" ]
    then
        mkdir -p "$(dirname "$SEQUENCE_FILE")"

        cat > "$SEQUENCE_FILE" <<EOF
{
  "lastId": 0
}
EOF
    fi
}

next_id() {

    init_sequence

    LAST=$(jq -r '.lastId' "$SEQUENCE_FILE")

    NEXT=$((LAST + 1))

    jq --argjson id "$NEXT" \
       '.lastId = $id' \
       "$SEQUENCE_FILE" > "${SEQUENCE_FILE}.tmp"

    mv "${SEQUENCE_FILE}.tmp" "$SEQUENCE_FILE"

    echo "$NEXT"
}