(function(){

    window.applyTemplate = function(template, data){
  
      if (!template) return "";
  
      return template.replace(/{{(.*?)}}/g, (_, key) => {
        try {
          return key.split(".").reduce((o,k)=>o[k], data) ?? "";
        } catch {
          return "";
        }
      });
    };
  
  })();