============================================================
PROYECTO: UNIVERSAL DECLARATIVE RUNTIME (UDR)
============================================================

Autor: Jose
Versión de referencia: UDR 4.x / 4.0.1

============================================================
1. OBJETIVO GENERAL
============================================================

UDR (Universal Declarative Runtime) es un runtime completamente
declarativo basado en JSON.

El objetivo es poder construir aplicaciones completas mediante
JSON declarativos, sin escribir lógica específica para cada tipo
de entidad.

El runtime NO debe contener lógica especial para:

- peliculas
- series
- personas
- libros
- comics
- musica
- clientes
- productos
- empleados
- etc.

El runtime solamente interpreta definiciones declarativas.

La misma infraestructura debe poder trabajar con cualquier
documento JSON que respete el contrato del sistema.

Principio fundamental:

    JSON declarativo
          ↓
       Runtime
          ↓
    resolvers
          ↓
      layout
          ↓
     renderers
          ↓
        HTML

No debe existir código del runtime del tipo:

    if entidad == "peliculas"
    if entidad == "clientes"
    if entidad == "libros"

============================================================
2. PRINCIPIOS ARQUITECTÓNICOS
============================================================

1. El runtime interpreta.
2. Los JSON contienen la definición de la aplicación.
3. No existen excepciones específicas para entidades.
4. Cada módulo tiene una responsabilidad única.
5. Los resolvers preparan información.
6. Los layouts renderizan.
7. Los fieldRenderers renderizan campos.
8. Un layout no debe resolver datasets ni schemas.
9. Un layout no debe resolver relaciones.
10. Un layout no debe contener lógica de negocio.
11. El pipeline prepara el contexto antes de renderizar.
12. Se debe evitar duplicación de lógica entre layouts.
13. Se debe mantener el runtime pequeño y genérico.
14. Todo debe funcionar mediante archivos JS, HTML, CSS y JSON.
15. No se utilizará Node ni software adicional para ejecutar la aplicación.

============================================================
3. ESTRUCTURA CONCEPTUAL DEL DOCUMENTO JSON
============================================================

La estructura evolucionó durante el proyecto.

Actualmente debe distinguirse claramente entre:

    metadata
    definition
    data
    layout
    navigation_header

El principio importante es:

METADATA
    contiene definiciones y metadatos del documento/campos.

DATA
    contiene los valores reales.

LAYOUT
    contiene la definición visual.

NAVIGATION_HEADER
    contiene la navegación asociada al documento.

DEFINITION
    contiene definiciones estructurales/datasets cuando
    corresponda al contrato utilizado por el runtime.

No se debe mezclar la definición de un campo con su valor.

Ejemplo conceptual:

metadata:
{
    ...
    catalogo: {
        tipos_media: {
            tipo: "text",
            relation: {
                ...
            },
            selector: {
                ui: "selector",
                mode: "multiple"
            }
        }
    }
}

data:
[
    {
        tipos_media: "1"
    }
]

La relación pertenece a METADATA.

El valor "1" pertenece a DATA.

============================================================
4. METADATA
============================================================

Metadata contiene información declarativa.

Entre otras cosas puede definir:

- nombre
- descripción
- versión
- fechas
- usuario
- schemas
- definición de campos
- tipo
- renderer
- relation
- selector
- propiedades de campos

Ejemplo:

{
    "campo": "tipos_media",
    "label": "Tipos Media",
    "tipo": "text",
    "renderer": "textFieldRenderer",
    "relation": {
        "source": {
            "file": "tipos_media.json",
            "path": "data/catalogos"
        },
        "where": {
            "id": "{tipos_media}"
        }
    },
    "selector": {
        "ui": "selector",
        "mode": "multiple"
    }
}

IMPORTANTE:

relation NO es un valor de DATA.

relation es una instrucción declarativa que indica cómo resolver
el valor.

============================================================
5. DATA
============================================================

DATA contiene exclusivamente los datos del documento.

Ejemplo:

{
    "titulo": "Películas",
    "descripcion": "Explorar catálogo de películas",
    "tipos_media": "1"
}

El valor:

    tipos_media: "1"

es el dato original.

El runtime puede generar información resuelta adicional, pero
no debe destruir el valor original.

