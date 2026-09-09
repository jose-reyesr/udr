==========================================================
UNIVERSAL DECLARATIVE RUNTIME (UDR)
VERSIÓN 1.0 - ESPECIFICACIÓN ARQUITECTÓNICA
==========================================================

UDR (Universal Declarative Runtime) es un runtime
de propósito general orientado a organizar,
relacionar, navegar y visualizar información
utilizando documentos JSON declarativos.

No es un framework de UI.

No es un framework CRUD.

No es un ORM.

No es un CMS.

No es una base de datos.

UDR es un motor declarativo cuyo objetivo es
construir un universo de conocimiento compuesto
por documentos relacionados.

==========================================================
VISIÓN
==========================================================

UDR busca convertirse en una capa de conocimiento
personal capaz de integrar:

- Personas
- Películas
- Series
- Música
- Libros
- Eventos
- Notas
- Finanzas
- Inventarios
- Multimedia
- PDF
- Word
- Excel
- Videos
- Audio
- Cualquier recurso digital

todo bajo un único modelo declarativo.

La IA no es el objetivo principal.

La IA es un consumidor futuro del conocimiento
estructurado por UDR.

Primero:

Conocimiento

↓

Relaciones

↓

Contexto

↓

IA

==========================================================
FILOSOFÍA
==========================================================

UDR nunca conoce entidades.

UDR solamente conoce:

- documentos
- datasets
- schemas
- layouts
- renderers
- relaciones
- navegación
- recursos

No existen conceptos especiales como:

- persona
- cliente
- producto
- película
- libro
- empleado

Todos son simplemente documentos.

==========================================================
PRINCIPIOS FUNDAMENTALES
==========================================================

1. INDEPENDENCIA DE ENTIDADES

El runtime jamás conoce entidades específicas.

Toda la lógica depende exclusivamente de la
configuración declarativa.

----------------------------------------------------------

2. UNIFORMIDAD DE DOCUMENTOS

Todos los documentos son equivalentes.

No existen:

- documentos raíz
- documentos maestros
- documentos especiales
- documentos índice
- documentos detalle

Todo documento puede utilizarse como punto de
entrada.

----------------------------------------------------------

3. DOCUMENTO AUTÓNOMO

Todo documento UDR es autocontenible.

Puede contener:

- definition
- meta
- layout
- navegación
- datasets
- relaciones
- recursos

----------------------------------------------------------

4. SIMPLICIDAD

UDR resolverá únicamente problemas reales.

No se agregarán capacidades para escenarios
hipotéticos.

----------------------------------------------------------

5. COMPOSICIÓN

Toda funcionalidad de UDR se construye mediante
composición declarativa.

Nunca mediante lógica de dominio.

==========================================================
ARQUITECTURA GENERAL
==========================================================

Documento

↓

Definition

↓

Datasets

↓

Data Resolver

↓

Relations

↓

Schemas

↓

Layout Registry

↓

Layout Renderer

↓

Field Registry

↓

Field Renderer

↓

HTML

==========================================================
CONTRATO DEL DOCUMENTO
==========================================================

{

    definition:{},

    meta:{},

    navigation:{},

    layout:{},

    data:[]

}

Todas las secciones son declarativas.

==========================================================
DEFINITION
==========================================================

Contiene configuración para inicializar el runtime.

Ejemplo:

definition{

    startup{},

    datasets[]

}

==========================================================
STARTUP
==========================================================

startup{

    meta_schema,

    fieldRenderers[],

    layoutRenderers[]

}

Responsabilidades:

- registro dinámico de renderers
- registro dinámico de layouts

==========================================================
DATASETS
==========================================================

Un dataset representa una vista lógica de una
porción del documento.

Definición:

{

    id,

    path,

    schema,

    container

}

Ejemplo:

{

    id:"data",

    path:"data",

    schema:"catalogo",

    container:"content-view"

}

==========================================================
DATASET RUNTIME CONTRACT
==========================================================

Todo dataset generado por DatasetResolver:

{

    id,

    definition,

    value,

    schema

}

==========================================================
PATH
==========================================================

Path localiza información dentro de un documento.

Ejemplos:

data

meta.data

layout.tabs

navigation.items

El runtime utiliza path para navegar estructuras
internas.

==========================================================
SOURCE
==========================================================

Source localiza recursos externos.

Contrato:

source{

    file,

    path

}

Ejemplos:

Documentos JSON

source{

    file:"maria.json",

    path:"data/personas"

}

Imágenes

source{

    file:"poster.jpg",

    path:"img/avatar"

}

PDF

source{

    file:"estado_cuenta.pdf",

    path:"docs/finanzas"

}

==========================================================
RESOURCE CONTRACT
==========================================================

Todo recurso debe poder representarse mediante:

{

    source:{

        file,

        path

    }

}

Tipos de recurso soportados:

- JSON
- Image
- Audio
- Video
- PDF
- Word
- Excel
- Archivos estáticos

El runtime no distingue entre tipos de negocio.

Sólo localiza recursos.

==========================================================
JSON PATH CONTRACT
==========================================================

UDR soporta navegación declarativa sobre objetos.

Ejemplos:

meta.schemas.catalogo

layout.tabs

navigation_header.items

data

Responsabilidad:

pathResolver.getByPath()

