Package.describe({
  name: 'rajenms:peek',
  version: '0.0.4',
  // Brief, one-line summary of the package.
  summary: 'A Meteor package that serves as a user interface for admin tools for your Meteor application.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/rajenms/meteor-peek',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  // Add client files
  api.addFiles([
      'client/peek-collection.js'
    ],
    'client'
  );

  // Add client/server files
  api.addFiles([
    'lib/extend-simple-schema.js',
    'peek.js',
    'peek-init.js'
  ]);

  // Dependencies
  api.use('meteor-platform');
  api.use('aldeed:collection2@2.3.3');
  api.use('aldeed:simple-schema@1.3.3');
  api.use('dburles:mongo-collection-instances@0.3.4');
  api.use('accounts-password');

  // Export
  api.export('Peek', 'web.browser');
});

Package.onTest(function(api) {
  api.use('meteor-platform');
  api.use('tinytest');
  api.use('rajenms:peek');
  api.use('aldeed:simple-schema@1.3.3');

  api.addFiles('tests/lib/collections/users.js');
  api.addFiles('tests/lib/collections/players.js');
  api.addFiles('tests/client/client-tests.js', 'client');
});