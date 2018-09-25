const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const {
  createContainer,
  asClass,
  asFunction,
  asValue,
  Lifetime,
} = require('awilix');
const config = require('../config');
const { logger, connectMongo } = require('./infrastructures');
const { apis, middleware } = require('./interfaces');
const Models = require('./infrastructures/database/models');


class App {
  static init() {
    this.koa = new Koa();
    const container = createContainer();
    container
      .register({
        logger: asFunction(logger).scoped(),
      })
      .register({
        config: asValue(config),
      });

    // load models
    Object.keys(Models).forEach(key => {
      container.register({
        [key]: asValue(Models[key])
      });
    });

    // load repository
    container.loadModules(
      [
        'src/domains/repositories/**/*.js',
      ],
      {
        formatName: (name, descriptor) => { // eslint-disable-line no-unused-vars
          return name.replace(/(Mongo)/g, '');
        },
        resolverOptions: {
          lifetime: Lifetime.SINGLETON,
          register: asClass,
        }
      }
    );

    // application task
    container.loadModules(
      [
        'src/applications/task/*.js',
      ],
      {
        resolverOptions: {
          lifetime: Lifetime.SINGLETON,
          register: asClass,
        }
      }
    );
    // load service
    container.loadModules(
      [
        'src/domains/services/*.js',
      ],
      {
        resolverOptions: {
          lifetime: Lifetime.SINGLETON,
          register: asFunction,
        }
      }
    );

    this.koa
      .use(cors())
      .use(helmet({
        dnsPrefetchControl: true,
        noSniff: true,
        xssFilter: true
      }))
      .use(bodyParser({
        enableTypes: ['json', 'form'],
        jsonLimit: '1mb',
        textLimit: '1mb',
        strict: true,
        onerror: (err, ctx) => {
          ctx.throw(err.message, 442);
        }
      }))
      .use((ctx, next) => {
        ctx.scope = container.createScope();
        return next();
      })
      .use(middleware)
      .use(apis.apiV1.routes())
      .use(apis.apiV1.allowedMethods());

    // server listen error
    this.koa.on('error', async (err, ctx) => {
      console.error('error ------------> ', err.message);
      console.error('server error', err, ctx);
    });

    return this;
  }

  static async start() {
    await connectMongo(config);
    return new Promise((resolve) => {
      http.createServer(this.koa.callback())
        .listen(process.env.PORT || config.web.port, () => {
          return resolve(`Server ID ${process.pid} listen port ${process.env.PORT || config.web.port}`);
        });
    });
  }
}


module.exports = App;