import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { SessionsController } from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      usuario: Joi.string().required(),
      senha: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

export default sessionsRouter;