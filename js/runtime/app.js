// ======================================================
// 📁 js/app.js
// ✅ UNIVERSAL DECLARATIVE RUNTIME
// ✅ Compatible con window.router
// ✅ Sin ES Modules
// ======================================================

(function(){

  const FILE = "app.js";

  function log(...a){
    window.logger?.info?.(FILE, ...a);
  }

  function error(...a){
    window.logger?.error?.(FILE, ...a);
  }

  function getRuntimeParams(){

    const search =
        new URLSearchParams(
            window.location.search
        );

    const context = {};

    for(const [key, value] of search.entries()){

        context[key] = value;

    }

    return {

        file:
            search.get("file"),

        path:
            search.get("path"),

        profile:
            search.get("profile"),

        context

    };

}

  async function startApp(){

    try {

      log("Iniciando runtime...");

      if (!window.runtime){
        throw new Error(
          "runtime no disponible"
        );
      }

      const params = getRuntimeParams();

      log(
        "Runtime params:",
        params
      );

      await window.runtime.init(
        params
      );

      log("Runtime iniciado");

    } catch(e){

      error(
        "startApp:",
        e
      );
    }
  }

  document.addEventListener(
    "DOMContentLoaded",
    startApp
  );

})();