==========================================================
META
==========================================================

Contiene metadatos y schemas.

meta{

    data:{},

    schemas:{}

}

==========================================================
SCHEMAS
==========================================================

Un schema describe una estructura de datos.

Puede ser:

- local
- externo

Schema local:

meta.schemas.catalogo

Schema externo:

source{

    file,

    path

}

==========================================================
SCHEMA FIELD CONTRACT
==========================================================

{

    campo,

    label,

    tipo,

    renderer,

    fields[]

}

==========================================================
RELACIONES
==========================================================

Las relaciones son completamente declarativas.

Contrato actual:

{

    localValue,

    source{

        file,

        path

    },

    remoteField

}

Interpretación:

Buscar en el documento indicado mediante source
un registro donde:

remoteField == localValue

==========================================================
RELACIONES ANIDADAS
==========================================================

UDR soporta relaciones recursivas.

Ejemplo:

Maria

↓

Películas favoritas

↓

Avatar

↓

Actores

↓

Sam Worthington

↓

Películas

La resolución es automática.

==========================================================
NAVIGATION
==========================================================

UDR soporta dos niveles de navegación.

==========================================================
NAVEGACIÓN GLOBAL
==========================================================

Utilizada normalmente en headers y menús.

Contrato:

{

    label,

    navigation{

        html,

        source{

            file,

            path

        }

    }

}

==========================================================
NAVEGACIÓN CONTEXTUAL
==========================================================

Asociada a registros específicos.

Ejemplo:

Película

↓

Abrir detalle

↓

Avatar.json

Utiliza el mismo contrato de navigation.

==========================================================
ROUTER
==========================================================

UDR navega documentos.

No navega entidades.

Contrato:

router.navigate({

    html,

    file,

    path

})

resultado:

index.html?file=xxx&path=yyy

==========================================================
REGISTRY PATTERN
==========================================================

UDR utiliza registros internos privados.

Field Registry

Renderer

↓

Registro

↓

Resolver

----------------------------------------------------------

Layout Registry

Layout

↓

Registro

↓

Resolver

==========================================================
FIELD RENDERER CONTRACT
==========================================================

Todo field renderer debe implementar:

render()

renderDisplay()

renderEdit()

==========================================================
FIELD TYPES V1
==========================================================

text

textarea

number

boolean

date

html

icon

image

audio

video

document

gallery

array

object

==========================================================
LAYOUT CONTRACT
==========================================================

Todo layout recibe:

{

    container,

    section,

    context,

    dataset

}

==========================================================
LAYOUTS V1
==========================================================

tabs

list

detail

object

==========================================================
COMPOSICIÓN
==========================================================

Layouts pueden contener layouts.

Fields pueden contener layouts.

Arrays pueden contener fields.

Objetos pueden contener arrays.

Relaciones pueden contener documentos.

No existen restricciones artificiales.

==========================================================
MULTIMEDIA
==========================================================

Multimedia es un recurso más.

No existe tratamiento especial para:

- imágenes
- video
- audio

Todos utilizan Source.

==========================================================
DOCUMENTOS EXTERNOS
==========================================================

PDF

Excel

Word

Texto

No son tratados como entidades especiales.

Simplemente son recursos accesibles mediante
source.

==========================================================
CATÁLOGO DE DOCUMENTOS
==========================================================

UDR puede utilizar un documento de catálogo.

Ejemplo:

documents.json

Su propósito es:

- inventariar documentos
- explicar propósito
- permitir navegación

No es obligatorio.

No es un documento especial.

No participa en el runtime.

==========================================================
PIPELINE DEL RUNTIME
==========================================================

loadJson

↓

resolveDefinitions

↓

resolveDatasets

↓

validateSchema

↓

resolveRelations

↓

registerRenderers

↓

render

==========================================================
ALCANCE V1
==========================================================

✔ Documents

✔ Datasets

✔ Schemas

✔ Source

✔ Path

✔ Relations

✔ Navigation

✔ Resource Resolution

✔ Multimedia

✔ Field Registry

✔ Layout Registry

✔ Dynamic Renderer Registration

✔ Recursive Layouts

✔ Recursive Relations

==========================================================
FUERA DEL ALCANCE V1
==========================================================

✖ IA

✖ Agentes

✖ Prompt Builders

✖ Motores de reglas

✖ Workflow Engines

✖ Recomendadores

✖ Machine Learning

✖ Bases de datos

✖ Frameworks externos

==========================================================
VISIÓN FUTURA
==========================================================

UDR tiene como objetivo convertirse en una capa
de conocimiento capaz de consolidar información
personal.

Ejemplos:

Maria

↓

Finanzas

↓

PDF

↓

Excel

↓

Medicamentos

↓

Eventos

↓

Vacaciones

↓

Películas

↓

Fotos

↓

Videos

↓

Notas

El resultado de esta consolidación podrá ser
consumido posteriormente por asistentes de IA.

==========================================================
PRINCIPIO FINAL
==========================================================

UDR no intenta construir inteligencia artificial.

UDR intenta construir conocimiento estructurado.

La calidad de las decisiones futuras de la IA
dependerá de la calidad, consistencia y riqueza
de la información organizada por UDR.

UDR construye la memoria.

La IA utiliza esa memoria.