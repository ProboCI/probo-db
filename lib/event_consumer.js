'use strict';

const Promise = require('bluebird');
const eventbus = require('probo-eventbus');

const logger = require('./logger').getLogger();

class EventConsumer {
  constructor(config) {
    this.config = config;
  }

  async start() {

    return new Promise((resolve, reject) => {
      try {
        this._consumer = new eventbus.plugins[this.config.plugin].Consumer(this.config);

        this._consumer.consumer.on('error', error => {
          logg.error({error: error});
        });

        return resolve();
      }
      catch (err) {
        logger.error({err: err}, `Failed to instantiate build stream producer plugin: ${err.message}`);
        return reject(err);
      }
    });

  }

  /**
   * Wrapper around onMessage event.
   *
   * @param {(...args) => void} listener - The listener function.
   */
  onMessage(listener) {
    this._consumer.consumer.on('message', message => {
      let value = JSON.parse(message.value);

      listener(value.data);
    });
  }

  /**
   * Commits the current offset.
   */
  commit() {
    this._consumer.consumer.commit((err, data) => {
      if (err) {
        logger.error({err: err}, 'Error commiting offset');
      }
    });
  }
}

module.exports = EventConsumer;
