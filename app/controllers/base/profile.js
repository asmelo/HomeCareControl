import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

const constraints = {
    nome: {
      presence: {
        allowEmpty: false,
        message: "Informe seu nome"
      }
    },

    registro: {
      presence: {
        allowEmpty: false,
        message: "Informe seu registro"
      }
    },

    dtNascimento: {
      presence: {
        allowEmpty: false,
        message: "Informe sua data de nascimento"
      }
    }
};

export default Controller.extend({

  alerta: service(),
  validacao: service(),

  nome: alias('model.nome'),
  registro: alias('model.registro'),
  dtNascimento: alias('model.dtNascimento'),

  actions: {

    selecionaDtNascimento(data) {
      this.set('dtNascimento', data);
    },

    atualizaProfile() {
      let campos = this.getProperties('nome', 'registro', 'dtNascimento');
      if (!this.get('validacao').validar(campos, constraints)) return;

      this.set('model.nome', this.get('nome'));
      this.set('model.registro', this.get('registro'));
      this.set('model.dtNascimento', this.get('dtNascimento'));

      let self = this;
      this.get('model').save().then(function() {
        self.get('alerta').sucesso('Registro atualizado com sucesso');
      }).catch(function() {
        self.get('alerta').erro('Erro ao atualizar registro');
      })
    }

  }

});
