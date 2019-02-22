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
      this.route('edicao', { path: '/edicao/:idPaciente'});
    });
    this.route('atendimento', function() {
      this.route('novo');
      this.route('edicao', { path: '/edicao/:idAtendimento'});
    });
    this.route('grupoCompartilhamento');
    this.route('reuniao', function() {
      this.route('novo');
      this.route('edicao', { path: '/edicao/:idReuniao'});
    });
    this.route('relatorio');
    this.route('profile');
  });
  this.route('conta');
  this.route('login');
});

export default Router;
