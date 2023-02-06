const express = require('express');

const app = express();
app.use(express.json());

const middlewares = require('./utils/Middlewares');

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.get('/talker', async (req, res) => {
  const result = await middlewares.getPersons();
  return res.status(200).json(result);
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
