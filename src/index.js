const express = require('express');

const crypto = require('crypto');

const app = express();
app.use(express.json());

const middlewares = require('./utils/Middlewares');

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.post('/login', middlewares.validateEmail, middlewares.validatePassword, (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(HTTP_OK_STATUS).json({
    token: `${token}`,
  });
});

app.get('/talker/search', middlewares.validadeteAuthorization, async (req, res) => {
  const { q } = req.query;

  const data = await middlewares.getPersons();
  const results = q
    ? data.filter(({ name }) => name.toLowerCase().includes(q.toLowerCase()))
    : data;
  
  return res.status(HTTP_OK_STATUS).json(results);
});

app.get('/talker', async (req, res) => {
  const result = await middlewares.getPersons();
  return res.status(HTTP_OK_STATUS).json(result);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await middlewares.getPersonId(id);
  if (talker) {
    return res.status(200).json(talker);
  } 
  return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/talker',
  middlewares.validadeteAuthorization,
  middlewares.validateName,
  middlewares.validateAge,
  middlewares.validateTalk,
  middlewares.validateWatchedAt,
  middlewares.validateRate,
async (req, res) => {
  const persons = await middlewares.getPersons();
  const id = persons.length + 1;
  const newTalker = {
    id,
    ...req.body,
    };
  persons.push(newTalker);
  await middlewares.insertPerson([...persons]);
  res.status(201).json(newTalker);
});

app.put('/talker/:id',
  middlewares.validadeteAuthorization,
  middlewares.validateName,
  middlewares.validateAge,
  middlewares.validateTalk,
  middlewares.validateWatchedAt,
  middlewares.validateRate,
async (req, res) => {
  const { id } = req.params;
  await middlewares.editPerson(+id, req.body);
  const newPersons = await middlewares.getPersons();
  const personEdited = newPersons.find((person) => person.id === +id);
  res.status(HTTP_OK_STATUS).json(personEdited);
});

app.delete('/talker/:id', middlewares.validadeteAuthorization, async (req, res) => {
  const { id } = req.params;
  await middlewares.deletTalker(+id);
  res.status(204).json();
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