============================================================
6. RELACIONES
============================================================

Una relación permite que un campo de un documento obtenga
información de otro JSON.

Ejemplo:

metadata:
{
    "tipos_media": {
        "tipo": "text",
        "relation": {
            "source": {
                "file": "tipos_media.json",
                "path": "data/catalogos"
            },
            "where": {
                "id": "{tipos_media}"
            }
        }
    }
}

data:

{
    "tipos_media": "1"
}

El valor original sigue siendo:

    "1"

pero relationResolver obtiene el registro relacionado.

Por ejemplo:

{
    "id": "1",
    "value": "Película"
}

La información relacionada se guarda en una estructura de
resolución, conceptualmente:

record.__resolved

Ejemplo:

record:
{
    tipos_media: "1",
    __resolved: {
        tipos_media: {
            ...
        }
    }
}

El objetivo es que:

DATA
    conserve el valor original

__resolved
    conserve el resultado de la relación

============================================================
7. RELATIONRESOLVER
============================================================

Responsabilidad:

Resolver relaciones declaradas en metadata.

NO debe:

- renderizar
- generar HTML
- modificar layouts
- decidir cómo se muestra una relación
- crear controles visuales
- abrir selectorLayout

Su función termina cuando la información relacionada está
disponible para las siguientes etapas.

El resultado debe quedar disponible para layoutResolver.

Ejemplo conceptual:

DATA:

tipos_media = "1"

relationResolver:

    busca tipos_media.json
    busca data/catalogos
    aplica where
    encuentra id = 1
    agrega resultado a __resolved

Resultado:

record:
{
    tipos_media: "1",

    __resolved: {
        tipos_media: {
            ...
        }
    }
}

============================================================
8. SCHEMA
============================================================

El schema define la estructura de los campos.

El schema está un nivel por encima de los valores.

Puede definir:

- campo
- label
- tipo
- renderer
- fields
- propiedades del campo
- relación
- selector

Los renderers pueden declararse en schema/metadata.

El layout no debería tener que conocer cómo resolver el
renderer.

Ejemplo:

{
    "campo": "titulo",
    "label": "Título",
    "tipo": "text",
    "renderer": "textFieldRenderer"
}

============================================================
9. _META
============================================================

Existe un schema base llamado conceptualmente:

    _meta

Su función es definir la estructura válida de los schemas.

Ejemplo conceptual:

_meta:

{
    campo,
    label,
    tipo,
    renderer,
    ...
}

La intención original era tener:

1. validar schema contra _meta
2. validar dataset contra schema
3. detener ejecución si la validación falla

Existe el concepto de:

    ValidatorDefinitions
    ValidatorSchemas

Actualmente validateschema fue retirado temporalmente
del pipeline para poder continuar validando el funcionamiento
del resto de la arquitectura.

PENDIENTE:

Reintegrar validateschema cuando el contrato definitivo
de metadata/relation/selector quede estabilizado.

============================================================
10. DATASET
============================================================

Los datasets son objetos de primera clase dentro del contexto.

Conceptualmente pueden tener:

{
    id,
    path,
    schema,
    layout,
    container
}

El runtime trabaja con:

context.datasets

Ejemplo conceptual:

context.datasets = {

    data: ...,

    schema: ...,

    layout: ...

}

Los datasets pueden ser procesados una sola vez.

Existe la idea de marcar datasets procesados para evitar
duplicar procesamiento.

============================================================
11. PIPELINE PRINCIPAL
============================================================

El pipeline conceptual actual es:

runtime
    ↓
loadJson
    ↓
resolveDataSource
    ↓
resolveRelations
    ↓
resolveSchema
    ↓
layoutResolver
    ↓
layoutRenderer
    ↓
fieldRenderer

En algunas versiones se manejaron también:

resolveMeta
resolveNavigation
renderNavigation
QueryResolver

La regla importante es que cada paso prepara información
para el siguiente.

============================================================
12. RUNTIME
============================================================

runtime.js es el orquestador principal.

No debe contener lógica específica de entidades.

Su responsabilidad es:

- recibir archivo
- interpretar profile
- cargar JSON
- construir contexto
- ejecutar pipeline
- llamar resolvers
- seleccionar/renderizar layout
- ejecutar navegación cuando corresponde

