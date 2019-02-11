import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object'

export default Controller.extend({

  alerta: service(),
  usuario: service(),
  util: service(),

  valor: computed('duracao', function() {
    return this.get('util').calculaValorReuniao(this.get('duracao'));
  }),

  actions: {

    selecionaData(data) {
      this.set('dtReuniao', data);
    },

    selecionaGrupoCompartilhamento(grupoCompartilhamento) {
      this.set('grupoCompartilhamento', grupoCompartilhamento);
    },

    salvarReuniao() {

      let grupoCompartilhamento = this.get('grupoCompartilhamento');
      if (grupoCompartilhamento.get('id') == '-1') {
        grupoCompartilhamento = null;
      }

      let reuniao = this.get('store').createRecord('reuniao', {
        dtReuniao: this.get('dtReuniao'),
        descricao: this.get('descricao'),
        duracao: this.get('duracao'),
        valor: this.get('valor'),
        grupoCompartilhamento: grupoCompartilhamento,
        usuario: this.get('usuario').usuario
      });

      reuniao.save().then(response => {
        this.get('alerta').sucesso('Registro salvo com sucesso', { timeOut: 4000 });
        this.send('inicializarCampos');
        window.scrollTo(0,0);
      }).catch(error => {
        this.get('alerta').sucesso('Erro ao salvar a reunião');
      })
    },

    inicializarCampos() {
      if (isEmpty(this.get('dtReuniao'))) {
        this.set('dtReuniao', new Date());
      }

      this.set('descricao', null);
      this.set('duracao', null);

      if (isEmpty(this.get('grupoCompartilhamento'))) {
        //Nesta primeira versão o primeiro grupo de compartilhamento será o valor padrão
        if (this.get('gruposCompartilhamento').length > 1) {
          this.set('grupoCompartilhamento', this.get('gruposCompartilhamento')[1]);
        } else {
          //Seleciona o item "Nenhum" caso não hajam grupos cadastrados
          this.set('grupoCompartilhamento', this.get('gruposCompartilhamento')[0]);
        }
      }
    }

  }
});
