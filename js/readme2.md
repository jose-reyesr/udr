{
  "id": "entidad-persona-001",
  "tipo": "persona",
  "metadatos_basicos": {
    "nombre": "María",
    "rol_relacion": "esposa",
    "fecha_registro": "2026-08-25"
  },

  "atributos_cuantitativos": {
    "medidas_y_tallas": [
      { "clave": "talla_calzado", "valor": "37 EU", "unidad": "talla" },
      { "clave": "talla_blusa", "valor": "S", "unidad": "talla" },
      { "clave": "talla_pantalón", "valor": "28", "unidad": "talla" },
      { "clave": "estatura", "valor": 165, "unidad": "cm" }
    ],
    "salud_y_biometria": [
      { "clave": "presion_arterial_promedio", "valor": "120/80", "unidad": "mmHg" },
      { "clave": "ritmo_cardiaco_reposo", "valor": 68, "unidad": "bpm" },
      { "clave": "glucosa_ayuno_promedio", "valor": 95, "unidad": "mg/dL" }
    ]
  },

  "preferencias_y_gustos": {
    "entretenimiento_y_cultura": [
      { "categoria": "pelicula", "valor": "Inception", "nivel": "favorita" },
      { "categoria": "serie", "valor": "The Office", "nivel": "muy_alta" },
      { "categoria": "genero_literario", "valor": "Ciencia Ficción", "nivel": "alto" }
    ],
    "estilo_y_moda": [
      { "categoria": "tela_ropa", "valor": "lino", "nivel": "preferente" },
      { "categoria": "color_ropa", "valor": "azul marino", "nivel": "favorito" },
      { "categoria": "accesorio", "valor": "joyería de plata", "nivel": "favorito" }
    ],
    "gastronomia": [
      { "categoria": "cafe", "valor": "café de especialidad", "nivel": "alto" },
      { "categoria": "cocina", "valor": "italiana", "nivel": "muy_alta" },
      { "categoria": "postre", "valor": "tarta de manzana", "nivel": "favorito" }
    ]
  },

  "restricciones_y_rechazos": {
    "salud_y_medicina": [
      { "categoria": "condicion", "descripcion": "Migraña crónica", "detalle": "Evitar fragancias intensas y luces parpadeantes" },
      { "categoria": "alergia_farmacos", "descripcion": "Penicilina", "detalle": "Reacción severa" }
    ],
    "alimentacion": [
      { "categoria": "alimento", "descripcion": "mariscos crudos", "detalle": "Intolerancia digestiva" },
      { "categoria": "ingrediente", "descripcion": "cilantro", "detalle": "Gusto de rechazo" }
    ],
    "gustos_personales": [
      { "categoria": "color_ropa", "descripcion": "amarillo fosforescente", "detalle": "Evitar en regalos" }
    ]
  },

  "salud_y_bienestar": {
    "medicamentos_activos": [
      { "item": "Losartán 50mg", "dosis": "1 diaria", "horario": "mañana" }
    ],
    "padecimientos": [
      { "condicion": "Hipertensión", "estado": "controlada" }
    ],
    "medicos_contacto": [
      { "especialidad": "Cardiología", "nombre": "Dr. Aranda", "telefono": "+528100000000" }
    ]
  },

  "eventos_importantes": {
    "fechas_clave": [
      { "evento": "Cumpleaños", "fecha": "11-14", "recordatorio_dias_antes": 15 },
      { "evento": "Aniversario de Bodas", "fecha": "10-20", "recordatorio_dias_antes": 30 }
    ]
  },

  "historial_e_interacciones": {
    "regalos_recibidos": [
      { "ano": 2025, "item": "Suéter de lino azul marino", "ocasion": "Cumpleaños", "resultado": "exitoso" },
      { "ano": 2025, "item": "Perfume floral fuerte", "ocasion": "Navidad", "resultado": "no_gusto" }
    ]
  },

  "relaciones_y_red": {
    "familiares_directos": [
      { "relacion": "hijo", "entidad_ref": "entidad-persona-002.json" },
      { "relacion": "hijo", "entidad_ref": "entidad-persona-003.json" }
    ]
  },

  "logistica_y_ubicacion": {
    "direcciones": [
      { "tipo": "casa", "ciudad": "San Pedro Garza García", "estado": "Nuevo León" }
    ]
  },

  "perfil_comunicacion": {
    "canales_preferidos": [
      { "canal": "WhatsApp", "uso": "mensajes cortos y urgentes" }
    ]
  }
}



