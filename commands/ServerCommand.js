'use strict';

const Riker = require('riker');
const eventbus = require('probo-eventbus');

const probodb = require('../lib');
const Db = probodb.Db;
const Server = probodb.Server;

class ServerCommand extends Riker.Command {
  constructor() {
    super();
    this.help = 'Run the ProboDB server.';
    this.shortDescription = this.help;
  }

  configure(config) {
    this.config = config;
  }

  run(config) {
    // TODO: Make this configurable.
    this.config = config;
    console.log(this.config);
    const db = new Db(this.config);
    const consumer = new eventbus.plugins['Kafka'].Consumer({
      group: 'proboDb',
      topic: 'build_events',
      version: 1,
    });
    this.server = new Server({consumer, db});
    this.server.start();

  }
}

module.exports = ServerCommand;
