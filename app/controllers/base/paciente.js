import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Controller.extend({

  usuario: service(),
  alerta: service(),

  exibirFiltro: $('body').width() >= 992,

  listaSituacao: ['Todos', 'Ativo', 'Inativo'],
  situacao: 'Ativo',

  pacientesFiltrados: computed('model.@each.inativo', 'nome', 'situacao', function() {
    if(this.get('model')) {
      let pacientes = this.get('model').filter(paciente => {
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
    return this.get('pacientesFiltrados').sortBy('nome');
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
