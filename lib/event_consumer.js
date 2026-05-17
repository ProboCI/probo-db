'use strict';

const eventbus = require('probo-eventbus');

const logger = require('./logger').getLogger();

class EventConsumer {
  constructor(config) {
    this.config = config;
  }

  async start() {
    try {
      this._consumer = new eventbus.plugins[this.config.plugin].Consumer(this.config);

      this._consumer.onError(error => {
        logger.error({err: error}, 'Kafka consumer error');
      });

      await this._consumer.start();
    }
    catch (err) {
      logger.error({err: err}, `Failed to instantiate build stream producer plugin: ${err.message}`);
      throw err;
    }
  }

  /**
   * Wrapper around onMessage event.
   *
   * @param {(...args) => void} listener - The listener function.
   */
  onMessage(listener) {
    this._consumer.onMessage(data => {
      listener(data);
    });
  }

  /**
   * Commits the current offset.
   */
  async commit() {
    try {
      await this._consumer.commit();
    }
    catch (err) {
      logger.error({err: err}, 'Error committing offset');
    }
  }
}

module.exports = EventConsumer;
