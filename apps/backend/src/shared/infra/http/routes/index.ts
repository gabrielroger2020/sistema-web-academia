import { Router } from 'express';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import evaluationsRouter from './evaluations.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/evaluations', evaluationsRouter);

export default routes;