import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import config from 'homecarecontrol/config/environment';

export default Route.extend({

    usuario: service(),

    model() {
        return RSVP.hash({
        assistencias: this.store.query('assistencia', {
            orderBy: 'usuario',
            equalTo: this.get('usuario').userId
        }),
        gruposCompartilhamento: this.store.query('grupo-compartilhamento', {
            orderBy: 'usuario',
            equalTo: this.get('usuario').userId
        })
        });
    },

    setupController(controller, model) {

        controller.set('assistencias', model.assistencias);

        let dicionarioMeses = {
        0: "Janeiro",
        1: "Fevereiro",
        2: "Março",
        3: "Abril",
        4: "Maio",
        5: "Junho",
        6: "Julho",
        7: "Agosto",
        8: "Setembro",
        9: "Outubro",
        10: "Novembro",
        11: "Dezembro"
        };

        var hoje = new Date;

        //Preenche filtro de Anos
        let listaAnos = [hoje.getFullYear() - 1, hoje.getFullYear(), hoje.getFullYear() + 1];
        controller.set('listaAnos', listaAnos);
        controller.set('ano', hoje.getFullYear());

        //Preenche filtro de Meses
        let listaMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        controller.set('listaMeses', listaMeses);
        controller.set('mes', dicionarioMeses[hoje.getMonth()]);
        controller.set('dicionarioMeses', dicionarioMeses);

        //Preenche filtro de Grupos de Compartilhamento
        let listaGruposCompartilhamento = model.gruposCompartilhamento.mapBy('nome');
        listaGruposCompartilhamento.insertAt(0, 'Todos');
        listaGruposCompartilhamento.insertAt(1, 'Nenhum');
        controller.set('gruposCompartilhamento', listaGruposCompartilhamento);

        //Preeche filtro de Turnos        
        let turnos = ['Todos'].concat(config.APP.turnos);
        controller.set('turnos', turnos);
        controller.set('turno', 'Todos');

        let grupoPrincipal = model.gruposCompartilhamento.filter(function(grupo) {
        return grupo.get('principal');
        });
        if (grupoPrincipal.length > 0) {
        controller.set('nmGrupoCompartilhamento', grupoPrincipal.objectAt(0).get('nome'));
        } else {
        controller.set('nmGrupoCompartilhamento', 'Todos');
        }

    }

});
