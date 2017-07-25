'use strict';

process.env.NODE_ENV = 'test';

const should = require('should');
const Db = require('../lib/Db');
const knexConfig = require('../knexfile');
const config = knexConfig[process.env.NODE_ENV];
const knex = require('knex')(config);
const builds = require('./fixtures/builds');

const db = new Db({knex});

describe('DB', function() {
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

  describe('Writes', function() {

    function verifyBuild(buildId) {
      return knex('build').where('buildId', buildId).first();
    }

    it('should save a build', function(done) {
      db.saveBuild(builds[0])
        .then(function() {
          return verifyBuild(builds[0].id);
        })
        .then(function(data) {
          should.equal(data.buildId, builds[0].id);
          done();
        })
    });

    it('should have another build after saving', function(done) {
      let count = 0;
      knex('build').count('*').first()
        .then(function(result) {
          count = result.count;
          return db.saveBuild(builds[0]);
        })
        .then(function() {
          return knex('build').count('*').first();
        })
        .then(function(result) {
          should.equal(++count, result.count);
          done();
        });
    });

  });

  describe('Reads', function() {
    const buildId = 'edae5055-db9e-4ae4-8863-7561cb6e0aa2';
    const projectId = 'c01f0f8c-9774-43e7-b717-5ca78bd44c01';

    it('should return the build ids', function(done) {
      db.getBuilds()
        .then(function(result) {
          // This data comes from the seed file.
          should.equal(8, result.length);
          done();
        });
    });

    it('should return the project ids', function(done) {
      db.getProjects()
        .then(function(result) {
          // This data comes from the seed file.
          should.equal(5, result.length);
          done();
        });
    });

    it('should return the build by id', function(done) {
      db.getBuildById(buildId)
        .then(function(result) {
          // This data comes from the seed file.
          should.equal('firstPr', result.prName);
          should.equal('firstBranch', result.branchName);
          done();
        });
    });

    it('should return the build size by id', function(done) {
      db.getBuildSize(buildId)
        .then(function(result) {
          should.equal(1001, result);
          done();
        });
    });

    it('should return the total disk usage for a project by id', function(done) {
      db.getProjectDiskTotal(projectId)
        .then(function(result) {
          should.equal(2009, result);
          done();
        });
    });

  });

});
