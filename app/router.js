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
      this.route('edicao', { path: '/edicao/:id_paciente'});
    });
    this.route('atendimento', function() {
      this.route('novo');
      this.route('edicao', { path: '/edicao/:id_atendimento'});
    });    
    this.route('reuniao', function() {
      this.route('novo');
      this.route('edicao', { path: '/edicao/:id_reuniao'});
    });
    this.route('relatorio');
    this.route('profile');
    this.route('query');
    this.route('setor', function() {
      this.route('novo');
      this.route('edicao', { path: '/edicao/:id_setor'});
    });
    this.route('assistencia', function() {
      this.route('novo');
      this.route('edicao', { path: '/edicao/:id_assistencia'});
    });
    this.route('relatorio-assistencia');
  });
  this.route('conta');
  this.route('login');
});

export default Router;
