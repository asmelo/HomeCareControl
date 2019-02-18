import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({

  model() {
    return RSVP.hash({
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
    controller.set('analu', model.analu.objectAt(0));
    controller.set('carol', model.carol.objectAt(0));
  },

});
