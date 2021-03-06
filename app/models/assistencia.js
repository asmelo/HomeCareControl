import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({

    dtAssistencia:            DS.attr('date'),
    setor:                    DS.belongsTo('setor', { inverse: false }),
    valor:                    DS.attr('moeda'),
    usuario:                  DS.belongsTo('usuario', { inverse: false }),    
    turno:                    DS.attr('string'),
    usuarioAnoMes:            DS.attr('string'),
    anoMes:                   DS.attr('string'),

    nmSetor: computed('setor.nome', function() {
        return this.get('setor.nome');
    }),

    valorNumber: computed('valor', function() {
        return Number(this.get('valor').replace('R$', '').replace('.', '').replace(',', '.').trim());
    }),

    dataFormatada: computed('dtAssistencia', function() {
        if (this.get('dtAssistencia') != null) {
            let dia = this.get('dtAssistencia').getDate();
            if (String(dia).length == 1) {
            dia = '0' + dia;
            }
            let mes = this.get('dtAssistencia').getMonth() + 1;
            if (String(mes).length == 1) {
            mes = '0' + mes;
            }
            let ano = this.get('dtAssistencia').getFullYear();
            return dia + '/' + mes + '/' + ano;
        }        
        return "";
    })

});
