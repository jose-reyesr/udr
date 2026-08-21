(function(){

    const FILE = "layoutResolver.js";

    const log   = (...a)=>window.logger?.info?.(FILE,...a);
    const debug = (...a)=>window.logger?.debug?.(FILE,...a);
    const warn  = (...a)=>window.logger?.warn?.(FILE,...a);
    const error = (...a)=>window.logger?.error?.(FILE,...a);

    // ==================================================
    // EXPORT
    // ==================================================

    window.layoutResolver = {

        execute

    };

    // ==================================================
    // EXECUTE
    // ==================================================

    async function execute({

        context = {}

    } = {}){

        try{

            const layoutSource =
                context.profileDefinition?.layout
                    ? context.root?.[
                        context.profileDefinition.layout
                    ]
                    : context.datasets?.layout?.value;

            const layout =
                layoutSource;            

            // const layout =

            //     context.datasets
            //         ?.layout
            //         ?.value;

            if(!layout){

                warn(
                    "Layout no encontrado."
                );

                return null;

            }

            context.layout =

                await resolveLayout({

                    layout,

                    context

                });

            log(
                "Layout resuelto correctamente."
            );

            return context.layout;

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
    // LAYOUT
    // ==================================================

    async function resolveLayout({

        layout,

        context

    }){

        return await resolveNode({

            node: clone(layout),

            context

        });

    }

    // ==================================================
    // NODE
    // ==================================================

    async function resolveNode({

        node,
    
        context
    
    }){
    
        //------------------------------------------------
        // NULL
        //------------------------------------------------
    
        if(node == null){
    
            return node;
    
        }
    
        //------------------------------------------------
        // ARRAY
        //------------------------------------------------
    
        if(Array.isArray(node)){
    
            const result = [];
    
            for(const item of node){
    
                result.push(
    
                    await resolveNode({
    
                        node: item,
    
                        context
    
                    })
    
                );
    
            }
    
            return result;
    
        }
    
        //------------------------------------------------
        // PRIMITIVO
        //------------------------------------------------
    
        if(typeof node !== "object"){
    
            return node;
    
        }
    
        //------------------------------------------------
        // COMPONENTE
        //------------------------------------------------
    
        if(typeof node.component === "string"){
    
            const resolved = clone(node);
    
            if(
    
                resolved.dataset ||
    
                resolved.dataSource
    
            ){
    
                const dataset =
    
                    context.datasets?.[
    
                        resolved.dataset ||
    
                        resolved.dataSource
    
                    ];
    
                const schema =
    
                    Array.isArray(
                        dataset?.schema
                    )
    
                        ? dataset.schema
    
                        : [];
    
                //------------------------------------------------
                // Si no hay fields definidos
                // utilizar todo el schema
                //------------------------------------------------
    
                if(
    
                    !Array.isArray(
                        resolved.fields
                    )
    
                    ||
    
                    resolved.fields.length === 0
    
                ){
    
                    resolved.fields =
                        clone(schema);
    
                }
    
                const records =
    
                    Array.isArray(
                        dataset?.value
                    )
    
                        ? dataset.value
    
                        : dataset?.value != null
    
                            ? [ dataset.value ]
    
                            : [];
    
                resolved.items = [];

                // debug(
                //     "DATASET RECORDS:",
                //     JSON.stringify(records, null, 2)
                // );

                for(const record of records){

// debug(
//     "CURRENT RECORD:",
//     JSON.stringify(record, null, 2)
// );

// debug(
//     "CURRENT RECORD.__RESOLVED:",
//     JSON.stringify(record.__resolved, null, 2)
// );             
                        

                    resolved.items.push({
    
                        value:
                            clone(record),
    
                        navigation:
                            clone(
                                record?.navigation
                            ),
    
                        fields:
    
                            await resolveFields({
    
                                fields:
                                    resolved.fields,
    
                                schema,
    
                                record,
    
                                context
    
                            })
    
                    });
    
                }
    
                delete resolved.fields;
    
            }
    
            //------------------------------------------------
            // Continúa resolviendo cualquier propiedad
            //------------------------------------------------
    
            for(const key of Object.keys(resolved)){
    
                if(key === "items"){
    
                    continue;
    
                }
    
                resolved[key] =
    
                    await resolveNode({
    
                        node: resolved[key],
    
                        context
    
                    });
    
            }
    
            return resolved;
    
        }
    
        //------------------------------------------------
        // OBJETO NORMAL
        //------------------------------------------------
    
        const result = {};
    
        for(const [key,value] of Object.entries(node)){
    
            result[key] =
    
                await resolveNode({
    
                    node: value,
    
                    context
    
                });
    
        }
    
        return result;
    
    }

    // ==================================================
    // FIELDS
    // ==================================================

    async function resolveFields({

        fields = [],

        schema = [],

        record = null,

        context = {}

    }){

  
        
        const result = [];

        // debug(
        //     "RECORD:",
        //     JSON.stringify(
        //         record,
        //         null,
        //         2
        //     )
        // );
        
        for(const layoutField of fields){

            result.push(
        
                await resolveField({
        
                    layoutField,
        
                    schema,
        
                    record,
        
                    context
        
                })
        
            );
        
        }

   

        return result;

    }

    // ==================================================
    // FIELD
    // ==================================================

    async function resolveField({

        layoutField = {},
    
        schema = [],
    
        record = null,
    
        context = {}
    
    }){
    
        //------------------------------------------------
        // SCHEMA FIELD
        //------------------------------------------------
    
        const schemaField =
    
            schema.find(
    
                field =>
    
                    field.campo ===
                    layoutField.campo
    
            )
    
            ||
    
            {};
    
    
        //------------------------------------------------
        // MERGE
        //------------------------------------------------
    
        const field =
    
            mergeField({
    
                schemaField,
    
                layoutField
    
            });
    
    
        // debug(
        //     "RESOLVE FIELD:",
        //     {
        //         campo:
        //             field.campo,
    
        //         originalValue:
        //             record?.[field.campo],
    
        //         resolvedValue:
        //             record?.__resolved?.[field.campo]
        //     }
        // );
    
    
        //------------------------------------------------
        // ORIGINAL VALUE
        //
        // Siempre representa el valor almacenado
        // en el dataset original.
        //------------------------------------------------
    
        field.value =
    
            resolveValue({
    
                record,
    
                campo:
                    field.campo
    
            });
    
    
        //------------------------------------------------
        // RESOLVED VALUE
        //
        // Proviene exclusivamente de relationResolver.
        //------------------------------------------------
    
        field.__resolved =
    
            resolveResolved({
    
                record,
    
                campo:
                    field.campo
    
            });
    
    
        //------------------------------------------------
        // PUBLIC RESOLVED VALUE
        //
        // El layout/renderer puede utilizarlo sin tener
        // que conocer __resolved.
        //------------------------------------------------
    
        if(
            field.__resolved !== null &&
            field.__resolved !== undefined
        ){
    
            field.resolvedValue =
    
                clone(
                    field.__resolved
                );
    
        }
        else{
    
            field.resolvedValue =
                null;
    
        }
    
    
        //------------------------------------------------
        // OBJECT
        //
        // Un objeto normal se sigue resolviendo
        // recursivamente.
        //
        // Si existe una relación resuelta, NO se
        // reemplaza el objeto original.
        //------------------------------------------------
    
        if(

            field.fields?.length &&
        
            field.__resolved
        
        ){
            
            field.fields =
            
                await resolveFields({
            
                    fields:
                        field.fields,
            
                    schema:
                        schemaField.fields || [],
            
                    record:
                        field.__resolved,
            
                    context
            
                });
        
        }
        else if(
        
            field.value &&
        
            typeof field.value === "object" &&
        
            !Array.isArray(
                field.value
            )
        
        ){
    
            const childRecord = {
    
                ...field.value
    
            };
    
    
            field.fields =
    
                await resolveFields({
    
                    fields:
                        field.fields || [],
    
                    schema:
                        schemaField.fields || [],
    
                    record:
                        childRecord,
    
                    context
    
                });
    
        }
    
    
        //------------------------------------------------
        // ARRAY
        //------------------------------------------------
    
        if(
            Array.isArray(
                field.value
            )
        ){
    
            field.items = [];
    
    
            for(
                const item
                of field.value
            ){
    
                field.items.push({
    
                    //------------------------------------------------
                    // VALOR ORIGINAL DEL ITEM
                    //------------------------------------------------
    
                    value:
                        clone(
                            item
                        ),
    
    
                    //------------------------------------------------
                    // NAVIGATION
                    //------------------------------------------------
    
                    navigation:
                        clone(
                            item?.navigation
                        ),
    
    
                    //------------------------------------------------
                    // CAMPOS RESUELTOS
                    //------------------------------------------------
    
                    fields:
    
                        await resolveFields({
    
                            fields:
                                field.fields || [],
    
                            schema:
                                schemaField.fields || [],
    
                            record:
                                item,
    
                            context
    
                        })
    
                });
    
            }
    
        }
    
    
        //------------------------------------------------
        // DEBUG
        //------------------------------------------------
    
        // debug(
        //     "FIELD ORIGINAL VALUE:",
        //     field.value
        // );
    
    
        // debug(
        //     "FIELD FINAL:",
        //     JSON.stringify(field, null, 2)
        // );
        
        // if(field.campo === "tipos_media"){

        //     debug(
        //         "TIPOS_MEDIA RESOLVE:",
        //         JSON.stringify({
        //             campo: field.campo,
        //             originalValue: record?.[field.campo],
        //             resolvedValue: record?.__resolved?.[field.campo]
        //         }, null, 2)
        //     );
        
        // }
    
    
        //------------------------------------------------
        // RETURN
        //------------------------------------------------
    
        return field;
    
    }

    // ==================================================
    // MERGE FIELD
    // ==================================================

    function mergeField({

        schemaField = {},
    
        layoutField = {}
    
    }){
    
        const schemaChildren =
            schemaField.fields || [];
    
        const layoutChildren =
            layoutField.fields || [];
    
        const mergedChildren =
            layoutChildren.map(
                layoutChild => {
    
                    const schemaChild =
                        schemaChildren.find(
                            s =>
                            s.campo ===
                            layoutChild.campo
                        ) || {};
    
                    return mergeField({
    
                        schemaField:
                            schemaChild,
    
                        layoutField:
                            layoutChild
    
                    });
    
                }
            );
    
        return {
    
            ...schemaField,
    
            ...layoutField,
    
            fields:
                mergedChildren.length
                    ? mergedChildren
                    : schemaChildren
    
        };
    
    }    

    // function mergeField({

    //     schemaField = {},

    //     layoutField = {}

    // }){

    //     return {

    //         ...schemaField,

    //         ...layoutField,

    //         fields:

    //             layoutField.fields ??

    //             schemaField.fields ??

    //             []

    //     };

    // }

    // ==================================================
    // VALUE
    // ==================================================

    function resolveValue({

        record,
        campo
    
    }){
    
        if(
            record == null ||
            !campo
        ){
    
            return null;
    
        }
    
        //--------------------------------------------------
        // VALOR ORIGINAL
        //--------------------------------------------------
    
        if(
            Object.prototype.hasOwnProperty.call(
                record,
                campo
            )
        ){
    
            return clone(
                record[campo]
            );
    
        }
    
        //--------------------------------------------------
        // CAMPO ANIDADO
        //--------------------------------------------------
    
        const parts =
            String(campo).split(".");
    
        let value =
            record;
    
        for(const part of parts){
    
            value =
                value?.[part];
    
            if(value === undefined){
    
                return null;
    
            }
    
        }
    
        return clone(
            value
        );
    
    }
    // ==================================================
    // CLONE
    // ==================================================

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

    function resolveResolved({

        record,
        campo
    
    }){
    
        if(
            !record ||
            !record.__resolved ||
            !campo
        ){
    
            return null;
    
        }
    
        return clone(
            record.__resolved[campo]
        ) ?? null;
    
    }

    // ==================================================
    // INIT
    // ==================================================

    log(
        `${FILE} inicializado correctamente.`
    );

})();