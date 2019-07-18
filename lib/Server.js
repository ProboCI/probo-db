'use strict';

const EventConsumer = require('./event_consumer');

class Server {
  constructor(options) {
    this.db = options.db;
    this.config = options.config;
    this.logger = options.logger;

    let streamConfig = this.config.buildsEventStream.config;
    streamConfig.plugin = this.config.buildsEventStream.plugin;

    this.consumer = new EventConsumer(streamConfig);

    this.dbPlugins = options.dbPlugins;
  }

  start() {
    this.testConnection(() => {
      this.startStreamListeners();
    });
  }

  testConnection(done) {

    this.logger.info('Attempting to connect to database...');

    this.db.test()
      .then(result => {
        this.logger.info('Database connection successful!');
        this.logger.info('Rows found: ', result.rows[0].count);
        done();
      })
      .catch(error => {
        this.logger.error(error);
        process.exit(1);
      });
  }

  /**
   * Starts Kafka event stream listeners.
   */
  startStreamListeners() {

    this.consumer.start()
      .then(() => {
        this.logger.info('Now listening for build events on the eventbus');

        this.consumer.onMessage(data => {
          if (!data.data || !data.build) {
            return;
          }

          this.logger.info('Received build event');

          this.db.saveBuild(data.build)
            .then(() => {
              this.logger.info('Build saved in database, sending to plugins');

              this.consumer.commit();

              this.processPlugins(data);
            })
            .catch(error => {
              this.logger.error({err: error}, 'Could not save build in database.');
            });
        });

       });

  }

  /**
   * Process build events for db plugins.
   *
   * @param {Object.<string, any>} data - The Kafka event data.
   */
  processPlugins(data) {
    this.dbPlugins.forEach(plugin => {

      plugin.process(data.build)
        .then(() => {
          this.logger.info('Plugin has processed build event.');
        })
        .catch(error => {
          this.logger.error({err: error}, 'Plugin could not process build event');
        });

    });
  }

}

module.exports = Server;
