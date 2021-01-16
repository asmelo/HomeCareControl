import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from 'homecarecontrol/config/environment';
import { isEmpty } from '@ember/utils';

const constraints = {
  setor: {
    presence: {
      message: "Selecione um setor"
    }
  },

  valor: {
    presence: {
      allowEmpty: false,
      message: "Informe o valor da assistência"
    }
  }
}

export default Controller.extend({

  alerta: service(),
  usuario: service(),
  util: service(),
  validacao: service(),

  actions: {

    selecionaData(data) {
      this.set('dtAssistencia', data);
    },

    selecionaSetor(setor) {      
      this.set('setor', setor);      
    },

    selecionaTurno(turno) {
      this.set('turno', turno);
      if (turno == 'Manhã') {
        this.set('valor', config.APP.valorTurnoManha);
      }
      if (turno == 'Tarde') {
        this.set('valor', config.APP.valorTurnoTarde);
      }
      if (turno == 'Noite') {
        this.set('valor', config.APP.valorTurnoNoite);
      }
      if (turno == 'Plantão diurno') {
        this.set('valor', config.APP.valorTurnoPlantaoDiurno);
      }
      if (turno == 'Plantão noturno') {
        this.set('valor', config.APP.valorTurnoPlantaoNoturno);
      }
    },

    salvarAssistencia() {

      let campos = this.getProperties('dtAssistencia', 'setor', 'valor');
      if (!this.get('validacao').validar(campos, constraints)) return;

      if(!this.get('setor')) {
        this.get('alerta').erro('Informe o setor');
        return;
      }

      let valorTratado = this.get('util').tratarValor(this.get('valor'));      
      
      this.get('dtAssistencia').setHours(12);
      
      let assistencia = this.get('store').createRecord('assistencia', {
        dtAssistencia: this.get('dtAssistencia'),
        valor: valorTratado,
        setor: this.get('setor'),        
        usuario: this.get('usuario').usuario,
        turno: this.get('turno')
      });

      let self = this;
      assistencia.save().then(function() {
        self.get('alerta').sucesso('Assistência salva com sucesso!', { timeOut: 4000 });
        self.set('ultimoIdAssistencia', assistencia.get('id'));
        self.send('inicializarCampos');
        window.scrollTo(0,0);
      }).catch(function() {
        self.get('alerta').sucesso('Erro ao salvar o assistência');
      })
    },

    inicializarCampos() {
      if (isEmpty(this.get('dtAssistencia'))) {
        this.set('dtAssistencia', new Date());
      }

      if (isEmpty(this.get('valor'))) {
        this.set('valor', config.APP.valorTurnoManha);        
      }

      if (isEmpty(this.get('turno'))) {
        this.set('turno', 'Manhã');
      }

      this.set('setor', null);      
    }

  }
});
