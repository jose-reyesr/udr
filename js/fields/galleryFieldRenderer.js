// ======================================================
// 📁 js/ui/galleryFieldRenderer.js
// ======================================================

(function(){

window.galleryFieldRenderer = {

    render,
    renderDisplay,
    renderEdit

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
        "field-gallery";

    value.forEach(item => {

        const cell =
            document.createElement(
                "div"
            );

        cell.className =
            "field-gallery-item";

        window.imageFieldRenderer
            ?.render({

                container: cell,
                value: item

            });

        wrapper.appendChild(
            cell
        );

    });

    container.appendChild(
        wrapper
    );
}

function renderEdit(p){

    renderDisplay(p);
}

})();
