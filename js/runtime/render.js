(function(){

    const FILE = "render.js";

    const log   = (...a)=>window.logger?.info?.(FILE,...a);
    const error = (...a)=>window.logger?.error?.(FILE,...a);

    window.render = {

        execute

    };

    async function execute({

        context = {}

    } = {}){

        try{

            return await window.layoutRenderer.render({

                context

            });

        }
        catch(e){

            error(
                "execute:",
                e
            );

            throw e;

        }

    }

    log(
        `${FILE} inicializado correctamente.`
    );

})();