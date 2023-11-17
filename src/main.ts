import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import MongoStore from 'connect-mongo';
import 'dotenv/config';
import session from 'express-session';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set the view engine
  app.set('view engine', 'ejs');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // TODO: set origin to the frontend url once it's deployed.
  app.enableCors({
    origin: '*',
  });

  app.use(helmet());

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      // Secure set to true when HTTPS is enabled
      cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 },
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        crypto: { secret: process.env.MONGO_SECRET },
      }),
    }),
  );


  const options = new DocumentBuilder()
  .setTitle('Your API Title')
  .setDescription('Your API description')
  .setVersion('1.0')
  .addServer('http://localhost:3000/', 'Local environment')
  .addServer('https://staging.yourapi.com/', 'Staging')
  .addServer('https://production.yourapi.com/', 'Production')
  .addTag('Your API Tag')
  .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);


  await app.listen(process.env.PORT || 3000);

  console.log(`Serving on: ${await app.getUrl()}`);
}
bootstrap();
