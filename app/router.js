import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('base', { path: '/' }, function() {});
  this.route('conta');
  this.route('login');
});

export default Router;
