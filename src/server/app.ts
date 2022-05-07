import path from 'path';

import express, {
  Application,
  NextFunction,
  Request,
  Response,
  RequestHandler,
} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize = require('express-mongo-sanitize');
import rateLimit from 'express-rate-limit';
import cookieParser = require('cookie-parser');

import routes from '../routes';
import globalErrorHandler from '../controllers/error';
import AppError from '../utils/appError';

const app: Application = express();

// 1) GLOBAL MIDDLEWARES
//  - Implementando cors
// app.use(cors());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Este middleware es para peticiones de verbos HTTP un poco mas complejos (PATCH, PUT, DELETE)
app.options('*', cors() as RequestHandler);

// console.log(path.join(__dirname, '../../public'));
//  - Configurando rutas estaticas
app.use(express.static(path.join(__dirname, '../../public')));

//  - Configurando headers se seguridad para HTTP
app.use(helmet());

//  - Saneamiento de datos para prevencion de ataques NoSQL injection
app.use(mongoSanitize());

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log('da cookies:');
  console.log(JSON.stringify(req.cookies));
  next();
});

app.use('/api', routes);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
