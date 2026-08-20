
// ======================================================
// 📁 js/layouts/relationTreeLayout.js
// ======================================================
// UNIVERSAL DECLARATIVE RUNTIME
//
// RELATION TREE LAYOUT
//
// RESPONSABILIDAD
// - Renderizar relaciones como un árbol.
// - Interpretar registros de relaciones.
// - Mostrar los nodos y sus relaciones.
//
// NO HACE
// - Resolver datasets.
// - Resolver relaciones externas.
// - Resolver schemas.
// - Construir URLs.
// - Cargar JSON.
//
// El dataset ya debe haber sido preparado por el runtime.
// ======================================================

(function(){

    const FILE = "relationTreeLayout.js";

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

        render

    };

    window.tree = api;

    // ==================================================
    // RENDER
    // ==================================================

    async function render({

        container,

        section = {},

        context = {}

    } = {}){

        try{

            if(!container){

                throw new Error(
                    "relationTreeLayout: container requerido."
                );

            }


            //--------------------------------------------------
            // LIMPIAR CONTENEDOR
            //--------------------------------------------------

            container.innerHTML = "";


            //--------------------------------------------------
            // DATASET
            //--------------------------------------------------

            const dataset =
                getDataset({
                    section,
                    context
                });


            if(!Array.isArray(dataset)){

                warn(
                    "Dataset inválido:",
                    dataset
                );

                return;

            }


            //--------------------------------------------------
            // DEBUG
            //--------------------------------------------------

            debug(
                "dataset:",
                dataset
            );


            //--------------------------------------------------
            // CONTENEDOR DEL TREE
            //--------------------------------------------------

            const treeContainer =
                document.createElement(
                    "div"
                );

            treeContainer.className =
                "relation-tree";


            container.appendChild(
                treeContainer
            );


            //--------------------------------------------------
            // PREPARAR TREE
            //--------------------------------------------------

            const tree =
                prepareTree({

                    dataset

                });


            if(!tree){

                warn(
                    "No fue posible construir el árbol."
                );

                return;

            }


            //--------------------------------------------------
            // RENDER TREE
            //--------------------------------------------------

            renderPreparedTree({

                container:
                    treeContainer,

                tree

            });


            //--------------------------------------------------
            // DEBUG
            //--------------------------------------------------

            debug(
                "tree:",
                tree
            );

        }
        catch(e){

            error(
                "render:",
                e
            );

            throw e;

        }

    }


    // ==================================================
    // GET DATASET
    // ==================================================

    function getDataset({

        section = {},

        context = {}

    } = {}){

        //--------------------------------------------------
        // El nombre real del dataset NO se define
        // directamente en relationTreeLayout.
        //
        // definition ya determinó qué dataset corresponde
        // y runtime lo dejó disponible en context.datasets.
        //--------------------------------------------------

        const dataSource =
            section.dataSource;


        if(!dataSource){

            warn(
                "No se especificó dataSource en la sección."
            );

            return [];

        }


        //--------------------------------------------------
        // DATASET RESUELTO
        //--------------------------------------------------

        const dataset =
            context
                ?.datasets
                ?.[dataSource]
                ?.value;


        if(!Array.isArray(dataset)){

            warn(
                "Dataset no encontrado:",
                dataSource
            );

            return [];

        }


        return dataset;

    }

    // ==================================================
    // FIND ROOT
    // ==================================================

    function findRoot({

        dataset = []

    } = {}){

        const roots =
            dataset.filter(
                record =>
                    record?.nodo_raiz === true
            );


        //--------------------------------------------------
        // VALIDAR RAÍZ
        //--------------------------------------------------

        if(roots.length === 0){

            warn(
                "No se encontró nodo raíz."
            );

            return null;

        }


        if(roots.length > 1){

            throw new Error(
                "relationTreeLayout: existe más de un nodo raíz."
            );

        }


        return roots[0];

    }


    // ==================================================
    // GET ROOT NODE
    // ==================================================

    function getRootNode({

        root = null

    } = {}){

        if(!root){

            return null;

        }


        //--------------------------------------------------
        // La raíz puede estar en cualquiera de los dos
        // extremos de la relación.
        //
        // Para el registro marcado como nodo_raiz,
        // normalmente utilizaremos persona1.
        //--------------------------------------------------

        const id =
            root.idpersona1;


        const nombre =
            root.nombre1;


        if(!id){

            warn(
                "El nodo raíz no tiene idpersona1:",
                root
            );

            return null;

        }


        return {

            id,

            nombre,

            depth: 0,

            relation: null,

            relationInverse: null,

            source: root,

            children: []

        };

    }


    // ==================================================
    // BUILD TREE
    // ==================================================

    function buildTree({

        dataset = [],
    
        rootNode = null,
    
        maxDepth = 0
    
    } = {}){
    
        if(!rootNode){
    
            return null;
    
        }
    
    
        //--------------------------------------------------
        // ÍNDICE
        //--------------------------------------------------
    
        const index =
            new Map();
    
    
        for(const record of dataset){
    
            if(!record){
    
                continue;
    
            }
    
    
            const id1 =
                record.idpersona1;
    
    
            if(!id1){
    
                continue;
    
            }
    
    
            if(!index.has(id1)){
    
                index.set(
                    id1,
                    []
                );
    
            }
    
    
            index
                .get(id1)
                .push(record);
    
        }
    
    
        //--------------------------------------------------
        // RECORRIDO
        //--------------------------------------------------
    
        const visited =
            new Set();
    
    
        visited.add(
            rootNode.id
        );
    
    
        walk(
            rootNode,
            0
        );
    
    
        //--------------------------------------------------
        // WALK
        //--------------------------------------------------
    
        function walk(
            node,
            level
        ){
    
            if(
                level >= maxDepth
            ){
    
                return;
    
            }
    
    
            const relations =
                index.get(
                    node.id
                )
                ||
                [];
    
    
            for(
                const record
                of relations
            ){
    
                const childId =
                    record.idpersona2;
    
    
                const childName =
                    record.nombre2;
    
    
                if(!childId){
    
                    continue;
    
                }
    
// ==================================================
// DEBUG RELACION
// ==================================================

// console.log(
//     "========== RELACION ==========",
//     {
//         padre:
//             node.nombre,

//         hijo:
//             childName,

//         tipo_relacion:
//             record.tipo_relacion,

//         record:
//             record
//     }
// );

    
                //--------------------------------------------------
                // EVITAR CICLOS
                //--------------------------------------------------
    
                if(
                    visited.has(
                        childId
                    )
                ){
    
                    continue;
    
                }
    
    
                //--------------------------------------------------
                // CREAR HIJO
                //--------------------------------------------------
    
                // console.log(
                //     "========== BUILD RELATION ==========",
                //     {
                //         parentId:
                //             node.id,
                
                //         childId:
                //             record.idpersona2,
                
                //         childName:
                //             record.nombre2,
                
                //         keys:
                //             Object.keys(record),
                
                //         record:
                //             record
                //     }
                // );

                const child = {
                
                    id:
                        childId,
                
                    nombre:
                        childName,
                
                    depth:
                        level + 1,
                
                    relation:
                        record.relacion_inversa,
                
                    relationInverse:
                        null,
                
                    source:
                        record,
                
                    children:
                        []
                
                };    
    
                node.children.push(
                    child
                );
    
    
                visited.add(
                    childId
                );
    
    
                //--------------------------------------------------
                // CONTINUAR
                //--------------------------------------------------
    
                walk(
                    child,
                    level + 1
                );
    
            }
    
        }
    
    
        return rootNode;
    
    }

    // ==================================================
    // RENDER TREE
    // ==================================================

    function renderTree({

        container = null,

        tree = null

    } = {}){

        if(!container){

            return;

        }


        if(!tree){

            warn(
                "No existe árbol para renderizar."
            );

            return;

        }


        //--------------------------------------------------
        // CONTENEDOR PRINCIPAL
        //--------------------------------------------------

        const rootElement =
            document.createElement(
                "div"
            );

        rootElement.className =
            "relation-tree-node";


        container.appendChild(
            rootElement
        );


        //--------------------------------------------------
        // RENDER ROOT
        //--------------------------------------------------

        renderNode({

            container:
                rootElement,

            node:
                tree,

            isRoot:
                true

        });

    }


    // ==================================================
    // RENDER NODE
    // ==================================================

// ==================================================
// RENDER NODE
// ==================================================

function renderNode({

    container = null,

    node = null,

    isRoot = false

} = {}){

    if(
        !container ||
        !node
    ){

        return;

    }


    //--------------------------------------------------
    // NODO
    //--------------------------------------------------

    const nodeElement =
        document.createElement(
            "div"
        );

    nodeElement.className =
        isRoot
            ? "relation-tree-root"
            : "relation-tree-item";


    //--------------------------------------------------
    // NOMBRE
    //--------------------------------------------------

    const nameElement =
        document.createElement(
            "div"
        );

    nameElement.className =
        "relation-tree-name";


        const name =
        node.nombre
        ??
        node.id;
    
    
    nameElement.textContent =
        isRoot
            ? name
            : node.relation
                ? `${name} (${node.relation})`
                : name;


    nodeElement.appendChild(
        nameElement
    );


    //--------------------------------------------------
    // AGREGAR NODO
    //--------------------------------------------------

    container.appendChild(
        nodeElement
    );


    //--------------------------------------------------
    // HIJOS
    //--------------------------------------------------

    renderChildren({

        container:
            nodeElement,

        node

    });

}


    // ==================================================
    // RENDER CHILDREN
    // ==================================================

// ==================================================
// RENDER CHILDREN
// ==================================================

function renderChildren({

    container = null,

    node = null

} = {}){

    if(
        !container ||
        !node ||
        !Array.isArray(
            node.children
        )
    ){

        return;

    }


    if(
        node.children.length === 0
    ){

        return;

    }


    //--------------------------------------------------
    // CONTENEDOR DE HIJOS
    //--------------------------------------------------

    const childrenElement =
        document.createElement(
            "div"
        );

    childrenElement.className =
        "relation-tree-children";


    container.appendChild(
        childrenElement
    );


    //--------------------------------------------------
    // RENDER CHILDREN
    //--------------------------------------------------

    for(
        const child
        of node.children
    ){
    
        // console.log(
        //     "TREE CHILD:",
        //     child.nombre,
        //     "RELATION:",
        //     child.relation
        // );
    
        const relationElement =
            document.createElement(
                "div"
            );
    
        // relationElement.textContent =
        //     "RELACION => " +
        //     String(
        //         child.relation ??
        //         "SIN RELACION"
        //     );
    
        // relationElement.style.display = "block";
        // relationElement.style.background = "yellow";
        // relationElement.style.color = "red";
        // relationElement.style.fontSize = "18px";
        // relationElement.style.fontWeight = "bold";
        // relationElement.style.padding = "5px";
    
        childrenElement.appendChild(
            relationElement
        );
    
        renderNode({
    
            container:
                childrenElement,
    
            node:
                child,
    
            isRoot:
                false
    
        });
    
    }
}

    // ==================================================
    // PREPARE TREE
    // ==================================================

    function prepareTree({

        dataset = []

    } = {}){

        //--------------------------------------------------
        // BUSCAR RAÍZ
        //--------------------------------------------------

        const root =
            findRoot({
                dataset
            });


        if(!root){

            return null;

        }


        //--------------------------------------------------
        // OBTENER NODO RAÍZ
        //--------------------------------------------------

        const rootNode =
            getRootNode({
                root
            });


        if(!rootNode){

            return null;

        }


        //--------------------------------------------------
        // PROFUNDIDAD
        //--------------------------------------------------

        const depth =
            getDepth({
                root
            });


        //--------------------------------------------------
        // CONSTRUIR ÁRBOL
        //--------------------------------------------------

        return buildTree({

            dataset,

            rootNode,

            maxDepth:
                depth

        });

    }


    // ==================================================
    // GET DEPTH
    // ==================================================

    function getDepth({

        root = null

    } = {}){

        if(!root){

            return 0;

        }


        const depth =
            Number(
                root.depth
            );


        if(
            !Number.isFinite(depth) ||
            depth < 0
        ){

            warn(
                "Depth inválido. Se utilizará 0:",
                root.depth
            );

            return 0;

        }


        return Math.floor(
            depth
        );

    }


    // ==================================================
    // RENDER PREPARED TREE
    // ==================================================

    function renderPreparedTree({

        container = null,

        tree = null

    } = {}){

        if(!container){

            return;

        }


        if(!tree){

            warn(
                "No existe árbol preparado."
            );

            return;

        }


        //--------------------------------------------------
        // RENDER
        //--------------------------------------------------

        renderTree({

            container,

            tree

        });

    }


    log("✅ relationTreeLayout registrado correctamente");

})();