Cada capa agrupa y gestiona distintos tipos de entidades JSON independientes:

Capa 1: Identidad (Mundo Interno - Sujetos)

Archivos JSON: persona_maria.json, persona_hijo1.json, perfil_usuario.json.

Secciones internas del JSON: metadatos_basicos, atributos_cuantitativos, preferencias_y_gustos, restricciones_y_rechazos, salud_y_bienestar.

Capa 2: Recursos (Mundo Interno - Objetos/Activos)

Archivos JSON: alacena.json, vehiculo_01.json, tarjeta_credito_x.json, poliza_seguro.json.

Secciones internas del JSON: inventario, financiero, mantenimiento, vigencia.

Capa 3: Entorno (Mundo Externo)

Archivos JSON: clima_local.json, regulaciones_fiscales_2026.json, trafico_zona.json.

Secciones internas del JSON: condiciones_actuales, normativas, alertas_externas.

Capa 4: Historial (Línea de Tiempo y Bitácora)

Archivos JSON: log_regalos_2025.json, historial_medico_maria.json, bitacora_mantenimiento.json.

Secciones internas del JSON: eventos, interacciones_pasadas, resultados.

Capa 5: Orquestación (El Motor de Selección)

Archivo JSON: catalogo_situaciones.json.

Rol: Es el mapa que le dice al relationResolver: "Para la situación salida_a_cenar, ve a la Capa 1 y lee persona_maria.json (sección preferencias_y_gustos.gastronomia), y ve a la Capa 2 y lee tarjeta_credito_x.json (sección presupuesto)".

{
  "clave_situacion": "salud_o_emergencia",
  "etiqueta": "Atención médica y recetas",
  "fuentes_requeridas": [
    {
      "capa": "capa_1_identidad",
      "source": { 
        "path": "data/entidades/personas",
        "file": "persona_maria.json" 
      },
      "seccion_interna": "salud_y_bienestar.medicamentos_activos"
    },
    {
      "capa": "capa_1_identidad",
      "source": { 
        "path": "data/entidades/personas",
        "file": "persona_maria.json" 
      },
      "seccion_interna": "restricciones_y_rechazos.salud_y_medicina"
    },
    {
      "capa": "capa_2_recursos",
      "source": { 
        "path": "data/recursos/seguros",
        "file": "poliza_seguro_01.json" 
      },
      "seccion_interna": "cobertura_y_emergencias"
    }
  ]
}

