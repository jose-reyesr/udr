(function(){

    const FILE = "programRegistry.js";
    
    const log   = (...a)=>window.logger?.info?.(FILE,...a);
    const error = (...a)=>window.logger?.error?.(FILE,...a);
    
    const registry = Object.create(null);
    
    window.programRegistry = {
    
        registerProgram,
        unregisterProgram,
        hasProgram,
        getProgram,
        execute
    
    };
    
    function registerProgram(name, program){
    
        if(!name || !program){
            return;
        }
    
        registry[name] = program;
    
    }
    
    function unregisterProgram(name){
    
        delete registry[name];
    
    }
    
    function hasProgram(name){
    
        return !!registry[name];
    
    }
    
    function getProgram(name){
    
        return registry[name] || null;
    
    }
    
    async function execute({
    
        name,
        context = {}
    
    } = {}){
    
        const program = registry[name];
    
        if(!program){
    
            throw new Error(
    
                `Programa no registrado: ${name}`
    
            );
    
        }
    
        if(typeof program.execute !== "function"){
    
            throw new Error(
    
                `${name} no implementa execute().`
    
            );
    
        }
    
        return await program.execute({
    
            context
    
        });
    
    }
    
    log("programRegistry inicializado.");
    
    })();