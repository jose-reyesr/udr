// ======================================================
// 📁 js/utils/jsonDownloader.js
// ======================================================

(function(){

    const FILE =
        "jsonDownloader.js";

    const log =
        (...a) =>
            window.logger?.info?.(
                FILE,
                ...a
            );

    const error =
        (...a) =>
            window.logger?.error?.(
                FILE,
                ...a
            );

    // ==================================================
    // EXPORT
    // ==================================================

    window.jsonDownloader = {

        serialize,

        download

    };

    // ==================================================
    // SERIALIZE
    // ==================================================

    function serialize({

        json = null

    } = {}){

        try{

            if(!json){

                return null;

            }

            return JSON.stringify(

                json,

                null,

                2

            );

        }
        catch(e){

            error(
                "serialize:",
                e
            );

            throw e;

        }

    }

    // ==================================================
    // DOWNLOAD
    // ==================================================

    function download({

        json = null,

        fileName =
            "document.json"

    } = {}){

        try{

            const content =
                serialize({
                    json
                });

            if(
                content === null
            ){

                return false;

            }

            const blob =
                new Blob(

                    [content],

                    {
                        type:
                            "application/json"
                    }

                );

            const url =
                URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement(
                    "a"
                );

            link.href =
                url;

            link.download =
                fileName;

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            URL.revokeObjectURL(
                url
            );

            return true;

        }
        catch(e){

            error(
                "download:",
                e
            );

            throw e;

        }

    }

    // ==================================================

    log(
        "jsonDownloader inicializado."
    );

})();