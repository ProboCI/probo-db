'use strict';

const Riker = require('riker');
const eventbus = require('probo-eventbus');

const probodb = require('../lib');
const Server = probodb.Server;

class ServerCommand extends Riker.Command {
  constructor() {
    super();
    this.help = 'Run the ProboDB server.';
    this.shortDescription = this.help;
  }
  run() {
    // TODO: Make this configurable.
    const consumer = new eventbus.plugins['Kafka'].Consumer({
      group: 'proboDb',
      topic: 'build_events',
      version: 1,
    });
    this.server = new Server({consumer});
    this.server.start();
  }
}

module.exports = ServerCommand;
