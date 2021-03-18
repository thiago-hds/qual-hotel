const app = require('./src/app').appInstance;

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
