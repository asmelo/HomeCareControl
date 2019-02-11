import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  usuario: service(),
  alerta: service(),

  actions: {

    criarGrupoSOSVida() {
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
    }

  }
});
