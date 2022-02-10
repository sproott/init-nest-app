import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { AppModule } from './app.module'
import { Model } from 'objection'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import fastifyCookie from 'fastify-cookie'
import fastifyHelmet from 'fastify-helmet'
import { knex } from 'db/knex'

const isProduction = () => process.env.NODE_ENV === 'production'

async function bootstrap() {
  Model.knex(knex)

  if (isProduction()) {
    await knex.migrate.latest()
  }

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  })

  const config = new DocumentBuilder()
    // TODO set Swagger info
    .setTitle('TODO')
    .setDescription('TODO')
    .setVersion('TODO')
    .addTag('TODO')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  })

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const port = process.env.PORT ?? 4000
  await app.listen(port, '0.0.0.0')
}
bootstrap()
