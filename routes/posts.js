'use strict';

var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var multer = require('multer');

var upload = multer({
  dest: './public/images/uploads'
});

/* Add Posts */
router.get('/add', function (req, res, next) {
  var categories = db.get('categories');
  categories.find({}, {}, function (err, categories) {
    res.render('addpost', {
      'title': 'Add Post',
      'categories': categories
    });
  });
});

router.post('/add', upload.single('mainimage'), function (req, res, next) {
  // Get Form Values
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();
  console.log(req.file);

  if (req.file) {
    var mainImageName = req.file.filename;
    var mainImageOriginalName = req.file.originalname;
    var mainImageMime = req.file.mimetype;
    var mainImagePath = req.file.path;
    var mainImageSize = req.file.size;
  } else {
    var mainImageName = 'noimage.png';
  }

  // Form Validation
  req.checkBody('title', 'Title field is required').notEmpty();
  req.checkBody('body', 'Body field is required').notEmpty();
  req.checkBody('author', 'Author field is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render('addpost', {
      'errors': errors,
      'title': title,
      'body': body,
      'author': author
    });
  } else {
    var posts = db.get('posts');

    // Submit to DB
    posts.insert({
      'title': title,
      'body': body,
      'category': category,
      'date': date,
      'author': author,
      'mainimage': mainImageName
    }, function (err, post) {
      if (err) {
        res.send('There was an issue submitting the post');
      } else {
        req.flash('success', 'Post Submmitted');
        res.location('/');
        res.redirect('/');
      }
    });
  }
});

module.exports = router;