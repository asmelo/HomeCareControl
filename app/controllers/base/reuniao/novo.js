import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';

const constraints = {
    descricao: {
      presence: {
        allowEmpty: false,
        message: "Informe a descrição da reunião"
      }
    },

    duracao: {
      presence: {
        message: "Informe a duração da reunião"
      },
      format: {
        pattern: /^\d{2}:\d{2}$/,
        message: "O formato da duração deve ser hh:mm. (Ex.: 01:00)"
      }
    }
};


export default Controller.extend({

  alerta: service(),
  usuario: service(),
  util: service(),
  validacao: service(),

  valor: computed('duracao', function() {    
    return this.get('util').calculaValorReuniao(this.get('duracao'), this.get('usuario.usuario.profissao'));
  }),

  actions: {

    selecionaData(data) {
      this.set('dtReuniao', data);
    },

    salvarReuniao() {

      let campos = this.getProperties('descricao', 'duracao');
      if (!this.get('validacao').validar(campos, constraints)) return;      

      let reuniao = this.get('store').createRecord('reuniao', {
        dtReuniao: this.get('dtReuniao'),
        descricao: this.get('descricao'),
        duracao: this.get('duracao'),
        valor: this.get('valor'),        
        usuario: this.get('usuario').usuario
      });

      let self = this;
      reuniao.save().then(function() {
        self.get('alerta').sucesso('Reunião salva com sucesso!', { timeOut: 4000 });
        self.set('ultimoIdReuniao', reuniao.get('id'));
        self.send('inicializarCampos');
        window.scrollTo(0,0);
      }).catch(function() {
        self.get('alerta').sucesso('Erro ao salvar a reunião');
      })
    },

    inicializarCampos() {
      if (isEmpty(this.get('dtReuniao'))) {
        this.set('dtReuniao', new Date());
      }

      this.set('descricao', null);
      this.set('duracao', null);      
    }

  }
});
