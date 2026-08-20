// ======================================================
// 📁 js/ui/numberFieldRenderer.js
// ======================================================
// ✅ UNIVERSAL DECLARATIVE RUNTIME
// ======================================================

(function(){

const FILE = "numberFieldRenderer.js";

const error = (...a)=>window.logger?.error?.(FILE,...a);

window.numberFieldRenderer = {
    render,
    renderDisplay,
    renderEdit,
    formatValue
};

async function render({
    container,
    value,
    field={},
    mode="display",
    context={}
}={}){

    if(!container)return;

    container.innerHTML="";

    return mode==="edit"
        ? renderEdit({container,value,field,context})
        : renderDisplay({container,value,field,context});
}

function renderDisplay({container,value}){

    const div=document.createElement("div");
    div.className="field-number";
    div.innerText=formatValue(value);

    container.appendChild(div);
}

function renderEdit({
    container,
    value,
    field={},
    context={}
}){

    const input=document.createElement("input");

    input.type="number";
    input.className="field-number-edit";
    input.value=value ?? "";

    if(field.placeholder){
        input.placeholder=field.placeholder;
    }

    if(field.readonly){
        input.readOnly=true;
    }

    input.addEventListener(
        "input",
        ()=>context?.onChange?.(
            input.value===""
                ? null
                : Number(input.value)
        )
    );

    container.appendChild(input);
}

function formatValue(value){

    try{

        if(
            value===null ||
            value===undefined
        ){
            return "";
        }

        return String(value);

    }catch(e){

        error(
            "formatValue:",
            e
        );

        return "";
    }
}


})();
