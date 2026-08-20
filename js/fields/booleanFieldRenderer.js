	// ======================================================
// 📁 js/ui/booleanFieldRenderer.js
// ======================================================

(function(){

const FILE="booleanFieldRenderer.js";

window.booleanFieldRenderer={

    render,
    renderDisplay,
    renderEdit,
    formatValue

};

async function render({

    container,
    value,
    field={},
    mode="display",
    context={}

}={}){

    if(!container)return;

    container.innerHTML="";

    return mode==="edit"

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

    const div=
        document.createElement(
            "div"
        );

    div.className=
        "field-boolean";

    div.innerText=
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
    context={}

}){

    const input=
        document.createElement(
            "input"
        );

    input.type=
        "checkbox";

    input.checked=
        !!value;

    input.addEventListener(

        "change",

        ()=>context
            ?.onChange?.(
                input.checked
            )

    );

    container.appendChild(
        input
    );
}

function formatValue(
    value
){

    return value
        ? "Sí"
        : "No";
}


})();
