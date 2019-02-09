import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from 'homecarecontrol/config/environment';

export default Route.extend({

  usuario: service(),  

  model() {
    return this.store.query('paciente', {
      orderBy: 'usuario',
      equalTo: this.get('usuario').usuario.get('id')
    })
  },

  setupController(controller, model) {

    controller.set('pacientes', model);
    controller.send('inicializarCampos');

  },

});
