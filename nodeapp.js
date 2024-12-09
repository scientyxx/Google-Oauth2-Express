const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
require('./auth');
app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use(express.static("picture"));
app.use(express.static('css'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/picture', express.static(__dirname + '/picture'));

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render('awal');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }
  ));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/google/failure'
  }),
  (req, res) => {
    // Setelah autentikasi berhasil, pastikan informasi pengguna disimpan di req.user
    req.session.user = req.user; // Misalkan informasi pengguna disimpan di session, sesuaikan dengan implementasi Anda
    res.redirect('/dashboard');
  }
);

app.get('/dashboard', isLoggedIn, (req, res) => {
  if (req.user) {
    res.render('index', { user: req.user });
  } else {
    // Handle jika user tidak terotentikasi
    res.redirect('/login'); // Atau rute lain sesuai kebutuhan Anda
  }
});


app.get('/logout', (req, res) => {
  // req.logout();
  req.session.destroy();
  res.render('login');
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});


// app.get('/', (req, res) => {
//   // res.sendFile('./index.html', { root: __dirname});
//   res.render('index')
// });





app.listen(3000, () => {
  console.log('Server started on port 3000');
});
