const path = require('path');
const express = require('express');
const session = require('express-session');
const routes = require('./controllers')
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: 'foundation',
  cookie: {},
  resave: true,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));
app.use(cors({ origin: '', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the build folder
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use('/api', routes);
// Catch-all route to serve the React app

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(
      `\nServer running on port ${PORT}. Visit http://localhost:${PORT} and create an account!`
    )
  );
});