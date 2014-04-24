function reverse(s) {
    return s.split("").reverse().join("");
}


function Editor(input, preview) {
    this.update = function () {
        if(input.value!="{{editorData}}")
        {
        /*preview.innerHTML = markdown.toHTML(input.value);
        console.log("Usemarkdown called!!!!!!!", preview.innerHTML);
        console.log("Usemarkdown called!!!!!!!",input.value);
        blogTextInput =input.value;
        */}
    };
    input.editor = this;
    this.update();
  }



var $ = function (id) {
    return document.getElementById(id);
};
    new Editor($("text-input"), $("preview"));
