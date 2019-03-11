import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import EmberObject from '@ember/object';


export default Route.extend({

  usuario: service(),

  model(params) {
    return RSVP.hash({
      pacientes: this.store.query('paciente', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').userId
      }),
      gruposCompartilhamento: this.store.query('grupo-compartilhamento', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').userId
      }),
      params: params
    });
  },

  setupController(controller, model) {

    window.scrollTo(0,0);

    let pacientes = model.pacientes.filter(paciente => { return !paciente.get('inativo') })
    pacientes = pacientes.sortBy('nome');
    let novoPaciente = this.store.createRecord('paciente', {
      nome: "Cadastrar novo paciente"
    })
    pacientes.insertAt(0, novoPaciente);
    controller.set('pacientes', pacientes);

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

    if (localStorage.getItem('novoPaciente')) {
        let pacienteCadastrado = this.store.peekRecord('paciente', localStorage.getItem('novoPaciente'));
        controller.set('paciente', pacienteCadastrado);
        localStorage.removeItem('novoPaciente')
    } else {
        controller.send('inicializarCampos');
    }

  },

});
