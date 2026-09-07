async function execute({
    persona1 = null,
    intencion = "",
    persona2 = null,
    field = null,
    selectedId = null,
    selectedField = null,
    selectedValue = null
} = {}) {

    try {

        if (!persona1) {
            throw new Error("persona1 es requerida.");
        }

        if (!intencion) {
            throw new Error("intencion es requerida.");
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
        // 1. EXTRAER NODOS DEL EMISOR (EN MEMORIA)
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
        // 2. OBTENER / EJECUTAR PROFILE DEL RECEPTOR
        //--------------------------------------------------
        let receptorRoot = persona2;

        if (!receptorRoot) {
            const source =
                field?.relation?.source ||
                {};

            if (!source.file) {
                throw new Error(
                    "persona2 no está definida y no se proporcionó un 'source.file' para cargarla."
                );
            }

            const receptorRuntimeContext =
                await window.runtime.init({
                    file: source.file,
                    path: source.path,
                    profile: "selector",
                    context: {
                        parameters: {
                            selectedId,
                            selectedField,
                            selectedValue
                        }
                    }
                });

            receptorRoot =
                receptorRuntimeContext?.root;
        }

        if (!receptorRoot) {
            throw new Error(
                "No fue posible cargar ni resolver el documento del receptor."
            );
        }

        //--------------------------------------------------
        // 3. EXTRAER NODOS DEL RECEPTOR
        //--------------------------------------------------
        const datosReceptor =
            extractNodes({
                root: receptorRoot,
                paths:
                    window.pathResolver.getByPath(
                        contexto,
                        rutas.campo_receptor,
                        []
                    )
            });

        //--------------------------------------------------
        // 4. CONSTRUIR SALIDA
        //--------------------------------------------------
        return buildOutput({
            estructuraBase,
            contexto,
            intencion,
            persona1,
            persona2: receptorRoot,
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
    persona2,
    datosEmisor,
    datosReceptor
} = {}) {

    const resultado = clone(estructuraBase);

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
            [nombreEmisor]: datosEmisor,
            [nombreReceptor]: datosReceptor
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

    //--------------------------------------------------
    // DISPARAR DESCARGA DEL ARCHIVO RESULTADO.JSON
    //--------------------------------------------------
    if (window.jsonDownloader?.download) {
        window.jsonDownloader.download({
            json: resultado,
            fileName: "resultado.json"
        });
    } else {
        warn("jsonDownloader no está disponible en window.");
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