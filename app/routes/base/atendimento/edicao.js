import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils'
import EmberObject from '@ember/object';
import RSVP from 'rsvp';

export default Route.extend({

  usuario: service(),

  model(params) {
    return RSVP.hash({
      atendimento: this.store.findRecord('atendimento', params.id_atendimento),
      pacientes: this.store.query('paciente', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').userId
      })
    })
  },

  setupController(controller, model) {

    controller.set('atendimento', model.atendimento);
    controller.set('pacientes', model.pacientes.sortBy('nome'));    

    controller.set('tiposAtendimento', ['Atendimento', 'Intercorrência', 'Remoção', 'Sobreaviso']);
  },

});
