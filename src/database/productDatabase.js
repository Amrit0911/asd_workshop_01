const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../../data.json');

async function getAll() {
  const file = await fs.readFile(filePath, 'utf8');
  return JSON.parse(file);
}

async function saveAll(products) {
  await fs.writeFile(filePath, `${JSON.stringify(products, null, 2)}\n`);
  return products;
}

module.exports = { getAll, saveAll };
