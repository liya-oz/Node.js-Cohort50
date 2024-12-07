import express from 'express';
import router from './authRoutes.js';

const app = express();

app.use(express.json());
app.use('/auth', router);

app.use(express.static('client'));

app.listen(3000);