Se sustituyó conceptualmente:

window.router

por:

window.runtime

El runtime debe poder ejecutar distintos profiles.

============================================================
13. PROFILES
============================================================

Los profiles determinan el comportamiento del pipeline.

Entre los perfiles importantes:

    runtime
    selector
    update

PROFILE RUNTIME
----------------

Carga y muestra el documento normalmente.

PROFILE SELECTOR
-----------------

Ejecuta el pipeline necesario para llegar a una pantalla
selectorLayout.

IMPORTANTE:

El profile selector NO actualiza información.

El selector únicamente permite seleccionar.

Mientras el usuario no presione:

    Guardar
    OK

no debe ejecutarse el update.

PROFILE UPDATE
--------------

Se ejecuta solamente después de que el selector haya terminado
y haya confirmado la selección.

El update debe leer update.json y aplicar la información
seleccionada.

============================================================
14. LAYOUTRESOLVER
============================================================

layoutResolver tiene una responsabilidad muy importante:

Preparar completamente el layout antes de entregarlo
al layout visual.

El layoutRenderer/layouts NO deben repetir lógica de:

- buscar datasets
- buscar schemas
- resolver relaciones
- resolver valores
- construir fields
- recorrer records para resolver campos

layoutResolver hace eso.

Conceptualmente:

layout original
      ↓
layoutResolver
      ↓
layout resuelto
      ↓
layoutRenderer
      ↓
layout específico
      ↓
fieldRenderer

============================================================
15. CONTRATO DEL LAYOUT RESUELTO
============================================================

Un componente de layout puede recibir algo como:

{
    component: "list",

    items: [

        {
            value: record,

            navigation: ...,

            fields: [

                {
                    campo: "...",
                    value: "...",
                    __resolved: ...,
                    resolvedValue: ...,
                    fields: [...]
                }

            ]
        }

    ]
}

El layout solamente consume ese resultado.

============================================================
16. resolveField()
============================================================

resolveField() debe:

1. encontrar schemaField
2. hacer merge entre schemaField y layoutField
3. obtener el valor original
4. obtener la información resuelta
5. conservar ambas cosas
6. resolver objetos hijos
7. resolver arrays hijos
8. devolver el field completamente preparado

Debe existir una separación clara:

field.value

    = valor original de DATA

field.__resolved

    = información obtenida por relationResolver

field.resolvedValue

    = representación conveniente del resultado resuelto,
      cuando sea necesaria

IMPORTANTE:

No reemplazar indiscriminadamente:

    field.value

con:

    field.__resolved

porque el valor original debe permanecer disponible.

============================================================
17. resolveValue()
============================================================

resolveValue obtiene primero el valor real del record.

El dato original debe conservarse.

La relación no debe sustituirlo automáticamente.

============================================================
18. resolveResolved()
============================================================

resolveResolved obtiene:

record.__resolved[campo]

cuando existe.

Debe devolver null cuando no existe.

============================================================
19. OBJECT FIELDS
============================================================

Si un field contiene un objeto, layoutResolver debe preparar
sus campos hijos.

Ejemplo:

source:
{
    file: "...",
    path: "..."
}

Debe poder generar:

field.fields = [...]

para que el renderer no tenga que volver a resolver
la estructura.

============================================================
20. ARRAY FIELDS
============================================================

Si un campo contiene un array:

field.items = [

    {
        value: ...,
        navigation: ...,
        fields: [...]
    }

]

Los elementos deben quedar preparados por layoutResolver.

============================================================
21. MERGE FIELD
============================================================

El merge debe combinar:

schemaField

con:

layoutField

El layout puede modificar propiedades visuales declaradas,
pero el schema sigue proporcionando la definición estructural.

Los campos hijos deben resolverse recursivamente.

============================================================
22. LAYOUTRENDERER
============================================================

layoutRenderer es el orquestador de layouts.

Tiene un registro de layouts.

Conceptualmente:

window.layoutRenderer

API:

render({
    container,
    section,
    context
})

No debe resolver datasets ni schemas.

Recibe información preparada.

Puede seleccionar:

- listLayout
- detailLayout
- objectLayout
- tabsLayout
- editLayout
- selectorLayout
- otros layouts declarativos

