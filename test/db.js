'use strict';

process.env.NODE_ENV = 'test';

const should = require('should');
const Db = require('../lib/Db');
const knexConfig = require('../knexfile');
const config = knexConfig[process.env.NODE_ENV];
const knex = require('knex')(config);
const builds = require('./fixtures/builds');

describe('Insert build record', function() {

  beforeEach(function(done) {
    knex.migrate.rollback()
      .then(function() {
          return knex.migrate.latest();
      })
      .then(function() {
        return knex.seed.run();
      })
      .then(function() {
        done();
      });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      done();
    });
  });

  function verifyBuild(buildId) {
    return knex('build').where('buildId', buildId).first();
  }

  describe('Db functions', function() {
    it('should save a build', function(done) {
      let db = new Db(config);
      db.saveBuild(builds[0])
        .then(function() {
          return verifyBuild(builds[0].id);
        })
        .then(function(data) {
          should.equal(data.buildId, builds[0].id);
          done();
        })
    });
  });

});
