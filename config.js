module.exports = {
  app: {
    port: 3000
  },
  database: {
    connection: 'mongodb+srv://bkhoi:baokhoi352006@cluster0.pptfi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    option: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  session: {
    key: '27bda112-99dd-4496-8015-ea20d1034228'
  }
};
