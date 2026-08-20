// ======================================================
// 📁 js/ui/htmlFieldRenderer.js
// ======================================================

(function(){

window.htmlFieldRenderer = {

    render,
    renderDisplay,
    renderEdit,
    formatValue

};

async function render({

    container,
    value,
    field = {},
    mode = "display",
    context = {}

} = {}){

    if(!container){
        return;
    }

    container.innerHTML = "";

    return mode === "edit"

        ? renderEdit({
            container,
            value,
            field,
            context
        })

        : renderDisplay({
            container,
            value
        });
}

function renderDisplay({

    container,
    value

}){

    const div =
        document.createElement(
            "div"
        );

    div.className =
        "field-html";

    div.innerHTML =
        formatValue(
            value
        );

    container.appendChild(
        div
    );
}

function renderEdit({

    container,
    value,
    field = {},
    context = {}

}){

    const textarea =
        document.createElement(
            "textarea"
        );

    textarea.className =
        "field-html-edit";

    textarea.value =
        value || "";

    if(field.placeholder){

        textarea.placeholder =
            field.placeholder;
    }

    textarea.addEventListener(

        "input",

        ()=>
            context?.onChange?.(
                textarea.value
            )

    );

    container.appendChild(
        textarea
    );
}

function formatValue(
    value
){

    return value || "";
}


})();
