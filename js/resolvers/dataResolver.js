// ======================================================
// 📁 js/core/dataResolver.js
// ======================================================
// UNIVERSAL DECLARATIVE RUNTIME
//
// RESPONSABILIDAD ÚNICA
// - Resolver información dentro de un JSON ya cargado.
//
// NO HACE
// - fetch de archivos
// - cargar schemas
// - resolver datasets
// - resolver relaciones
// - navegación
// - render
// ======================================================

(function(){

    const FILE = "dataResolver.js";

    const error =
        (...a)=>window.logger?.error?.(FILE,...a);

    // ==================================================
    // CACHE
    // ==================================================

    const CACHE =
        Object.create(null);

    // ==================================================
    // EXPORTS
    // ==================================================

    window.dataResolver = {

        resolve,

        clearCache,

        getCache

    };

    // ==================================================
    // RESOLVE
    // ==================================================
    // Devuelve cualquier estructura ubicada
    // mediante un jsonPath dentro del root.
    // ==================================================

    async function resolve({

        root = null,

        jsonPath = null

    } = {}){

        try{

            if(!root){
                return null;
            }

            //------------------------------------------------
            // ROOT COMPLETO
            //------------------------------------------------

            if(
                !jsonPath ||
                jsonPath === ""
            ){

                return root;

            }

            //------------------------------------------------
            // CACHE
            //------------------------------------------------

            const cacheKey =

                jsonPath;

            if(
                CACHE[
                    cacheKey
                ] !== undefined
            ){

                return CACHE[
                    cacheKey
                ];

            }

            //------------------------------------------------
            // PATH
            //------------------------------------------------

            const value =

                window.pathResolver
                ?.getByPath(

                    root,

                    jsonPath

                )

                ??

                null;

            CACHE[
                cacheKey
            ] = value;

            return value;

        }
        catch(e){

            error(
                "resolve:",
                e
            );

            return null;

        }

    }

    // ==================================================
    // CACHE
    // ==================================================

    function clearCache(){

        Object.keys(
            CACHE
        ).forEach(

            key=>delete CACHE[key]

        );

    }

    function getCache(){

        return {

            ...CACHE

        };

    }

})();