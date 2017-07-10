'use strict';

module.exports = [
  {
    "commit": {
      "htmlUrl": "https://github.com/test/test/commit/aaaaaaabbbbbbbbbcccccccccdddddddeeeeeeff",
      "ref": "aaaaaaabbbbbbbbbcccccccccdddddddeeeeeeff"
    },
    "pullRequest": {
      "description": "",
      "htmlUrl": "https://github.com/test/test/pull/7",
      "name": "Test 7",
      "number": "7"
    },
    "branch": {
      "htmlUrl": "https://github.com/test/test/tree/features/test",
      "name": "features/test"
    },
    "config": { "allowAccessWhileBuilding": true, "assets": ["test.sql"], "image": "proboci/ubuntu-14.04-lamp:php-5.6", "steps": [{ "database": "test.sql", "name": "Provision Drupal", "plugin": "Drupal", "settingsAppend": "$bar = 'baz';\n$foo = 'stuff';\n", "settingsRequireFile": "site-settings.php", "tty": false, "cliDefines": {}, "phpIniOptions": {}, "phpConstants": {}, "installPackages": {}, "phpMods": {}, "apacheMods": {}, "restartApache": false, "secrets": [], "siteFolder": "default", "profileName": "standard", "clearCaches": true, "drupalVersion": 7 }]
    },
    "reaped": false,
    "reapedReason": 0,
    "reapedReasonText": "",
    "reapedDate": "2017-06-12T12:31:59.287Z",
    "pinned": false,
    "statuses": {},
    "submittedState": "pending",
    "status": "error",
    "steps": [{ "id": "aaaaaaaaaa000000", "name": "GithubDownloader task", "plugin": "GithubDownloader", "result": { "code": 0, "time": 1001 }, "state": "success", "description": "[▶] GithubDownloader test/test @ aaaaaaabbbbbbbbbcccccccccdddddddeeeeeeff" }, { "id": "aaaaaaaaaa000000", "name": "AssetDownloader task", "plugin": "AssetDownloader", "result": { "code": 0, "time": 245 }, "state": "success", "description": "[▶] AssetDownloader test.sql" }, { "id": "aaaaaaaaaa000000", "name": "Provision Drupal", "plugin": "Drupal", "result": { "code": 1, "time": 75722 }, "state": "error", "description": "[■] Drupal 'Provisioning Drupal!'" }],
    "diskSpace": {
      "realBytes": 13462483,
      "virtualBytes": 1512017490
    },
    "createdAt": "2017-06-12T13:44:07.145Z",
    "projectId": "651f7cc3-af8c-4db1-995e-fac844f467dc",
    "updatedAt": "2017-06-12T13:45:35.391Z",
    "requestId": "28c47b7e-f7c0-48ab-893f-cfc5b03af3cd",
    "id": "51246265-be28-4af3-8148-22ebdd46eab2",
    "active": false
  },
  {
    "commit": {
      "htmlUrl": "https://github.com/test/test/commit/abcabcabbbbbbbbbcccccccccdddddddeeeeeeff",
      "ref": "abcabcabbbbbbbbbcccccccccdddddddeeeeeeff"
    },
    "pullRequest": {
      "description": "",
      "htmlUrl": "https://github.com/test/test/pull/8",
      "name": "Test 8",
      "number": "8"
    },
    "branch": {
      "htmlUrl": "https://github.com/test/test/tree/features/test",
      "name": "features/test"
    },
    "config": { "allowAccessWhileBuilding": true, "assets": ["test.sql"], "image": "proboci/ubuntu-14.04-lamp:php-5.6", "steps": [{ "database": "test.sql", "name": "Provision Drupal", "plugin": "Drupal", "settingsAppend": "$bar = 'baz';\n$foo = 'stuff';\n", "settingsRequireFile": "site-settings.php", "tty": false, "cliDefines": {}, "phpIniOptions": {}, "phpConstants": {}, "installPackages": {}, "phpMods": {}, "apacheMods": {}, "restartApache": false, "secrets": [], "siteFolder": "default", "profileName": "standard", "clearCaches": true, "drupalVersion": 7 }]
    },
    "reaped": false,
    "reapedReason": 0,
    "reapedReasonText": "",
    "reapedDate": "2017-06-30T12:31:59.287Z",
    "pinned": false,
    "statuses": {},
    "submittedState": "pending",
    "status": "error",
    "steps": [{ "id": "aaaaaaaaaa000000", "name": "GithubDownloader task", "plugin": "GithubDownloader", "result": { "code": 0, "time": 1001 }, "state": "success", "description": "[▶] GithubDownloader test/test @ aaaaaaabbbbbbbbbcccccccccdddddddeeeeeeff" }, { "id": "aaaaaaaaaa000000", "name": "AssetDownloader task", "plugin": "AssetDownloader", "result": { "code": 0, "time": 245 }, "state": "success", "description": "[▶] AssetDownloader test.sql" }, { "id": "aaaaaaaaaa000000", "name": "Provision Drupal", "plugin": "Drupal", "result": { "code": 1, "time": 75722 }, "state": "error", "description": "[■] Drupal 'Provisioning Drupal!'" }],
    "diskSpace": {
      "realBytes": 123456,
      "virtualBytes": 12345678
    },
    "createdAt": "2017-06-30T13:44:07.145Z",
    "projectId": "651f7cc3-af8c-4db1-995e-fac844f467dc",
    "updatedAt": "2017-06-30T13:45:35.391Z",
    "requestId": "bdf1c6b6-5dec-4bf6-9efd-dcc2a01ca570",
    "id": "207f5c8a-9902-40c5-b10a-d9640750b967",
    "active": false
  },
  {
    "commit": {
      "htmlUrl": "https://github.com/check/check/commit/cdefbcabbbbbbbbbcccccccccdddddddeeeeeeff",
      "ref": "cdefbcabbbbbbbbbcccccccccdddddddeeeeeeff"
    },
    "pullRequest": {
      "description": "",
      "htmlUrl": "https://github.com/check/check/pull/9",
      "name": "Test 9",
      "number": "9"
    },
    "branch": {
      "htmlUrl": "https://github.com/check/check/tree/features/test",
      "name": "features/test"
    },
    "config": { "allowAccessWhileBuilding": true, "assets": ["test.sql"], "image": "proboci/ubuntu-14.04-lamp:php-5.6", "steps": [{ "database": "test.sql", "name": "Provision Drupal", "plugin": "Drupal", "settingsAppend": "$bar = 'baz';\n$foo = 'stuff';\n", "settingsRequireFile": "site-settings.php", "tty": false, "cliDefines": {}, "phpIniOptions": {}, "phpConstants": {}, "installPackages": {}, "phpMods": {}, "apacheMods": {}, "restartApache": false, "secrets": [], "siteFolder": "default", "profileName": "standard", "clearCaches": true, "drupalVersion": 7 }]
    },
    "reaped": false,
    "reapedReason": 0,
    "reapedReasonText": "",
    "reapedDate": "2017-06-20T12:31:59.287Z",
    "pinned": false,
    "statuses": {},
    "submittedState": "pending",
    "status": "error",
    "steps": [{ "id": "aaaaaaaaaa000000", "name": "GithubDownloader task", "plugin": "GithubDownloader", "result": { "code": 0, "time": 1001 }, "state": "success", "description": "[▶] GithubDownloader test/test @ aaaaaaabbbbbbbbbcccccccccdddddddeeeeeeff" }, { "id": "aaaaaaaaaa000000", "name": "AssetDownloader task", "plugin": "AssetDownloader", "result": { "code": 0, "time": 245 }, "state": "success", "description": "[▶] AssetDownloader test.sql" }, { "id": "aaaaaaaaaa000000", "name": "Provision Drupal", "plugin": "Drupal", "result": { "code": 1, "time": 75722 }, "state": "error", "description": "[■] Drupal 'Provisioning Drupal!'" }],
    "diskSpace": {
      "realBytes": 234567,
      "virtualBytes": 23456789
    },
    "createdAt": "2017-06-20T13:44:07.145Z",
    "projectId": "29c1071c-9b60-4447-ae92-b1ef1b067dbf",
    "updatedAt": "2017-06-20T13:45:35.391Z",
    "requestId": "4de3bf13-60c5-45fa-9f0c-98df42e5b1b4",
    "id": "1dfd59be-706d-43fb-a8af-3e81f81db21e",
    "active": false
  },
  {
    "commit": {
      "htmlUrl": "https://github.com/check/check/commit/deffbcabbbbbbbbbcccccccccdddddddeeeeeeff",
      "ref": "deffbcabbbbbbbbbcccccccccdddddddeeeeeeff"
    },
    "pullRequest": {
      "description": "",
      "htmlUrl": "https://github.com/check/check/pull/10",
      "name": "Test 10",
      "number": "10"
    },
    "branch": {
      "htmlUrl": "https://github.com/check/check/tree/features/test",
      "name": "features/test"
    },
    "config": { "allowAccessWhileBuilding": true, "assets": ["test.sql"], "image": "proboci/ubuntu-14.04-lamp:php-5.6", "steps": [{ "database": "test.sql", "name": "Provision Drupal", "plugin": "Drupal", "settingsAppend": "$bar = 'baz';\n$foo = 'stuff';\n", "settingsRequireFile": "site-settings.php", "tty": false, "cliDefines": {}, "phpIniOptions": {}, "phpConstants": {}, "installPackages": {}, "phpMods": {}, "apacheMods": {}, "restartApache": false, "secrets": [], "siteFolder": "default", "profileName": "standard", "clearCaches": true, "drupalVersion": 7 }]
    },
    "reaped": false,
    "reapedReason": 0,
    "reapedReasonText": "",
    "reapedDate": "2017-06-21T12:31:59.287Z",
    "pinned": false,
    "statuses": {},
    "submittedState": "pending",
    "status": "error",
    "steps": [{ "id": "aaaaaaaaaa000000", "name": "GithubDownloader task", "plugin": "GithubDownloader", "result": { "code": 0, "time": 1001 }, "state": "success", "description": "[▶] GithubDownloader test/test @ aaaaaaabbbbbbbbbcccccccccdddddddeeeeeeff" }, { "id": "aaaaaaaaaa000000", "name": "AssetDownloader task", "plugin": "AssetDownloader", "result": { "code": 0, "time": 245 }, "state": "success", "description": "[▶] AssetDownloader test.sql" }, { "id": "aaaaaaaaaa000000", "name": "Provision Drupal", "plugin": "Drupal", "result": { "code": 1, "time": 75722 }, "state": "error", "description": "[■] Drupal 'Provisioning Drupal!'" }],
    "diskSpace": {
      "realBytes": 234567,
      "virtualBytes": 23456789
    },
    "createdAt": "2017-06-21T13:44:07.145Z",
    "projectId": "29c1071c-9b60-4447-ae92-b1ef1b067dbf",
    "updatedAt": "2017-06-21T13:45:35.391Z",
    "requestId": "841074c8-cddb-4c95-b8b0-ddef0411077c",
    "id": "7d4d56cc-2630-456a-bf66-9b27199408d4",
    "active": false
  }
];
