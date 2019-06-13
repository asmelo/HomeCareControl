import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({

  usuario: service(),

  model() {
    return RSVP.hash({
      gruposCompartilhamento: this.store.query('grupo-compartilhamento', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').userId
      }),
      analu: this.store.query('usuario', {
            orderBy: 'email',
            equalTo: 'analusiqueira@hotmail.com'
          }),
      carol: this.store.query('usuario', {
            orderBy: 'email',
            equalTo: 'carolreina_fisio@hotmail.com'
          })
      })
  },

  setupController(controller, model) {
    controller.set('gruposCompartilhamento', model.gruposCompartilhamento);
    controller.set('analu', model.analu.objectAt(0));
    controller.set('carol', model.carol.objectAt(0));
  },

});
