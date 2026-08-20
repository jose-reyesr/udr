
// ======================================================
// 📁 js/core/pathResolver.js
// ======================================================
// UNIVERSAL DECLARATIVE RUNTIME
// Runtime path engine
//
// RESPONSABILIDADES:
//
// 1) Navegación de objetos
// 2) Manipulación de rutas físicas
// 3) Resolución relativa
//
// NO conoce:
//
// - dataSource
// - schemas
// - layouts
// - renderers
// - router
// - navigation
//
// ======================================================

(function(){

    const FILE = "pathResolver.js";

    const error =
        (...a)=>window.logger?.error?.(
            FILE,...a
        );

    let BASE_PATH = "";

    let CURRENT = {

        file:"",
        path:"",
        fullPath:"",
        directory:""

    };

    window.pathResolver={

        getByPath,
        setByPath,
        removeByPath,
        exists,

        normalize,
        join,
        split,

        resolve,
        resolveRelative,
        resolveAbsolute,
        resolvePathAndFile,

        setBasePath,
        getBasePath,

        setCurrent,
        getCurrent,

        getDirectory,
        getFileName,
        getExtension,

        isAbsolute,
        isRelative,
        isHTML,
        isJSON,

        prettify
    };

    //==================================================
    // OBJECT
    //==================================================

    function getByPath(
        obj,
        path,
        fallback=null
    ){

        try{

            if(
                obj===undefined ||
                obj===null
            ){
                return fallback;
            }

            if(
                !path ||
                path==="."
            ){
                return obj;
            }

            path=String(path)

                .replace(/\[(\w+)\]/g,".$1")
                .replace(/^\./,"");

            const parts=
                path
                .split(".")
                .filter(Boolean);

            let current=obj;

            for(
                const part
                of parts
            ){

                if(
                    current===null ||
                    current===undefined
                ){
                    return fallback;
                }

                current=
                    current[part];
            }

            return (
                current===undefined
                    ? fallback
                    : current
            );

        }
        catch(e){

            error(
                "getByPath",
                e
            );

            return fallback;
        }
    }

    function setByPath(
        obj,
        path,
        value
    ){

        if(
            !obj ||
            !path
        ){
            return obj;
        }

        const parts=
            String(path)
            .replace(/\[(\d+)\]/g,".$1")
            .split(".")
            .filter(Boolean);

        let current=obj;

        parts.forEach(
            (
                part,
                index
            )=>{

                const last=
                    index===parts.length-1;

                if(last){

                    current[
                        part
                    ]=value;

                    return;
                }

                if(

                    current[
                        part
                    ]===undefined

                ){

                    current[
                        part
                    ]={};
                }

                current=
                    current[
                        part
                    ];
            }
        );

        return obj;
    }

    function removeByPath(
        obj,
        path
    ){

        if(
            !obj ||
            !path
        ){
            return obj;
        }

        const parts=
            path
            .split(".");

        const last=
            parts.pop();

        const parent=
            getByPath(
                obj,
                parts.join(".")
            );

        if(
            parent &&
            last in parent
        ){

            delete parent[
                last
            ];
        }

        return obj;
    }

    function exists(
        obj,
        path
    ){

        return (

            getByPath(

                obj,
                path,
                undefined

            )

            !==

            undefined

        );
    }

    //==================================================
    // PATHS
    //==================================================

    function normalize(
        path=""
    ){

        return String(path)

            .replace(/\\/g,"/")
            .replace(/\/+/g,"/")
            .replace(/^\.\/+/,"")
            .replace(/\/$/,"")
            .trim();
    }

    function join(){

        return normalize(

            Array
            .from(arguments)
            .filter(Boolean)
            .join("/")

        );
    }

    function split(
        path=""
    ){

        return normalize(path)

            .split("/")
            .filter(Boolean);
    }

    function resolve(
        path="",
        file=""
    ){

        path=
            normalize(path);

        file=
            normalize(file);

        if(
            isAbsolute(file)
        ){

            return file;
        }

        if(
            isRelative(file)
        ){

            return resolveRelative(

                path ||
                CURRENT.directory ||
                BASE_PATH,

                file

            );
        }

        if(
            !path
        ){

            path=

                CURRENT.path ||

                BASE_PATH ||

                "";
        }

        return join(
            path,
            file
        );
    }

    function resolveRelative(
        base,
        relative
    ){

        base=
            normalize(base);

        relative=
            normalize(relative);

        if(

            isHTML(base) ||

            isJSON(base)

        ){

            base=
                getDirectory(
                    base
                );
        }

        const stack=
            split(base);

        const parts=
            split(relative);

        parts.forEach(
            part=>{

                if(
                    part==="."
                ){
                    return;
                }

                if(
                    part===".."
                ){

                    stack.pop();

                    return;
                }

                stack.push(
                    part
                );
            }
        );

        return normalize(

            stack.join("/")

        );
    }

    function resolveAbsolute(
        path=""
    ){

        return normalize(
            path
        );
    }

    function resolvePathAndFile(

        path="",
        file=""

    ){

        const fullPath=
            resolve(
                path,
                file
            );

        return {

            path:
                getDirectory(
                    fullPath
                ),

            file:
                getFileName(
                    fullPath
                ),

            fullPath
        };
    }

    //==================================================
    // CONTEXT
    //==================================================

    function setBasePath(
        path=""
    ){

        BASE_PATH=
            normalize(path);
    }

    function getBasePath(){

        return BASE_PATH;
    }

    function setCurrent(

        file="",
        path=""

    ){

        CURRENT.file=
            normalize(file);

        CURRENT.path=
            normalize(path);

        CURRENT.fullPath=

            resolve(

                CURRENT.path,
                CURRENT.file

            );

        CURRENT.directory=

            getDirectory(

                CURRENT.fullPath

            );
    }

    function getCurrent(){

        return {

            ...CURRENT

        };
    }

    //==================================================
    // HELPERS
    //==================================================

    function getDirectory(
        path=""
    ){

        const p=
            split(path);

        p.pop();

        return p.join("/");
    }

    function getFileName(
        path=""
    ){

        return (
            split(path).pop()
            ||
            ""
        );
    }

    function getExtension(
        path=""
    ){

        const f=
            getFileName(path);

        const p=
            f.split(".");

        return p.length>1
            ? p.pop()
            : "";
    }

    function isAbsolute(
        path=""
    ){

        return (

            path.startsWith("/") ||

            path.startsWith("http://") ||

            path.startsWith("https://")

        );
    }

    function isRelative(
        path=""
    ){

        return (

            path.startsWith("./") ||

            path.startsWith("../")

        );
    }

    function isHTML(
        path=""
    ){

        return (

            path.endsWith(".html") ||

            path.endsWith(".htm")

        );
    }

    function isJSON(
        path=""
    ){

        return path.endsWith(
            ".json"
        );
    }

    function prettify(
        txt=""
    ){

        return String(txt)

            .replace(
                /[_\-]/g,
                " "
            )

            .replace(
                /\b\w/g,
                c=>c.toUpperCase()
            );
    }

})();
