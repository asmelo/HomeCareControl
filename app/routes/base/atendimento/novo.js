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
      params: params
    });
  },

  setupController(controller, model) {

    window.scrollTo(0,0);

    controller.set('tiposAtendimento', ['Atendimento', 'Intercorrência', 'Remoção', 'Sobreaviso']);

    let pacientes = model.pacientes.filter(paciente => { return !paciente.get('inativo') })
    pacientes = pacientes.sortBy('nome');
    let novoPaciente = this.store.createRecord('paciente', {
      nome: "Cadastrar novo paciente"
    })
    pacientes.insertAt(0, novoPaciente);
    controller.set('pacientes', pacientes);

    if (localStorage.getItem('novoPaciente')) {
        let pacienteCadastrado = this.store.peekRecord('paciente', localStorage.getItem('novoPaciente'));
        controller.set('paciente', pacienteCadastrado);
        localStorage.removeItem('novoPaciente')
    } else {
        controller.send('inicializarCampos');
    }

  },

});