============================================================
23. FIELDRENDERER
============================================================

fieldRenderer tiene un registry de renderers.

Los renderers pueden incluir:

- textFieldRenderer
- mediaFieldRenderer
- objectFieldRenderer
- etc.

El renderer se determina declarativamente.

El fieldRenderer recibe:

{
    container,
    value,
    field,
    mode,
    context
}

El renderer no debe buscar por su cuenta el dataset ni el schema.

============================================================
24. LISTLAYOUT
============================================================

listLayout es el layout utilizado para mostrar colecciones.

Puede renderizar:

- table
- grid
- cards

El layout recibe:

items
fields
layoutConfig
context

No debe resolver relaciones.

Puede aplicar navegación de row/card mediante:

window.navigateRenderer

============================================================
25. DETAILLAYOUT
============================================================

detailLayout muestra un objeto individual.

Su responsabilidad es visualizar el objeto ya resuelto.

No debe contener lógica de negocio.

También existe el modo:

display

y:

edit

============================================================
26. EDITLAYOUT
============================================================

editLayout ya funciona.

La idea es que sea una copia conceptual de detailLayout,
pero orientada a edición.

Reglas:

- no modifica layout_resolved
- calcula/prepara una estructura de edición
- permite modificar registros
- permite eliminar registros
- permite insertar registros
- NO permite crear campos que no existen en schema
- si primero se modifica el schema para agregar un campo,
  entonces puede existir el valor correspondiente

La edición debe mantener separación entre:

estructura
y
datos.

El pipeline no debe contaminar layout_resolved.

Si se necesita una versión modificada se genera una nueva
estructura, por ejemplo:

layout_modificado
layout_editado
etc.

No se debe modificar directamente:

definition
metadata
navigation_header
layout
data

desde el pipeline.

Si se necesita representar una modificación, debe existir
una nueva sección/estructura de resultado.

============================================================
27. RELACIONES EN EDITLAYOUT
============================================================

Cuando un campo tiene:

relation

y:

selector

el editLayout debe poder identificar que ese campo no es
simplemente un text input.

Ejemplo:

{
    "campo": "tipos_media",
    "label": "Tipos Media",
    "tipo": "text",
    "renderer": "textFieldRenderer",

    "relation": {
        "source": {
            "file": "tipos_media.json",
            "path": "data/catalogos"
        },
        "where": {
            "id": "{tipos_media}"
        }
    },

    "selector": {
        "ui": "selector",
        "mode": "multiple"
    }
}

El editLayout ya fue modificado para que el campo relacionado
pueda mostrar una lupa/selector.

============================================================
28. SELECTORLAYOUT
============================================================

selectorLayout es una pantalla normal de selección.

NO es modal.

NO se abre como popup.

Debe abrirse como una página más, utilizando el mismo mecanismo
de navegación que utiliza listLayout cuando se selecciona
una fila.

selectorLayout ya existe y contiene:

- tabla
- checkbox por registro
- selección múltiple
- botón Cancelar
- botón Guardar

Conceptualmente:

window.selector = api

API:

render({
    container,
    section,
    context
})

============================================================
29. ESTADO DEL SELECTOR
============================================================

selectorLayout mantiene:

context.__selector

con:

{
    selected: []
}

Los checkbox agregan o eliminan elementos de:

context.__selector.selected

El selector solamente acumula selección.

No debe modificar todavía el documento original.

============================================================
30. FLUJO EDIT → SELECTOR
============================================================

El flujo deseado es:

editLayout
    ↓
usuario presiona lupa
    ↓
se ejecuta profile = selector
    ↓
runtime ejecuta pipeline
    ↓
se llega a selectorLayout
    ↓
usuario selecciona registros
    ↓
usuario presiona Guardar / OK
    ↓
se termina selector
    ↓
se ejecuta profile = update
    ↓
update lee update.json
    ↓
aplica selección
    ↓
genera documento actualizado

IMPORTANTE:

El profile selector NO actualiza.

El profile selector solamente selecciona.

El update ocurre únicamente después de Guardar/OK.

============================================================
31. NAVEGACIÓN DEL SELECTOR
============================================================

La pantalla selector debe abrirse como una página normal.

No utilizar modal.

