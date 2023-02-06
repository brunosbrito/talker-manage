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

module.exports = { getPersons, getPersonId };