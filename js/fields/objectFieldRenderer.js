// ======================================================
// 📁 js/fields/objectFieldRenderer.js
// ======================================================

(function(){

    const FILE = "objectFieldRenderer.js";

    const log   = (...a)=>window.logger?.info?.(FILE,...a);
    const debug = (...a)=>window.logger?.debug?.(FILE,...a);
    const error = (...a)=>window.logger?.error?.(FILE,...a);

    // ==================================================
    // API
    // ==================================================

    const api = {
        render
    };

    // ==================================================
    // RENDER
    // ==================================================

    async function render({
        container,
        value,
        field = {},
        context = {},
        mode = "display"
    } = {}){

        try{

            if(!container) return;

            container.innerHTML = "";

            const section = resolveSection(field);

            if(!section) return;

            const childContext = resolveContext({
                value,
                field,
                context,
                mode
            });

            await window.layoutRenderer.renderLayout({
                container,
                section,
                context: childContext
            });

        }
        catch(e){
            error("render:", e);
        }
    }

    // ==================================================
    // HELPERS (necesitas definir estas funciones)
    // ==================================================

    function resolveSection(field = {}) {

        return {
    
            component: "object",
    
            ...field
    
        };
    
    }

    function resolveContext({ value, field, context, mode }) {
        return {
            ...context,
            parentValue: value,
            parentField: field,
            mode
        };
    }

    // ==================================================
    // REGISTRO GLOBAL
    // ==================================================
    window.objectFieldRenderer = api;

    debug("✅ objectFieldRenderer registrado correctamente");

})();