Debe utilizarse el mismo concepto de navegación existente:

window.navigateRenderer

o el mecanismo equivalente del runtime.

El profile selector forma parte del pipeline.

No se quiere llamar directamente:

selectorLayout.render()

desde editLayout sin pasar por el runtime.

La intención es:

editLayout
    ↓
navegación/profile
    ↓
runtime
    ↓
pipeline
    ↓
selectorLayout

============================================================
32. UPDATE.JSON
============================================================

Existe una idea para que update sea universal.

No importa desde qué documento se inicia.

Ejemplo:

matrix.json

Al seleccionar:

    selector

se genera:

    update.json

update.json representa el documento que será actualizado.

La intención es que update siempre lea el mismo archivo:

    update.json

sin importar cuál fue el JSON original.

Ejemplo:

matrix.json
    ↓
selector
    ↓
update.json
    ↓
selector selecciona
    ↓
update profile
    ↓
actualiza update.json
    ↓
genera document.json

============================================================
33. REGLA IMPORTANTE DE UPDATE.JSON
============================================================

update.json se genera inicialmente en DOWNLOAD.

No se debe asumir que automáticamente está disponible
en data/.

Flujo actual decidido:

1. Se genera update.json.
2. update.json se descarga.
3. Manualmente el usuario mueve update.json a data/.
4. Después de eso se presiona Guardar/OK en selector.
5. El update profile lee:

       data/update.json

6. Aplica la selección.
7. Genera el documento correspondiente.

Esto es importante porque actualmente no se quiere introducir
Node ni filesystem externo para hacer automáticamente el movimiento.

============================================================
34. UPDATE PROFILE
============================================================

El update profile debe ser universal.

No debe saber:

    matrix
    peliculas
    personas
    libros
    etc.

Debe leer:

    update.json

y trabajar según la información declarativa que contiene.

Debe utilizar el mismo pipeline/resolvers necesarios para
interpretar el documento.

============================================================
35. UPDATEPROGRAM
============================================================

Se planteó que el botón Guardar/OK pueda terminar provocando
una ejecución de:

    updateProgram

o:

    runtime con profile = update

La dirección arquitectónica preferida es mantener la ejecución
dentro del runtime mediante profiles.

Es decir:

selector
    ↓
profile update
    ↓
runtime
    ↓
pipeline update

============================================================
36. STARTUP CONFIG
============================================================

Existe una configuración de startup para evitar que
index.html conozca todos los componentes.

Conceptualmente:

{
    "startup": {
        "layout": "layout",
        "meta_schema": "_meta",

        "fieldRenderers": [
            {
                "name": "textFieldRenderer",
                "file": "js/fields/textFieldRenderer.js"
            }
        ]
    }
}

La idea es que el runtime cargue componentes declarativamente.

No depender de index.html para conocer cada renderer.

============================================================
37. NAVIGATION
============================================================

La navegación es declarativa.

Puede existir algo como:

{
    "html": "index.html",
    "source": {
        "file": "peliculas.json",
        "path": "data/peliculas"
    },
    "parameters": {
        "profile": "runtime"
    }
}

El runtime/navigateRenderer interpreta esto.

El layout no debe contener lógica específica para navegación.

listLayout puede delegar:

window.navigateRenderer.navigate(...)

============================================================
38. TABS
============================================================

Existe tabsLayout.

La intención es soportar layouts compuestos con tabs sin
introducir lógica específica por entidad.

tabsLayout debe consumir información ya preparada por
layoutResolver/layoutRenderer.

============================================================
39. OBJECTLAYOUT
============================================================

objectLayout renderiza objetos.

Responsabilidades:

- recibir dataset preparado
- recibir schema preparado
- renderizar campos
- manejar objetos anidados
- delegar cada campo a fieldRenderer

No debe buscar nuevamente dataset/schema.

============================================================
40. MEDIA
============================================================

Los campos media pueden tener estructuras declarativas.

Ejemplo conceptual:

{
    "tipo_media": ...,
    "source": {
        "file": "...",
        "path": "..."
    }
}

Puede haber múltiples objetos media con diferentes:

- tipo_media
- file
- path

La resolución debe ser genérica.

============================================================
41. CAMPOS RELACIONADOS
============================================================

