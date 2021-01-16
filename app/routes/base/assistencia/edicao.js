import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import config from 'homecarecontrol/config/environment';

export default Route.extend({

    usuario: service(),

    model(params) {
        return RSVP.hash({
            assistencia: this.store.findRecord('assistencia', params.id_assistencia),
            setores: this.store.findAll('setor')
        })
    },

    setupController(controller, model) {
        controller.set('assistencia', model.assistencia);
        controller.set('setores', model.setores);
        controller.set('turnos', config.APP.turnos);                
    }

});
