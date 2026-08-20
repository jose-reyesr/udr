// ======================================================
// 📁 js/ui/iconFieldRenderer.js
// ======================================================

(function(){

window.iconFieldRenderer = {

    render,
    renderDisplay,
    renderEdit,
    formatValue

};

async function render({

    container,
    value,
    mode = "display"

} = {}){

    if(!container){
        return;
    }

    container.innerHTML = "";

    return mode === "edit"

        ? renderEdit({
            container,
            value
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
        "field-icon";

    // emoji o texto simple

    if(
        typeof value ===
        "string"
    ){

        div.innerHTML =
            `<span>${value}</span>`;
    }

    // objeto

    else if(

        value &&
        typeof value ===
        "object"

    ){

        if(
            value.tipo ===
            "emoji"
        ){

            div.innerHTML =
                `<span>${value.valor || ""}</span>`;
        }
        else if(
            value.src ||
            value.url
        ){

            const img =
                document.createElement(
                    "img"
                );

            img.className =
                "field-icon-image";

            img.src =
                value.src ||
                value.url;

            div.appendChild(
                img
            );
        }
        else{

            div.innerText =
                formatValue(
                    value
                );
        }
    }

    container.appendChild(
        div
    );
}

function renderEdit({

    container,
    value

}){

    renderDisplay({
        container,
        value
    });
}

function formatValue(
    value
){

    if(!value){
        return "";
    }

    return (

        value.label ||

        value.nombre ||

        value.valor ||

        value.text ||

        "[Icon]"

    );
}

window.fieldRenderer
    ?.registerRenderer?.(

        "icon",

        window
            .iconFieldRenderer

    );


})();
