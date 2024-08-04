import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception.filter';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

export const appSettings = (app: INestApplication) => {
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors) => {
        const customErrors: any = [];

        errors.forEach((e) => {
          const constraintsKeys = Object.keys(e.constraints!);
          constraintsKeys.forEach((key) => {
            customErrors.push({
              message: e.constraints![key],
              field: e.property,
            });
          });
        });

        throw new BadRequestException(customErrors);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
};