Una relación puede producir información adicional.

Ejemplo:

DATA:

tipos_media: "1"

RELATION:

id = "1"

RESOLVED:

{
    ...
}

El problema que ya se corrigió parcialmente fue que
layoutResolver estaba tratando de construir el campo únicamente
con el valor original.

Debe conservar:

field.value
field.__resolved

para que los renderers puedan decidir qué mostrar.

============================================================
42. REGLA CLAVE ENTRE RESOLVERS Y LAYOUTS
============================================================

RELATIONRESOLVER:

    consigue información.

LAYOUTRESOLVER:

    prepara esa información dentro del layout.

LAYOUT:

    solamente renderiza.

FIELDRENDERER:

    solamente renderiza el campo.

Por lo tanto:

relationResolver
NO debe saber cómo mostrar.

layoutResolver
NO debe crear HTML.

listLayout
NO debe buscar relaciones.

editLayout
NO debe volver a resolver relaciones.

selectorLayout
NO debe volver a resolver datasets.

============================================================
43. PROCESAMIENTO DE RELACIONES
============================================================

La relación debe resolverse antes del layoutResolver.

Flujo:

DATA
 ↓
relationResolver
 ↓
record.__resolved
 ↓
layoutResolver
 ↓
field.value
field.__resolved
field.resolvedValue
 ↓
layout
 ↓
fieldRenderer

============================================================
44. CACHÉ
============================================================

dataResolver y schemaResolver pueden utilizar caché.

El objetivo es no cargar/reprocesar repetidamente los mismos
datasets/schemas.

============================================================
45. PATH RESOLVER
============================================================

Existe pathResolver.

Su responsabilidad es resolver rutas declarativas.

No debe contener lógica específica de entidades.

============================================================
46. DATARESOLVER
============================================================

dataResolver:

- carga datasets
- resuelve dataSource
- maneja caché
- entrega datos al contexto

No renderiza.

============================================================
47. SCHEMARESOLVER
============================================================

schemaResolver:

- obtiene schema
- resuelve referencias
- utiliza caché
- prepara schema para el runtime

No renderiza.

============================================================
48. QUERY RESOLVER
============================================================

Se planteó QueryResolver para resolver consultas declarativas.

Debe mantenerse separado de:

relationResolver

si el contrato final lo requiere.

No introducir lógica específica por entidad.

============================================================
49. LOGGER
============================================================

Existe:

window.logger

Los módulos utilizan:

window.logger?.info
window.logger?.debug
window.logger?.warn
window.logger?.error

Existe FILE por módulo:

const FILE = "module.js";

Esto permite identificar fácilmente el origen de los mensajes.

============================================================
50. DEBUG
============================================================

Existe:

window.DEBUG

El proyecto utiliza logs de diagnóstico durante desarrollo.

Los logs no deben formar parte de la lógica funcional.

============================================================
51. REGLA SOBRE LAYOUT_RESOLVED
============================================================

layout_resolved es únicamente para visualización/preparación.

No debe utilizarse como objeto mutable de negocio.

Especialmente:

layoutRenderer/layouts NO deben modificar
layout_resolved para guardar cambios.

Para editar:

se calcula una estructura nueva.

============================================================
52. MODOS DISPLAY Y EDIT
============================================================

Los layouts pueden trabajar con:

mode = "display"

o:

mode = "edit"

DISPLAY:

    muestra información.

EDIT:

    prepara controles para modificar información.

El renderer recibe:

mode

como parte de su contexto.

============================================================
53. REGLA DE EDICIÓN
============================================================

editLayout:

SI puede:

- modificar valores
- insertar registros
- eliminar registros

NO puede:

- crear campos inexistentes

Para crear un campo:

1. modificar schema/metadata
2. volver a resolver
3. entonces editar su valor

============================================================
54. ATOMICIDAD
============================================================

El diseño debe evitar que una modificación parcial contamine
el documento original.

Se reconstruye el resultado completo cuando sea necesario.

La intención es mantener consistencia entre:

schema
data
layout
metadata
navigation

============================================================
55. CONTEXTO
============================================================

El runtime prepara un context común.

Puede contener:

context.datasets
context.layout
context.navigation
context.__selector
etc.

Los layouts consumen este contexto.

