import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from 'homecarecontrol/config/environment';
import $ from 'jquery';

export default Route.extend({

  util: service(),

  setupController(controller) {
    let profissoes = [config.APP.fonoaudiologo, config.APP.fisioterapeuta];
    if (this.get('util').isLocalhostOrControleDeAssistenciaHost()) {
      profissoes = [config.APP.fisiohealth];
    }
    controller.set('profissoes', profissoes);
  },

  actions: {
    didTransition() {
      $('loading').css('display', 'none');
    }
  }

});
