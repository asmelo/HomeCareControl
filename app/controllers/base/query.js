import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';
import $ from 'jquery';

export default Controller.extend({

  usuario: service(),
  alerta: service(),

  totalAtendimentosExample: computed('atendimentos', function() {
    return this.get('atendimentos').length;
  }),

  totalAtendimentos38Example: computed('atendimentos', function() {
    return this.get('atendimentos').filter(function(atendimento) {
      return atendimento.get('valor') == "R$ 38,00"
    }, this).length;
  })  

});
