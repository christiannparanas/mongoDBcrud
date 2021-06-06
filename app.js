
const _ = require('lodash');
const express = require('express');
const morgan = require('morgan'); 
const mongoose = require('mongoose'); 

// require the exported model
const Blog = require('./models/blog');
const { result } = require('lodash');

// express app
const app = express();

// connection string of mongoDB
const dbURI = 'mongodb+srv://christian:thea1718@freedom.dpkct.mongodb.net/freedom?retryWrites=true&w=majority';

// connect to mongo using mongoose
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }) 
.then((result) => console.log('connected to db')) // listen to 3000 if the connection is established
.catch((err) => console.log(err))


// listen - so that we can connect to localhost:3000
app.listen(3000)

// ========= middlewares ========

// register view engine
app.set('view engine', 'ejs');

// middleware & static files to use stylesheet
app.use(express.static('public'));

// this is to get the send data from a form in the createPost view 
app.use(express.urlencoded({ extended: true }))

// morgan middleware to log details
app.use(morgan('dev')); 



// ============ ROUTES ===========
// home
app.get('/', (req, res) => {
   // redirect to blogs route
   res.redirect('/blogs')
   
   // res.render('index', {
   //    title: 'Home', blogs });
});

// about
app.get('/about', (req, res) => {
   
   res.render('about', {
      title: 'About'
   });
});

// create post view
app.get('/blogs/create', (req, res) => {
   res.render('createPost', {
      title: 'Create Blog'
   });
});

// blog routes
app.get('/blogs', (req, res) => {
   Blog.find().sort({ createdAt: -1 }) // sort by its date of creation, newest to oldest
      .then((result) => {
         // render the index view
         res.render('index', {
            title: 'All Blogs',
            blogs: result // put the result to blogs that have in index view
         })
      })
      .catch((err) => {
         console.log(err)
      })
});


//  route paramters 

// view single post by id
app.get('/blogs/:id', (req, res) => {
   // put the id into var
   const id = req.params.id;

   Blog.findById(id)
      .then((result) => {
         res.render('singlePost', {
            blog: result,
            title: 'Single Blog'
         })
      })
      .catch((err) => {
         console.log(err)
      })

});



// this will recieve the data from the createPost view
app.post('/blogs', (req, res) => {
   // post it into the db
   const blog = new Blog( req.body )

   // save it in db
   blog.save()
      .then((result) => {
         res.redirect('/blogs')
      })
      .catch((err) => {
         console.log(err)
      })
});

// delete post
app.delete('/blogs/:id', (req, res) => {
   const id = req.params.id;

   Blog.findByIdAndDelete(id)
      .then((result) => {
         // parse to json
         res.json({ redirect: '/blogs' })
      })
      .catch((err) => {
         console.log(err)
      })
})


// 404 page
app.use((req, res) => {
   res.status(404).render('404', {
      title: '404'
   });
})

