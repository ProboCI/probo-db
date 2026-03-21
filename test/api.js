'use strict';

process.env.NODE_ENV = 'test';

const should = require('should');
const portfinder = require('portfinder');
const Db = require('../lib/Db');
const Api = require('../lib/Api');
const knexConfig = require('../knexfile');
const dbConfig = knexConfig[process.env.NODE_ENV];
const knex = require('knex')(dbConfig);
const builds = require('./fixtures/builds');

const db = new Db({knex});

const projectId = 'c01f0f8c-9774-43e7-b717-5ca78bd44c01';
const buildId = 'edae5055-db9e-4ae4-8863-7561cb6e0aa2';
const reapedProjectId = '5140b34e-21ed-4395-85bf-f3bda5adaa14';

const logger = {
  info: function() {return},
  error: function() {return}
};

let api = null;
let apiPort = null;

describe('API', function() {

  beforeEach(function(done) {
    knex.migrate.rollback()
      .then(function() {
          return knex.migrate.latest();
      })
      .then(function() {
        return knex.seed.run();
      })
      .then(function() {
        return portfinder.getPortPromise();
      })
      .then(function(port) {
        apiPort = port;
        const config = {port, host: 'localhost', serverName: 'testServer', version: 'test-1.0.0'};
        api = new Api({config, db, logger, apiPlugins: []});
        api.start();
        done();
      });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      api.stop();
      done();
    });
  });

  it('returns a 200 response on head requests', function(done) {
    fetch(`http://localhost:${apiPort}/`, {method: 'HEAD'})
      .then(function(response) {
        response.status.should.equal(200);
        done();
      })
      .catch(done);
  });

  it('returns a version number', function(done) {
    fetch(`http://localhost:${apiPort}/`)
      .then(function(response) {
        response.status.should.equal(200);
        return response.text();
      })
      .then(function(body) {
        body.should.containEql('test-1.0.0');
        done();
      })
      .catch(done);
  });

  it('returns an array of projects', function(done) {
    fetch(`http://localhost:${apiPort}/project`)
      .then(function(response) {
        response.status.should.equal(200);
        return response.text();
      })
      .then(function(body) {
        let data = JSON.parse(body);
        data.length.should.equal(5);
        body.should.containEql(projectId);
        done();
      })
      .catch(done);
  });

  it('returns disk usage for a project', function(done) {
    fetch(`http://localhost:${apiPort}/project/${projectId}/disk-usage`)
      .then(function(response) {
        response.status.should.equal(200);
        return response.text();
      })
      .then(function(body) {
        let data = JSON.parse(body);
        data.should.equal('2009');
        done();
      })
      .catch(done);
  });

  it('returns the number zero for project disk usage if all builds are reaped', function(done) {
    fetch(`http://localhost:${apiPort}/project/${reapedProjectId}/disk-usage`)
      .then(function(response) {
        response.status.should.equal(200);
        return response.text();
      })
      .then(function(body) {
        let data = JSON.parse(body);
        data.should.equal('0');
        done();
      })
      .catch(done);
  });

  it('returns an array of builds', function(done) {
    fetch(`http://localhost:${apiPort}/build`)
      .then(function(response) {
        response.status.should.equal(200);
        return response.text();
      })
      .then(function(body) {
        let data = JSON.parse(body);
        data.length.should.equal(8);
        body.should.containEql(buildId);
        done();
      })
      .catch(done);
  });

  it('returns data for a build by id', function(done) {
    fetch(`http://localhost:${apiPort}/build/${buildId}`)
      .then(function(response) {
        response.status.should.equal(200);
        return response.json();
      })
      .then(function(data) {
        data.branchName.should.equal('firstBranch');
        data.prName.should.equal('firstPr');
        done();
      })
      .catch(done);
  });

  it('returns the disk usage for a build by id', function(done) {
    fetch(`http://localhost:${apiPort}/build/${buildId}/disk-usage`)
      .then(function(response) {
        response.status.should.equal(200);
        return response.text();
      })
      .then(function(body) {
        let data = JSON.parse(body);
        data.should.equal('1001');
        done();
      })
      .catch(done);
  });

});
