// ======================================================
// 📁 js/layouts/pageLayout.js
// ======================================================

(function(){

    const FILE = "pageLayout.js";

    const log   = (...a) => window.logger?.info?.(FILE, ...a);
    const debug = (...a) => window.logger?.debug?.(FILE, ...a);
    const warn  = (...a) => window.logger?.warn?.(FILE, ...a);
    const error = (...a) => window.logger?.error?.(FILE, ...a);

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

    } = {}){

        try{

            if(!container){
                return;
            }

            container.innerHTML = "";

            const sections =

                section.sections

                ||

                [];

            if(!Array.isArray(sections)){

                warn(
                    "sections inválido.",
                    sections
                );

                return;
            }

            for(const childSection of sections){

                const sectionContainer =

                    document.createElement(
                        "div"
                    );

                sectionContainer.className =
                    "page-section";

                container.appendChild(
                    sectionContainer
                );

                await window.layoutRenderer
                    ?.renderLayout({

                        container:
                            sectionContainer,

                        section:
                            childSection,

                        context

                    });

            }

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

    window.page = api;

    log(
        "✅ pageLayout registrado correctamente"
    );

})();