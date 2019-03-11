import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import $ from 'jquery';

export default Controller.extend({

  usuario: service(),
  alerta: service(),

  exibirFiltro: $('body').width() >= 992,

  situacao: 'Ativo',

  pacientesFiltrados: computed('pacientes.@each.inativo', 'nome', 'situacao', function() {
    if(this.get('pacientes')) {
      let pacientes = this.get('pacientes').filter(paciente => {
        if (isEmpty(this.get('nome')) || paciente.get('nome').toLowerCase().includes(this.get('nome').toLowerCase())) {
          if ((this.get('situacao') == 'Todos') || (paciente.situacao == this.get('situacao'))) {
            return true;
          }
        }
        return false;
      });

      return pacientes;
    }else{
      return null;
    }

  }),

  pacientesOrdenados: computed('pacientesFiltrados', function() {
    if (this.get('pacientesFiltrados')) {
        return this.get('pacientesFiltrados').sortBy('nome');
    } else {
      return null;
    }
  }),

  actions: {

    editarPaciente(paciente) {
      this.transitionToRoute('base.paciente.edicao', paciente.get('id'));
      window.scrollTo(0,0);
    },

    selecionaSituacao(situacao) {
      this.set('situacao', situacao);
    },

    scrollUp() {
      window.scrollTo(0,0);
    },

    exibirFiltroAction() {
      this.set('exibirFiltro', !this.get('exibirFiltro'));
    }

  }
});
