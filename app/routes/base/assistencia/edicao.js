import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils'
import EmberObject from '@ember/object';
import RSVP from 'rsvp';
import config from 'homecarecontrol/config/environment';

export default Route.extend({

    usuario: service(),

    model(params) {
        return RSVP.hash({
            assistencia: this.store.findRecord('assistencia', params.id_assistencia),
            setores: this.store.findAll('setor'),
            gruposCompartilhamento: this.store.query('grupo-compartilhamento', {
                orderBy: 'usuario',
                equalTo: this.get('usuario').userId
            })
        })
    },

    setupController(controller, model) {

        controller.set('assistencia', model.assistencia);
        controller.set('setores', model.setores);
        controller.set('turnos', config.APP.turnos);

        //Transfere os grupos para uma lista comum para poder inserir o
        //item "Nenhum", pois o resultSet do grupo-compartilhamento é imutável
        let gruposCompartilhamento = model.gruposCompartilhamento.map(function(grupo) {
            return grupo;
        });
        let itemNenhum = EmberObject.create({
            id: '-1',
            nome: 'Nenhum'
        });
        gruposCompartilhamento.insertAt(0, itemNenhum);
        controller.set('gruposCompartilhamento', gruposCompartilhamento);

        if (isEmpty(model.assistencia.get('grupoCompartilhamento.id'))) {
            //Seleciona o item "Nenhum"
            controller.set('grupoCompartilhamento', gruposCompartilhamento[0]);
        } else {
            model.assistencia.get('grupoCompartilhamento').then(grupo => {
                controller.set('grupoCompartilhamento', grupo);
            });
        }
    }

});
