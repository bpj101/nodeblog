'use strict';

var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* Add Cstegories */
router.get('/add', function (req, res, next) {
  res.render('addcategory', {
    'title': 'Add Category'
  });
});


router.post('/add', function (req, res, next) {
  // Get Form Values
  var title = req.body.title;

  console.log(req.body.title);

  // Form Validation
  req.checkBody('title', 'Title field is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render('addcategory', {
      'errors': errors,
      'title': title
    });
  } else {
    var categories = db.get('categories');

    // Submit to DB
    categories.insert({
      'title': title
    }, function (err, category) {
      console.log(category);
      if (err) {
        res.send('There was an issue submitting the category');
      } else {
        req.flash('success', 'Category Added');
        res.location('/');
        res.redirect('/');
      }
    });
  }
});

module.exports = router;