// ======================================================
// 📁 js/layouts/personSelectorLayout.js
// ======================================================
// ✅ UNIVERSAL DECLARATIVE RUNTIME
// ✅ Layout selector: Persona 1 (Única) y Persona 2 (Múltiple 0..N) desde JSON
// ======================================================

(function(){

    const FILE = "personSelectorLayout.js";

    const log   = (...a) => window.logger?.info?.(FILE, ...a);
    const debug = (...a) => window.logger?.debug?.(FILE, ...a);
    const warn  = (...a) => window.logger?.warn?.(FILE, ...a);
    const error = (...a) => window.logger?.error?.(FILE, ...a);

    const api = {
        render
    };

    window.personSelectorLayout = api;

    // ==================================================
    // RENDER MAIN
    // ==================================================

    async function render({
        container,
        dataset = [],
        schema = {},
        context = {}
    }){
        try {
            if(!container){
                return;
            }

            container.innerHTML = "";

            // --------------------------------------------------
            // 🔍 1. LEER ARCHIVO JSON (ej. persona.json)
            // --------------------------------------------------
            const field = context.field || schema.field || {};
            const source = field?.relation?.source || schema?.relation?.source || {};
            
            const jsonFileName = source.file || "persona.json"; 
            const jsonPath = source.path || "";

            log(`Cargando personas desde el JSON: ${jsonFileName}`);

            // Cargar datos desde persona.json
            const peopleList = await loadPeopleFromJSON({
                fileName: jsonFileName,
                path: jsonPath,
                context
            });

            if(!peopleList || peopleList.length === 0){
                renderEmpty(container, `No se encontraron personas en ${jsonFileName}`);
                return;
            }

            // --------------------------------------------------
            // 2. CONSTRUIR ESTRUCTURA DEL DOM
            // --------------------------------------------------
            const wrapper = document.createElement("div");
            wrapper.className = "person-selector-layout";
            wrapper.style.display = "flex";
            wrapper.style.flexDirection = "column";
            wrapper.style.gap = "16px";
            wrapper.style.padding = "16px";

            // --------------------------------------------------
            // COMBOBOX 1: PERSONA 1 (EMISOR - SELECCIÓN ÚNICA)
            // --------------------------------------------------
            const person1Group = createFieldGroup("Persona 1 (Emisor):");
            const person1Select = document.createElement("select");
            person1Select.className = "detail-select";

            const defaultOpt1 = document.createElement("option");
            defaultOpt1.value = "";
            defaultOpt1.innerText = "-- Seleccione Persona 1 --";
            person1Select.appendChild(defaultOpt1);

            // Se llena con las personas del JSON
            peopleList.forEach((person, index) => {
                const opt = document.createElement("option");
                opt.value = person.id || index;
                opt.innerText = person.nombre || person.name || `Persona ${index + 1}`;
                opt.dataset.index = index;
                person1Select.appendChild(opt);
            });

            person1Group.appendChild(person1Select);
            wrapper.appendChild(person1Group);

            // --------------------------------------------------
            // COMBOBOX 2: INTENCIÓN (CAPA 5 DE PERSONA 1)
            // --------------------------------------------------
            const intentionGroup = createFieldGroup("Intención (Capa 5):");
            const intentionSelect = document.createElement("select");
            intentionSelect.className = "detail-select";
            
            const defaultIntentionOpt = document.createElement("option");
            defaultIntentionOpt.value = "";
            defaultIntentionOpt.innerText = "-- Seleccione una intención --";
            intentionSelect.appendChild(defaultIntentionOpt);

            intentionGroup.appendChild(intentionSelect);
            wrapper.appendChild(intentionGroup);

            // --------------------------------------------------
            // COMBOBOX 3: PERSONA 2 (RECEPTORES - SELECCIÓN MÚLTIPLE 0..N)
            // --------------------------------------------------
            const person2Group = createFieldGroup("Persona 2 (Receptor - Opcional / Selección Múltiple):");
            const person2Select = document.createElement("select");
            person2Select.className = "detail-select";
            person2Select.multiple = true;
            person2Select.size = 5;

            person2Group.appendChild(person2Select);
            wrapper.appendChild(person2Group);

            // --------------------------------------------------
            // EVENTO AL CAMBIAR PERSONA 1
            // --------------------------------------------------
            person1Select.onchange = () => {
                const selectedIndex = person1Select.options[person1Select.selectedIndex]?.dataset?.index;
                const selectedPerson1 = peopleList[selectedIndex];

                // Limpiar selecciones dependientes
                intentionSelect.innerHTML = "";
                intentionSelect.appendChild(defaultIntentionOpt.cloneNode(true));
                person2Select.innerHTML = "";

                if (!selectedPerson1) return;

                // A. Extraer Intenciones de la Persona 1 seleccionada (Capa 5)
                const motorConfig = selectedPerson1?.definition?.motor_config || {};
                const rutas = motorConfig.rutas_orquestacion || {};
                const contenedorPath = rutas.contenedor;

                let mapaIntenciones = [];
                if (window.pathResolver && contenedorPath) {
                    mapaIntenciones = window.pathResolver.getByPath(selectedPerson1, contenedorPath, []);
                } else {
                    mapaIntenciones = selectedPerson1.capa5 || selectedPerson1.intenciones || [];
                }

                const campoContexto = rutas.campo_contexto || "intencion";

                if (Array.isArray(mapaIntenciones)) {
                    mapaIntenciones.forEach(item => {
                        const val = window.pathResolver?.getByPath(item, campoContexto, item) || item;
                        const opt = document.createElement("option");
                        opt.value = typeof val === "string" ? val : (item.intencion || item.nombre || JSON.stringify(val));
                        opt.innerText = opt.value;
                        intentionSelect.appendChild(opt);
                    });
                }

                // B. Cargar opciones para Persona 2 (Selección Múltiple excluyendo Persona 1)
                peopleList.forEach((person, index) => {
                    if (String(index) === String(selectedIndex)) return; // Se excluye el emisor
                    const opt = document.createElement("option");
                    opt.value = person.id || index;
                    opt.innerText = person.nombre || person.name || `Persona ${index + 1}`;
                    opt.dataset.index = index;
                    person2Select.appendChild(opt);
                });
            };

            // --------------------------------------------------
            // BOTÓN DE EJECUCIÓN (INVOCA contextResolver.js)
            // --------------------------------------------------
            const actions = document.createElement("div");
            actions.className = "detail-actions";

            const executeButton = document.createElement("button");
            executeButton.className = "detail-button detail-button-save";
            executeButton.innerText = "🚀 Resolver Contexto";

            executeButton.onclick = async () => {
                try {
                    const idx1 = person1Select.options[person1Select.selectedIndex]?.dataset?.index;
                    const persona1Obj = peopleList[idx1];
                    const selectedIntencion = intentionSelect.value;

                    // Mapeo de seleccionados para Persona 2 (Array de 0 a N objetos)
                    const selectedIndicesP2 = Array.from(person2Select.selectedOptions).map(opt => opt.dataset.index);
                    const persona2List = selectedIndicesP2.map(idx => peopleList[idx]).filter(Boolean);

                    if (!persona1Obj) {
                        alert("Por favor seleccione Persona 1.");
                        return;
                    }

                    if (!selectedIntencion) {
                        alert("Por favor seleccione una intención.");
                        return;
                    }

                    log("Invocando contextResolver.execute con:", {
                        persona1: persona1Obj,
                        intencion: selectedIntencion,
                        persona2: persona2List // Lista vacía [] o con N personas seleccionadas
                    });

                    if (window.contextResolver?.execute) {
                        await window.contextResolver.execute({
                            persona1: persona1Obj,
                            intencion: selectedIntencion,
                            persona2: persona2List,
                            field,
                            selectedId: context.selectedId || null,
                            selectedField: context.selectedField || null,
                            selectedValue: context.selectedValue || null
                        });
                    } else {
                        error("window.contextResolver.execute no está disponible.");
                    }

                } catch (err) {
                    error("Error al ejecutar contextResolver:", err);
                }
            };

            actions.appendChild(executeButton);
            wrapper.appendChild(actions);

            container.appendChild(wrapper);

        } catch (e) {
            error("render:", e);
        }
    }

    // ==================================================
    // FUNCIÓN PARA LEER EL ARCHIVO JSON DINÁMICAMENTE
    // ==================================================

    async function loadPeopleFromJSON({ fileName, path, context }) {
        try {
            if (window.runtime?.init) {
                const runtimeContext = await window.runtime.init({
                    file: fileName,
                    path: path,
                    profile: "selector",
                    context: {
                        parameters: {
                            selectedId: context.selectedId,
                            selectedField: context.selectedField,
                            selectedValue: context.selectedValue
                        }
                    }
                });

                const root = runtimeContext?.root;
                if (Array.isArray(root)) return root;
                if (root) return [root];
            }

            const response = await fetch(`./${fileName}`);
            if (response.ok) {
                const json = await response.json();
                return Array.isArray(json) ? json : [json];
            }
        } catch (e) {
            warn(`No se pudo leer el archivo ${fileName}:`, e);
        }

        return [];
    }

    // ==================================================
    // HELPERS
    // ==================================================

    function createFieldGroup(labelText) {
        const group = document.createElement("div");
        group.className = "detail-row";
        group.style.display = "flex";
        group.style.flexDirection = "column";
        group.style.gap = "4px";

        const label = document.createElement("label");
        label.className = "detail-label";
        label.innerText = labelText;

        group.appendChild(label);
        return group;
    }

    function renderEmpty(container, message = "Sin datos") {
        const div = document.createElement("div");
        div.className = "detail-empty";
        div.innerText = message;
        container.appendChild(div);
    }

})();