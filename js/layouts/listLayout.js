(function(){

    const FILE = "listLayout.js";
    
    const log   = (...a) => window.logger?.info?.(FILE, ...a);
    const debug = (...a) => window.logger?.debug?.(FILE, ...a);
    const warn  = (...a) => window.logger?.warn?.(FILE, ...a);
    const error = (...a) => window.logger?.error?.(FILE, ...a);

  // ==================================================
  // EXPORT
  // ==================================================

  const api = {
    render
};    

// =====================================================
// MAIN
// =====================================================

async function render({

    container,
    section = {},
    context = {}

}){


    // debug(
    //     "SECTION:",
    //     section
    // );

    //         console.log(
    //             "CONTEXT KEYS:",
    //             Object.keys(context)
    //         );
            
    //         console.log(
    //             "SCHEMAS:",
    //             context.schemas
    //         );
            
    //         console.log(
    //             "LAYOUT:",
    //             context.layout
    //         );
            
    //         console.log(
    //             "DATASETS:",
    //             context.datasets
    //         );       

    //         console.log(
    //             "META:",
    //             context.datasets?.meta
    //         );
            
    //         console.log(
    //             "LAYOUT DATASET:",
    //             context.datasets?.layout
    //         );        
            
    //         console.log(
    //             "META VALUE:",
    //             context.datasets?.meta?.value
    //         );
            
    //         console.log(
    //             "META SCHEMA:",
    //             context.datasets?.meta?.schema
    //         );            
    
    //         console.log(
    //             "DEFINITION:",
    //             context.definition
    //         );
            
    //         console.log(
    //             "DEFINITIONS:",
    //             context.definitions
    //         );

    //         console.log(
    //             "DATA DEFINITION:",
    //             context.datasets?.data?.definition
    //         );
            
    //         console.log(
    //             "META DEFINITION:",
    //             context.datasets?.meta?.definition
    //         );      
            
    //         console.log(
    //             "2) META VALUE:",
    //             JSON.stringify(
    //                 context.datasets?.meta?.value,
    //                 null,
    //                 2
    //             )
    //         );            

    //         console.log(
    //             "DATA SCHEMA:",
    //             context.datasets?.data?.schema
    //         );            

    //         console.log(
    //             "DATA SCHEMA:",
    //             JSON.stringify(
    //                 context.datasets?.data?.schema,
    //                 null,
    //                 2
    //             )
    //         );  

    const layoutConfig =
        section || {};

    try{

        if(!container){
            return;
        }

        container.innerHTML = "";

        //------------------------------------------------
        // ITEMS
        //------------------------------------------------

        const items =

            layoutConfig.items || [];

            // console.log(
            //     "ITEM",
            //     items?.[0]
            // );          

        if(!items.length){

            warn(
                "Sin elementos para renderizar."
            );

            return;

        }

        //------------------------------------------------
        // FIELDS
        //------------------------------------------------

        const fields =
        expandFields(
            items?.[0]?.fields || []
        );

//  log("FIELDS: ", fields);


        if(!fields.length){

            warn(
                "Sin campos definidos."
            );

            return;

        }

        //------------------------------------------------
        // VIEW
        //------------------------------------------------

        const view =
            String(

                layoutConfig.view ||

                layoutConfig.tipo ||

                "table"

            )
            .toLowerCase();

        switch(view){

            case "grid":
            case "cards":

                return renderGrid({

                    container,
                    items,
                    fields,
                    layoutConfig,
                    context

                });

            case "table":
            default:

                return renderTable({

                    container,
                    items,
                    fields,
                    layoutConfig,
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


// =====================================================
// VISIBLE FIELDS
// =====================================================

function buildVisibleFields(
    fields = []
){

    return fields.filter(field => {

        return (
            field.hidden !== true &&
            field.visible !== false &&
            field.visible !== "false"
        );

    });

}


// =====================================================
// NAVIGATION
// =====================================================

function applyNavigation({

    element,
    item

}){

    if(

        !element ||

        !window
            .navigateRenderer
            ?.isNavigation(

                item?.navigation

            )

    ){
        return;
    }

    element.style.cursor =
        "pointer";

    element.onclick =
        async ()=>{

            await window
                .navigateRenderer
                .navigate(

                    item.navigation

                );

        };

}

// =====================================================
// TABLE
// =====================================================

async function renderTable({

    container,
    items,
    fields,
    layoutConfig,
    context

}){

    const table =
        document.createElement(
            "table"
        );

    table.className =
        "list-table";

    const visibleFields =
        buildVisibleFields(
            fields
        );

    //------------------------------------------------
    // HEADER
    //------------------------------------------------

    const thead =
        document.createElement(
            "thead"
        );

    const tr =
        document.createElement(
            "tr"
        );

        // console.log(
        //     "FIELDS TO RENDER",
        //     JSON.stringify(
        //         visibleFields,
        //         null,
        //         2
        //     )
        // );
        

    for(const field of visibleFields){     

        const th =
            document.createElement(
                "th"
            );

        th.className =
            "list-header";

        if(field.columnWidth){

            th.style.width =
                field.columnWidth;

            th.style.minWidth =
                field.columnWidth;

            th.style.maxWidth =
                field.columnWidth;

        }

        th.innerText =

            field.label ||

            field.campo ||

            "";

        tr.appendChild(
            th
        );

    }

    thead.appendChild(
        tr
    );

    table.appendChild(
        thead
    );

    //------------------------------------------------
    // BODY
    //------------------------------------------------

    const tbody =
        document.createElement(
            "tbody"
        );

    for(const item of items){

        const row =
            document.createElement(
                "tr"
            );

        row.className =
            "list-row";          

            const fieldsToRender =
            buildVisibleFields(
                expandFields(item.fields || [])
            );
        
            // console.log(
            //     "ITEM.VALUE:",
            //     item.value
            // );

            // console.log(
            //     "ITEM:",
            //     item
            // );
                        
        for(const field of fieldsToRender){
        
            const td =
                document.createElement(
                    "td"
                );
        
            td.className =
                "list-cell";
        
            if(field.columnWidth){
        
                td.style.width =
                    field.columnWidth;
        
            }

            // console.log(
            //     "CAMPO:",
            //     field.campo
            // );
            
            // console.log(
            //     "VALOR REGISTRO:",
            //     item?.value?.[field.campo]
            // );
            
            // console.log(
            //     "RESOLVED:",
            //     item?.value?.__resolved?.[field.campo]
            // );            
        
            await window
                .fieldRenderer
                ?.render({
        
                    container: td,
        
                    value:
                        field.resolvedValue ??
                        field.value,
        
                    field,
        
                    mode:
        
                        layoutConfig.mode ||
        
                        "display",
        
                    context:{
        
                        ...context,
        
                        item,
        
                        currentItem:
                            item,
        
                        currentField:
                            field
        
                    }
        
                });
        
            row.appendChild(
                td
            );
        
        }

        applyNavigation({

            element: row,

            item

        });

        tbody.appendChild(
            row
        );

    }

    table.appendChild(
        tbody
    );

    container.appendChild(
        table
    );

}

// =====================================================
// GRID
// =====================================================

async function renderGrid({

    container,
    items,
    fields,
    layoutConfig,
    context

}){

    const grid =
        document.createElement(
            "div"
        );

    grid.className =
        "list-grid";

    for(const item of items){

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "list-card";

        for(const field of (item.fields || [])){

            if(field.hidden){

                continue;

            }

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "list-card-row";

            //--------------------------------------------
            // LABEL
            //--------------------------------------------

            if(
                field.showLabel !== false
            ){

                const label =
                    document.createElement(
                        "div"
                    );

                label.className =
                    "list-card-label";

                label.innerText =

                    field.label ||

                    field.campo;

                row.appendChild(
                    label
                );

            }

            //--------------------------------------------
            // VALUE
            //--------------------------------------------

            const valueDiv =
                document.createElement(
                    "div"
                );

            valueDiv.className =
                "list-card-value";

                // console.log(
                //     "CAMPO:",
                //     field.campo
                // );
                
                // console.log(
                //     "VALOR REGISTRO:",
                //     item?.value?.[field.campo]
                // );
                
                // console.log(
                //     "RESOLVED:",
                //     item?.value?.__resolved?.[field.campo]
                // );                

            await window
                .fieldRenderer
                ?.render({

                    container:
                        valueDiv,

                    value:
                        field.resolvedValue ??
                        field.value,

                    field,

                    mode:

                        layoutConfig.mode ||

                        "display",

                    context:{

                        ...context,

                        item,

                        currentItem:
                            item,

                        currentField:
                            field

                    }

                });

            row.appendChild(
                valueDiv
            );

            card.appendChild(
                row
            );

        }

        applyNavigation({

            element:
                card,

            item

        });

        grid.appendChild(
            card
        );

    }

    container.appendChild(
        grid
    );

}

function expandFields(
    fields = [],
    parentLabel = null
){

    const result = [];

    for(const field of fields){

        const current = {
            ...field
        };

        if(
            parentLabel &&
            !current.label
        ){
            current.label =
                `${parentLabel} - ${current.campo}`;
        }

        result.push(current);

        if(
            Array.isArray(current.fields) &&
            current.fields.length
        ){

            result.push(
                ...expandFields(
                    current.fields,
                    current.label
                )
            );

        }

    }

    return result;

}

// =====================================================
// EXPAND RESOLVED
// =====================================================

function expandResolved(resolved){

    const result = [];

    if(!resolved){
        return result;
    }

    for(const value of Object.values(resolved)){

        if(!value){
            continue;
        }

        if(Array.isArray(value.items)){

            for(const item of value.items){

                result.push(...(item.fields || []));

            }

        }
        else if(Array.isArray(value.fields)){

            result.push(...value.fields);

        }

    }

    return result;

}

    // ==================================================
    // REGISTRO GLOBAL
    // ==================================================
    window.list = api;                    // ← Importante

    log("✅ listLayout registrado correctamente");

})();   // ← Cierre del IIFE
