// ======================================================
// 📁 js/core/router.js
// ======================================================

(function(){

    const FILE = "router.js";

    const log   = (...a) => window.logger?.info?.(FILE, ...a);
    const debug = (...a) => window.logger?.debug?.(FILE, ...a);
    const error = (...a) => window.logger?.error?.(FILE, ...a);

    window.router = {
        navigate,
        back,
        reload
    };

    async function navigate(params = {}){

        try{
            const { 
                html = "index.html", 
                file = "", 
                path = "" 
            } = params;

            if(!html){
                throw new Error("html es requerido");
            }

            const query = buildURL(file, path);
            let fullURL = html + query;

            // Forzar refresco añadiendo timestamp
            fullURL += (fullURL.includes('?') ? '&' : '?') + '_t=' + Date.now();

            debug("Navegando a:", fullURL);

            window.location.assign(fullURL);   // Mejor que href directo

        } catch(e){
            error("navigate:", e);
        }
    }

    function buildURL(file, path = "") {
        const query = new URLSearchParams();
        if (file) query.set("file", file);
        if (path) query.set("path", path);
        const str = query.toString();
        return str ? `?${str}` : "";
    }

    function back() {
        window.history.back();
    }

    function reload() {
        window.location.reload(true);
    }

    log("✅ router cargado y mejorado");

})();