{
  "id": "entidad-persona-001",
  "tipo": "persona",
  "metadatos_basicos": {
    "nombre": "María",
    "rol_relacion": "esposa",
    "fecha_registro": "2026-08-25"
  },

  "atributos_cuantitativos": {
    "medidas_y_tallas": [
      { "clave": "talla_calzado", "valor": "37 EU", "unidad": "talla" },
      { "clave": "talla_blusa", "valor": "S", "unidad": "talla" },
      { "clave": "talla_pantalón", "valor": "28", "unidad": "talla" },
      { "clave": "estatura", "valor": 165, "unidad": "cm" }
    ],
    "salud_y_biometria": [
      { "clave": "presion_arterial_promedio", "valor": "120/80", "unidad": "mmHg" },
      { "clave": "ritmo_cardiaco_reposo", "valor": 68, "unidad": "bpm" },
      { "clave": "glucosa_ayuno_promedio", "valor": 95, "unidad": "mg/dL" }
    ]
  },

  "preferencias_y_gustos": {
    "entretenimiento_y_cultura": [
      { "categoria": "pelicula", "valor": "Inception", "nivel": "favorita" },
      { "categoria": "serie", "valor": "The Office", "nivel": "muy_alta" },
      { "categoria": "genero_literario", "valor": "Ciencia Ficción", "nivel": "alto" }
    ],
    "estilo_y_moda": [
      { "categoria": "tela_ropa", "valor": "lino", "nivel": "preferente" },
      { "categoria": "color_ropa", "valor": "azul marino", "nivel": "favorito" },
      { "categoria": "accesorio", "valor": "joyería de plata", "nivel": "favorito" }
    ],
    "gastronomia": [
      { "categoria": "cafe", "valor": "café de especialidad", "nivel": "alto" },
      { "categoria": "cocina", "valor": "italiana", "nivel": "muy_alta" },
      { "categoria": "postre", "valor": "tarta de manzana", "nivel": "favorito" }
    ]
  },

  "restricciones_y_rechazos": {
    "salud_y_medicina": [
      { "categoria": "condicion", "descripcion": "Migraña crónica", "detalle": "Evitar fragancias intensas y luces parpadeantes" },
      { "categoria": "alergia_farmacos", "descripcion": "Penicilina", "detalle": "Reacción severa" }
    ],
    "alimentacion": [
      { "categoria": "alimento", "descripcion": "mariscos crudos", "detalle": "Intolerancia digestiva" },
      { "categoria": "ingrediente", "descripcion": "cilantro", "detalle": "Gusto de rechazo" }
    ],
    "gustos_personales": [
      { "categoria": "color_ropa", "descripcion": "amarillo fosforescente", "detalle": "Evitar en regalos" }
    ]
  },

  "salud_y_bienestar": {
    "medicamentos_activos": [
      { "item": "Losartán 50mg", "dosis": "1 diaria", "horario": "mañana" }
    ],
    "padecimientos": [
      { "condicion": "Hipertensión", "estado": "controlada" }
    ],
    "medicos_contacto": [
      { "especialidad": "Cardiología", "nombre": "Dr. Aranda", "telefono": "+528100000000" }
    ]
  },

  "eventos_importantes": {
    "fechas_clave": [
      { "evento": "Cumpleaños", "fecha": "11-14", "recordatorio_dias_antes": 15 },
      { "evento": "Aniversario de Bodas", "fecha": "10-20", "recordatorio_dias_antes": 30 }
    ]
  },

  "historial_e_interacciones": {
    "regalos_recibidos": [
      { "ano": 2025, "item": "Suéter de lino azul marino", "ocasion": "Cumpleaños", "resultado": "exitoso" },
      { "ano": 2025, "item": "Perfume floral fuerte", "ocasion": "Navidad", "resultado": "no_gusto" }
    ]
  },

  "relaciones_y_red": {
    "familiares_directos": [
      { "relacion": "hijo", "entidad_ref": "entidad-persona-002.json" },
      { "relacion": "hijo", "entidad_ref": "entidad-persona-003.json" }
    ]
  },

  "logistica_y_ubicacion": {
    "direcciones": [
      { "tipo": "casa", "ciudad": "San Pedro Garza García", "estado": "Nuevo León" }
    ]
  },

  "perfil_comunicacion": {
    "canales_preferidos": [
      { "canal": "WhatsApp", "uso": "mensajes cortos y urgentes" }
    ]
  }
}

1. Capa de Automatización y Mantenimiento (/bin)
Los scripts en Bash asumen el control total de la manipulación de archivos localmente:

udr-bootstrap.sh / udr-generate.sh: Creación de plantillas vacías para nuevas entidades (personas, productos, finanzas).

udr-validate.sh / udr-rebuild.sh: Verificación de sintaxis JSON y reconstrucción de índices.

udr-media.sh: Procesamiento o indexación de archivos multimedia asociados.

2. Capa de Presentación Nativa JS (/js)
Tiene una arquitectura desacoplada basada en el patrón de renderizado dinámico por tipo de dato:

/fields: Renderizadores por tipo de campo (imágenes, textos, audios, objetos, arreglos). Esto permite pintar cualquier propiedad de un JSON sin importar cuál sea su esquema.

/layouts: Vistas UI preparadas (tablas, formularios de edición, árboles de relación entre entidades, vista de detalle).

/resolvers: La capa clave de resolución (schemaResolver, relationResolver, pathResolver). Es la que se encarga de navegar el JSON dinámicamente según la ruta requerida.

/runtime: El motor de la aplicación web (app.js, router.js, runtime.js).

/utils: Módulos de soporte como jsonLoader.js (para cargar archivos locales) o jsonDownloader.js (para guardar o exportar los JSONs editados).

