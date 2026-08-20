// ======================================================
// 📁 js/ui/arrayFieldRenderer.js
// ======================================================
// ✅ UNIVERSAL DECLARATIVE RUNTIME
// ✅ Recursividad para arrays
// ✅ Cada elemento vuelve al dispatcher
// ======================================================

(function(){

window.arrayFieldRenderer = {

    render,

    resolveItemField,
    resolveContext

};

async function render({

    container,
    value,
    field = {},
    context = {},
    mode = "display"

} = {}){

    if(!container){
        return;
    }

    container.innerHTML = "";

    if(
        !Array.isArray(value)
    ){
        return;
    }

    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "field-array";

    container.appendChild(
        wrapper
    );

    for(
        const item
        of value
    ){

        const row =
            document.createElement(
                "div"
            );

        row.className =
            "field-array-item";

        wrapper.appendChild(
            row
        );

        await window
            .fieldRenderer
            ?.render({

                container:
                    row,

                value:
                    item,

                field:
                    resolveItemField({

                        field,
                        item

                    }),

                mode,

                context:

                    resolveContext({

                        item,
                        field,
                        context,
                        mode

                    })

            });

    }

}

function resolveItemField({

    field = {},
    item

}){

    if(
        field.itemField
    ){
        return field.itemField;
    }

    if(
        Array.isArray(item)
    ){

        return {
            tipo:
                "array"
        };

    }

    if(

        item &&
        typeof item ===
        "object"

    ){

        return {

            tipo:
                "object",

            schema:
                field.schema,

            fields:
                field.fields,

            component:
                field.component

        };

    }

    if(
        typeof item ===
        "number"
    ){

        return {
            tipo:
                "number"
        };

    }

    if(
        typeof item ===
        "boolean"
    ){

        return {
            tipo:
                "boolean"
        };

    }

    return {
        tipo:
            "text"
    };

}

function resolveContext({

    item,
    field,
    context,
    mode

}){

    return {

        ...context,

        currentItem:
            item,

        field,

        mode

    };

}

})();
