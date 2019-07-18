class KmGrid{

    //will recive the paramtros
    constructor(config){

        config.listeners = Object.assign({
            afterUpdateClick:(e)=>{
                $('#modal-update').modal('show');                      
            },
            afterDeleteClick:(e)=>{              
                window.location.reload();
            },
            afterFormCreate:(e) => {
                window.location.reload();
            },
            afterFormUpdate:(e) => {
                window.location.reload();
            },
            afterFormCreateError:(e)=> {
                alert('Not send the form');
            },
            afterFormUpdateError:(e)=> {
                alert('Not send the form');
            }
         },config.listeners);

         //standard objects(padrao)
        this.options = Object.assign({},{
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: 'btn-update',
            btnDelete: 'btn-delete',
            onUpdateLoad: (form, name, data) =>{
              
              let input= form.querySelector('[name=' + name + ']');
               if(input) input.value = data[name];
                 
             } 
           
        },config);

        this.rows =[...document.querySelectorAll('table tbody tr')];

        // call methods
        this.initForms();
        this.initButtons();
        
    }
          
    // CREATE  //UPDATE 
    initForms(){
        
        this.formCreate = document.querySelector(this.options.formCreate);

        if( this.formCreate){
            this.formCreate.save({
                success:()=> {
                    this.fireEvent('afterFormCreate');
                },
                failure:()=>{
                    this.fireEvent('afterFormCreateError');
                }
            });
        }
            
       this.formUpdate = document.querySelector(this.options.formUpdate);

        if( this.formUpdate){
            this.formUpdate.save({
                    success:()=> {
                        this.fireEvent('afterFormUpdate');
                    },
                    failure:()=>{
                    this.fireEvent('afterFormUpdateError');
                    }
            });
        }        
    }

    //Fire an event handler to the specified node.
    fireEvent(name, args){
        // testing the typo of listeners[name] 
        // Make sure is a 'function', if a fucition the listeners pass correct
        // then call the fuction using the apply pass theyself and arguments
        if(typeof this.options.listeners[name] === 'function') this.options.listeners[name].apply(this,args);
    }
    
    //method to get tag <tr> data
    getTrData(e){

        let tr = e.path.find(el=>{
        
            return (el.tagName.toUpperCase() === 'TR');
    
            });
    
            return JSON.parse(tr.dataset.row); 


    }

    //buttons update click
    btnUpdateClick(e){
        
        this.fireEvent('beforeUpdateClick', [e]);
    
        let data = this.getTrData(e);

        for(let name in data){

            this.options.onUpdateLoad(this.formUpdate, name, data);
                
        }
        
        this.fireEvent('afterUpdateClick', [e]);
        

    }

    //buttons Delete click
    btnDeleteClick(e){

        this.fireEvent('beforeDeleteClick');
    
     
            let data = this.getTrData(e);
        
                if(confirm(eval('`'+ this.options.deleteMsg+'`'))){
        
                fetch(eval('`'+this.options.deleteUrl+'`'),{
                    method:'DELETE'
                    })
                    .then(response => response.json())
                    .then(json => {
                    
                    this.fireEvent('afterDeleteClick');
             });

        }

    }

    //Init buttons
    initButtons(){

        this.rows.forEach(row => {

            [...row.querySelectorAll('.btn')].forEach(btn =>{
                
                btn.addEventListener('click', e =>{

                    if(e.target.classList.contains(this.options.btnUpdate)){

                        this.btnUpdateClick(e);

                    }else if(e.target.classList.contains(this.options.btnDelete)){
                        
                        this.btnDeleteClick(e);

                    }else{

                        this.fireEvent('buttonClick',[e.target, this.getTrData(e), e]);
                    }
               
                });

            });
        });

          
        
    }
}