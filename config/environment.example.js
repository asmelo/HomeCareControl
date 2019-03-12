'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'homecarecontrol',
    environment,
    rootURL: '/',
    locationType: 'auto',
    moment: {
      // To cherry-pick specific locale support into your application.
      // Full list of locales: https://github.com/moment/moment/tree/2.10.3/locale
      includeTimezone: 'all',
      includeLocales: ['pt-br'],
      allowEmpty: true
    },
    firebase: {
      apiKey: "<your_firebase_api_key>",
      authDomain: "<your_firebase_project_id>.firebaseapp.com",
      databaseURL: "https://<your_firebase_project_id>.firebaseio.com",
      projectId: "<your_firebase_project_id>",
      storageBucket: "<your_firebase_project_id>.appspot.com",
      messagingSenderId: "<your_firebase_messaging_sender_id>"
    },

    torii: {
      sessionServiceName: 'session'
    },

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      valorAtendimento: "R$ 38,00",
      valorReuniao: 40
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
