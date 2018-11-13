const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const{ensureAuthenticated} = require('../helpers/auth');

module.exports = router;

//Load  Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Idea Index Page
router.get('/', ensureAuthenticated, (req, res)=>{
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then(menu => {
        res.render('index',{
            menu:menu
        });
    });
});
// Add Idea Form
router.get('/add', ensureAuthenticated,(req, res) =>{
    res.render('menu/add');
});

// Edit Idea Form
router.get('/edit/:id',(req, res) =>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('error_msg','Not Authorised');
            res.redirect('/menu');
        }else{
            res.render('menu/edit',{
                idea: idea
            });
        }
    });

   });

// Restaurants
router.get('/restaurants',ensureAuthenticated,(req, res) =>{
    // Idea.findOne({
    //     _id: req.params.id
    // })
    // .then(idea => {
    //     if(idea.user != req.user.id){
    //         req.flash('error_msg','Not Authorised');
    //         res.redirect('/menu');
    //     }else{
            res.render('menu/restaurants');//,{
    //             idea: idea
    //         });
    //     }
    // });

   });

   //Cafe
   router.get('/cafe',ensureAuthenticated,(req, res) =>{
    res.render('menu/cafe');

   });

   //Cheapeats
   router.get('/cheapeats',ensureAuthenticated,(req, res) =>{
    res.render('menu/cheapeats');

   });

//Night Life
router.get('/nightlife',ensureAuthenticated,(req, res) =>{
    res.render('menu/nightlife');

   }); 

//Live
router.get('/live',ensureAuthenticated,(req, res) =>{
    res.render('menu/live');

   }); 

//Calender
router.get('/calender',ensureAuthenticated,(req, res) =>{
    res.render('menu/calender');

   });

//Process Form a Post Request form Form Submit
router.post('/', ensureAuthenticated, (req, res) =>{

    console.log(req.body);// It will console submitted idea title and details

    let errors = [];
    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'});
    }
    if(errors.length > 0){
        res.render('menu/add',{
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }else{
        //Storing the submitted form to MongoDB
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
        .save()
        .then(idea =>{
            req.flash('success_msg', 'A Video idea Added');
            res.redirect('/menu');
        });
    }
}); 

//Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Video idea Updated')
            res.redirect('/menu');
        })
    });

});


//Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res)=>{

    Idea.remove({_id: req.params.id})
    .then(() =>{
      
        req.flash('success_msg', 'Video idea removed');
        res.redirect('/menu');
    });

});