import DS from 'ember-data';
import { computed } from '@ember/object';
import config from 'homecarecontrol/config/environment';

export default DS.Model.extend({

  nome:         DS.attr('string'),
  registro:     DS.attr('string'),
  email:        DS.attr('string'),
  foto:         DS.attr('string'),
  profissao:    DS.attr('string'),
  dtNascimento: DS.attr('date'),
  feriasMes:    DS.attr('string'),
  feriasAno:    DS.attr('string'),
  coordenador:  DS.attr('string'),
  desenvolvedor:  DS.attr('string'),
  ativo:  DS.attr('string'),

  userFirebase: null,

  isCoordenador: computed('coordenador', function() {
    return this.get('coordenador') == 'Sim';
  }),

  isDesenvolvedor: computed('desenvolvedor', function() {
    return this.get('desenvolvedor') == 'Sim';
  }),

  isFisioHealth: computed('profissao', function() {
    return this.get('profissao') == config.APP.fisiohealth;
  }),

  isAtivo: computed('ativo', function() {
    return this.get('ativo') != 'Não'
  }),

  dtNascimentoFormatada: computed('dtNascimento', function() {
    if (this.get('dtNascimento') != null) {
      let dia = this.get('dtNascimento').getDate();
      if (String(dia).length == 1) {
        dia = '0' + dia;
      }
      let mes = this.get('dtNascimento').getMonth() + 1;
      if (String(mes).length == 1) {
        mes = '0' + mes;
      }
      let ano = this.get('dtNascimento').getFullYear();
      return dia + '/' + mes + '/' + ano;
    }
    return "";
  })

});
