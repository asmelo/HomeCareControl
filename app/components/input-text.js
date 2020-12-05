import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  active: computed.notEmpty('value'),

  classNames: ['input-field'],

  didInsertElement() {
      this._super(...arguments);

      if (!this.get('type')) {
        this.set('type', 'text');
      }

      this.set('inputClass', "input-text " + this.get('inputClass'));

      let inputId = this.$('input').attr('id');
          this.$('label').attr('for', inputId);

      if(this.get('mask')){
        if (this.get('mask') == '#.##0,00') {
          this.set('value', this.get('value').replace('R$', '').trim())
        }        
        if(this.get('mask') == 'telefone') {
            var SPMaskBehavior = function (val) {
              return val.replace(/\D/g, '').length === 11 ? '(00)00000-0000' : '(00)0000-00009';
            },
            spOptions = {
              onKeyPress: function(val, e, field, options) {
                  field.mask(SPMaskBehavior.apply({}, arguments), options);
                }
            };

            this.$('input').mask(SPMaskBehavior, spOptions);
        }else{
          if(this.get('reverseMask')) {
            this.$('input').mask(this.get('mask'), {reverse: true});
          }else{
            this.$('input').mask(this.get('mask'));
          }


        }
      }

      if(this.get('formato')){
        if(this.get('formato') == 'inteiro') {
          this.$('input').on('keydown', function(e){-1!==this.$.inArray(e.keyCode,[46,8,9,27,13,110,190])||(/65|67|86|88/.test(e.keyCode)&&(e.ctrlKey===true||e.metaKey===true))&&(!0===e.ctrlKey||!0===e.metaKey)||35<=e.keyCode&&40>=e.keyCode||(e.shiftKey||48>e.keyCode||57<e.keyCode)&&(96>e.keyCode||105<e.keyCode)&&e.preventDefault()});
        }
        if(this.get('formato') == 'real') {
          this.$('input').on('keydown', function(e){return /\d+|,+|[/b]+|-+/i.test(e.key)})
        }
      }

    },

});
