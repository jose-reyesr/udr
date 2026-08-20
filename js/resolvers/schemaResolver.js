// ======================================================
// 📁 js/resolvers/schemaResolver.js
// ======================================================
// UNIVERSAL DECLARATIVE RUNTIME
//
// RESPONSABILIDAD ÚNICA
// - Resolver schemas.
//
// SOPORTA
// - Schemas locales (meta.schemas)
// - Schemas externos
//
// NO HACE
// - cache
// - layouts
// - datasets
// - render
// ======================================================

(function(){

    const FILE = "schemaResolver.js";

    const log   = (...a)=>window.logger?.info?.(FILE,...a);
    const error = (...a)=>window.logger?.error?.(FILE,...a);

    // ==================================================
    // EXPORTS
    // ==================================================

    window.schemaResolver = {

        execute,
        getSchema,
        loadExternalSchema,
        normalizeField

    };

    async function execute({

        context = {}
    
    } = {}){
    
        try{
    
            context.definition = getSchema({
    
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
    // GET SCHEMA
    // ==================================================

    async function getSchema({

        name = "",
        source = null,
        context = {}

    } = {}){

        try{

            if(!name){
                return [];
            }

            //------------------------------------------------
            // LOCAL SCHEMA
            //------------------------------------------------

            if(!source){

                const schema =

                    context
                    ?.root
                    ?.meta
                    ?.schemas
                    ?.[name];

                return Array.isArray(schema)

                    ? schema.map(normalizeField)

                    : [];

            }

            //------------------------------------------------
            // EXTERNAL SCHEMA
            //------------------------------------------------

            return await loadExternalSchema({

                name,
                source

            });

        }
        catch(e){

            error(
                "getSchema:",
                e
            );

            return [];

        }

    }

    // ==================================================
    // LOAD EXTERNAL SCHEMA
    // ==================================================

    async function loadExternalSchema({

        name = "",
        source = {}

    } = {}){

        try{

            if(!source.file){
                return [];
            }

            //------------------------------------------------
            // LOAD DOCUMENT
            //------------------------------------------------

            const json =
                await window.runtime
                ?.execute({

                    file: source.file,
                    path: source.path,
                    context: {},
                    steps: ["loadJson"]

                });

            if(!json?.root){
                return [];
            }

            //------------------------------------------------
            // EXTRACT SCHEMA
            //------------------------------------------------

            const schema =
                await window.dataResolver
                ?.resolve({

                    root: json.root,
                    jsonPath: "meta.schemas." + name

                });

            return Array.isArray(schema)

                ? schema.map(normalizeField)

                : [];

        }
        catch(e){

            error(
                "loadExternalSchema:",
                e
            );

            return [];

        }

    }

// ==================================================
// CREATE EMPTY ITEM
// ==================================================

// ==================================================
// CREATE EMPTY ITEM
// ==================================================

function createEmptyItem({

    schema = []

} = {}){

    try{

        if(!Array.isArray(schema)){

            return {};

        }

        const record = {};

        for(const field of schema){

            if(!field){
                continue;
            }

            const campo =
                String(
                    field.campo ||
                    field.field ||
                    ""
                ).trim();

            if(!campo){
                continue;
            }

            record[campo] =
                createEmptyValue(field);

        }

        return record;

    }
    catch(e){

        error(
            "createEmptyItem:",
            e
        );

        return {};

    }

}

// ==================================================
// CREATE EMPTY VALUE
// ==================================================

function createEmptyValue(

    field = {}

){

    try{

        const tipo =
            String(
                field.tipo ||
                field.type ||
                "text"
            )
            .toLowerCase()
            .trim();

        //--------------------------------------------------
        // OBJECT
        //--------------------------------------------------

        if(tipo === "object"){

            const object = {};

            //------------------------------------------------
            // Si el schema define fields internos
            //------------------------------------------------

            if(
                Array.isArray(
                    field.fields
                )
            ){

                for(
                    const child of field.fields
                ){

                    const campo =
                        String(
                            child.campo ||
                            child.field ||
                            ""
                        ).trim();

                    if(!campo){
                        continue;
                    }

                    object[campo] =
                        createEmptyValue(
                            child
                        );

                }

            }
            else{

                //------------------------------------------------
                // Copiar estructura declarativa del schema
                //------------------------------------------------

                for(
                    const key of Object.keys(field)
                ){

                    if(
                        key === "campo" ||
                        key === "field" ||
                        key === "tipo" ||
                        key === "type" ||
                        key === "label" ||
                        key === "fields"
                    ){

                        continue;

                    }

                    object[key] =
                        createEmptyStructure(
                            field[key]
                        );

                }

            }

            return object;

        }

        //--------------------------------------------------
        // ARRAY
        //--------------------------------------------------

        if(tipo === "array"){

            return [];

        }

        //--------------------------------------------------
        // BOOLEAN
        //--------------------------------------------------

        if(tipo === "boolean"){

            return false;

        }

        //--------------------------------------------------
        // NUMBER
        //--------------------------------------------------

        if(
            tipo === "number" ||
            tipo === "integer"
        ){

            return "";

        }

        //--------------------------------------------------
        // DEFAULT
        //--------------------------------------------------

        return "";

    }
    catch(e){

        error(
            "createEmptyValue:",
            e
        );

        return "";

    }

}

// ==================================================
// CREATE EMPTY STRUCTURE
// ==================================================

function createEmptyStructure(

    value

){

    try{

        if(
            value === null ||
            value === undefined
        ){

            return "";

        }

        //--------------------------------------------------
        // ARRAY
        //--------------------------------------------------

        if(Array.isArray(value)){

            return [];

        }

        //--------------------------------------------------
        // OBJECT
        //--------------------------------------------------

        if(
            typeof value ===
            "object"
        ){

            const result = {};

            for(
                const key of Object.keys(value)
            ){

                result[key] =
                    createEmptyStructure(
                        value[key]
                    );

            }

            return result;

        }

        //--------------------------------------------------
        // PRIMITIVO
        //--------------------------------------------------

        return "";

    }
    catch(e){

        error(
            "createEmptyStructure:",
            e
        );

        return "";

    }

}

    // ==================================================
    // NORMALIZE FIELD
    // ==================================================

    function normalizeField(field = {}){

        try{
    
            if(typeof field === "string"){
    
                return {
    
                    campo: field,
                    tipo: "text"
    
                };
    
            }
    
            const normalized = {
    
                ...field,
    
                campo: String(
                    field.campo ||
                    field.field ||
                    ""
                ).trim(),
    
                tipo: String(
                    field.tipo ||
                    field.type ||
                    "text"
                ).toLowerCase().trim()
    
            };
    
            //--------------------------------------------------
            // SOLO SI EL SCHEMA DEFINE FIELDS
            //--------------------------------------------------
    
            if(Array.isArray(field.fields)){
    
                normalized.fields =
                    field.fields.map(normalizeField);
    
            }
    
            return normalized;
    
        }
        catch(e){
    
            error(
                "normalizeField:",
                e
            );
    
            return {
    
                campo: "",
                tipo: "text"
    
            };
    
        }
    
    }
        

    
    // ==================================================

    log(
        "schemaResolver inicializado."
    );

})();