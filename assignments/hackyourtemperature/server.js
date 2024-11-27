import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello from backend to frontend!');
});

app.post('/weather', (req, res) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ error: 'Missing field: cityName' });
  }

  res.json({
    message: `Weather data received for ${cityName}`,
    data: { cityName },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
