// ======================================================
// 📁 js/core/logger.js
// ✅ LOGGER v2 (FULL: debug, info, warn, error)
// ======================================================

(function(){

    const FILE = "logger.js";
  
    const LEVELS = {
      debug: "DEBUG",
      info: "INFO",
      warn: "WARN",
      error: "ERROR"
    };
  
    function now(){
      const d = new Date();
      return d.toISOString().replace("T", " ").replace("Z", "");
    }
  
    function log(level, file, ...args){
  
      const prefix = `[${now()}] [${file}] [${LEVELS[level]}]`;
  
      switch(level){
  
        case "debug":
          if (window.DEBUG){
            console.log(prefix, ...args);
          }
          break;
  
        case "info":
          console.log(prefix, ...args);
          break;
  
        case "warn":
          console.warn(prefix, ...args);
          break;
  
        case "error":
          console.error(prefix, ...args);
          break;
      }
    }
  
    // 🔥 ASEGURAR QUE EXISTEN TODOS LOS MÉTODOS
    window.logger = {
      debug: (file, ...args) => log("debug", file, ...args),
      info:  (file, ...args) => log("info",  file, ...args),
      warn:  (file, ...args) => log("warn",  file, ...args),
      error: (file, ...args) => log("error", file, ...args)
    };
  
    // 🔥 DEBUG FLAG GLOBAL
    if (window.DEBUG === undefined){
      window.DEBUG = true;
    }
  
    console.log(`[${now()}] [${FILE}] [INFO] Logger inicializado`);
  
  })();