/*pugglin - prototype to send the form
* add a method to object DOM of the form
*then will cancel the submit form default, and will send by AJAX
*
*/
HTMLFormElement.prototype.save=function(config){

    //get a form
    let form = this;

    // form send and pass event submit
    form.addEventListener('submit', e => {

        // cancel default
        e.preventDefault();
        
        //get the data as a data
        let formData = new FormData (form);

        // Send by AJAX - (will be informated by element into the form )
        fetch(form.action,{
        method:form.method,
        body: formData
        })
        .then(response => response.json())
        .then(json => {

            if(json.error){
               if(typeof config.failure === 'function') config.failure(json.error);
            }else{
                if(typeof config.success === 'function') config.success(json);
            }

          
        }).catch(err=>{
            
            if(typeof config.failure === 'function') config.failure(err);
        });
        
    
    });


}

