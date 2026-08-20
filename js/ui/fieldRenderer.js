// ======================================================
// 📁 js/ui/fieldRenderer.js
// ======================================================
// ✅ UNIVERSAL DECLARATIVE RUNTIME
// ✅ Dispatcher puro
// ✅ Registry interno
// ✅ Sin switch(type)
// ✅ Sin renderObject()
// ✅ Sin renderArray()
// ✅ Sin lógica heredada
// ======================================================

(function(){

const FILE = "fieldRenderer.js";

const log   = (...a) => window.logger?.info?.(FILE, ...a);
const debug = (...a) => window.logger?.debug?.(FILE, ...a);
const warn  = (...a) => window.logger?.warn?.(FILE, ...a);
const error = (...a) => window.logger?.error?.(FILE, ...a);

// ==================================================
// INTERNAL REGISTRY
// ==================================================

const fieldRegistry =
    Object.create(null);

// ==================================================
// EXPORTS
// ==================================================

window.fieldRenderer = {

    render,

    registerRenderer,
    unregisterRenderer,

    hasRenderer,
    getRenderer,

    getRendererRegistry,

    resolveRenderer

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

        const rendererName =
        resolveRenderer({
            field,
            value
        });
    
    // debug(
    //      "Renderer solicitado:",
    //      rendererName
    //  );
    
    //  debug(
    //      "Registry:",
    //      Object.keys(fieldRegistry)
    //  );
    
    const renderer =
        getRenderer(
            rendererName
        );

        if(!renderer){

            error(
                `Renderer no registrado: ${rendererName}`
            );

            return;
        }

        if(
            typeof renderer.render !==
            "function"
        ){

            error(
                `Renderer inválido: ${rendererName}`
            );

            return;
        }

        return await renderer.render({

            container,

            value,

            field,

            mode,

            context

        });

    }
    catch(e){

        error(
            "render:",
            e
            // rendererName
        );
    }
}

// ==================================================
// RESOLVE
// ==================================================

function resolveRenderer({

    field = {}

} = {}){

    //--------------------------------------------------
    // renderer explícito
    //--------------------------------------------------

    if(field.renderer){

        return String(field.renderer)
            .trim();

    }

    //--------------------------------------------------
    // renderer por tipo
    //--------------------------------------------------

    if(field.tipo){

        switch(String(field.tipo).trim().toLowerCase()){
    
            case "text":
                return "textFieldRenderer";
    
            case "image":
                return "imageFieldRenderer";
    
            case "icon":
                return "iconFieldRenderer";
    
            case "navigate":
                return "navigateFieldRenderer";
    
            default:
                return String(field.tipo).trim();
        }
    
    }

    //--------------------------------------------------
    // layout embebido
    //--------------------------------------------------

    if(field.component){

        return "__layout__";

    }

    //--------------------------------------------------
    // default
    //--------------------------------------------------

    return "textFieldRenderer";

}

// ==================================================
// REGISTER
// ==================================================

function registerRenderer(

    name,
    renderer

){

    try{

        if(
            !name ||
            !renderer
        ){

            return;
        }

        const key =
            String(name)

            .trim();

            // debug(
            //     `Registrado: ${key}`
            // );            

        fieldRegistry[
            key
        ] = renderer;

        // debug(
        //     `Renderer registrado: ${key}`
        // );

    }
    catch(e){

        error(
            "registerRenderer:",
            e
        );

    }

}

// ==================================================
// UNREGISTER
// ==================================================

function unregisterRenderer(
    name
){

    try{

        if(
            !name
        ){
            return;
        }

        const key =
            String(name)

            .trim();

        delete fieldRegistry[
            key
        ];

    }
    catch(e){

        error(
            "unregisterRenderer:",
            e
        );

    }

}

// ==================================================
// EXISTS
// ==================================================

function hasRenderer(
    name
){

    try{

        if(
            !name
        ){

            return false;

        }

        const key =
            String(name)

            .trim();

        return !!fieldRegistry[
            key
        ];

    }
    catch(e){

        error(
            "hasRenderer:",
            e
        );

        return false;

    }

}

// ==================================================
// GET
// ==================================================

function getRenderer(
    name
){

    try{

        if(
            !name
        ){

            return null;

        }

        const key =
            String(name)

            .trim();

        return (

            fieldRegistry[
                key
            ]

            ||

            null

        );

    }
    catch(e){

        error(
            "getRenderer:",
            e
        );

        return null;

    }

}

// ==================================================
// SNAPSHOT
// ==================================================

function getRendererRegistry(){

    try{

        return {

            ...fieldRegistry

        };

    }
    catch(e){

        error(
            "getRendererRegistry:",
            e
        );

        return {};

    }

}

// ==================================================
// DEFAULT LAYOUT BRIDGE
// ==================================================

registerRenderer("__layout__", {

    async render({

        container,
        value,
        field,
        context

    }){

        return await window.layoutRenderer?.renderLayout({

            container,

            section: field,

            context:{

                ...context,

                currentItem: value,

                item: value

            }

        });

    }

});

log(
    "fieldRenderer inicializado."
);


})();