¿Dónde se integra el Memory Engine de IA aquí?
Tu proyecto ya tiene toda la infraestructura para visualizar y editar datos manualmente desde el navegador. Para conectar el Memory Engine que diseñamos sin romper esta estructura:

Nuevo archivo en /js/resolvers/contextResolver.js:
Recibe la intención del usuario (ej. planeacion_comida), lee el catalogo_situaciones.json y utiliza los resolvers que ya tienes (schemaResolver.js, pathResolver.js) para extraer únicamente las rutas necesarias del perfil.

Nuevo archivo en /js/runtime/aiService.js:
Toma el objeto empaquetado por el contextResolver y realiza la petición HTTP al endpoint del modelo (Gemini / Claude / OpenAI).

Interfaz en index.html:
Un layout o componente flotante de asistente/chat que consuma ese aiService.js.

El diseño técnico está súper profesional, modular y completamente escalable. ¿Quieres que preparemos la lógica del contextResolver.js basándonos en los resolvers que ya tienes programados en esa carpeta?


# 🧠 Memory Engine & Personal CRM Architecture

Este repositorio contiene la arquitectura, esquemas JSON y utilidades para implementar un **Asistente Personal de Contexto Unificado**. 

El objetivo del sistema es permitir a un modelo de lenguaje (LLM) responder con extrema precisión cruzando la identidad del usuario, sus recursos disponibles, las variables del entorno y los límites de operación sin saturar la ventana de contexto (*Lost in the Middle*).

---

## 🏗️ Clasificación Maestra de Capas

Para mantener la modularidad y evitar archivos monolíticos ingobernables, la información del sistema se organiza en **5 Capas Principales**:

                       SISTEMA DE MEMORIA
                               │
┌───────────────┬───────────────┼───────────────┬───────────────┐
▼               ▼               ▼               ▼               ▼

SUJETOS     2. RECURSOS     3. ENTORNO      4. OPERATIVA    5. MOTOR
(Identidad)     (Interno)       (Externo)      (Historial)   (Orquestación)


---

## 📂 Catálogo de Archivos JSON y Responsabilidades

### 1. Capa Identidad (`SUJETOS`)
> **Pregunta Clave:** *¿Quién es o qué le caracteriza de forma intrínseca?*  
> **Naturaleza:** Datos permanentes o de evolución lenta que definen a las personas.

* **`perfil_usuario.json`**: Datos biométricos, condiciones de salud (ej. diabetes, alergias), gustos, restricciones alimentarias y preferencias generales del usuario principal.
* **`perfil_familiares.json`**: Sub-perfiles individuales para cada miembro del núcleo familiar (esposa, hijos) con sus gustos, tallas, cumpleaños e historial médico.
* **`red_contactos.json`**: Libreta de contactos clave con contexto (médicos de cabecera, mecánico, pediatra, jefes, amigos).

---

### 2. Capa Interna (`RECURSOS Y CONTROL`)
> **Pregunta Clave:** *¿Qué tengo, qué debo o qué planeo hacer yo?*  
> **Naturaleza:** Todo lo que está bajo la propiedad, administración o voluntad directa del usuario.

* **`finanzas.json`**: Cuentas bancarias, saldos líquidos, fechas de corte/pago de tarjetas, presupuestos mensuales y deudas.
* **`alacena.json`**: Inventario de alimentos en refrigerador y alacena con cantidades e insumos disponibles.
* **`botiquin.json`**: Stock de medicamentos en casa, dosis y tratamientos activos.
* **`inventario_hogar.json`**: Equipamiento físico del hogar, herramientas, productos de limpieza y vehículos.
* **`proyectos_y_objetivos.json`**: Proyectos activos (remodelaciones, planes de viaje), metas financieras y listas de tareas asociadas.

---

### 3. Capa Externa (`ENTORNO Y TERCEROS`)
> **Pregunta Clave:** *¿Qué está pasando afuera o qué imponen terceros?*  
> **Naturaleza:** Factores que el usuario no puede modificar, pero que condicionan sus decisiones.

* **`proveedores_y_servicios.json`**: Horarios de comercios habituales, pólizas de seguro (coberturas, deducibles), garantías de productos y contratos.
* **`tramites_y_normativas.json`**: Fechas de vencimiento de documentos oficiales (pasaportes, licencias, visados), calendario fiscal y reglas locales.
* **`entorno_y_clima.json`**: Alertas meteorológicas, estado del tráfico, días festivos y calendarios escolares.

