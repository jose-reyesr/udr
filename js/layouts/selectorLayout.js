(function(){

    const FILE = "selectorLayout.js";
    
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

    initializeSelection({
        context
    });

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

// log("FIELDS: ", fields);


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

    // -----------------------------------------
    // COLUMNA SELECCIÓN
    // -----------------------------------------

    const thSelect =
        document.createElement(
            "th"
        );

    thSelect.className =
        "list-header";

    thSelect.innerText =
        "✓";

    tr.appendChild(
        thSelect
    );

    // -----------------------------------------
    // CAMPOS
    // -----------------------------------------

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
                expandFields(
                    item.fields || []
                )
            );

        // -----------------------------------------
        // CHECKBOX DEL RENGLÓN
        // -----------------------------------------

        const tdSelect =
            document.createElement(
                "td"
            );

            const checkbox =
            document.createElement(
                "input"
            );
        
        checkbox.type =
            "checkbox";
        
            checkbox.addEventListener(

                "click",
            
                (event) => {
            
                    event.stopPropagation();
            
                }
            
            );

            checkbox.addEventListener(
                "change",
                () => {
            
                    const selection =
                        initializeSelection({
                            context
                        });
            
                    if(checkbox.checked){
            
                        selection.selected.push(
                            item
                        );
            
                    }
                    else{
            
                        const index =
                            selection.selected.indexOf(
                                item
                            );
            
                        if(index !== -1){
            
                            selection.selected.splice(
                                index,
                                1
                            );
            
                        }
            
                    }
            
                    debug(
                        "SELECCIÓN ACTUAL:",
                        selection.selected
                    );
            
                }
            );

        tdSelect.appendChild(
            checkbox
        );

        row.appendChild(
            tdSelect
        );

        // -----------------------------------------
        // CAMPOS DEL RENGLÓN
        // -----------------------------------------

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

            await window
                .fieldRenderer
                ?.render({

                    container: td,

                    value:
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

    renderSelectorActions({

        container,

        context

    });

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

            await window
                .fieldRenderer
                ?.render({

                    container:
                        valueDiv,

                    value:
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

function initializeSelection({
    context = {}
} = {}){

    if(!context.__selector){

        context.__selector = {

            selected: []

        };

    }

    return context.__selector;

}

function renderSelectorActions({

    container,
    context

}){

    const actions =
        document.createElement(
            "div"
        );

    actions.className =
        "selector-actions";

    const btnCancel =
        document.createElement(
            "button"
        );

    btnCancel.innerText =
        "Cancelar";

    btnCancel.onclick =
        () => cancelSelection({
            context
        });

    const btnSave =
        document.createElement(
            "button"
        );

    btnSave.innerText =
        "Guardar";

    btnSave.onclick =
        () => saveSelection({
            context
        });

    actions.appendChild(
        btnCancel
    );

    actions.appendChild(
        btnSave
    );

    container.appendChild(
        actions
    );

}

// =====================================================
// SAVE SELECTION
// =====================================================

async function saveSelection({

    context

}){

    console.log(
        "Guardar selección",
        context
    );

}

// =====================================================
// CANCEL SELECTION
// =====================================================

function cancelSelection({
    context
}){

    const selection =
        initializeSelection({
            context
        });

    selection.selected = [];

    debug(
        "Selección cancelada."
    );

}


    // ==================================================
    // REGISTRO GLOBAL
    // ==================================================
    window.selector = api;

    log("✅ selectorLayout registrado correctamente");

})();   // ← Cierre del IIFE
