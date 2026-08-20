(function(){

    const FILE = "layoutRenderer.js";

    const log   = (...a)=>window.logger?.info?.(FILE,...a);
    const debug = (...a)=>window.logger?.debug?.(FILE,...a);
    const warn  = (...a)=>window.logger?.warn?.(FILE,...a);
    const error = (...a)=>window.logger?.error?.(FILE,...a);

    const layoutRegistry =
    Object.create(null);    

// ==================================================
// EXECUTE
// ==================================================

async function execute({

    context = {}

} = {}){

    try{

        await render({

            context

        });

        return context.layout;

    }
    catch(e){

        error(
            "execute:",
            e
        );

        throw e;

    }

}

// ==================================================
// RENDER
// ==================================================

async function render({

    container,
    context = {},
    section = null

} = {}){

    try{

        container ??=

            document.getElementById(
                "content-view"
            );

        if(!container){

            error(
                "Container no encontrado."
            );

            return;

        }

        const runtimeSection =

            section ||

            context.layout;

        if(!runtimeSection){

            warn(
                "Layout no encontrado."
            );

            return;

        }

        return await renderLayout({

            container,

            section:
                runtimeSection,

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
// RENDER LAYOUT
// ==================================================

async function renderLayout({

    container,
    section,
    context = {}

} = {}){

    try{

        if(!container){

            return;

        }

        if(!section){

            return;

        }

        const component =

            resolveComponent(
                section
            );

        const renderer =

            getLayout(
                component
            );

        if(!renderer){

            error(

                `Layout no registrado: ${component}`

            );

            return;

        }

        if(

            typeof renderer.render ===
            "function"
        
        ){
        
            //--------------------------------------------------
            // PREPARAR PARÁMETROS PARA editLayout
            //--------------------------------------------------
        
            if(component === "edit"){
        
                const dataset =
                window.pathResolver.getByPath(
            
                    context.originalRoot,
            
                    section.dataSource
            
                );

                    const schemaRaw =
                    context?.root?.meta?.schemas?.[section.schema];
                
                debug(
                    "EDIT schema RAW:",
                    schemaRaw
                );
                
                debug(
                    "EDIT schema RAW Array?:",
                    Array.isArray(schemaRaw)
                );
                
                const schema =
                await window.schemaResolver.getSchema({
            
                    context,
            
                    name:
                        section.schema
            
                });
                
                debug(
                    "EDIT schema RESUELTO:",
                    schema
                );

                console.log(
                    "EDIT SCHEMA JSON",
                    JSON.stringify(
                        schema,
                        null,
                        2
                    )
                );

                return await renderer.render({
        
                    container,
        
                    section,
        
                    context,
        
                    dataset,
        
                    schema
        
                });
        
            }
        
            //--------------------------------------------------
            // RESTO DE LOS LAYOUTS
            //--------------------------------------------------
        
            return await renderer.render({
        
                container,
        
                section,
        
                context
        
            });
        
        }

        if(

            typeof renderer ===
            "function"

        ){

            return await renderer({

                container,

                section,

                context

            });

        }

        error(

            `Renderer inválido: ${component}`

        );

    }
    catch(e){

        error(
            "renderLayout:",
            e
        );

    }

}

// ==================================================
// RESOLVE COMPONENT
// ==================================================

function resolveComponent(

    section = {}

){

    try{

        return String(

            section.component ||

            "object"

        )

        .trim()

        .toLowerCase();

    }
    catch(e){

        error(

            "resolveComponent:",

            e

        );

        return "object";

    }

}

// ==================================================
// HAS LAYOUT
// ==================================================

function hasLayout(

    name

){

    try{

        if(!name){

            return false;

        }

        return !!getLayout(

            name

        );

    }
    catch(e){

        error(

            "hasLayout:",

            e

        );

        return false;

    }

}

// ==================================================
// GET LAYOUT
// ==================================================

function getLayout(

    name

){

    try{

        if(!name){

            return null;

        }

        return layoutRegistry[

            String(name)

                .trim()

                .toLowerCase()

        ] ||

        null;

    }
    catch(e){

        error(

            "getLayout:",

            e

        );

        return null;

    }

}

function registerLayout(

    name,

    layout

){

    if(!name || !layout){

        return;

    }

    layoutRegistry[
        String(name)
            .trim()
            .toLowerCase()
    ] = layout;

}

function unregisterLayout(

    name

){

    delete layoutRegistry[
        String(name)
            .trim()
            .toLowerCase()
    ];

}

// ==================================================
// EXPORT
// ==================================================

window.layoutRenderer = {

    execute,

    render,

    renderLayout,

    registerLayout,

    unregisterLayout,

    hasLayout,

    getLayout

};

// ==================================================
// INIT
// ==================================================

log(
    "layoutRenderer registrado correctamente."
);

})();