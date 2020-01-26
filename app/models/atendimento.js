import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({

  dtAtendimento:            DS.attr('date'),
  paciente:                 DS.belongsTo('paciente', { inverse: false }),
  valor:                    DS.attr('moeda'),
  usuario:                  DS.belongsTo('usuario', { inverse: false }),
  grupoCompartilhamento:    DS.belongsTo('grupo-compartilhamento', { inverse: false }),
  tipo:                     DS.attr('string'),

  nmPaciente: computed('paciente.nome', function() {
    return this.get('paciente.nome');
  }),

  valorNumber: computed('valor', function() {
    return Number(this.get('valor').replace('R$', '').replace('.', '').replace(',', '.').trim());
  }),

  nmGrupoCompartilhamento: computed('grupoCompartilhamento.nome', function() {
    if (this.get('grupoCompartilhamento.nome')) {
      return this.get('grupoCompartilhamento.nome');
    } else {
      return 'Nenhum';
    }
  }),

  dataFormatada: computed('dtAtendimento', function() {
    let dia = this.get('dtAtendimento').getDate();
    if (String(dia).length == 1) {
      dia = '0' + dia;
    }
    let mes = this.get('dtAtendimento').getMonth() + 1;
    if (String(mes).length == 1) {
      mes = '0' + mes;
    }
    let ano = this.get('dtAtendimento').getFullYear();
    return dia + '/' + mes + '/' + ano;
  })

});
