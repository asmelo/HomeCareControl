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
    }
};

export default Controller.extend({

  alerta: service(),
  validacao: service(),

  nome: alias('model.nome'),
  registro: alias('model.registro'),

  actions: {

    atualizaProfile() {
      let campos = this.getProperties('nome', 'registro');
      if (!this.get('validacao').validar(campos, constraints)) return;

      this.set('model.nome', this.get('nome'));
      this.set('model.registro', this.get('registro'));

      this.get('model').save().then(response => {
        this.get('alerta').sucesso('Registro atualizado com sucesso');
      }).catch(erro => {
        this.get('alerta').erro('Erro ao atualizar com sucesso');
      })
    }

  }

});
