import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({

  usuario: service(),

  setupController(controller, model) {
    window.scrollTo(0,0);
    controller.send('inicializarCampos');
  },

});
