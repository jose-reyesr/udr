// ======================================================
// 📁 js/layouts/tabsLayout.js
// ======================================================
// ✅ UNIVERSAL DECLARATIVE RUNTIME
// ✅ Compatible con layoutRenderer actual
// ✅ Usa section
// ✅ Usa renderLayout()
// ✅ Registro automático
// ✅ Tabs recursivos
// ======================================================

(function(){

  const FILE = "tabsLayout.js";

  const log   = (...a) => window.logger?.info?.(FILE,...a);
  const debug = (...a) => window.logger?.debug?.(FILE,...a);
  const warn  = (...a) => window.logger?.warn?.(FILE,...a);
  const error = (...a) => window.logger?.error?.(FILE,...a);

  // ==================================================
  // EXPORT
  // ==================================================

  const api = {
      render
  };

  // ==================================================
  // MAIN
  // ==================================================

  async function render({

      container,
      section = {},
      context = {}

  }){

      try{

          if(!container){
              return;
          }

          container.innerHTML = "";

          const tabs =

              section.tabs ||

              section.items ||

              [];

          if(!Array.isArray(tabs)){

              warn(
                  "tabs inválido"
              );

              return;
          }

          if(!tabs.length){

              warn(
                  "tabs vacío"
              );

              return;
          }

          // ==========================================
          // WRAPPER
          // ==========================================

          const wrapper =
              document.createElement(
                  "div"
              );

          wrapper.className =
              "tabs-layout";

          container.appendChild(
              wrapper
          );

          // ==========================================
          // HEADER
          // ==========================================

          const header =
              document.createElement(
                  "div"
              );

          header.className =
              "tabs-header";

          wrapper.appendChild(
              header
          );

          // ==========================================
          // BODY
          // ==========================================

          const body =
              document.createElement(
                  "div"
              );

          body.className =
              "tabs-body";

          wrapper.appendChild(
              body
          );

          let currentIndex = 0;

          // ==========================================
          // ACTIVE BUTTONS
          // ==========================================

          function updateButtons(){

              header
              .querySelectorAll(
                  ".tab-button"
              )
              .forEach((btn,index)=>{

                  btn.classList.toggle(
                      "active",
                      index === currentIndex
                  );

              });

          }

          // ==========================================
          // RENDER TAB
          // ==========================================

          async function renderTab(index){

              body.innerHTML = "";

              const tab =
                  tabs[index];

              if(!tab){
                  return;
              }

              const sections =

                  tab.sections ||

                  [];

              // --------------------------------------
              // TAB SIMPLE
              // --------------------------------------

              if(

                  !sections.length &&
                  tab.component

              ){

                  await window
                  .layoutRenderer
                  ?.renderLayout({

                      container: body,

                      section: tab,

                      context: {

                          ...context,

                          currentTab:
                              tab,

                          currentTabIndex:
                              index

                      }

                  });

                  return;
              }

              // --------------------------------------
              // TAB CON SECTIONS
              // --------------------------------------

              for(
                  const childSection
                  of sections
              ){

                  const sectionContainer =
                      document.createElement(
                          "div"
                      );

                  sectionContainer.className =
                      "tab-section";

                  body.appendChild(
                      sectionContainer
                  );

                  await window
                  .layoutRenderer
                  ?.renderLayout({

                      container:
                          sectionContainer,

                      section:
                          childSection,

                      context: {

                          ...context,

                          currentTab:
                              tab,

                          currentTabIndex:
                              index

                      }

                  });

              }

          }

          // ==========================================
          // BUTTONS
          // ==========================================

          tabs.forEach((tab,index)=>{

              const button =
                  document.createElement(
                      "button"
                  );

              button.className =
                  "tab-button";

              button.innerText =

                  tab.label ||

                  tab.title ||

                  `Tab ${index + 1}`;

              button.onclick =
                  async ()=>{

                      currentIndex =
                          index;

                      updateButtons();

                      await renderTab(
                          index
                      );

                  };

              header.appendChild(
                  button
              );

          });

          // ==========================================
          // FIRST TAB
          // ==========================================

          updateButtons();

          await renderTab(0);

      }
      catch(e){

          error(
              "render:",
              e
          );

      }

  }

  // ==================================================
  // REGISTRO GLOBAL
  // ==================================================
  window.tabs = api;           // ← Muy importante

  log("✅ tabsLayout registrado correctamente");

})(); 