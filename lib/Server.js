'use strict';

const amqp = require('amqplib/callback_api');
const logger = require('./logger').getLogger();

class Server {
  constructor(options) {
    this.db = options.db;
    this.config = options.config;
    this.logger = options.logger;
    this.dbPlugins = options.dbPlugins;
  }

  start() {
    this.testConnection(() => {
      this.startStreamListeners();
    });
  }

  testConnection(done) {
    logger.info('Attempting to connect to database...');
    this.db.test()
      .then(result => {
        logger.info('Database connection successful!');
        logger.info('Rows found: ', result.rows[0].count);
        done();
      })
      .catch(error => {
        logger.error(error);
        process.exit(1);
      });
  }

  startStreamListeners() {
    amqp.connect(this.config.rabbit.url, function(connectError, connection) {
      if (connectError) {
        throw connectError;
      }
      logger.info('Connected to RabbitMQ');
      connection.createChannel(function(channelError, channel) {
        if (channelError) {
          throw channelError;
        }
        logger.info('Channel created.');
        channel.assertExchange('buildEvents', 'topic', {
          durable: false
        });
        channel.assertQueue('', {
          exclusive: true
        }, function(queueError, q) {
          if (queueError) {
            throw queueError;
          }
          channel.bindQueue(q.queue, 'buildEvents', 'proboDB.*');
          channel.consume(q.queue, function(msg) {
            const json = msg.content.toString();
            const data = JSON.parse(json);
            this.db.saveBuild(data.build)
              .then(() => {
                logger.info('Build saved in database, sending to plugins');
                //this.consumer.commit();
                this.processPlugins(data);
              })
              .catch(error => {
                logger.error({err: error}, 'Could not save build in database.');
              });
          });
        }, {
          noAck: true
        });
      });
    });
  };
    // this.consumer.start()
    //   .then(() => {
    //     this.logger.info('Now listening for build events on the eventbus');
    //     this.consumer.onMessage(data => {
    //       if (!data.data || !data.build) {
    //         return;
    //       }
    //       this.logger.info('Received build event');
    //       this.db.saveBuild(data.build)
    //         .then(() => {
    //           this.logger.info('Build saved in database, sending to plugins');
    //           this.consumer.commit();
    //           this.processPlugins(data);
    //         })
    //         .catch(error => {
    //           this.logger.error({err: error}, 'Could not save build in database.');
    //         });
    //     });
    //    });

  /**
   * Process build events for db plugins.
   *
   * @param {Object.<string, any>} data - The Kafka event data.
   */
  processPlugins(data) {
    this.dbPlugins.forEach(plugin => {

      plugin.process(data.build)
        .then(() => {
          logger.info('Plugin has processed build event.');
        })
        .catch(error => {
          logger.error({err: error}, 'Plugin could not process build event');
        });

    });
  }
}

module.exports = Server;
