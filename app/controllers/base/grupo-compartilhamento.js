import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  usuario: service(),
  alerta: service(),

  actions: {

    criarGrupoSOSVidaFono() {
      let grupo = this.get('store').createRecord('grupo-compartilhamento', {
        nome: 'SOS Vida',
        usuario: this.get('usuario').usuario
      });

      grupo.get('listaUsuarios').pushObject(this.get('analu'));

      grupo.save().then(response => {
        this.get('alerta').sucesso('Grupo SOS Vida Criado com sucesso!');
      }).catch(error => {
        this.get('alerta').erro('Ocorreu um erro ao criar o grupo!');
      })
    },

    criarGrupoSOSVidaFisio() {
      let grupo = this.get('store').createRecord('grupo-compartilhamento', {
        nome: 'SOS Vida',
        usuario: this.get('usuario').usuario
      });

      grupo.get('listaUsuarios').pushObject(this.get('carol'));

      grupo.save().then(response => {
        this.get('alerta').sucesso('Grupo SOS Vida Criado com sucesso!');
      }).catch(error => {
        this.get('alerta').erro('Ocorreu um erro ao criar o grupo!');
      })
    },

    criarGrupoParticular() {
      let grupo = this.get('store').createRecord('grupo-compartilhamento', {
        nome: 'Particulares',
        usuario: this.get('usuario').usuario
      });

      grupo.save().then(response => {
        this.get('alerta').sucesso('Grupo Particulares Criado com sucesso!');
      }).catch(error => {
        this.get('alerta').erro('Ocorreu um erro ao criar o grupo Particulares!');
      })
    }

  }
});
