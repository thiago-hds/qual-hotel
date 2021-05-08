const app = require('./src/app');

const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
