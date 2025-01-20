module.exports = {
  app: {
    port: 3000
  },
  database: {
    connection: process.env.DB_URI || 'mongodb://localhost:27017/shopping', // Dùng biến môi trường để linh hoạt
    option: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false
    }
  },
  session: {
    key: process.env.SESSION_KEY || '27bda112-99dd-4496-8015-ea20d1034228'
  }
};
