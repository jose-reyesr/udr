// ======================================================
// 📁 js/utils/jsonLoader.js
// ======================================================
// UNIVERSAL DECLARATIVE RUNTIME
//
// RESPONSABILIDAD
// - Cargar archivos JSON.
// - Resolver file + path.
// - Usar dataLoader cuando exista.
// - Hacer fetch como fallback.
//
// NO HACE
// - Render
// - Layouts
// - Profiles
// - Datasets
// - Relaciones
// ======================================================

(function(){

    const FILE =
        "jsonLoader.js";

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

    window.jsonLoader = {

        load,

        resolvePath

    };

    // ==================================================
    // LOAD
    // ==================================================

    async function load({

        file = null,

        path = ""

    } = {}){

        try{

            if(!file){

                throw new Error(
                    "No se especificó el archivo."
                );

            }

            const fullPath =
                resolvePath({

                    file,

                    path

                });

            //--------------------------------------------------
            // DATALOADER
            //--------------------------------------------------

            if(
                window.dataLoader?.load
            ){

                const json =
                    await window
                        .dataLoader
                        .load(
                            fullPath
                        );

                if(json){

                    return json;

                }

            }

            //--------------------------------------------------
            // FETCH
            //--------------------------------------------------

            const response =
                await fetch(

                    fullPath,

                    {
                        cache:
                            "no-store"
                    }

                );

            if(
                !response.ok
            ){

                throw new Error(

                    `HTTP ${response.status}`

                );

            }

            return await response.json();

        }
        catch(e){

            error(
                "load:",
                e
            );

            throw e;

        }

    }

    // ==================================================
    // RESOLVE PATH
    // ==================================================

    function resolvePath({

        file = null,

        path = ""

    } = {}){

        try{

            return (

                window.pathResolver
                    ?.resolve(

                        path,

                        file

                    )

                ||

                file

            );

        }
        catch(e){

            error(
                "resolvePath:",
                e
            );

            return file;

        }

    }

    // ==================================================

    log(
        "jsonLoader inicializado."
    );

})();