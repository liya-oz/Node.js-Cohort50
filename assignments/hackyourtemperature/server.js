import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello from backend to frontend!');
});

app.post('/weather', (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'Missing required field: city' });
  }

  res.json({ message: `Weather data received for ${city}` });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
