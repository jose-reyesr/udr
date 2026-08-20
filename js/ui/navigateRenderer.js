// ======================================================
// 📁 js/ui/navigateRenderer.js
// ======================================================
// UNIVERSAL DECLARATIVE RUNTIME
//
// Resolver único de navegación
//
// Utilizado por:
//
// - objectFieldRenderer
// - imageFieldRenderer
// - iconFieldRenderer
// - buttonFieldRenderer
// - listLayout
//
// ======================================================

(function(){

    const FILE =
        "navigateRenderer.js";

    const log =
        (...a)=>window.logger?.info?.(
            FILE,
            ...a
        );

    const error =
        (...a)=>window.logger?.error?.(
            FILE,
            ...a
        );

    window.navigateRenderer = {

        buildHref,
        navigate,
        isNavigation

    };

    // ==========================================
    // DETECTA OBJETO NAVIGATION
    // ==========================================

    function isNavigation(
        value
    ){

        try{

            return !!(

                value &&
                typeof value === "object" &&
                value.html &&
                value.source

            );

        }
        catch(e){

            return false;

        }

    }

    // ==========================================
    // BUILD HREF
    // ==========================================

    function buildHref(
        navigation = {}
    ){

        try{

            if(
                !navigation
            ){
                return "#";
            }

            const html =
                navigation.html ||
                "index.html";

            const file =
                navigation
                ?.source
                ?.file;

            const path =
                navigation
                ?.source
                ?.path;

            const parameters =
                navigation
                ?.parameters

                ||

                {};

            const params =
                new URLSearchParams();

            //--------------------------------------
            // SOURCE
            //--------------------------------------

            if(file){

                params.append(
                    "file",
                    file
                );

            }

            if(path){

                params.append(
                    "path",
                    path
                );

            }

            //--------------------------------------
            // PARAMETERS
            //--------------------------------------

            for(const key of Object.keys(parameters)){

                const value =
                    parameters[key];

                if(
                    value === undefined ||
                    value === null
                ){
                    continue;
                }

                params.append(
                    key,
                    value
                );

            }

            const query =
                params.toString();

            return query

                ? `${html}?${query}`

                : html;

        }
        catch(e){

            error(
                "buildHref",
                e
            );

            return "#";

        }

    }

    // ==========================================
    // NAVEGAR
    // ==========================================

    async function navigate(
        navigation = {}
    ){

        try{

            const href =
                buildHref(
                    navigation
                );

            window.location.href =
                href;

        }
        catch(e){

            error(
                "navigate",
                e
            );

        }

    }

    log(
        "navigateRenderer inicializado"
    );

})();