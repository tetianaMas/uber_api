require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const {PORT} = require('./config');
const mongo = 'mongodb+srv://tetiana_maslova:test1@cluster0.jei9g.mongodb.net/uber-hw-3?retryWrites=true&w=majority';

const trucksRouter = require('./routers/trucksRouter');
const loadsRouter = require('./routers/loadsRouter');
const authRouter = require('./routers/authRouter');
const usersRouter = require('./routers/usersRouter');

app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/trucks', trucksRouter);
app.use('/api/loads', loadsRouter);

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

const start = async () => {
  await mongoose.connect(mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

start();
