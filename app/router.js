import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('base', { path: '/' }, function() {
    this.route('paciente', function() {
      this.route('novo');
      this.route('edicao', { path: '/paciente/edicao/:idPaciente'});
    });
    this.route('atendimento', function() {
      this.route('novo');
      this.route('edicao', { path: '/atendimento/edicao/:idAtendimento'});
    });
  });
  this.route('conta');
  this.route('login');
});

export default Router;