---

### 4. Capa Operativa (`HISTORIAL Y APRENDIZAJE`)
> **Pregunta Clave:** *¿Qué pasó en el pasado o qué hacer ante un imprevisto?*  
> **Naturaleza:** Registro de eventos transaccionales, protocolos de reacción y retroalimentación.

* **`historial_interacciones.json`**: Registro cronológico de compras pasadas, regalos otorgados, registros médicos o eventos pasados.
* **`contingencias_y_riesgos.json`**: Protocolos de emergencia, contactos prioritarios, planes de respaldo (Plan B).
* **`aprendizaje.json`**: Registro de retroalimentación (ideas o sugerencias rechazadas en el pasado para evitar repetir errores).

---

### 5. Capa Orquestación (`MOTOR DEL SISTEMA`)
> **Pregunta Clave:** *¿Cómo lee la IA la información y cómo debe comportarse?*  
> **Naturaleza:** La lógica del sistema y el enrutador de datos.

* **`catalogo_situaciones.json`**: Registro extensible de intenciones (ej. `salud_o_emergencia`, `salida_o_cena`, `planeacion_comida`). Define qué módulos JSON debe leer el script extractor para cada caso.
* **`reglas_asistente.json`**: Define el tono de respuesta de la IA, límites de autonomía (cuándo requerir confirmación) y directivas de privacidad.

---

## 🎯 Matriz Rápida de Clasificación

Si hay duda sobre dónde ubicar un nuevo dato, aplica la siguiente tabla de decisión:

| Tipo de Dato | Capa | Archivo JSON Destino |
| :--- | :--- | :--- |
| Condición médica o restricción dietética | **1. Identidad** | `perfil_usuario.json` |
| Ingrediente comprado y guardado en cocina | **2. Interna** | `alacena.json` |
| Fecha límite de pago de tarjeta de crédito | **2. Interna** | `finanzas.json` |
| Teléfono y número de póliza del seguro | **3. Externa** | `proveedores_y_servicios.json` |
| Vencimiento de la licencia de conducir | **3. Externa** | `tramites_y_normativas.json` |
| Registro de una receta o regalo pasado | **4. Operativa** | `historial_interacciones.json` |
| Módulos requeridos para la intención "Cena" | **5. Orquestación**| `catalogo_situaciones.json` |

---

## 🔄 Flujo de Ejecución (Intent-Driven Extraction)

[Usuario] ──> "Tengo diabetes, ¿qué ceno hoy?"
│
▼
[catalogo_situaciones.json] (Identifica intención: "planeacion_comida")
│
▼
[JavaScript Context Extractor] ── (Lee solo las rutas necesarias)
│
├──> perfil_usuario.json (Salud / Restricciones)
├──> alacena.json        (Ingredientes disponibles)
└──> finanzas.json       (Presupuesto restante)
│
▼
[System Prompt + Contexto Filtrado] ──> [LLM]


