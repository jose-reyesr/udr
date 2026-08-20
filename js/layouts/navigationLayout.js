// ======================================================
// 📁 js/layouts/navigationLayout.js
// ======================================================
// UNIVERSAL DECLARATIVE RUNTIME
//
// RESPONSABILIDAD
// - Renderizar barras de navegación.
//
// NO HACE
// - Resolver datasets
// - Resolver relaciones
// - Resolver schemas
// - Construir URLs
//
// La navegación se delega a:
//
// window.navigateRenderer.navigate()
//
// ======================================================

(function(){

    const FILE = "navigationLayout.js";

    const log   = (...a)=>window.logger?.info?.(FILE,...a);
    const debug = (...a)=>window.logger?.debug?.(FILE,...a);
    const warn  = (...a)=>window.logger?.warn?.(FILE,...a);
    const error = (...a)=>window.logger?.error?.(FILE,...a);

    //==================================================
    // EXPORTS
    //==================================================

    window.navigation = {

        render

    };

    //==================================================
    // MAIN
    //==================================================

    async function render({

        container,
        section = {},
        context = {}

    } = {}){

        try{

            if(!container){
                return;
            }

            container.innerHTML = "";

            //--------------------------------------------------
            // DATASET
            //--------------------------------------------------

            const dataset =

                context.datasets?.[

                    section.dataset ||

                    section.dataSource

                ] ||

                null;

            if(!dataset){

                warn(
                    "Dataset inexistente:",
                    section.dataset ||
                    section.dataSource
                );

                return;

            }

            //--------------------------------------------------
            // ITEMS
            //--------------------------------------------------

            const items =

                dataset.value?.items ||

                dataset.value ||

                [];

            if(!Array.isArray(items)){

                warn(
                    "Navigation inválida."
                );

                return;

            }

            //--------------------------------------------------
            // RENDER
            //--------------------------------------------------

            for(const item of items){

                renderItem({

                    container,

                    item,

                    context

                });

            }

        }
        catch(e){

            error(
                "render:",
                e
            );

        }

    }

    //==================================================
    // ITEM
    //==================================================

    function renderItem({

        container,
        item = {}

    } = {}){

        try{

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "navigation-button";

            button.innerText =

                item.label ||

                item.title ||

                item.text ||

                "Sin título";

            //--------------------------------------------------
            // ICONO
            //--------------------------------------------------

            if(item.icon){

                button.dataset.icon =
                    item.icon;

            }

            //--------------------------------------------------
            // CLICK
            //--------------------------------------------------

            if(

                window
                    .navigateRenderer
                    ?.isNavigation(

                        item.navigation

                    )

            ){

                button.onclick = async ()=>{

                    await window
                        .navigateRenderer
                        .navigate(

                            item.navigation

                        );

                };

            }
            else{

                button.disabled = true;

            }

            container.appendChild(
                button
            );

        }
        catch(e){

            error(
                "renderItem:",
                e
            );

        }

    }

    //==================================================

    log(
        "navigationLayout inicializado."
    );

})();