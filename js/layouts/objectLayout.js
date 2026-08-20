// ======================================================
// 📁 js/layouts/objectLayout.js
// ======================================================
// ✅ UNIVERSAL DECLARATIVE RUNTIME
// ✅ Compatible con layoutRenderer nuevo
// ✅ Compatible con schemaResolver
// ✅ Compatible con dataResolver
// ✅ Compatible con fieldRenderer
// ✅ Recursividad ilimitada
// ======================================================

(function () {

  const FILE = "objectLayout.js";

  const log   = (...a) => window.logger?.info?.(FILE, ...a);
  const debug = (...a) => window.logger?.debug?.(FILE, ...a);
  const warn  = (...a) => window.logger?.warn?.(FILE, ...a);
  const error = (...a) => window.logger?.error?.(FILE, ...a);

  // =====================================================
  // EXPORTS
  // =====================================================

  const api = {

    render,

    renderRecord,

    renderField,

    renderObjectField,

    resolveFields

};

  // =====================================================
  // REGISTRO
  // =====================================================

//   if (window.layoutRenderer?.registerLayout) {

//       window.layoutRenderer.registerLayout(
//           "object",
//           api
//       );

//       log(
//           "Layout object registrado."
//       );

//   } else {

//       warn(
//           "layoutRenderer no disponible."
//       );
//   }

  // =====================================================
  // RENDER
  // =====================================================

  async function render({

      container,
      context = {},
      section = {}

  } = {}) {

      try {

          if (!container) {
              return;
          }

          container.innerHTML = "";

          let data;

          if(section.dataset){
          
              const dataset =
          
                  context.datasets?.[
                      section.dataset
                  ];
          
              if(!dataset){
                  return;
              }
          
              data = dataset.value;
          
          }
          else{
          
              data =
          
                  context.parentValue;
          
              if(!data){
                  return;
              }
          
          }
      
      const fields =
          await resolveFields(
              section,
              context
          );
      
      const records =
      
          Array.isArray(data)
      
              ? data
      
              : [data];
      
      for(const record of records){
      
          await renderRecord({
      
              container,
      
              record,
      
              fields,
      
              context,
      
              section
      
          });
      
      }

      } catch (e) {

          error(
              "render:",
              e
          );
      }
  }

  // =====================================================
  // RENDER RECORD
  // =====================================================

async function renderRecord({

    container,
    record,
    fields = [],
    context = {},
    section = {}

} = {}) {

      try {

          if (!record) {
              return;
          }

          const wrapper =
              document.createElement(
                  "div"
              );

          wrapper.className =
              "object-record";

          container.appendChild(
              wrapper
          );

          for(const field of fields){

              await renderField({

                  container: wrapper,

                  record,

                  field,

                  context,

                  section

              });
          }

      } catch (e) {

          error(
              "renderRecord:",
              e
          );
      }
  }

  // =====================================================
  // RENDER FIELD
  // =====================================================

  async function renderField({

      container,
      record,
      field,
      context = {},
      section = {}

  } = {}) {

      try {

          if (!field) {
              return;
          }

          if (
              field.hidden === true
          ) {
              return;
          }

          // ---------------------------------------------
          // COMPONENT
          // ---------------------------------------------

          if (field.component) {

              return await window.layoutRenderer
                  ?.renderLayout({

                      container,

                      section: field,

                      context: {

                          ...context,

                          currentItem: record,

                          item: record

                      }

                  });
          }

          // ---------------------------------------------
          // OBJECT
          // ---------------------------------------------

          if (
              field.tipo === "object"
          ) {

              return await renderObjectField({

                  container,

                  record,

                  field,

                  context,

                  section

              });
          }

          // ---------------------------------------------
          // SIMPLE FIELD
          // ---------------------------------------------

          const row =
              document.createElement(
                  "div"
              );

          row.className =
              "object-field";

          container.appendChild(
              row
          );

          if (
              field.showLabel !== false
          ) {

              const label =
                  document.createElement(
                      "div"
                  );

              label.className =
                  "object-field-label";

              label.innerText =
                  field.label ||
                  field.campo ||
                  "";

              row.appendChild(
                  label
              );
          }

          const valueContainer =
              document.createElement(
                  "div"
              );

          valueContainer.className =
              "object-field-value";

          row.appendChild(
              valueContainer
          );

          const value =
              window.pathResolver
                  ?.getByPath?.(
                      record,
                      field.campo
                  );

          await window.fieldRenderer
              ?.render?.({

                  container:
                      valueContainer,

                  value,

                  field,

                  mode:
                      section.mode ||
                      "display",

                  context: {

                      ...context,

                      currentItem:
                          record,

                      item:
                          record,

                      currentField:
                          field

                  }

              });

      } catch (e) {

          error(
              "renderField:",
              e
          );
      }
  }

  // =====================================================
  // OBJECT FIELD
  // =====================================================

  async function renderObjectField({

      container,
      record,
      field,
      context = {},
      section = {}

  } = {}) {

      try {

          const value =
              window.pathResolver
                  ?.getByPath?.(
                      record,
                      field.campo
                  );

          if (
              value === undefined ||
              value === null
          ) {
              return;
          }

          const wrapper =
              document.createElement(
                  "div"
              );

          wrapper.className =
              "object-nested";

          container.appendChild(
              wrapper
          );

          if (
              field.showLabel !== false
          ) {

              const title =
                  document.createElement(
                      "div"
                  );

              title.className =
                  "object-nested-title";

              title.innerText =
                  field.label ||
                  field.campo ||
                  "";

              wrapper.appendChild(
                  title
              );
          }

          const nestedRecords =
              Array.isArray(value)
                  ? value
                  : [value];

                //   debug(
                //     "OBJECT FIELD:",
                //     field.campo
                // );
                
                // debug(
                //     "NESTED VALUE:",
                //     value
                // );
                



                  const nestedFields =

                  await resolveFields(
              
                      field,
              
                      context
              
                  );

                //   debug(
                //     "NESTED FIELDS:",
                //     nestedFields
                // );         

          for (const nested of nestedRecords) {

            await renderRecord({

                container:
                    wrapper,
            
                record:
                    nested,
            
                fields:
                    nestedFields,
            
                context:{
            
                    ...context,
            
                    currentItem:
                        nested,
            
                    item:
                        nested
            
                },
            
                section:
                    field
            
            });
          }

      } catch (e) {

          error(
              "renderObjectField:",
              e
          );
      }
  }

  // =====================================================
  // RESOLVE FIELDS
  // =====================================================

  async function resolveFields(

    section = {},

    context = {}

){

    try{

        //--------------------------------------------------
        // CAMPOS EMBEBIDOS
        //--------------------------------------------------

        if (
            Array.isArray(section.fields) &&
            section.fields.length
        ){

            return section.fields.map(

                window.schemaResolver.normalizeField

            );

        }

        //------------------------------------------------
        // DATASET
        //------------------------------------------------

        const dataset =

            context.datasets?.[
                section.dataset
            ];

        //------------------------------------------------
        // SCHEMA
        //------------------------------------------------

        let schema =

            dataset?.schema ||

            [];

        //------------------------------------------------
        // FALLBACK
        //------------------------------------------------

        if(

            !schema.length &&

            section.schema

        ){

            schema =

                await window.schemaResolver
                ?.getSchema({

                    name:
                        section.schema,

                    context

                });

        }

        //------------------------------------------------
        // FIELDS EXPLÍCITOS
        //------------------------------------------------

        if(

            Array.isArray(
                section.fields
            )

        ){

            if(!schema.length){

                return section.fields;

            }

            return section.fields

                .map(field=>{

                    //------------------------------------------------
                    // STRING
                    //------------------------------------------------

                    if(

                        typeof field ===
                        "string"

                    ){

                        return schema.find(

                            item=>

                                item.campo ===
                                field

                        );

                    }

                    //------------------------------------------------
                    // OBJECT
                    //------------------------------------------------

                    if(

                        field &&
                        typeof field ===
                        "object"

                    ){

                        const base =

                            schema.find(

                                item=>

                                    item.campo ===
                                    field.campo

                            ) || {};

                        return {

                            ...base,

                            ...field

                        };

                    }

                    return null;

                })

                .filter(Boolean);

        }

        //------------------------------------------------
        // SCHEMA COMPLETO
        //------------------------------------------------

        return schema;

    }
    catch(e){

        error(
            "resolveFields:",
            e
        );

        return [];

    }

}

    // ==================================================
    // REGISTRO GLOBAL PARA RUNTIME
    // ==================================================
    window.object = api;                    // ← Agrega esta línea

    log("✅ objectLayout registrado correctamente");

})(); 