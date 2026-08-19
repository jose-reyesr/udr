#!/bin/bash

###############################################################################
# UDR Generate
#
# Genera:
#   - definiciones
#   - ids
#   - carpetas
#   - json hijos
#   - carpetas multimedia
#
# Uso:
#   ./bin/udr-generate.sh data/personas/personas.json
#
###############################################################################

source ./bin/udr-lib.sh

JSON="$1"

if [ ! -f "$JSON" ]
then
    echo "[ERROR] Archivo no encontrado: $JSON"
    exit 1
fi

FILE_NAME=$(basename "$JSON" .json)
FILE_PATH=$(dirname "$JSON")

###############################################################################
# DEFINICIONES
###############################################################################

if ! jq -e '.definiciones' "$JSON" >/dev/null 2>&1
then

    ID=$(next_id)

    jq \
        --arg filename "$FILE_NAME" \
        --arg path "$FILE_PATH" \
        --argjson id "$ID" \
        '. + {
            definiciones: {
                id: $id,
                filename: $filename,
                path: $path
            }
        }' \
        "$JSON" > "${JSON}.tmp"

    mv "${JSON}.tmp" "$JSON"

    echo "[OK] definiciones agregadas a $JSON"

fi

BASE_PATH=$(jq -r '.definiciones.path' "$JSON")

###############################################################################
# ITEMS
###############################################################################

jq -c '.items[]?' "$JSON" | while read -r ITEM
do

    NOMBRE=$(echo "$ITEM" | jq -r '.nombre // .')

    SLUG=$(normalizar "$NOMBRE")

    CHILD_PATH="${BASE_PATH}/${SLUG}"
    CHILD_JSON="${CHILD_PATH}/${SLUG}.json"

    if [ ! -d "$CHILD_PATH" ]
    then
        mkdir -p "$CHILD_PATH"
        echo "[CREADA] $CHILD_PATH"
    else
        echo "[EXISTE] $CHILD_PATH"
    fi

    if [ ! -f "$CHILD_JSON" ]
    then

        CHILD_ID=$(next_id)

        cat > "$CHILD_JSON" <<EOF
{
  "definiciones": {
    "id": $CHILD_ID,
    "filename": "$SLUG",
    "path": "$CHILD_PATH"
  },
  "items": [],
  "media": {
    "images": [],
    "videos": [],
    "audios": [],
    "documents": []
  }
}
EOF

        echo "[CREADO] $CHILD_JSON"

    else
        echo "[EXISTE] $CHILD_JSON"
    fi

    RELATIVE_PATH="${CHILD_PATH#data/}"

    for TIPO in img video audio documentos
    do

        MEDIA_DIR="media/$TIPO/$RELATIVE_PATH"

        if [ ! -d "$MEDIA_DIR" ]
        then
            mkdir -p "$MEDIA_DIR"
            echo "[CREADA] $MEDIA_DIR"
        fi

    done

done