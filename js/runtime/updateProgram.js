// ======================================================
// 📁 js/programs/updateProgram.js
// ======================================================
// UNIVERSAL DECLARATIVE RUNTIME
//
// UPDATE PROGRAM
//
// RESPONSABILIDAD
// - Cargar el JSON indicado por source.
// - Aplicar data_modif directamente cuando exista.
// - Aplicar where + update cuando corresponda.
// - Generar el JSON completo actualizado.
// - Enviar el resultado a Download.
//
// NO HACE
// - Resolver profiles.
// - Resolver navegación.
// - Renderizar UI.
// - Resolver layouts.
// - Interpretar relaciones.
// ======================================================

(function(){

    const FILE = "updateProgram.js";

    const log =
        (...a) =>
            window.logger?.info?.(
                FILE,
                ...a
            );

    const debug =
        (...a) =>
            window.logger?.debug?.(
                FILE,
                ...a
            );

    const warn =
        (...a) =>
            window.logger?.warn?.(
                FILE,
                ...a
            );

    const error =
        (...a) =>
            window.logger?.error?.(
                FILE,
                ...a
            );

// ==================================================
// EXPORT
// ==================================================

const api = {

    execute,

    executeDirect,

    hasDataModif,

    matchWhere,

    findRecordIndexes,

    cloneData,

    applyUpdate,

    updateData,

    applyDataModif,

    applyOperation

    // serializeJson,

    // downloadJson

};

window.updateProgram = api;


    log(
        "✅ updateProgram registrado correctamente"
    );

    async function execute({

        context = {}
    
    } = {}){
    
        return executeDirect({
    
            root:
                context.root,
    
            data_original:
                context.data_original,
    
            source:
                context.source,
    
            where:
                context.where,
    
            update:
                context.update,
    
            data_modif:
                context.data_modif,
    
            selectedId:
                context.selectedId,
    
            selectedField:
                context.selectedField,
    
            selectedValue:
                context.selectedValue
    
        });
    
    }

    async function executeDirect({

        root = null,
    
        data_original = null,
    
        source = null,
    
        where = null,
    
        update = null,
    
        data_modif = undefined,
    
        selectedId = null,
    
        selectedField = null,
    
        selectedValue = null
    
    } = {}){
    
        try{
    
            const result =
                applyOperation({
    
                    json:
                        root,
    
                    data:
                        data_original,
    
                    source,
    
                    where,
    
                    update,
    
                    data_modif,
    
                    selectedId,
    
                    selectedField,
    
                    selectedValue
    
                });
    
            debug(
                "RESULT FROM applyOperation:",
                result
            );
    
            if(!result){
    
                warn(
                    "No fue posible generar el resultado."
                );
    
                return null;
    
            }
    
            debug(
                "RESULT keys:",
                Object.keys(result)
            );
    
            //--------------------------------------------------
            // DOWNLOAD
            //--------------------------------------------------
    
            const downloaded =
                window.jsonDownloader
                    ?.download({
    
                        json:
                            result,
    
                        fileName:
                            "document.json"
    
                    });
    
            const startupSource =
                result?.meta
                    ?.data
                    ?.source;
    
            await window.navigateRenderer.navigate({
    
                html: "index.html",
    
                source:
                    startupSource,
    
                parameters: {
    
                    profile:
                        "runtime"
    
                }
    
            });
    
            debug(
                "DOWNLOAD RESULT:",
                downloaded
            );
    
            return result;
    
        }
        catch(e){
    
            error(
                "executeDirect:",
                e
            );
    
            throw e;
    
        }
    
    }
    
// ==================================================
// HAS DATA MODIF
// ==================================================

function hasDataModif({

    data_modif = undefined

} = {}){

    return (
        data_modif !== undefined &&
        data_modif !== null
    );

}


// ==================================================
// MATCH WHERE
// ==================================================

function matchWhere({

    record = null,

    where = null

} = {}){

    if(!record){

        return false;

    }


    if(
        !where ||
        typeof where !== "object"
    ){

        return true;

    }


    for(
        const field
        of Object.keys(where)
    ){

        if(
            record?.[field] !==
            where[field]
        ){

            return false;

        }

    }


    return true;

}


// ==================================================
// FIND RECORD INDEXES
// ==================================================

function findRecordIndexes({

    data = null,

    where = null

} = {}){

    if(!Array.isArray(data)){

        warn(
            "Data no es un array."
        );

        return [];

    }


    if(
        !where ||
        typeof where !== "object"
    ){

        warn(
            "Where requerido."
        );

        return [];

    }


    const indexes = [];


    data.forEach(
        (record,index)=>{

            if(
                matchWhere({
                    record,
                    where
                })
            ){

                indexes.push(
                    index
                );

            }

        }
    );


    debug(
        "índices encontrados:",
        indexes
    );


    return indexes;

}

// ==================================================
// CLONE DATA
// ==================================================

function cloneData({

    data = null

} = {}){

    if(!Array.isArray(data)){

        warn(
            "Data no es un array."
        );

        return null;

    }


    return data.map(
        record => {

            if(
                record &&
                typeof record === "object"
            ){

                return {
                    ...record
                };

            }

            return record;

        }
    );

}


// ==================================================
// APPLY UPDATE
// ==================================================

function applyUpdate({

    data = null,

    where = null,

    update = null

} = {}){

    if(!Array.isArray(data)){

        warn(
            "Data no es un array."
        );

        return data;

    }


    if(
        !update ||
        typeof update !== "object"
    ){

        warn(
            "Update inválido."
        );

        return data;

    }


    const indexes =
        findRecordIndexes({
            data,
            where
        });


    if(!indexes.length){

        warn(
            "No se encontraron registros para actualizar:",
            where
        );

        return data;

    }


    for(
        const index
        of indexes
    ){

        const record =
            data[index];


        if(
            !record ||
            typeof record !== "object"
        ){

            continue;

        }


        for(
            const field
            of Object.keys(update)
        ){

            record[field] =
                update[field];

        }

    }


    debug(
        "update aplicado:",
        {
            where,
            update,
            registros:
                indexes.length
        }
    );


    return data;

}


// ==================================================
// UPDATE DATA
// ==================================================

function updateData({

    data = null,

    where = null,

    update = null

} = {}){

    try{

        const dataModificada =
            cloneData({
                data
            });


        if(!dataModificada){

            return null;

        }


        return applyUpdate({

            data:
                dataModificada,

            where,

            update

        });

    }
    catch(e){

        error(
            "updateData:",
            e
        );

        throw e;

    }

}

// ==================================================
// APPLY DATA MODIF
// ==================================================

function applyDataModif({

    json = null,

    source = null,

    data_modif = undefined

} = {}){

    try{

        debug(
            "========== APPLY DATA MODIF =========="
        );

        debug(
            "json:",
            json
        );

        debug(
            "source:",
            source
        );

        debug(
            "source.path:",
            source?.path
        );

        debug(
            "data_modif:",
            data_modif
        );


        if(!json){

            warn(
                "applyDataModif: json no disponible."
            );

            return null;

        }


        if(
            !hasDataModif({
                data_modif
            })
        ){

            warn(
                "applyDataModif: data_modif vacío."
            );

            return null;

        }


        const result =
            structuredClone(
                json
            );


        debug(
            "JSON CLONADO:",
            result
        );


        window.pathResolver.setByPath(
            result,
            source.path,
            data_modif
        );


        debug(
            "JSON DESPUÉS DE setByPath:",
            result
        );


        return result;

    }
    catch(e){

        error(
            "applyDataModif:",
            e
        );

        throw e;

    }

}


// ==================================================
// APPLY OPERATION
// ==================================================

function applyOperation({

    json = null,

    data = null,

    source = null,

    where = null,

    update = null,

    data_modif = undefined,
    selectedId = null,
    selectedField = null,
    selectedValue = null

} = {}){

    try{

        debug(
            "========== APPLY OPERATION =========="
        );

        debug(
            "json:",
            json
        );

        debug(
            "data:",
            data
        );

        debug(
            "source:",
            source
        );

        debug(
            "where:",
            where
        );

        debug(
            "update:",
            update
        );

        debug(
            "data_modif:",
            data_modif
        );


        //--------------------------------------------------
        // DATA MODIF
        //--------------------------------------------------

        const hasModifiedData =
            hasDataModif({

                data_modif

            });


        debug(
            "hasDataModif:",
            hasModifiedData
        );


        if(hasModifiedData){

            debug(
                "APPLY OPERATION → DATA_MODIF"
            );


            const result =
                applyDataModif({

                    json,
                    source,
                    data_modif

                });


            debug(
                "applyDataModif RESULT:",
                result
            );


            return result;

        }

        debug("selectedId", selectedId);
        debug("selectedField", selectedField);
        debug("selectedValue", selectedValue);

        if(

            selectedId !== null &&

            selectedField &&

            selectedValue !== null

        ){

            return applySelectedUpdate({

                json,

                source,

                selectedId,

                selectedField,

                selectedValue

            });

        }        


        //--------------------------------------------------
        // UPDATE
        //--------------------------------------------------

        debug(
            "APPLY OPERATION → UPDATE"
        );


        if(
            update &&
            typeof update === "object"
        ){

            debug(
                "Executing updateData..."
            );


            const dataModificada =
                updateData({

                    data,
                    where,
                    update

                });


            debug(
                "updateData RESULT:",
                dataModificada
            );


            if(
                dataModificada === null
            ){

                warn(
                    "updateData regresó null."
                );

                return null;

            }


            const result =
                structuredClone(
                    json
                );


            debug(
                "JSON CLONADO:",
                result
            );


            window.pathResolver.setByPath(
                result,
                source.path,
                dataModificada
            );


            debug(
                "JSON DESPUÉS DE UPDATE:",
                result
            );


            return result;

        }


        warn(
            "applyOperation: no existe data_modif ni update."
        );


        return null;

    }
    catch(e){

        error(
            "applyOperation:",
            e
        );

        throw e;

    }

}

// // ==================================================
// // SERIALIZE JSON
// // ==================================================

// function serializeJson({

//     json = null

// } = {}){

//     try{

//         if(!json){

//             warn(
//                 "JSON para serializar no disponible."
//             );

//             return null;

//         }


//         return JSON.stringify(
//             json,
//             null,
//             2
//         );

//     }
//     catch(e){

//         error(
//             "serializeJson:",
//             e
//         );

//         throw e;

//     }

// }


// // ==================================================
// // DOWNLOAD JSON
// // ==================================================

// function downloadJson({

//     json = null,

//     fileName = "updated.json"

// } = {}){

//     try{

//         debug(
//             "========== DOWNLOAD JSON =========="
//         );

//         debug(
//             "fileName:",
//             fileName
//         );

//         debug(
//             "json:",
//             json
//         );


//         const content =
//             serializeJson({
//                 json
//             });


//         debug(
//             "serialized content:",
//             content
//         );


//         if(content === null){

//             warn(
//                 "downloadJson: serializeJson regresó null."
//             );

//             return false;

//         }


//         const blob =
//             new Blob(
//                 [content],
//                 {
//                     type:
//                         "application/json"
//                 }
//             );


//         debug(
//             "Blob creado:",
//             blob
//         );


//         const url =
//             URL.createObjectURL(
//                 blob
//             );


//         debug(
//             "Object URL creada:",
//             url
//         );


//         const link =
//             document.createElement(
//                 "a"
//             );


//         link.href =
//             url;

//         link.download =
//             fileName;


//         document.body.appendChild(
//             link
//         );


//         debug(
//             "Iniciando descarga:",
//             fileName
//         );


//         link.click();


//         link.remove();

//         URL.revokeObjectURL(
//             url
//         );


//         debug(
//             "Descarga completada."
//         );


//         return true;

//     }
//     catch(e){

//         error(
//             "downloadJson:",
//             e
//         );

//         throw e;

//     }

// }


function applySelectedUpdate({

    json = null,

    source = null,

    selectedId = null,

    selectedField = null,

    selectedValue = null

} = {}){

    try{

        const result =
            structuredClone(
                json
            );

        const data =
            window.pathResolver
                .getByPath(
                    result,
                    source.path
                );

        if(!Array.isArray(data)){
            return null;
        }

        const record =
            data.find(
                item =>
                    String(item.id) ===
                    String(selectedId)
            );

        if(!record){
            return null;
        }

        record[
            selectedField
        ] = selectedValue;

        return result;

    }
    catch(e){

        error(
            "applySelectedUpdate:",
            e
        );

        throw e;

    }

}

})();