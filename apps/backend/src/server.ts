import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import { errors } from 'celebrate';
import './shared/infra/typeorm';
import routes from './shared/infra/http/routes';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());
app.use(routes);

app.use(errors());

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {

    if (err instanceof Error) {
      return response.status(400).json({
        message: err.message,
      });
    }

    console.error(err);
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}!`);
});