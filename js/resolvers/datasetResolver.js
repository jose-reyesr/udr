// ======================================================
// 📁 js/resolvers/datasetResolver.js
// ======================================================

(function(){

    const FILE = "datasetResolver.js";

    const log   = (...a)=>window.logger?.info?.(FILE,...a);
    const error = (...a)=>window.logger?.error?.(FILE,...a);

    window.datasetResolver = {

        execute,
        resolve

    };

// ======================================================
// EXECUTE
// ======================================================

async function execute({

    context = {}

} = {}){

    try{

        context.definition = resolve({

            context

        });

        return context.definition;

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
    // RESOLVE
    // ==================================================

    async function resolve({

        context = {}
    
    } = {}){
    
        try{
    
            const definitions =
    
                context
                ?.definition
                ?.datasets || [];
    
            const datasets =
                Object.create(null);
    
            //------------------------------------------------
            // BUILD DATASETS
            //------------------------------------------------
    
            for(const definition of definitions){
    
                // console.log(
                //     "ROOT EXISTS",
                //     !!context.root
                // );
                
                // console.log(
                //     "PATH",
                //     definition.path
                // );
                
                // console.log(
                //     "DATA RESOLVER",
                //     window.dataResolver
                // );
                
                const value =
                    await window
                        .dataResolver
                        ?.resolve({
                
                            root: context.root,
                
                            jsonPath: definition.path
                
                        });
                
                // console.log(
                //     "VALUE",
                //     value
                // );
    
                const schema =
                    await window
                        .schemaResolver
                        ?.getSchema({
    
                            name:
                                definition.schema,
    
                            context
    
                        });
    
                        // console.log(
                        //     "DATASET BUILD",
                        //     definition.id,
                        //     value
                        // );

                datasets[
                    definition.id
                ] = {
    
                    id:
                        definition.id,
    
                    definition,
    
                    value,
    
                    schema
    
                };
    
            }
    
            context.datasets =
                datasets;
    
            return datasets;
    
        }
        catch(e){
    
            error(
                "resolve:",
                e
            );
    
            context.datasets =
                Object.create(null);
    
            return context.datasets;
    
        }
    
    }
    
    // ==================================================

    log("datasetResolver inicializado.");

})();