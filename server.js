const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' })); // allow image data URLs

const DATA = path.join(__dirname, 'data.json');

async function readData() {
  try { return JSON.parse(await fs.readFile(DATA, 'utf8')); }
  catch (err) { return []; }
}

async function writeData(items) {
  await fs.writeFile(DATA, JSON.stringify(items, null, 2));
}

app.get('/items', async (req, res) => {
  res.json(await readData());
});

app.post('/items', async (req, res) => {
  const items = await readData();
  const item = { id: Date.now().toString(), ...req.body };
  items.push(item);
  await writeData(items);
  res.status(201).json(item);
});

app.delete('/items/:id', async (req, res) => {
  const id = req.params.id;
  const items = await readData();
  const filtered = items.filter(i => i.id !== id);
  await writeData(filtered);
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
