import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  usuario: service(),

  model() {
    return this.store.query('paciente', {
      orderBy: 'usuario',
      equalTo: this.get('usuario').userId
    })
  },

  setupController(controller, model) {
    controller.set('pacientes', model);
    controller.set('listaSituacao', ['Todos', 'Ativo', 'Inativo']);

  },


});
