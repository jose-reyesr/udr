// ======================================================
// 📁 js/ui/dateFieldRenderer.js
// ======================================================

(function(){

window.dateFieldRenderer={

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

        : renderDisplay(
            container,
            value
        );
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
        "field-date";

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
        "date";

    input.value=
        value || "";

    input.addEventListener(

        "input",

        ()=>context
            ?.onChange?.(
                input.value
            )

    );

    container.appendChild(
        input
    );
}

function formatValue(
    value
){

    return value || "";
}

})();
