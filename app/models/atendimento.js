import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({

  dtAtendimento:            DS.attr('date'),
  paciente:                 DS.belongsTo('paciente', { inverse: false }),
  valor:                    DS.attr('moeda'),
  usuario:                  DS.belongsTo('usuario', { inverse: false }),
  grupoCompartilhamento:    DS.belongsTo('grupo-compartilhamento', { inverse: false }),

  nmPaciente: computed('paciente', function() {
    return this.get('paciente.nome');
  }),

  valorNumber: computed('valor', function() {
    return Number(this.get('valor').replace('R$', '').replace('.', '').replace(',', '.').trim());
  }),

  nmGrupoCompartilhamento: computed('grupoCompartilhamento', function() {
    if (this.get('grupoCompartilhamento.nome')) {
      return this.get('grupoCompartilhamento.nome');
    } else {
      return 'Nenhum';
    }
  }),

});
