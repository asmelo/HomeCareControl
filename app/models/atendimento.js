import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({

  dtAtendimento:            DS.attr('date'),
  paciente:                 DS.belongsTo('paciente', { inverse: false }),
  valor:                    DS.attr('moeda'),
  usuario:                  DS.belongsTo('usuario', { inverse: false }),  
  tipo:                     DS.attr('string'),
  usuarioAnoMes:            DS.attr('string'),
  anoMes:                   DS.attr('string'),

  nmPaciente: computed('paciente.nome', function() {
    return this.get('paciente.nome');
  }),

  nrPaciente: computed('paciente.numero', function() {
    return this.get('paciente.numero');
  }),

  valorNumber: computed('valor', function() {
    return Number(this.get('valor').replace('R$', '').replace('.', '').replace(',', '.').trim());
  }),
 
  dataFormatada: computed('dtAtendimento', function() {
    if (this.get('dtAtendimento') != null) {
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
    }
    return "";
  })

});
