#!/bin/bash

###############################################################################
# UDR Rebuild
#
# Recorre todos los JSON y regenera media.
#
# Uso:
#   ./bin/udr-rebuild.sh
#
###############################################################################

find data -type f -name "*.json" | while read -r JSON
do

    echo "Procesando $JSON"

    ./bin/udr-media.sh "$JSON"

done

echo "[OK] rebuild completado"