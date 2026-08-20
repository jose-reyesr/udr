(function(){

    const FILE = "validateSchemas.js";

    const log   = (...a)=>window.logger?.info?.(FILE,...a);
    const error = (...a)=>window.logger?.error?.(FILE,...a);

    window.validateSchemas = {

        execute

    };

    async function execute({

        context = {}

    } = {}){

        const startup =
            context.root?.definition?.startup || {};

        const definitions =
            context.root?.definition?.datasets || [];

        const metaName =
            startup.meta_schema || "_meta";

        const meta =
            context.root?.meta?.schemas?.[metaName];

        if(!meta){

            throw new Error(

                `No existe el schema '${metaName}'.`

            );

        }

        //--------------------------------------------------
        // _META -> SCHEMAS
        //--------------------------------------------------

        for(const definition of definitions){

            const schema =
                context.root
                    ?.meta
                    ?.schemas
                    ?.[definition.schema];

            if(!schema){

                throw new Error(

                    `No existe el schema '${definition.schema}'.`

                );

            }

            // log(
            //     "Validando schema:",
            //     definition.schema
            // );

            validateSchemaDefinition({

                meta,
                schema,

                schemaName:
                    definition.schema

            });

        }

        //--------------------------------------------------
        // SCHEMA -> DATASET
        //--------------------------------------------------

        for(const dataset of Object.values(context.datasets)){

            // log(
            //     "Validando dataset:",
            //     dataset.id
            // );
        
            if(Array.isArray(dataset.value)){
        
                validateDataset({
        
                    schema: dataset.schema,
        
                    data: dataset.value,
        
                    datasetName: dataset.id
        
                });
        
            }
            else{
        
                validateObject({
        
                    schema: dataset.schema,
        
                    object: dataset.value,
        
                    path: dataset.id
        
                });
        
            }
        
        }

        // log(
        //     "Schemas validados correctamente."
        // );

        return true;

    }

    //--------------------------------------------------
    //_META -> SCHEMA
    //--------------------------------------------------

    function validateSchemaDefinition({

        meta,
        schema,

        schemaName = ""

    }){

        const properties =
            meta.properties || {};

        for(const field of schema){

            //------------------------------------------
            // atributos permitidos
            //------------------------------------------

            for(const property of Object.keys(field)){

                if(!(property in properties)){

                    throw new Error(

                        `El atributo '${property}' no existe en _meta (${schemaName}).`

                    );

                }

            }

            //------------------------------------------
            // obligatorios
            //------------------------------------------

            for(const property in properties){

                if(

                    properties[property].obligatorio &&
                    !(property in field)

                ){

                    throw new Error(

                        `Falta '${property}' en '${field.campo}' (${schemaName}).`

                    );

                }

            }

            //------------------------------------------
            // recursividad
            //------------------------------------------

            if(Array.isArray(field.fields)){

                validateSchemaDefinition({

                    meta,

                    schema:
                        field.fields,

                    schemaName

                });

            }

        }

    }

    //--------------------------------------------------
    // SCHEMA -> DATASET
    //--------------------------------------------------

    function validateDataset({

        schema = [],
        data = [],

        datasetName = ""

    }){

        if(!Array.isArray(data)){

            throw new Error(

                `'${datasetName}' debe ser un array.`

            );

        }

        for(const row of data){

            validateObject({

                schema,

                object:
                    row,

                path:
                    datasetName

            });

        }

    }

    //--------------------------------------------------
    // SCHEMA -> OBJETO
    //--------------------------------------------------

    function validateObject({

        schema = [],
        object,

        path = ""

    }){

        if(Array.isArray(object)){

            for(const item of object){
        
                validateObject({
        
                    schema,
                    object: item,
                    path
        
                });
        
            }
        
            return;
        
        }
                
        if(

            object === null ||

            typeof object !== "object"

        ){

            throw new Error(

                `'${path}' debe ser un objeto. Valor recibido: ${JSON.stringify(object)}`

            );

        }

        for(const field of schema){

            //------------------------------------------
            // obligatorio
            //------------------------------------------

            if(!(field.campo in object)){
                
                if(!(field.campo in object)){

                    if(field.required === true){
                
                        throw new Error(
                
                            `Falta el campo '${path}.${field.campo}'.`
                
                        );
                
                    }
                
                    continue;
                
                }
            }


            const value =
                object[field.campo];

            //------------------------------------------
            // objetos hijos
            //------------------------------------------

            if(Array.isArray(field.fields)){

                if(Array.isArray(value)){

                    for(const item of value){

                        validateObject({

                            schema:
                                field.fields,

                            object:
                                item,

                            path:
                                `${path}.${field.campo}`

                        });

                    }

                }
                else{

                    validateObject({

                        schema:
                            field.fields,

                        object:
                            value,

                        path:
                            `${path}.${field.campo}`

                });

                }

            }

        }

    }

})();