============================================================
56. DEFINICIONES
============================================================

Existe el concepto de:

definition

para definir datasets y estructuras.

Ejemplo conceptual:

definition: {

    sections: {

        ...

    },

    datasets: [

        {
            id: "...",
            path: "...",
            schema: "...",
            layout: "...",
            container: "..."
        }

    ]

}

Las definiciones deben mantenerse separadas de los datos.

============================================================
57. CADA JSON ES INDEPENDIENTE
============================================================

Cada JSON debe poder controlar su propia página.

No se busca una aplicación con un único JSON global.

Un JSON puede:

- definir su metadata
- definir sus datos
- definir su layout
- definir su navegación
- apuntar al siguiente JSON

============================================================
58. NO EXISTE LÓGICA GLOBAL ESPECÍFICA
============================================================

No crear:

peliculasRuntime
clientesRuntime
librosRuntime
etc.

Todo debe ser interpretado por el mismo runtime.

============================================================
59. RESTRICCIÓN DE IMPLEMENTACIÓN
============================================================

El sistema debe funcionar solamente con:

- JavaScript
- HTML
- CSS
- JSON

No utilizar Node para resolver operaciones del sistema.

El navegador debe ser capaz de ejecutar el runtime.

============================================================
60. ESTADO ACTUAL DEL PROYECTO
============================================================

Actualmente funcionan o están desarrollados:

- runtime
- dataResolver
- relationResolver
- schemaResolver
- layoutResolver
- layoutRenderer
- fieldRenderer
- navigation
- tabsLayout
- listLayout
- detailLayout
- editLayout
- selectorLayout

Las relaciones ya se están resolviendo y aparecen en:

record.__resolved

El editLayout ya detecta campos con selector/relation y puede
mostrar la lupa.

selectorLayout ya tiene:

- tabla
- checkbox
- selección
- Cancelar
- Guardar

============================================================
61. VALIDATESCHEMA
============================================================

Actualmente validateschema fue quitado temporalmente para
poder probar el resto del sistema.

PENDIENTE:

Reintegrar validateschema cuando quede completamente definido
el contrato de:

metadata
schema
relation
selector

Debe validar:

schema contra _meta

y posteriormente:

data contra schema

============================================================
62. PENDIENTE ACTUAL PRINCIPAL
============================================================

El siguiente trabajo es terminar el flujo:

editLayout
    ↓
lupa
    ↓
profile selector
    ↓
runtime
    ↓
pipeline
    ↓
selectorLayout
    ↓
selección
    ↓
Guardar / OK
    ↓
profile update
    ↓
data/update.json
    ↓
aplicar selección
    ↓
generar documento actualizado

============================================================
63. PENDIENTE: INVOCACIÓN DEL SELECTOR
============================================================

No se quiere:

selectorLayout.render()

directamente desde editLayout.

Se quiere:

editLayout
    ↓
navegación declarativa
    ↓
runtime
    ↓
profile = selector
    ↓
pipeline
    ↓
selectorLayout

Debe abrirse como página normal.

No modal.

============================================================
64. PENDIENTE: CONTRATO DEL SELECTOR
============================================================

El selector debe recibir suficiente información para saber:

- qué dataset mostrar
- qué schema utilizar
- qué relación está resolviendo
- qué campo originó la selección
- si es single/multiple
- a dónde regresar
- qué documento será actualizado

Pero esta información debe viajar declarativamente.

No hardcodearla en selectorLayout.

============================================================
65. PENDIENTE: GUARDAR DEL SELECTOR
============================================================

El botón Guardar/OK no debe actualizar directamente el documento.

Debe finalizar el profile selector y provocar:

profile = update

El update será responsable de leer update.json.

============================================================
66. PENDIENTE: UPDATE.JSON
============================================================

Debe definirse exactamente:

- quién genera update.json
- qué estructura contiene
- cómo identifica el documento original
- qué campo se está actualizando
- qué selección debe aplicar
- qué documento final genera

Actualmente está decidido que:

update.json

se genera en DOWNLOAD.

El usuario debe moverlo manualmente a:

data/update.json

antes de presionar Guardar/OK.

============================================================
67. PENDIENTE: UPDATE PROFILE
============================================================

Debe implementar el flujo universal:

