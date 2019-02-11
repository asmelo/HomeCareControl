import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { isEmpty } from '@ember/utils'
import EmberObject from '@ember/object';
import RSVP from 'rsvp';

export default Route.extend({

  usuario: service(),

  model(params) {
    return RSVP.hash({
      atendimento: this.store.findRecord('atendimento', params.idAtendimento),
      pacientes: this.store.query('paciente', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').usuario.get('id')
      }),
      gruposCompartilhamento: this.store.query('grupo-compartilhamento', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').usuario.get('id')
      })
    })
  },

  setupController(controller, model) {

    controller.set('atendimento', model.atendimento);
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

    if (isEmpty(model.atendimento.get('grupoCompartilhamento.id'))) {
      //Seleciona o item "Nenhum"
      controller.set('grupoCompartilhamento', gruposCompartilhamento[0]);
    } else {
      model.atendimento.get('grupoCompartilhamento').then(grupo => {
          controller.set('grupoCompartilhamento', grupo);
      });
    }

    later(function() {
      $('label').addClass('active');
    }, 200);

  },

});
