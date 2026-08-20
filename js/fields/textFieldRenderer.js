// ======================================================
// 📁 js/ui/textFieldRenderer.js
// ======================================================
// ✅ UNIVERSAL DECLARATIVE RUNTIME
// ✅ Renderer puro
// ✅ Sin lógica de negocio
// ✅ Compatible con fieldRenderer registry
// ✅ display / edit
// ======================================================

(function(){

const FILE = "textFieldRenderer.js";

const log   = (...a) => window.logger?.info?.(FILE, ...a);
const debug = (...a) => window.logger?.debug?.(FILE, ...a);
const warn  = (...a) => window.logger?.warn?.(FILE, ...a);
const error = (...a) => window.logger?.error?.(FILE, ...a);


  // ==================================================
  // EXPORT
  // ==================================================

  const api = {
    render
};

// ==================================================
// EXPORTS
// ==================================================

window.textFieldRenderer = {

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

        if(
            mode === "edit"
        ){

            return renderEdit({

                container,
                value,
                field,
                context

            });

        }

        return renderDisplay({

            container,
            value,
            field,
            context

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
    value,
    field = {}

} = {}){

    const span =
        document.createElement(
            "span"
        );

    span.className =
        "field-text";

    if(
        field.className
    ){

        span.classList.add(
            field.className
        );

    }

    if(
        field.style &&
        typeof field.style ===
        "object"
    ){

        Object.assign(
            span.style,
            field.style
        );

    }

    span.innerText =
        formatValue(
            value
        );

    container.appendChild(
        span
    );

}

// ==================================================
// EDIT
// ==================================================

// function renderEdit({

//     container,
//     value,
//     field = {},
//     context = {}

// } = {}){

//     const input =
//         document.createElement(
//             "input"
//         );

//     input.type =
//         "text";

//     input.className =
//         "field-text-edit";

//     input.value =
//         formatValue(
//             value
//         );

//     if(
//         field.placeholder
//     ){

//         input.placeholder =
//             field.placeholder;

//     }

//     if(
//         field.readonly
//     ){

//         input.readOnly =
//             true;

//     }

//     if(
//         field.disabled
//     ){

//         input.disabled =
//             true;

//     }

//     input.addEventListener(

//         "input",

//         function(){

//             if(

//                 typeof context
//                     ?.onChange ===
//                 "function"

//             ){

//                 context.onChange(
//                     input.value
//                 );

//             }

//         }

//     );

//     container.appendChild(
//         input
//     );

// }

function renderEdit({

    container,
    value,
    field = {},
    context = {}

} = {}){

    const input =
        document.createElement(
            "input"
        );

    input.type =
        "text";

    input.className =
        "field-text-edit";

    input.value =
        formatValue(
            value
        );

    if(
        field.placeholder
    ){

        input.placeholder =
            field.placeholder;

    }

    if(
        field.readonly
    ){

        input.readOnly =
            true;

    }

    if(
        field.disabled
    ){

        input.disabled =
            true;

    }

    input.addEventListener(

        "input",

        function(){

            //--------------------------------------------------
            // ACTUALIZAR REGISTRO
            //--------------------------------------------------

            const record =
                context?.record ||
                context?.currentRecord;

            const campo =
                field?.campo;

            if(
                record &&
                campo
            ){

                record[campo] =
                    input.value;

            }

            //--------------------------------------------------
            // CALLBACK OPCIONAL
            //--------------------------------------------------

            if(

                typeof context
                    ?.onChange ===
                "function"

            ){

                context.onChange(
                    input.value
                );

            }

        }

    );

    container.appendChild(
        input
    );

}

// ==================================================
// FORMAT
// ==================================================

function formatValue(
    value
){

    try{

        if(

            value === null ||

            value === undefined

        ){

            return "";

        }

        if(

            typeof value ===
            "string" ||

            typeof value ===
            "number" ||

            typeof value ===
            "boolean"

        ){

            return String(
                value
            );

        }

        if(
            Array.isArray(
                value
            )
        ){

            return value

                .map(v =>
                    formatValue(v)
                )

                .join(
                    ", "
                );

        }

        if(
            typeof value ===
            "object"
        ){

            return (

                value.label ||

                value.nombre ||

                value.titulo ||

                value.descripcion ||

                value.valor ||

                value.text ||

                "[Object]"

            );

        }

        return String(
            value
        );

    }
    catch(e){

        error(
            "formatValue:",
            e
        );

        return "";

    }

}

    // ==================================================
    // REGISTRO GLOBAL
    // ==================================================
    window.textFieldRenderer = api;                    // ← Importante

    log("✅ textFieldRenderer registrado correctamente");

})();   // ← Cierre del IIFE
