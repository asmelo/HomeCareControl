import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import EmberObject from '@ember/object';


export default Route.extend({

  usuario: service(),

  model() {
    return RSVP.hash({
      gruposCompartilhamento: this.store.query('grupo-compartilhamento', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').userId
      })
    });
  },

  setupController(controller, model) {

    window.scrollTo(0,0);

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

    if (gruposCompartilhamento.length == 1) {
      let novoGrupo = EmberObject.create({
        id: '-2',
        nome: 'Cadastrar novo grupo'
      });
      gruposCompartilhamento.insertAt(0, novoGrupo);
      controller.set('grupoCompartilhamento', itemNenhum)
    }

    controller.set('gruposCompartilhamento', gruposCompartilhamento);

    controller.send('inicializarCampos');

  },

});
