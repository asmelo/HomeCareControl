import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

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
            equalTo: 'asmelo10@gmail.com'
          })
      })
  },

  setupController(controller, model) {
    controller.set('gruposCompartilhamento', model.gruposCompartilhamento);
    controller.set('analu', model.analu.objectAt(0));
    controller.set('carol', model.carol.objectAt(0));
  },

});
