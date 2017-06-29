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
      "name": "Test 3",
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
  }
];
