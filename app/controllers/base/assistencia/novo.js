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

    selecionaGrupoCompartilhamento(grupoCompartilhamento) {
      if (grupoCompartilhamento.get('nome') == 'Cadastrar novo grupo') {
        this.transitionToRoute('base.grupo-compartilhamento');
      } else {
        this.set('grupoCompartilhamento', grupoCompartilhamento);
      }
    },

    selecionaTurno(turno) {
      this.set('turno', turno);
      /*if (turno == 'Manhã') {
        this.set('valor', config.APP.valorTurnoManha);
      }
      if (turno == 'Tarde') {
        this.set('valor', config.APP.valorTurnoTarde);
      }
      if (turno == 'Noite') {
        this.set('valor', config.APP.valorTurnoNoite);
      }*/
    },

    salvarAssistencia() {

      let campos = this.getProperties('dtAssistencia', 'setor', 'valor', 'grupoCompartilhamento');
      if (!this.get('validacao').validar(campos, constraints)) return;

      if(!this.get('setor')) {
        this.get('alerta').erro('Informe o setor');
        return;
      }

      let valorTratado = this.get('util').tratarValor(this.get('valor'));

      let grupoCompartilhamento = this.get('grupoCompartilhamento');
      if (grupoCompartilhamento.get('id') == '-1') {
        grupoCompartilhamento = null;
      }

      let assistencia = this.get('store').createRecord('assistencia', {
        dtAssistencia: this.get('dtAssistencia'),
        valor: valorTratado,
        setor: this.get('setor'),
        grupoCompartilhamento: grupoCompartilhamento,
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
        //this.set('valor', config.APP.valorTurnoManha);        
      }

      if (isEmpty(this.get('turno'))) {
        this.set('turno', 'Manhã');
      }

      this.set('setor', null);

      if (isEmpty(this.get('grupoCompartilhamento'))) {
        let grupoPrincipal = this.get('gruposCompartilhamento').filter(function(grupo) {
          return grupo.get('principal');
        });
        if (grupoPrincipal.length > 0) {
          this.set('grupoCompartilhamento', grupoPrincipal.objectAt(0));
        } else {
          //Seleciona o opção Nenhum
          this.set('grupoCompartilhamento', this.get('gruposCompartilhamento')[0]);
        }
      }
    }

  }
});
