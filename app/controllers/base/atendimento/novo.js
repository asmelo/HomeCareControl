import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from 'homecarecontrol/config/environment';
import { isEmpty } from '@ember/utils';

const constraints = {
  paciente: {
    presence: {
      message: "Selecione um paciente"
    }
  },

  valor: {
    presence: {
      allowEmpty: false,
      message: "Informe o valor do atendimento"
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
      this.set('dtAtendimento', data);
    },

    selecionaPaciente(paciente) {
      if (paciente.get('nome') == 'Cadastrar novo paciente') {
        this.transitionToRoute('base.paciente.novo', { queryParams: { from: 'base.atendimento.novo' }});
      } else {
        this.set('paciente', paciente);
      }
    },

    selecionaTipoAtendimento(tipoAtendimento) {
      this.set('tipoAtendimento', tipoAtendimento);
      if (tipoAtendimento == 'Atendimento') {
        this.set('valor', config.APP.valorAtendimentoFisio);
      }
      if (tipoAtendimento == 'Intercorrência') {
        this.set('valor', config.APP.valorIntercorrencia);
      }
      if (tipoAtendimento == 'Remoção') {
        this.set('valor', config.APP.valorRemocao);
      }
      if (tipoAtendimento == 'Sobreaviso') {
        this.set('valor', config.APP.valorSobreaviso);
      }
    },

    salvarAtendimento() {

      let campos = this.getProperties('dtAtendimento', 'paciente', 'valor');
      if (!this.get('validacao').validar(campos, constraints)) return;

      if(!this.get('paciente')) {
        this.get('alerta').erro('Informe o paciente');
        return;
      }

      let valorTratado = this.get('util').tratarValor(this.get('valor'));      

      this.get('dtAtendimento').setHours(12);
      let anoMes = this.get('util').formataAnoEmes(this.get('dtAtendimento'));
      let usuarioAnoMes = this.get('util').formataUsuarioAnoEmes(this.get('usuario').usuario.id, this.get('dtAtendimento'));

      let atendimento = this.get('store').createRecord('atendimento', {
        dtAtendimento: this.get('dtAtendimento'),
        valor: valorTratado,
        paciente: this.get('paciente'),        
        usuario: this.get('usuario').usuario,
        tipo: this.get('tipoAtendimento'),
        anoMes: anoMes,
        usuarioAnoMes: usuarioAnoMes
      });

      let self = this;
      atendimento.save().then(function() {
        self.get('alerta').sucesso('Atendimento salvo com sucesso!', { timeOut: 4000 });
        self.set('ultimoIdAtendimento', atendimento.get('id'));
        self.send('inicializarCampos');
        window.scrollTo(0,0);
      }).catch(function() {
        self.get('alerta').sucesso('Erro ao salvar o atendimento');
      })
    },

    inicializarCampos() {
      if (isEmpty(this.get('dtAtendimento'))) {
        this.set('dtAtendimento', new Date());
      }

      if (isEmpty(this.get('valor'))) {
        this.set('valor', config.APP.valorAtendimento);
        if (this.get('usuario.usuario.profissao') == 'Fisioterapeuta') {
          this.set('valor', config.APP.valorAtendimentoFisio);
        }
      }

      if (isEmpty(this.get('tipoAtendimento'))) {
        this.set('tipoAtendimento', 'Atendimento');
      }

      this.set('paciente', null);      
    }

  }
});
