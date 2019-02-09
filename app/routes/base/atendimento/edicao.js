import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import RSVP from 'rsvp';

export default Route.extend({

  usuario: service(),

  model(params) {
    return RSVP.hash({
      atendimento: this.store.findRecord('atendimento', params.idAtendimento),
      pacientes: this.store.query('paciente', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').usuario.get('id')
      })
    })
  },

  setupController(controller, model) {

    controller.set('atendimento', model.atendimento);  
    controller.set('pacientes', model.pacientes);

    later(function() {
      $('label').addClass('active');
    }, 200);

  },

});
