// ======================================================
// 📁 js/runtime/relationResolver.js
// ======================================================
// UNIVERSAL DECLARATIVE RUNTIME
//
// Resuelve relaciones declarativas:
//
// {
//     source:{
//         file,
//         path
//     },
//     where:{
//         campo:"{campoLocal}"
//     }
// }
//
// Reemplaza el objeto de relación por el registro
// relacionado.
// ======================================================

(function(){

    const FILE = "relationResolver.js";
    
    const log   = (...a)=>window.logger?.info?.(FILE,...a);
    const debug = (...a)=>window.logger?.debug?.(FILE,...a);
    const warn  = (...a)=>window.logger?.warn?.(FILE,...a);
    const error = (...a)=>window.logger?.error?.(FILE,...a);
    
    window.relationResolver = {
    
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

        return await resolve({

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
    //==================================================
    // ENTRY POINT
    //==================================================
    
    async function resolve({
    
        context
    
    } = {}){
    
        try{
    
            const dataset =
    
                context
                ?.datasets
                ?.data
                ?.value;
    
            if(!Array.isArray(dataset)){



                return;
            }

            // console.log(
            //     "CONTEXT KEYS:",
            //     Object.keys(context)
            // );
            
            // console.log(
            //     "SCHEMAS:",
            //     context.schemas
            // );
            
            // console.log(
            //     "LAYOUT:",
            //     context.layout
            // );
            
            // console.log(
            //     "DATASETS:",
            //     context.datasets
            // );       

            // console.log(
            //     "META:",
            //     context.datasets?.meta
            // );
            
            // console.log(
            //     "LAYOUT DATASET:",
            //     context.datasets?.layout
            // );        
            
            // console.log(
            //     "META VALUE:",
            //     context.datasets?.meta?.value
            // );
            
            // console.log(
            //     "META SCHEMA:",
            //     context.datasets?.meta?.schema
            // );            
    
            // console.log(
            //     "DEFINITION:",
            //     context.definition
            // );
            
            // console.log(
            //     "DEFINITIONS:",
            //     context.definitions
            // );

            // console.log(
            //     "DATA DEFINITION:",
            //     context.datasets?.data?.definition
            // );
            
            // console.log(
            //     "META DEFINITION:",
            //     context.datasets?.meta?.definition
            // );      
            
            // console.log(
            //     "2) META VALUE:",
            //     JSON.stringify(
            //         context.datasets?.meta?.value,
            //         null,
            //         2
            //     )
            // );            

            // console.log(
            //     "DATA SCHEMA:",
            //     context.datasets?.data?.schema
            // );            

            // console.log(
            //     "DATA SCHEMA:",
            //     JSON.stringify(
            //         context.datasets?.data?.schema,
            //         null,
            //         2
            //     )
            // );            

            const schema =

            context
                ?.datasets
                ?.data
                ?.schema
        
            ||
        
            [];

            for(const row of dataset){

                await resolveRowRelations({
            
                    row,
            
                    schema
            
                });
            
            }            

            // for(const row of dataset){
    
            //     await resolveNode(
            //         row,
            //         row
            //     );
    
            // }

            // debug(
            //     "dataset after relations:",
            //     dataset
            // );            
    
        }
        catch(e){
    
            error(e);
    
        }
    
    }
    
    //==================================================
    // RECURSIVE WALK
    //==================================================
    
    async function resolveNode(
    
        node,
        rootRow
    
    ){
    
        if(!node){
            return;
        }
    
        if(Array.isArray(node)){
    
            for(const item of node){
    
                await resolveNode(
                    item,
                    rootRow
                );
    
            }
    

            return;
    
        }
    

        if(typeof node !== "object"){
            return;
        }
    
        for(const key of Object.keys(node)){
    
            let value = node[key];
    
            //------------------------------------------
            // RELATION
            //------------------------------------------
    
            if(isRelation(value)){

                // debug(
                //     "RELATION DETECTED:",
                //     key,
                //     value
                // );
            
                const record =
                    await loadRelation(
                        value,
                        rootRow
                    );
            
                // debug(
                //     "RELATION RESULT:",
                //     key,
                //     record
                // );
            
                if(record){

                    //--------------------------------------------------
                    // Todas las relaciones viven en la fila raíz
                    //--------------------------------------------------
                
                    rootRow.__resolved ??= {};
                
                    rootRow.__resolved[key] = record;
                    
                
                    //--------------------------------------------------
                    // Reemplaza el valor para seguir resolviendo
                    //--------------------------------------------------
                
                    value = record;
                
                }
    
            }
    
            await resolveNode(
    
                value,
    
                rootRow
    
            );
    
        }
    
    }
    
    //==================================================
    // RELATION DETECTOR
    //==================================================
    
    function isRelation(value){
    
        return (
    
            value &&
    
            typeof value === "object" &&
    
            value.source?.file &&
    
            value.source?.path &&
    
            value.where &&
    
            typeof value.where === "object"
    
        );
    
    }
    
    async function loadRelation(

        relation,
    
        row = {}
    
    ){
    
        try{
    
            // debug(
            //     "========================================"
            // );
    
            // debug(
            //     "LOAD RELATION START"
            // );
    
            // debug(
            //     "relation:",
            //     relation
            // );
    
            // debug(
            //     "row:",
            //     row
            // );
    
            //--------------------------------------------------
            // Ejecuta runtime relacionado
            //--------------------------------------------------
    
            const relationContext =
    
                await window.runtime.init({
    
                    file:
                        relation.source.file,
    
                    path:
                        relation.source.path,
    
                    profile:
                        "relation",
    
                    context:{}
    
                });

            //     debug(
            //         "relationContext keys:",
            //         Object.keys(relationContext || {})
            //     );
                
            //     debug(
            //         "relationContext.layout:",
            //         relationContext?.layout
            //     );

    
            // debug(
            //     "relationContext:",
            //     relationContext
            // );
    
            //--------------------------------------------------
            // DATASET
            //--------------------------------------------------
    
            const dataset =
    
                relationContext
                    ?.datasets
                    ?.data
                    ?.value
    
                ||
    
                [];
    
            // debug(
            //     "dataset length:",
            //     dataset.length
            // );
    
            // debug(
            //     "dataset sample:",
            //     dataset[0]
            // );
    
            //--------------------------------------------------
            // LAYOUT
            //--------------------------------------------------
    
            // const layoutItems =
    
            //     relationContext
            //         ?.layout
            //         ?.items
    
            //     ||
    
            //     [];
    
            // debug(
            //     "layout:",
            //     relationContext?.layout
            // );
    
            // debug(
            //     "layoutItems length:",
            //     layoutItems.length
            // );
    
            // debug(
            //     "layoutItems sample:",
            //     layoutItems[0]
            // );
    
            //--------------------------------------------------
            // VALIDATION
            //--------------------------------------------------
    
            // if(
    
            //     !Array.isArray(dataset) ||
    
            //     !Array.isArray(layoutItems)
    
            // ){
    
            //     warn(
            //         "dataset/layoutItems invalid",
            //         {
            //             dataset,
            //             layoutItems
            //         }
            //     );
    
            //     return null;
    
            // }
    
            //--------------------------------------------------
            // BUILD WHERE
            //--------------------------------------------------
    
            const where = {};
    
            for(const key of Object.keys(relation.where)){
    
                let value =
                    relation.where[key];
    
                if(
    
                    typeof value === "string" &&
    
                    value.startsWith("{") &&
    
                    value.endsWith("}")
    
                ){
    
                    const field =
    
                        value.slice(1,-1);
    
                    // debug(
                    //     "resolving token:",
                    //     field
                    // );
    
                    value =
    
                        window.pathResolver
                            ?.getByPath?.(
                                row,
                                field
                            )
    
                        ??
    
                        row[field];
    
                }
    
                where[key] =
                    value;
    
            }
    
            // debug(
            //     "where:",
            //     where
            // );
    
            //--------------------------------------------------
            // SEARCH
            //--------------------------------------------------
    
            const index =
    
                dataset.findIndex(item=>{
    
                    return Object.keys(where)
    
                        .every(key=>
    
                            String(item[key])
    
                            ===
    
                            String(where[key])
    
                        );
    
                });
    
            // debug(
            //     "index:",
            //     index
            // );
    
            if(index < 0){
    
                warn(
                    "relation record not found",
                    where
                );
    
                return null;
    
            }
    
            //--------------------------------------------------
            // FOUND RECORD
            //--------------------------------------------------
    
            // debug(
            //     "dataset",
            //     dataset[index]
            // );
    
            // debug(
            //     "layoutItems",
            //     layoutItems[index]
            // );
    
            // const result =
    
            //     clone(
            //         layoutItems[index]
            //     );
    
                // const result =
                // clone(
                //     dataset[index]
                // );

                const result = dataset[index];

            // debug(
            //     "result:",
            //     result
            // );
    
            // debug(
            //     "LOAD RELATION END"
            // );
    
            // debug(
            //     "========================================"
            // );
    
            return result;
    
        }
        catch(e){
    
            error(
                "loadRelation error:",
                e
            );
    
            return null;
    
        }
    
    }

//==================================================
// CLONE
//==================================================

function clone(value){

    if(

        value === null ||

        value === undefined

    ){

        return value;

    }

    return JSON.parse(

        JSON.stringify(value)

    );

}    
    
async function resolveRowRelations({

    row,

    schema = []

}){

    for(const field of schema){

        if(!field.relation){
            continue;
        }

        const record =
            await loadRelation(

                field.relation,

                row

            );

        if(!record){
            continue;
        }

        row.__resolved ??= {};

        row.__resolved[
            field.campo
        ] = record;

        // console.log(
        //     "ROW === ITEM.VALUE ?",
        //     row
        // );        

        // console.log(
        //     "FIELD RELATION:",
        //     field.campo
        // );
        
        // console.log(
        //     "ROW VALUE:",
        //     row[field.campo]
        // );
        
        // console.log(
        //     "RECORD:",
        //     record
        // );        


        // console.log(
        //     "ROW.__RESOLVED:",
        //     row.__resolved
        // );

    }

}

    })();