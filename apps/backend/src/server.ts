import 'reflect-metadata';
import express from 'express';
import { errors } from 'celebrate';
import './shared/infra/typeorm';
import routes from './shared/infra/http/routes';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());
app.use(routes);

app.use(errors());

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}!`);
});