// Routes - admin.js
var express = require('express');
var users = require("./../connect_db/users");
var admin = require("./../connect_db/admin");
var menus = require("./../connect_db/menus");
var reservations = require("./../connect_db/reservations");
var contacts = require("./../connect_db/contacts");
var emails = require("./../connect_db/emails");
var moment = require("moment");
var router = express.Router();

/*Middleware that is specific to the router access the login*/ 
router.use(function(req,res,next){

    if(['/login'].indexOf(req.url) === -1 && !req.session.user){
        res.redirect("/admin/login");
    }else{
        next();
    }

});


/*Middleware Sidebar - to pass all router into admin*/ 
router.use(function(req,res,next){
    req.sidebars = admin.getSidebars(req);

    next();
});


/*Middleware router to logout */ 
router.get("/logout", function(req,res, netx){

    delete req.session.user;
 
    res.redirect("/admin/login");
    
 });

/* GET home Admin. */
router.get('/', function(req, res, next) {

    admin.dashboard().then(data=>{
         
     res.render('admin/index',admin.getParametros(req, {
         data
         }));
     
         }).catch(err=>{
             console.log(err);
         });
 });
     

 /* GET login */

 router.post('/login', function(req, res, next){
    if(!req.body.email){
            users.render(req,res, "Email Required fill.");
        }else if(!req.body.password){
            users.render(req,res, "Password Required fill.");
        }else{
            users.login(req.body.email, req.body.password).then(user=>{

                req.session.user = user;
                res.redirect("/admin");

            }).catch(err=>{

                users.render(req,res, err.message || err);
            });
   }

});
router.get("/login", function(req, res, next) {

    /* testing the redis**
    if(!req.session.views) req.session.views=0;
    console.log("SESSION: ", req.session.views++);
    */   

   users.render(req,res, null);

});


/* GET contacts. */
router.get("/contacts", function(req, res, next) {
    
    contacts.getContacts().then(data=>{
        res.render("admin/contacts", admin.getParametros(req,{
            data
        }));
        
    });
});

/*DELETE contacts*/
router.delete("/contacts/:id", function(req, res, next){
    contacts.delete(req.params.id).then(results =>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });

});


/* GET  emails. */
router.get("/emails", function(req, res, next) {

    emails.getEmails().then(data=>{
        res.render("admin/emails", admin.getParametros(req,{
            data
        }));
        
    });
});

/*DELETE emails*/
router.delete("/emails/:id", function(req, res, next){
    emails.delete(req.params.id).then(results =>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });

});

 
 /* GET menus. */
 router.get('/menus', function(req, res, next) {
    
    // menus.geMenus from connects_dc.js>menus.js
    //data will be is a data storage into menus and show in frontend 
    menus.getMenus().then(data =>{
        res.render('admin/menus', admin.getParametros(req,{
            data
        }));
    
    });
   
});


 /* POST menus. */
router.post("/menus", function(req, res, next){

    menus.save(req.fields, req.files).then(results =>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });

});

 /* DELETE menus. */
router.delete("/menus/:id", function(req, res, next){
    menus.delete(req.params.id).then(results =>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });

});


/* GET reservations. */
router.get("/reservations", function(req, res, next) {

     reservations.getReservations().then(data=> {
        res.render("admin/reservations", admin.getParametros(req,{
            date:{},
            data,
            moment
        
        }));

     });
    
           
});

/* POST reservations. */
router.post("/reservations", function(req, res, next){
  
    reservations.save(req.fields, req.files).then(results =>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });

});

 /* DELETE reservations. */
router.delete("/reservations/:id", function(req, res, next){
    reservations.delete(req.params.id).then(results =>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });

});

/* GET users. */
router.get("/users", function(req, res, next) {
    users.getUsers().then(data=>{
        res.render("admin/users", admin.getParametros(req,{
            data
        }));
    
    
    });
        
     
});

/* POST users. */
router.post("/users", function(req, res, next){
  
    users.save(req.fields).then(results =>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });

});

router.post("/users/password-change", function(req, res, next){
    users.changePassword(req).then(results=>{
        res.send(results);
    }).catch(err=>{
        res.send({
            error:err
        });
    });

});

 /* DELETE users. */
router.delete("/users/:id", function(req, res, next){
    users.delete(req.params.id).then(results =>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });

});

module.exports = router;