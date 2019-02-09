import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from 'homecarecontrol/config/environment';

export default Controller.extend({

  alerta: service(),
  usuario: service(),
  util: service(),

  actions: {

    selecionaData(data) {
      this.set('dtAtendimento', data);
    },

    selecionaPaciente(paciente) {
      this.set('paciente', paciente);
    },

    salvarAtendimento() {
      if(!this.get('paciente')) {
        this.get('alerta').erro('Informe o paciente');
        return;
      }

      let valorTratado = this.get('util').tratarValor(this.get('valor'));

      let atendimento = this.get('store').createRecord('atendimento', {
        dtAtendimento: this.get('dtAtendimento'),
        valor: valorTratado,
        paciente: this.get('paciente'),
        usuario: this.get('usuario').usuario
      });

      atendimento.save().then(response => {
        this.get('alerta').sucesso('Registro salvo com sucesso');
        this.send('inicializarCampos');
      }).catch(error => {
        this.get('alerta').sucesso('Erro ao salvar o atendimento');
      })
    },

    inicializarCampos() {
      this.set('dtAtendimento', new Date());
      this.set('valor', config.APP.valorAtendimento);
      this.set('paciente', null);
    }

  }
});
