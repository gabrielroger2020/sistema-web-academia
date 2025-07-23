import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { UsersController } from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      nome: Joi.string().required(),
      usuario: Joi.string().required(),
      senha: Joi.string().min(6).required(),
      perfil: Joi.string().valid('admin', 'professor', 'aluno').required(),
    },
  }),
  usersController.create,
);

export default usersRouter;