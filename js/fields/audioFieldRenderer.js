// ======================================================
// 📁 js/fields/audioFieldRenderer.js
// ======================================================

(function(){

    window.audioFieldRenderer = {
    
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
    
        const audio =
            document.createElement(
                "audio"
            );
    
        audio.className =
            "field-audio";
    
        audio.controls =
            true;
    
        audio.src =
            src;
    
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
    
            audio.style.cursor =
                "pointer";
    
            audio.onclick = async ()=>{
    
                await window
                    .navigateRenderer
                    .navigate(
    
                        value.navigation
    
                    );
    
            };
    
        }
    
        container.appendChild(
            audio
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
    
    })();