Catálogo Maestro de Capas: ¿Qué va en dónde?1. Capa Identidad (SUJETOS)Pregunta clave: ¿Quién es o qué le caracteriza de forma intrínseca?Datos permanentes o de evolución lenta que definen a las personas.Perfil Principal y Familiar (perfil_usuario.json, perfil_familiares.json): Nombres, fechas de nacimiento, condiciones médicas (diabetes, alergias), gustos, tallas de ropa, restricciones alimentarias.Red Cercana y Contactos (red_contactos.json): Datos de amigos, pediatra de confianza, mecánico, jefes, cumpleaños de terceros.2. Capa Interna (RECURSOS Y CONTROL)Pregunta clave: ¿Qué tengo, qué debo o qué planeo hacer yo?Todo lo que está bajo tu propiedad, administración o voluntad.Finanzas (finanzas.json): Cuentas bancarias, saldo disponible, fechas de corte de tarjetas, deudas, presupuestos mensuales.Inventario Consumible (alacena.json, botiquin.json): Alimentos en refrigerador y alacena, medicamentos en casa, dosis disponibles.Inventario Físico del Hogar (inventario_hogar.json): Electrodomésticos, herramientas, productos de limpieza, autos familiares.Proyectos y Pendientes (proyectos_y_objetivos.json): Tareas activas, metas de ahorro, remodelaciones en curso, listas de deseos.3. Capa Externa (ENTORNO Y TERCEROS)Pregunta clave: ¿Qué está pasando afuera o qué imponen otros?Todo lo que NO puedes cambiar, pero te afecta directamente.Servicios y Proveedores (proveedores_y_servicios.json): Horarios de farmacias, pólizas de seguro (coberturas, deducibles), garantías de aparatos, contratos de servicios (internet, agua).Trámites y Marco Legal (tramites_y_normativas.json): Vencimiento de pasaportes, licencias, fechas de impuestos, reglas del vecindario.Entorno y Variables Ambientales (entorno_y_clima.json): Alertas de clima, tráfico en rutas habituales, días festivos y calendarios escolares.4. Capa Operativa (REACCIONAL Y APRENDIZAJE)Pregunta clave: ¿Qué pasó en el pasado o qué hacer si algo sale mal?El historial dinámico y los planes de contención.Historial de Eventos (historial_interacciones.json): Registro de compras pasadas, regalos dados en años anteriores, registros médicos pasados.Contingencias y Emergencias (contingencias_y_riesgos.json): Protocolo en caso de accidente, contactos de emergencia a la vista, plan B si falla la niñera o el auto.Feedback y Preferencias Aprendidas (aprendizaje.json): Cosas que probaste y no te gustaron (restaurantes rechazados, marcas que fallaron).5. Capa Orquestación (MOTOR DEL SISTEMA)Pregunta clave: ¿Cómo lee la IA la información y cómo debe comportarse?La inteligencia que conecta todas las capas anteriores.Catálogo de Situaciones (catalogo_situaciones.json): El "índice" que le dice al código qué JSONs abrir según el tema (ej. si es "cena", lee perfil + alacena + finanzas).Reglas del Asistente (reglas_asistente.json): Tono de respuesta, límites de dinero para avisar, políticas de privacidad.La Guía Rápida de Decisión (Matriz de Clasificación)Si alguna vez dudando dónde colocar un nuevo dato, pásalo por este filtro:Si el dato es...Su capa correcta es:Archivo JSON sugerido:Una preferencia o condición física de una persona1. Identidadperfil_usuario.jsonAlgo que compraste y está dentro de tu casa2. Internaalacena.json o inventario_hogar.jsonUna fecha límite de pago o dinero2. Internafinanzas.jsonEl teléfono del seguro o el número de contrato de internet3. Externaproveedores_y_servicios.jsonLa fecha de vencimiento de una identificación oficial3. Externatramites_y_normativas.jsonUn recuerdo de lo que hiciste hace un mes4. Operativahistorial_interacciones.jsonEl mapa que une los módulos según la intención5. Orquestacióncatalogo_situaciones.json

{
  "esquema": "1.0",
  "situaciones": [
    {
      "clave_situacion": "salud_o_emergencia",
      "etiqueta": "Atención médica, recetas o emergencias",
      "modulos_requeridos": [
        "salud_y_bienestar",
        "restricciones_y_rechazos.salud_y_medicina",
        "atributos_cuantitativos.salud_y_biometria",
        "logistica_y_ubicacion"
      ]
    },
    {
      "clave_situacion": "salida_o_cena",
      "etiqueta": "Reservas gastronómicas, citas o eventos nocturnos",
      "modulos_requeridos": [
        "preferencias_y_gustos.gastronomia",
        "restricciones_y_rechazos.alimentacion",
        "logistica_y_ubicacion",
        "perfil_comunicacion"
      ]
    },
    {
      "clave_situacion": "redecoracion_hogar",
      "etiqueta": "Compra de muebles, arte o remodelaciones",
      "modulos_requeridos": [
        "preferencias_y_gustos.estilo_y_moda",
        "restricciones_y_rechazos.gustos_personales",
        "atributos_cuantitativos.medidas_y_tallas"
      ]
    },
    {
      "clave_situacion": "gestion_profesional",
      "etiqueta": "Reuniones de trabajo, networking o regalos corporativos",
      "modulos_requeridos": [
        "relaciones_y_red.laborales",
        "perfil_comunicacion",
        "logistica_y_ubicacion"
      ]
    }
  ]
}

