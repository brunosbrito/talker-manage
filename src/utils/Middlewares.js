const fs = require('fs').promises;

const path = require('path');

const talkersPath = path.resolve(__dirname, '../talker.json');

const getPersons = async () => {
  try {
    const data = await fs.readFile(talkersPath);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const getPersonId = async (id) => {
  const persons = await getPersons();
  const person = persons.find((p) => p.id === +(id));
  return person;
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const isEmail = /[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z.]*\w$/;

  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!isEmail.test(email)) {
    return res.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }

  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  } 
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  next();
};

const deletTalker = async (personId) => {
  const talker = await getPersons();
  const newTalker = talker.filter(({ id }) => id !== +personId);
  await fs.writeFile(talkersPath, JSON.stringify(newTalker));
};

const editPerson = async (id, requestPerson) => {
  const persons = await getPersons();
  const personsFiltered = persons.filter((person) => person.id !== id);
  const personEdited = {
    id,
    ...requestPerson,
  };
  const newPersons = [...personsFiltered, personEdited];
  await fs.writeFile(talkersPath, JSON.stringify(newPersons));
};

const insertPerson = async (newTalker) => {
  fs.writeFile(talkersPath, JSON.stringify(newTalker));
};

const validadeteAuthorization = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401)
      .json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
    return res.status(401)
      .json({ message: 'Token inválido' }); 
  }
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400)
      .json({ message: 'O campo "name" é obrigatório' }); 
  }
  if (name.length < 3) {
  return res.status(400)
    .json({ message: 'O "name" deve ter pelo menos 3 caracteres' }); 
  }
  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(400)
      .json({ message: 'O campo "age" é obrigatório' });
  }
  if (typeof age !== 'number') {
    return res.status(400).json({ message: 'O campo "age" deve ser do tipo "number"' });
  }
   if (Math.floor(age) !== age) {
    return res.status(400).json({ message: 'O campo "age" deve ser um "number" do tipo inteiro' });
  }
  if (age < 18) { 
    return res.status(400)
      .json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  next();
};

const validateWatchedAt = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  if (!watchedAt) {
    return res.status(400)
      .json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (!dateRegex.test(watchedAt)) {
    return res.status(400)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const validateRate = (req, res, next) => {
  const { talk } = req.body;

  if ((talk.rate < 1 || talk.rate > 5)) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
   }

  if (!talk.rate) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
   }

  if (Math.floor(talk.rate) !== talk.rate) {
  return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
 }

  next();
};

module.exports = {
  getPersons,
  getPersonId,
  validateEmail,
  validatePassword,
  validadeteAuthorization,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  insertPerson,
  validateRate,
  editPerson,
  deletTalker,
};