1. cargar data/update.json
2. resolver su estructura
3. aplicar la información seleccionada
4. reconstruir el documento
5. generar el JSON actualizado

No debe conocer el nombre del documento original.

============================================================
68. PENDIENTE: SELECTOR MULTIPLE
============================================================

selector.mode puede ser:

    single
    multiple

Actualmente selectorLayout utiliza:

context.__selector.selected

como array.

Debe definirse cómo se transforma esa selección en el valor
final del campo.

Ejemplo:

si se seleccionan:

1
3
5

el resultado podría ser:

tipos_media: ["1", "3", "5"]

según el schema declarado.

============================================================
69. PENDIENTE: RETURN DEL SELECTOR
============================================================

Debe definirse cómo el selector sabe qué hacer después de
Guardar.

La navegación debe ser declarativa.

El selector no debe conocer directamente:

matrix.json
peliculas.json
clientes.json

Debe utilizar información recibida por context/profile.

============================================================
70. PENDIENTE: CANCELAR
============================================================

Cancelar debe:

- descartar selección
- no ejecutar update
- regresar a la página anterior/origen

No debe modificar data.

============================================================
71. PENDIENTE: UPDATE UNIVERSAL
============================================================

La gran meta es que:

matrix.json
peliculas.json
clientes.json
libros.json

puedan utilizar el mismo:

selectorLayout
update profile
update.json

sin código específico.

============================================================
72. MATRIZ DE RESPONSABILIDADES
============================================================

runtime
    Orquesta.

dataResolver
    Obtiene datos.

relationResolver
    Resuelve relaciones.

schemaResolver
    Obtiene/resuelve schemas.

pathResolver
    Resuelve paths.

layoutResolver
    Construye layout completamente resuelto.

layoutRenderer
    Selecciona y ejecuta layout.

listLayout
    Renderiza listas.

detailLayout
    Renderiza detalles.

objectLayout
    Renderiza objetos.

tabsLayout
    Renderiza tabs.

editLayout
    Renderiza edición.

selectorLayout
    Permite seleccionar.

fieldRenderer
    Renderiza campos.

navigateRenderer
    Ejecuta navegación.

validator
    Valida estructuras.

update profile
    Actualiza documentos.

============================================================
73. REGLA FUNDAMENTAL DEL PROYECTO
============================================================

SI UNA FUNCIONALIDAD PUEDE SER RESUELTA DE FORMA DECLARATIVA,
NO DEBE CREARSE LÓGICA ESPECÍFICA EN EL RUNTIME.

El objetivo final es que UDR pueda recibir un JSON desconocido
y ejecutar su aplicación sin que el runtime haya sido escrito
para conocer previamente esa aplicación.

============================================================
74. OBJETIVO FINAL
============================================================

La arquitectura final buscada es:

                    JSON
                     │
                     ▼
                  RUNTIME
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
    DATA RESOLVER         SCHEMA RESOLVER
          │                     │
          └──────────┬──────────┘
                     ▼
              RELATION RESOLVER
                     │
                     ▼
              LAYOUT RESOLVER
                     │
                     ▼
             LAYOUT RENDERER
                     │
        ┌────────────┼─────────────┐
        ▼            ▼             ▼
      LIST         DETAIL        EDIT
        │            │             │
        │            │             ▼
        │            │          SELECTOR
        │            │             │
        │            │             ▼
        │            │           UPDATE
        │            │             │
        └────────────┴─────────────┘
                     │
                     ▼
              FIELD RENDERERS
                     │
                     ▼
                    HTML

Todo el flujo debe mantenerse declarativo,
genérico y reutilizable.

============================================================
75. REGLA PARA EL NUEVO CHAT
============================================================

Al continuar el desarrollo NO asumir que una función debe
modificarse solamente porque existe un problema visual.

Primero determinar en qué capa pertenece el problema:

- datos → dataResolver
- relación → relationResolver
- schema → schemaResolver
- preparación → layoutResolver
- presentación → layout
- campo → fieldRenderer
- navegación → navigateRenderer
- selección → selectorLayout
- actualización → update profile

Evitar mover lógica entre capas solamente para solucionar
un síntoma.

El objetivo es conservar las responsabilidades de cada módulo.