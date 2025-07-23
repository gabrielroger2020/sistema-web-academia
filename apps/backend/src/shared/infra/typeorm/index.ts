import { DataSource } from 'typeorm';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.resolve(__dirname, '..', '..', '..', '..', 'database.sqlite'),
  entities: [path.resolve(__dirname, '..', '..', '..', 'modules', '**', 'entities', '*.ts')],
  migrations: [path.resolve(__dirname, 'migrations', '*.ts')],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });