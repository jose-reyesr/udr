#!/bin/bash

###############################################################################
# UDR Media
#
# Sincroniza la sección media de un JSON.
#
# Uso:
#   ./bin/udr-media.sh data/personas/juan-perez/juan-perez.json
#
###############################################################################

JSON="$1"

if [ ! -f "$JSON" ]
then
    echo "[ERROR] Archivo no encontrado"
    exit 1
fi

PATH_JSON=$(jq -r '.definiciones.path' "$JSON")

REL="${PATH_JSON#data/}"

IMG="media/img/$REL"
VIDEO="media/video/$REL"
AUDIO="media/audio/$REL"
DOC="media/documentos/$REL"

mkdir -p "$IMG"
mkdir -p "$VIDEO"
mkdir -p "$AUDIO"
mkdir -p "$DOC"

build_media() {

    DIR="$1"

    if [ ! -d "$DIR" ]
    then
        echo "[]"
        return
    fi

    find "$DIR" -type f | while read -r FILE
    do

        NAME=$(basename "$FILE")
        LABEL="${NAME%.*}"

        jq -n \
            --arg label "$LABEL" \
            --arg filename "$NAME" \
            --arg path "$DIR" \
            '{
                label:$label,
                source:{
                    filename:$filename,
                    path:$path
                }
            }'

    done | jq -s '.'
}

IMAGES=$(build_media "$IMG")
VIDEOS=$(build_media "$VIDEO")
AUDIOS=$(build_media "$AUDIO")
DOCUMENTS=$(build_media "$DOC")

jq \
    --argjson images "$IMAGES" \
    --argjson videos "$VIDEOS" \
    --argjson audios "$AUDIOS" \
    --argjson documents "$DOCUMENTS" \
    '.media = {
        images: $images,
        videos: $videos,
        audios: $audios,
        documents: $documents
     }' \
    "$JSON" > "${JSON}.tmp"

mv "${JSON}.tmp" "$JSON"

echo "[OK] media sincronizada"