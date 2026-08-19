#!/bin/bash

###############################################################################
# UDR Validate
#
# Uso:
#   ./bin/udr-validate.sh data/personas/personas.json
#
###############################################################################

JSON="$1"

if [ ! -f "$JSON" ]
then
    echo "[ERROR] Archivo no encontrado"
    exit 1
fi

echo "Validando: $JSON"

jq -e '.definiciones.id' "$JSON" >/dev/null \
    || echo "[ERROR] definiciones.id"

jq -e '.definiciones.filename' "$JSON" >/dev/null \
    || echo "[ERROR] definiciones.filename"

jq -e '.definiciones.path' "$JSON" >/dev/null \
    || echo "[ERROR] definiciones.path"

echo "[OK] validación finalizada"