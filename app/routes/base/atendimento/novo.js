import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from 'homecarecontrol/config/environment';
import RSVP from 'rsvp';
import EmberObject from '@ember/object';


export default Route.extend({

  usuario: service(),

  model() {
    return RSVP.hash({
      pacientes: this.store.query('paciente', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').usuario.get('id')
      }),
      gruposCompartilhamento: this.store.query('grupo-compartilhamento', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').usuario.get('id')
      })
    });
  },

  setupController(controller, model) {

    window.scrollTo(0,0);

    controller.set('pacientes', model.pacientes);

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

    controller.send('inicializarCampos');

  },

});
