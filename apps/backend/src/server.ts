// src/server.ts
import 'reflect-metadata';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ message: 'Sooro By The Whey - API' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}!`);
});