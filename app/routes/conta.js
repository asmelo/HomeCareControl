import Route from '@ember/routing/route';
import config from 'homecarecontrol/config/environment';
import $ from 'jquery';

export default Route.extend({

  setupController(controller) {
    controller.set('profissoes', [config.APP.fonoaudiologo, config.APP.fisioterapeuta, config.APP.fisiohealth]);
  },

  actions: {
    didTransition() {
      $('loading').css('display', 'none');
    }
  }

});
