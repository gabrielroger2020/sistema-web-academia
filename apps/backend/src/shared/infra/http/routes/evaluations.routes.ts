import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { EvaluationsController } from '../controllers/EvaluationsController';

const evaluationsRouter = Router();
const evaluationsController = new EvaluationsController();

evaluationsRouter.use(isAuthenticated);

evaluationsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      alunoId: Joi.string().uuid(),
      professorId: Joi.string().uuid(),
    },
  }),
  evaluationsController.list
);

evaluationsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      idUsuarioAluno: Joi.string().uuid().required(),
      peso: Joi.number().positive().required(),
      altura: Joi.number().positive().required(),
    },
  }),
  evaluationsController.create,
);

export default evaluationsRouter;