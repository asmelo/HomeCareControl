import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { isEmpty } from '@ember/utils'
import EmberObject from '@ember/object';
import RSVP from 'rsvp';
import $ from 'jquery';

export default Route.extend({

  usuario: service(),

  model(params) {
    return RSVP.hash({
      reuniao: this.store.findRecord('reuniao', params.id_reuniao),
      gruposCompartilhamento: this.store.query('grupo-compartilhamento', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').userId
      })
    })
  },

  setupController(controller, model) {

    controller.set('reuniao', model.reuniao);

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

    if (isEmpty(model.reuniao.get('grupoCompartilhamento.id'))) {
      //Seleciona o item "Nenhum"
      controller.set('grupoCompartilhamento', gruposCompartilhamento[0]);
    } else {
      model.reuniao.get('grupoCompartilhamento').then(grupo => {
          controller.set('grupoCompartilhamento', grupo);
      });
    }

    later(function() {
      $('label').addClass('active');
    }, 200);

  },

});
