// ======================================================
// 📁 js/fields/imageFieldRenderer.js
// ======================================================

(function(){

    const FILE = "imageFieldRenderer.js";

    const log   = (...a)=>window.logger?.info?.(FILE,...a);
    const debug = (...a)=>window.logger?.debug?.(FILE,...a);
    const warn  = (...a)=>window.logger?.warn?.(FILE,...a);
    const error = (...a)=>window.logger?.error?.(FILE,...a);

    window.imageFieldRenderer = {

        render,
        renderDisplay,
        renderEdit,
        resolveImagePath

    };

    //==================================================
    // MAIN
    //==================================================

    async function render({

        container,
        value,
        field = {},
        mode = "display"

    } = {}){

        if(!container){
            return;
        }

        container.innerHTML = "";

        if(!value){

            container.innerHTML = `
                <div class="field-image-placeholder">
                    Sin imagen
                </div>`;

            return;

        }

        return mode === "edit"

            ? renderEdit({

                container,
                value,
                field

            })

            : renderDisplay({

                container,
                value,
                field

            });

    }

    //==================================================
    // DISPLAY
    //==================================================

    function renderDisplay({

        container,
        value,
        field = {}

    }){

        //--------------------------------------------------
        // SI ES ARRAY TOMAR EL PRIMER ELEMENTO
        //--------------------------------------------------

        const media =

            Array.isArray(value)

                ? value[0]

                : value;

        // debug(
        //     "MEDIA:",
        //     media
        // );

        const src =
            resolveImagePath(media);

        // debug(
        //     "SRC:",
        //     src
        // );

        if(!src){

            container.innerHTML = "";

            return;

        }

        const image =
            field.image || {};

        const img =
            document.createElement("img");

        img.className =
            "field-image";

        img.src =
            src;

        img.alt =
            field.label || "Imagen";

        img.style.width =
            image.width || "128px";

        img.style.height =
            image.height || "96px";

        img.style.maxWidth =
            "100%";

        img.style.objectFit =
            image.fit || "contain";

        img.style.borderRadius =
            "6px";

        img.style.display =
            "block";

        //--------------------------------------------------
        // NAVIGATION
        //--------------------------------------------------

        // debug(
        //     "NAVIGATION:",
        //     media?.navigation
        // );

        if(

            window.navigateRenderer?.isNavigation(
                media?.navigation
            )

        ){

            img.style.cursor =
                "pointer";

            img.onclick = async ()=>{

                event.preventDefault();
                event.stopPropagation();
            

                // debug(
                //     "CLICK IMAGE",
                //     media.navigation
                // );

                await window
                    .navigateRenderer
                    .navigate(
                        media.navigation
                    );

            };

        }

        container.appendChild(
            img
        );

    }

    //==================================================
    // EDIT
    //==================================================

    function renderEdit({

        container,
        value,
        field

    }){

        renderDisplay({

            container,
            value,
            field

        });

    }

    //==================================================
    // HELPERS
    //==================================================

    function resolveImagePath(value){

        if(!value){
            return "";
        }

        if(typeof value === "string"){
            return value;
        }

        if(Array.isArray(value) && value.length){
            return resolveImagePath(value[0]);
        }

        if(value.source){

            return `${value.source.path}/${value.source.file}`;

        }

        return (

            value.src ||

            value.url ||

            value.file ||

            value.path ||

            ""

        );

    }

})();