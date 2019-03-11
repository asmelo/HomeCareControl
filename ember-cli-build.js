'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    sassOptions: {
        includePaths: [
            'vendor/materialize/sass',
            'vendor/materialize/sass/components/',
        ]
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('vendor/firebase/firebase.js');
  app.import('vendor/firebase/firebase-app.js');
  app.import('vendor/firebase/firebase-auth.js');
  app.import('vendor/firebase/firebase-database.js');
  app.import('vendor/firebase/firebase-firestore.js');
  app.import('vendor/firebase/firebase-messaging.js');
  app.import('vendor/firebase/firebase-functions.js');
  app.import('vendor/firebase/initialize-firebase.js');

  app.import('vendor/materialize/js/bin/materialize.js');
  app.import('vendor/jquery.mask.js');
  app.import('vendor/validate.min.js');

  return app.toTree();
};
