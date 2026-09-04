async function execute({

    persona1 = null,
    intencion = "",
    persona2 = null

} = {}){

    try{

        if(!persona1){

            throw new Error(
                "persona1 es requerida."
            );

        }

        if(!intencion){

            throw new Error(
                "intencion es requerida."
            );

        }

        if(!persona2){

            throw new Error(
                "persona2 es requerida."
            );

        }

        const motorConfig =
            persona1?.definition?.motor_config ||
            {};

        const rutas =
            motorConfig.rutas_orquestacion ||
            {};

        const estructuraBase =
            motorConfig.estructura_salida_base;

        if(!estructuraBase){

            throw new Error(
                "No existe 'estructura_salida_base' en motor_config."
            );

        }

        const mapaIntenciones =
            window.pathResolver.getByPath(
                persona1,
                rutas.contenedor,
                []
            );

        const contexto =
            resolveIntent({

                mapaIntenciones,
                intencion,
                campoContexto:
                    rutas.campo_contexto

            });

        if(!contexto){

            debug(
                "Intención no encontrada:",
                intencion
            );

            return null;

        }

        const datosEmisor =
            extractNodes({

                root: persona1,

                paths:
                    window.pathResolver.getByPath(
                        contexto,
                        rutas.campo_emisor,
                        []
                    )

            });

        const datosReceptor =
            extractNodes({

                root: persona2,

                paths:
                    window.pathResolver.getByPath(
                        contexto,
                        rutas.campo_receptor,
                        []
                    )

            });

        return buildOutput({

            estructuraBase,
            contexto,
            intencion,
            persona1,
            persona2,
            datosEmisor,
            datosReceptor

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

function resolveIntent({

    mapaIntenciones = [],
    intencion = "",
    campoContexto = ""

} = {}){

    if(!Array.isArray(mapaIntenciones)){

        return null;

    }

    if(!campoContexto){

        return null;

    }

    return mapaIntenciones.find(

        item =>

            window.pathResolver.getByPath(
                item,
                campoContexto,
                undefined
            ) === intencion

    ) || null;

}

function extractNodes({

    root = {},
    paths = []

} = {}){

    const resultado = {};

    if(!Array.isArray(paths)){

        return resultado;

    }

    for(const path of paths){

        const value =
            window.pathResolver.getByPath(
                root,
                path,
                undefined
            );

        if(value === undefined){

            continue;

        }

        window.pathResolver.setByPath(
            resultado,
            path,
            value
        );

    }

    return resultado;

}

function buildOutput({

    estructuraBase,
    contexto,
    intencion,
    persona1,
    persona2,
    datosEmisor,
    datosReceptor

} = {}){

    const resultado =
        clone(
            estructuraBase
        );

    const nombreEmisor =
        persona1?.nombre ||
        persona1?.id ||
        "";

    const nombreReceptor =
        persona2?.nombre ||
        persona2?.id ||
        "";

    window.pathResolver.setByPath(
        resultado,
        "contexto_sistema.intencion_detectada",
        intencion
    );

    window.pathResolver.setByPath(
        resultado,
        "datos_encontrados.entidades_cruzadas",
        {

            [nombreEmisor]:
                datosEmisor,

            [nombreReceptor]:
                datosReceptor

        }
    );

    window.pathResolver.setByPath(
        resultado,
        "instruccion_usuario",
        `${nombreEmisor} ${intencion} ${nombreReceptor}`
    );

    log(
        "Resultado construido:",
        resultado
    );

    return resultado;

}

function clone(value){

    if(

        value === null ||

        value === undefined

    ){

        return value;

    }

    return JSON.parse(

        JSON.stringify(
            value
        )

    );

}

