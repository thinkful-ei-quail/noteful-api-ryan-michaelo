module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
<<<<<<< HEAD
  DB_URL: process.env.DB_URL,
};
=======
  DB_URL: process.env.DB_URL || 'postgresql://dunder_mifflin@localhost/noteful',
};
>>>>>>> 2d618fa2f594e8fef13ce3052bf16180b63499f7
