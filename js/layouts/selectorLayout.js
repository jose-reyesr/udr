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

        showTerminalCommand({
            
            container
            
            });

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

        //------------------------------------------------
        // CHECKBOX
        //------------------------------------------------

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

        const selection =
            initializeSelection({
                context
            });

            // console.log(
            //     "ITEM",
            //     item
            // );
            
            const id =
                String(
                    item?.value?.id ?? ""
                );
            
            // console.log(
            //     "ID",
            //     id
            // );
            
            // console.log(
            //     "SELECTED",
            //     selection.selected
            // );

        checkbox.checked =
            selection.selected
                .map(String)
                .includes(id);

        checkbox.addEventListener(
            "click",
            event => {

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

                    if(
                        !selection.selected
                            .map(String)
                            .includes(id)
                    ){

                        selection.selected.push(
                            id
                        );

                    }

                }
                else{

                    selection.selected =
                        selection.selected.filter(
                            value =>
                                String(value) !== id
                        );

                }

            }
        );

        tdSelect.appendChild(
            checkbox
        );

        row.appendChild(
            tdSelect
        );

        //------------------------------------------------
        // CAMPOS
        //------------------------------------------------

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

                    context: {

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

    // console.log(
    //     "CONTEXT",
    //     context
    // );

    // console.log(
    //     "SELECTED VALUE",
    //     context.selectedValue
    // );

    if(!context.__selector){

        context.__selector = {

            selected:
                JSON.parse(
                    context.selectedValue || "[]"
                )

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

    const selection =
        initializeSelection({
            context
        });

    await window.navigateRenderer
        ?.navigate({

            html: "index.html",

            source: {
                file: "update.json",

                path: "data"                
            },

            parameters: {

                profile:
                    "update",

                selectedId:
                    context.selectedId,

                selectedField:
                    context.selectedField,

                selectedValue:
                    selection.selected?.[0] ?? null

            }

        });

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

function showTerminalCommand({
    container
}){

    const panel =
        document.createElement("div");

    panel.className =
        "terminal-command";

    panel.style.marginBottom =
        "16px";

    panel.style.padding =
        "12px";

    panel.style.background =
        "#111";

    panel.style.color =
        "#0f0";

    panel.style.fontFamily =
        "monospace";

    panel.innerHTML =
`
<div>
Copiar update.json al proyecto:
</div>

<pre>
./bin/actualizar.sh
</pre>
`;

    container.appendChild(
        panel
    );

}

    // ==================================================
    // REGISTRO GLOBAL
    // ==================================================
    window.selector = api;

    log("✅ selectorLayout registrado correctamente");

})();   // ← Cierre del IIFE
