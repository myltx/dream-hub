import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 启用跨域
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // swagger 配置
  const options = new DocumentBuilder()
    .setTitle('VisionaryHub') // 标题
    .setDescription('VisionaryHub接口文档') // 描述
    .setVersion('1.0') // 版本
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  //配置swgger地址
  SwaggerModule.setup('api-docs', app, document, {
    customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css',
    customJs:
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js',
    // customJsStr:
    //   'https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-standalone-preset.js',
  });

  await app.listen(process.env.PORT ?? 8081);
  console.log(`Application is running on: ${await app.getUrl()} , or http://localhost:${process.env.PORT}`);
}
bootstrap();
