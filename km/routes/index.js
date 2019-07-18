// Routes - index.js

var conn = require('./../connect_db/db');
var express = require('express');
var menus = require('./../connect_db/menus');
var reservations = require ('./../connect_db/reservations');
var contacts = require ('./../connect_db/contacts');
var emails = require('./../connect_db/emails');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus().then(results=>{
    res.render('index', 
    { 
        title: 'Km Restaurant',
        menus: results,
        isHome: true
    });
  });
});

/* GET menus page. */
router.get('/menus', function(req, res, next){

  menus.getMenus().then(results=>{
    res.render('menus',{
      title: 'Menus - Km Restaurant',
      background: 'images/img_bg_1.jpg',
      h1: "Wellcome to dining!",
      menus: results
    });
  });  
});

/* GET services page. */
router.get('/services', function(req, res, next){

  res.render('services',{
    title: 'Services - Km Restaurant',
    background: 'images/img_bg_1.1.jpg',
    h1: "It's our pleasure to serve your!"
  });
});

/* GET contacts page. */
router.get('/contacts', function(req, res, next){

  contacts.render(res,req);
  
});

/* POST contacts page. */
router.post('/contacts', function(req, res, next){

  if(!req.body.name){
    contacts.render(res,req, "*Required name" );
    }else if(!req.body.email){  
      contacts.render(res,req, "*Required email" );
    }else if(!req.body.message){  
      contacts.render(res,req, "*write message" );
    }else{
      contacts.save(req.body).then(results=>{
      req.body = {};
      contacts.render(res,req, null, "YOUR CONTACT HAS BEEN SEND SUCCESS!" );
    }).catch(err=>{
      contacts.render(res,req, err.message);
    });
  }
});

/* GET reservations page. */
router.get('/reservations', function(req, res, next){
  reservations.render(res,req);  
});

/* POST reservations page. */
router.post('/reservations', function(req, res, next){

  if(!req.body.name){
      reservations.render(res,req, "*Required name" );
    }else if(!req.body.email){  
      reservations.render(res,req, "*Required email" );
    }else if(!req.body.people){  
        reservations.render(res,req, "*Select number of people" );
    }else if(!req.body.date){  
        reservations.render(res,req, "*Required date" );
    }else if(!req.body.time){  
      reservations.render(res,req, "*Required time" );
    } else{

    reservations.save(req.body).then(results=>{
    req.body = {};
    reservations.render(res,req, null, "Thanks for reservation, Soon you will receive a confirmation  by email" );
    }).catch(err=>{
      reservations.render(res,req, err.message);
    }); 
  }
});

router.post("/subscribe", function(req, res, next){

  emails.save(req).then(results=>{
    res.send(results);
  }).catch(err=>{
    res.send(err);
  });

});



module.exports = router;