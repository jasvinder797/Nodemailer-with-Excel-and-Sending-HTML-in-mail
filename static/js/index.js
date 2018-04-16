console.log = function(){};  /*disable all console log */

window.onload = function() {
   
}
function test(){
    upload()
    return false;
}
function upload(){

    var formElement = document.querySelector("#uploadForm");
    var ajaxRequest = new XMLHttpRequest();
    if (ajaxRequest) 
    {
        ajaxRequest.onreadystatechange = ajaxResponse;
        ajaxRequest.open("POST", "/sendmail/");
       // ajaxRequest.setRequestHeader("Content-Type", "application/json");
        ajaxRequest.send(new FormData(formElement));  
    }
    function ajaxResponse() {
        if(ajaxRequest.readyState != 4)
        {
            console.log("its in process")

        }else if(ajaxRequest.status == 200){
            alert(this.responseText);
        }
        else{
            console.log("Error")
        }
         
  }
}
