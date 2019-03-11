import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';


export default Controller.extend({

  usuario: service(),
  alerta: service(),

  funcaoOrdenacao: Object.freeze(['principal:desc']),
  gruposCompartilhamentoOrdenado: sort('gruposCompartilhamento', 'funcaoOrdenacao'),

  actions: {

    criarGrupoSOSVidaFono() {
      let grupoSOS = this.get('gruposCompartilhamento').filter(grupo => {
        return grupo.get('nome') == 'SOS Vida';
      });
      if (grupoSOS.length > 0) {
        this.get('alerta').erro('Este grupo já existe');
        return;
      }

      let grupo = this.get('store').createRecord('grupo-compartilhamento', {
        nome: 'SOS Vida',
        principal: true,
        usuario: this.get('usuario').usuario
      });

      grupo.get('listaUsuarios').pushObject(this.get('analu'));

      let self = this;
      grupo.save().then(function() {
        self.get('alerta').sucesso('Grupo SOS Vida Criado com sucesso!');
      }).catch(function() {
        self.get('alerta').erro('Ocorreu um erro ao criar o grupo!');
      })
    },

    criarGrupoSOSVidaFisio() {
      let grupoSOS = this.get('gruposCompartilhamento').filter(grupo => {
        return grupo.get('nome') == 'SOS Vida';
      });
      if (grupoSOS.length > 0) {
        this.get('alerta').erro('Este grupo já existe');
        return;
      }

      let grupo = this.get('store').createRecord('grupo-compartilhamento', {
        nome: 'SOS Vida',
        principal: true,
        usuario: this.get('usuario').usuario
      });

      grupo.get('listaUsuarios').pushObject(this.get('carol'));

      let self = this;
      grupo.save().then(function() {
        self.get('alerta').sucesso('Grupo SOS Vida Criado com sucesso!');
      }).catch(function() {
        self.get('alerta').erro('Ocorreu um erro ao criar o grupo!');
      })
    },

    criarGrupoParticular() {
      let grupoParticular = this.get('gruposCompartilhamento').filter(grupo => {
        return grupo.get('nome') == 'Particulares';
      });
      if (grupoParticular.length > 0) {
        this.get('alerta').erro('Este grupo já existe');
        return;
      }

      let grupo = this.get('store').createRecord('grupo-compartilhamento', {
        nome: 'Particulares',
        usuario: this.get('usuario').usuario
      });

      let self = this;
      grupo.save().then(function() {
        self.get('alerta').sucesso('Grupo Particulares Criado com sucesso!');
      }).catch(function() {
        self.get('alerta').erro('Ocorreu um erro ao criar o grupo Particulares!');
      })
    }

  }
});
