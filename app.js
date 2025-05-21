require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const Book = require('./models/Book');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Home page: list books
app.get('/', async (req, res) => {
  const sort = req.query.sort || 'date_read';
  const books = await Book.find().sort({ [sort]: -1 });
  res.render('index', { books });
});

// New book form
app.get('/new', (req, res) => res.render('new'));

// Add new book
app.post('/books', async (req, res) => {
  const { title, author, rating, notes, date_read } = req.body;
  const cover_url = `https://covers.openlibrary.org/b/Title/${encodeURIComponent(title)}-M.jpg`;

  const book = new Book({ title, author, rating, notes, date_read, cover_url });
  await book.save();
  res.redirect('/');
});

// Edit form
app.get('/edit/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render('edit', { book });
});

// Update book
app.post('/edit/:id', async (req, res) => {
  const { title, author, rating, notes, date_read } = req.body;
  const cover_url = `https://covers.openlibrary.org/b/Title/${encodeURIComponent(title)}-M.jpg`;

  await Book.findByIdAndUpdate(req.params.id, {
    title, author, rating, notes, date_read, cover_url
  });
  res.redirect('/');
});

// Delete book
app.post('/delete/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(4000, () => console.log(`Server running on http://localhost:4000`));

