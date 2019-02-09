import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  usuario: service(),

  model() {
    return this.store.query('paciente', {
      orderBy: 'usuario',
      equalTo: this.get('usuario').usuario.get('id')
    })
  },
/*
  setupController(controller, model) {
    this.get('usuario').set('transitionAposUsuario', 'base.paciente.novo')
  },*/

});
