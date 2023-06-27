/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const BookModel = require('../model').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      BookModel.find({}, (err, data) => {
        if(err || !data) {
          res.send('data is empty');
        } else {
          let value = data.map(e => ({
            _id: e._id,
            title: e.book,
            comments: e.comments,
            commentcount: e.comments.length
          }));
          res.json(value);
        }
      })

    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      const newBook = BookModel({book: title});
      newBook.save((err, data) => {
        if(err || !data) {
          res.send('missing required field title');
        } else {
          res.json({_id: data._id, title: data.book });
        }
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      BookModel.deleteMany({}, (err, data) => {
        if(err) {
          res.send('error')
        } else {
          res.send('complete delete successful')
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      BookModel.findById(bookid, (err, data) => {
        if(err || !data) {
          res.send('no book exists')
        } else {
          res.json({_id: data._id, title: data.book, comments: data.comments})
        }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!bookid) {
        res.send('missing required field title');
        return;
      };

        BookModel.findById(bookid, (err, data) => {
          if(err || !data) {
            res.send('no book exists');
          } else if (!comment) {
            res.send('missing required field comment');
          } else {
            data.comments.push(comment)
            data.save((err, value) => {
              if(err, !value) {
                res.send('post request failed');
              } else {
                res.json({_id: value._id, title: value.book, comments: value.comments, commentcount: value.comments.length});
              }
            })
          }
        })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      BookModel.findByIdAndDelete(bookid, (err, data) => {
        if (err || !data) {
          res.send('no book exists');
        } else {
          res.send('delete successful')
        }
      })
    });
  
};
