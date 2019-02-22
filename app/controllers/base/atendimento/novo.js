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
      this.set('paciente', paciente);
    },

    selecionaGrupoCompartilhamento(grupoCompartilhamento) {
      this.set('grupoCompartilhamento', grupoCompartilhamento);
    },

    salvarAtendimento() {

      let campos = this.getProperties('dtAtendimento', 'paciente', 'valor', 'grupoCompartilhamento');
      if (!this.get('validacao').validar(campos, constraints)) return;

      if(!this.get('paciente')) {
        this.get('alerta').erro('Informe o paciente');
        return;
      }

      let valorTratado = this.get('util').tratarValor(this.get('valor'));

      let grupoCompartilhamento = this.get('grupoCompartilhamento');
      if (grupoCompartilhamento.get('id') == '-1') {
        grupoCompartilhamento = null;
      }

      let atendimento = this.get('store').createRecord('atendimento', {
        dtAtendimento: this.get('dtAtendimento'),
        valor: valorTratado,
        paciente: this.get('paciente'),
        grupoCompartilhamento: grupoCompartilhamento,
        usuario: this.get('usuario').usuario
      });

      atendimento.save().then(response => {
        this.get('alerta').sucesso('Registro salvo com sucesso', { timeOut: 4000 });
        this.send('inicializarCampos');
        window.scrollTo(0,0);
      }).catch(error => {
        this.get('alerta').sucesso('Erro ao salvar o atendimento');
      })
    },

    inicializarCampos() {
      if (isEmpty(this.get('dtAtendimento'))) {
        this.set('dtAtendimento', new Date());
      }

      if (isEmpty(this.get('valor'))) {
        this.set('valor', config.APP.valorAtendimento);
      }

      this.set('paciente', null);

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
