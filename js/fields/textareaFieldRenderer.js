// ======================================================
// 📁 js/ui/textareaFieldRenderer.js
// ======================================================
// ✅ UNIVERSAL DECLARATIVE RUNTIME
// ✅ Compatible con fieldRenderer
// ✅ display
// ✅ edit
// ✅ null safe
// ✅ Registro automático
// ======================================================

(function(){

    const FILE = "textareaFieldRenderer.js";

    const log   = (...a)=>window.logger?.info?.(FILE,...a);
    const debug = (...a)=>window.logger?.debug?.(FILE,...a);
    const warn  = (...a)=>window.logger?.warn?.(FILE,...a);
    const error = (...a)=>window.logger?.error?.(FILE,...a);

    // ==================================================
    // API
    // ==================================================

    const api = {

        render,
        renderDisplay,
        renderEdit,
        formatValue

    };

    // ==================================================
    // MAIN
    // ==================================================

    async function render({

        container,
        value,
        field = {},
        mode = "display",
        context = {}

    } = {}){

        try{

            if(!container){
                return;
            }

            container.innerHTML = "";

            if(mode === "edit"){

                return renderEdit({

                    container,
                    value,
                    field,
                    context

                });

            }

            return renderDisplay({

                container,
                value

            });

        }
        catch(e){

            error(
                "render:",
                e
            );

        }

    }

    // ==================================================
    // DISPLAY
    // ==================================================

    function renderDisplay({

        container,
        value

    } = {}){

        try{

            if(!container){
                return;
            }

            const pre =
                document.createElement(
                    "pre"
                );

            pre.className =
                "field-textarea";

            pre.innerText =
                formatValue(
                    value
                );

            container.appendChild(
                pre
            );

        }
        catch(e){

            error(
                "renderDisplay:",
                e
            );

        }

    }

    // ==================================================
    // EDIT
    // ==================================================

    function renderEdit({

        container,
        value,
        field = {},
        context = {}

    } = {}){

        try{

            if(!container){
                return;
            }

            const textarea =
                document.createElement(
                    "textarea"
                );

            textarea.className =
                "field-textarea-edit";

            textarea.value =
                value ?? "";

            if(field.placeholder){

                textarea.placeholder =
                    field.placeholder;

            }

            if(field.rows){

                textarea.rows =
                    field.rows;

            }

            textarea.addEventListener(

                "input",

                ()=>{

                    context
                    ?.onChange
                    ?.(

                        textarea.value

                    );

                }

            );

            container.appendChild(
                textarea
            );

        }
        catch(e){

            error(
                "renderEdit:",
                e
            );

        }

    }

    // ==================================================
    // FORMAT
    // ==================================================

    function formatValue(
        value
    ){

        if(
            value === null ||
            value === undefined
        ){
            return "";
        }

        if(
            typeof value ===
            "object"
        ){

            try{

                return JSON.stringify(
                    value,
                    null,
                    2
                );

            }
            catch(e){

                return String(
                    value
                );

            }

        }

        return String(
            value
        );

    }

    // ==================================================
    // REGISTRO GLOBAL
    // ==================================================
    window.textareaFieldRenderer = api;

    debug("Renderer registrado:", "textareaFieldRenderer");

})();