#!/bin/bash

###############################################################################
# UDR Bootstrap
#
# Inicializa un JSON de UDR:
#   - Crea definiciones si no existen
#   - Asigna IDs globales
#   - Genera carpetas y JSON hijos
#   - Sincroniza media
#   - Ejecuta validaciones
#
# Uso:
#   ./bin/udr-bootstrap.sh <archivo-json>
#
# Ejemplo:
#   ./bin/udr-bootstrap.sh data/personas/personas.json
#
###############################################################################

source ./bin/udr-lib.sh

JSON="$1"

[ -f "$JSON" ] || exit 1

FILE_NAME=$(basename "$JSON" .json)
FILE_PATH=$(dirname "$JSON")

if ! jq -e '.definiciones' "$JSON" >/dev/null
then

    ID=$(next_id)

    jq \
        --arg filename "$FILE_NAME" \
        --arg path "$FILE_PATH" \
        --argjson id "$ID" \
        '. + {
          definiciones:{
            id:$id,
            filename:$filename,
            path:$path
          }
        }' \
        "$JSON" > "${JSON}.tmp"

    mv "${JSON}.tmp" "$JSON"

fi

./bin/udr-generate.sh "$JSON"
./bin/udr-media.sh "$JSON"
./bin/udr-validate.sh "$JSON"