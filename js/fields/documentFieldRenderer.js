// ======================================================
// 📁 js/fields/documentFieldRenderer.js
// ======================================================

(function(){

    window.documentFieldRenderer = {
    
        render,
        renderDisplay,
        renderEdit,
        resolvePath
    
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
    
        const src =
            resolvePath(value);
    
        if(!src){
            return;
        }
    
        const link =
            document.createElement(
                "a"
            );
    
        link.className =
            "field-document";
    
        link.href =
            src;
    
        link.innerText =
            "Abrir documento";
    
        //--------------------------------------------------
        // NAVIGATION
        //--------------------------------------------------
    
        if(
    
            window
                .navigateRenderer
                ?.isNavigation(
    
                    value.navigation
    
                )
    
        ){
    
            link.href =
                "javascript:void(0)";
    
            link.style.cursor =
                "pointer";
    
            link.onclick =
                async (event)=>{
    
                    event.preventDefault();
    
                    await window
                        .navigateRenderer
                        .navigate(
    
                            value.navigation
    
                        );
    
                };
    
        }
        else{
    
            link.target =
                "_blank";
    
        }
    
        container.appendChild(
            link
        );
    
    }
    
    function renderEdit(p){
    
        renderDisplay(p);
    
    }
    
    function resolvePath(value){
    
        if(!value){
            return "";
        }
    
        if(typeof value === "string"){
            return value;
        }
    
        if(Array.isArray(value) && value.length){
            return resolvePath(value[0]);
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
    
    window.fieldRenderer
        ?.registerRenderer(
            "document",
            window.documentFieldRenderer
        );
    
    })();