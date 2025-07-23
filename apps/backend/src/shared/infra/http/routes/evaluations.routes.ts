import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { ensureAdminOrProfessor  } from '../middlewares/ensureAdminOrProfessor';
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
  ensureAdminOrProfessor,
  celebrate({
    [Segments.BODY]: {
      idUsuarioAluno: Joi.string().uuid().required(),
      peso: Joi.number().positive().required(),
      altura: Joi.number().positive().required(),
    },
  }),
  evaluationsController.create,
);

evaluationsRouter.put(
  '/:id',
  ensureAdminOrProfessor,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      peso: Joi.number().positive(),
      altura: Joi.number().positive(),
    },
  }),
  evaluationsController.update,
);

evaluationsRouter.delete(
  '/:id',
  ensureAdminOrProfessor,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  evaluationsController.delete,
);

export default evaluationsRouter;