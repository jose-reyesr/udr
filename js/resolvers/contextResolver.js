async function execute({

    persona1 = null,
    intencion = "",
    persona2 = [],
    field = null,
    selectedId = null,
    selectedField = null,
    selectedValue = null

} = {}) {

    try {

        if (!persona1) {

            throw new Error(
                "persona1 es requerida."
            );

        }

        if (!intencion) {

            throw new Error(
                "intencion es requerida."
            );

        }

        if (!Array.isArray(persona2)) {

            throw new Error(
                "persona2 debe ser una lista."
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

        if (!estructuraBase) {

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

        if (!contexto) {

            debug(
                "Intención no encontrada:",
                intencion
            );

            return null;

        }

        //--------------------------------------------------
        // 1. EXTRAER NODOS DEL EMISOR
        //--------------------------------------------------

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

        //--------------------------------------------------
        // 2. OBTENER PERSONAS RECEPTORAS
        //--------------------------------------------------

        let personasReceptor =
            persona2;

        if (!personasReceptor.length) {

            const source =
                field?.relation?.source ||
                {};

            if (source.file) {

                const receptorRuntimeContext =
                    await window.runtime.init({

                        file:
                            source.file,

                        path:
                            source.path,

                        profile:
                            "selector",

                        context: {

                            parameters: {

                                selectedId,
                                selectedField,
                                selectedValue

                            }

                        }

                    });

                const receptorRoot =
                    receptorRuntimeContext?.root;

                if (Array.isArray(receptorRoot)) {

                    personasReceptor =
                        receptorRoot;

                }
                else if (receptorRoot) {

                    personasReceptor = [
                        receptorRoot
                    ];

                }

            }

        }

        //--------------------------------------------------
        // 3. EXTRAER NODOS DE CADA RECEPTOR
        //--------------------------------------------------

        const pathsReceptor =
            window.pathResolver.getByPath(
                contexto,
                rutas.campo_receptor,
                []
            );

        const datosReceptor = [];

        for (
            const persona
            of personasReceptor
        ) {

            datosReceptor.push(

                extractNodes({

                    root:
                        persona,

                    paths:
                        pathsReceptor

                })

            );

        }

        //--------------------------------------------------
        // 4. CONSTRUIR SALIDA
        //--------------------------------------------------

        return buildOutput({

            estructuraBase,
            contexto,
            intencion,
            persona1,
            persona2:
                personasReceptor,
            datosEmisor,
            datosReceptor

        });

    }
    catch (e) {

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
} = {}) {

    if (!Array.isArray(mapaIntenciones)) {
        return null;
    }

    if (!campoContexto) {
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
} = {}) {

    const resultado = {};

    if (!Array.isArray(paths)) {
        return resultado;
    }

    for (const path of paths) {

        const value =
            window.pathResolver.getByPath(
                root,
                path,
                undefined
            );

        if (value === undefined) {
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
    persona2 = [],
    datosEmisor,
    datosReceptor = []

} = {}) {

    const resultado =
        clone(
            estructuraBase
        );

    const nombreEmisor =
        persona1?.nombre ||
        persona1?.id ||
        "";

    window.pathResolver.setByPath(
        resultado,
        "contexto_sistema.intencion_detectada",
        intencion
    );

    //--------------------------------------------------
    // ENTIDADES CRUZADAS
    //--------------------------------------------------

    const entidadesCruzadas = {

        [nombreEmisor]:
            datosEmisor

    };

    for (
        let i = 0;
        i < persona2.length;
        i++
    ) {

        const persona =
            persona2[i];

        const nombreReceptor =
            persona?.nombre ||
            persona?.id ||
            "";

        if (!nombreReceptor) {

            continue;

        }

        entidadesCruzadas[
            nombreReceptor
        ] =
            datosReceptor[i] || {};

    }

    window.pathResolver.setByPath(
        resultado,
        "datos_encontrados.entidades_cruzadas",
        entidadesCruzadas
    );

    //--------------------------------------------------
    // INSTRUCCIÓN
    //--------------------------------------------------

    const nombresReceptores =
        persona2
            .map(
                persona =>
                    persona?.nombre ||
                    persona?.id ||
                    ""
            )
            .filter(Boolean);

    window.pathResolver.setByPath(
        resultado,
        "instruccion_usuario",
        [
            nombreEmisor,
            intencion,
            ...nombresReceptores
        ].join(" ")
    );

    log(
        "Resultado construido:",
        resultado
    );

    //--------------------------------------------------
    // DESCARGA
    //--------------------------------------------------

    if (
        window.jsonDownloader?.download
    ) {

        window.jsonDownloader.download({

            json:
                resultado,

            fileName:
                "resultado.json"

        });

    }
    else {

        warn(
            "jsonDownloader no está disponible en window."
        );

    }

    return resultado;

}

function clone(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return value;
    }

    return JSON.parse(
        JSON.stringify(
            value
        )
    );

}