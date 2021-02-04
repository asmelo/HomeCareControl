import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import config from 'homecarecontrol/config/environment';

export default Route.extend({

    usuario: service(),

    model(params) {
        return RSVP.hash({
            setores: this.store.findAll('setor'),
            params: params
        });
    },

    setupController(controller, model) {

        window.scrollTo(0,0);

        let turnos = config.APP.turnos;
        controller.set('turnos', turnos);

        let setores = model.setores.filter(setor => { return !setor.get('inativo') })
        setores = setores.sortBy('nome');                
        controller.set('setores', setores);        
        
        controller.send('inicializarCampos');
        
    }

});
