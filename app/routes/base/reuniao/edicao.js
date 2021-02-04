import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import RSVP from 'rsvp';
import $ from 'jquery';

export default Route.extend({

  usuario: service(),

  model(params) {
    return RSVP.hash({
      reuniao: this.store.findRecord('reuniao', params.id_reuniao)
    })
  },

  setupController(controller, model) {

    controller.set('reuniao', model.reuniao);

    later(function() {
      $('label').addClass('active');
    }, 200);

  },

});
