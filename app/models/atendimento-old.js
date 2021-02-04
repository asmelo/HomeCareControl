import DS from 'ember-data';

export default DS.Model.extend({

    dtAtendimento:            DS.attr('date'),
    paciente:                 DS.belongsTo('paciente', { inverse: false }),
    valor:                    DS.attr('moeda'),
    usuario:                  DS.belongsTo('usuario', { inverse: false }),  
    tipo:                     DS.attr('string'),
    usuarioAnoMes:            DS.attr('string'),
    anoMes:                   DS.attr('string'),

});
