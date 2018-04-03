'use strict';

const uuidv4 = require('uuid/v4');

class Db {
  constructor(options) {
    this.knex = options.knex;
    this.logger = options.logger;
    this.table = options.table;
  }

  test() {
    return this.knex.raw('SELECT count(*) FROM build');
  }

  getObjects(type, filters, options) {
    const self = this;
    console.log(type);
    console.log('here');
    const tablePlugin = self.table.getPlugin(type);
    if (tablePlugin) {
      return tablePlugin.getRows(filters, options);
    }
  }

  deleteObject(type, id, options) {
    const self = this;
    const tablePlugin = self.table.getPlugin(type);
    return tablePlugin.deleteRow(id, options);
  }

  createObject(type, data) {
    const self = this;
    data = self.table.mapData(type, data);
    if (self.table.Uuid() === true) {
      if (!data.uuid) {
        data.uuid = uuidv4();
      }
    }

    // This returns the uuid of the created object.
    return self.knex(type)
      .returning('uuid')
      .insert(data);
  }

  updateObject(type, uuid, data) {
    const self = this;
    data = self.table.mapData(type, data);
    // This returns the uuid of the created object.
    return self.knex(type)
      .where('uuid', uuid)
      .update(data);
  }

  saveBuild(build) {
    let self = this;
    let buildData = self.dbDataFromBuild(build);
    return self.knex('build')
      .where('uuid', build.id)
      .del()
      .then(function() {
        return self.knex('build').insert(buildData);
      });
  }

  getProjects() {
    return this.knex('build')
      .distinct('projectId')
      .map(function(row) {
        return row.projectId;
      });
  }

  getBuilds() {
    return this.knex('build')
      .distinct('uuid')
      .map(function(row) {
        return row.uuid;
      });
  }

  getBuildById(buildId) {
    return this.knex('build')
      .first()
      .where({uuid: buildId});
  }

  getBuildSize(buildId) {
    return this.getBuildById(buildId)
      .then(function(result) {
        return result.bytesReal;
      });
  }


  getProjectDiskTotal(projectId) {
    return this.knex
      .select('projectId')
      .sum('bytesReal')
      .from('build')
      .where({'projectId': projectId, 'reaped': false})
      .groupBy('projectId')
      .first()
      .then(function(result) {
        // If there are no active builds we don't get a result. This effectivly
        // means they are using zero bytes.
        let total = (result && result.sum) ? result.sum : 0;
        return total;
      });
  }

  dbDataFromBuild(build) {
    let self = this;
    return {
      branchName: self.getBuildPropertyOrMessage(build, 'branch.name'),
      branchUrl: self.getBuildPropertyOrMessage(build, 'branch.htmlUrl'),
      buildId: self.getBuildPropertyOrMessage(build, 'id', null),
      bytesReal: self.getBuildPropertyOrMessage(build, 'diskSpace.realBytes',  0) || 0,
      bytesVirtual: self.getBuildPropertyOrMessage(build, 'diskSpace.virtualBytes', 0) || 0,
      commitRef: self.getBuildPropertyOrMessage(build, 'commit.ref'),
      commitUrl: self.getBuildPropertyOrMessage(build, 'commit.htmlUrl'),
      config: JSON.stringify(self.getBuildPropertyOrMessage(build, 'config')),
      pinned: self.getBuildPropertyOrMessage(build, 'pinned', false),
      prDescription: self.getBuildPropertyOrMessage(build, 'pullRequest.description'),
      prName: self.getBuildPropertyOrMessage(build, 'pullRequest.name'),
      prNumber: self.getBuildPropertyOrMessage(build, 'pullRequest.number'),
      projectId: self.getBuildPropertyOrMessage(build, 'projectId'),
      prUrl: self.getBuildPropertyOrMessage(build, 'pullRequest.htmlUrl'),
      reaped: self.getBuildPropertyOrMessage(build, 'reaped', true),
      reapedDate: self.ensureDate(self.getBuildPropertyOrMessage(build, 'reapedDate', null)),
      reapedReason: self.getBuildPropertyOrMessage(build, 'reapedReason', 0),
      reapedReasonText: self.getBuildPropertyOrMessage(build, 'reapedReasonText', 'Old build with bad data.'),
      requestId: self.getBuildPropertyOrMessage(build, 'requestId'),
      statusBuild: self.getBuildPropertyOrMessage(build, 'status', 'error'),
      statusSubmitted: self.getBuildPropertyOrMessage(build, 'submittedState', 'error'),
      timeStarted: self.getBuildPropertyOrMessage(build, 'createdAt', new Date(1970, 1, 1)),
      timeUpdated: self.getBuildPropertyOrMessage(build, 'updatedAt', new Date(1970, 1, 1)),
    };
  }

  getBuildPropertyOrMessage(build, property, defaultValue) {
    let self = this;
    let properties = property.split('.');
    defaultValue = (defaultValue !== undefined) ? defaultValue : null;
    if (build.hasOwnProperty(properties[0])) {
      if (properties.length === 1) {
        return build[properties[0]];
      } else {
        let prop = properties.shift();
        return self.getBuildPropertyOrMessage(build[prop], properties.join('.'), defaultValue);
      }
    } else {
      return defaultValue;
    }
  }

  ensureDate(date) {
    if (Number(date) == date) {
      return new Date(Number(date));
    }
    return date;
  }
}

module.exports = Db;
