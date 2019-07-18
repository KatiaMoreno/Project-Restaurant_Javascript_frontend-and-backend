var conn = require('./db');

module.exports={ 
    
    /*show into dashboard admin how many register has into database*/
    dashboard(){
        return new Promise((resolve, reject)=>{

        conn.query(`SELECT
        (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
        (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
        (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
        (SELECT COUNT(*) FROM tb_users) AS nrusers;
        `,(err, results) => {
            if(err){
                reject(err);
            }else{
                resolve(results[0]);
            }
        });

        });

    },

   // Sidebar 
    getParametros(req,parametros){

        return Object.assign({},{
            sidebars:req.sidebars,
            user:req.session.user
        },parametros );
    },
    
    getSidebars(req){

        let sidebars = [
            {
                text:"Dashboard",
                href:"/admin/",
                icon:"home",
                active:false
            },
            {
                text:"Menu",
                href:"/admin/menus",
                icon:"cutlery",
                active:false
            },
            {
                text:"Reservation",
                href:"/admin/reservations",
                icon:"calendar-check-o",
                active:false
            },
            {
                text:"Contact",
                href:"/admin/contacts",
                icon:"comments",
                active:false
            },
            {
                text:"Users",
                href:"/admin/users",
                icon:"users",
                active:false
            },
            {
                text:"E-mails",
                href:"/admin/emails",
                icon:"envelope",
                active:false
            }

        ];

        sidebars.map(sidebar =>{

            if(sidebar.href === `/admin${req.url}`)sidebar.active = true;
            console.log(req.url, sidebar.href);

        });

        return sidebars;
    }

  
   

};

