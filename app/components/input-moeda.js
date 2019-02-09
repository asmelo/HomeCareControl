import Component from '@ember/component';

export default Component.extend({

      active: Ember.computed.notEmpty('value'),

      initValue: false,

      currentValue: '',

      preventTab: false, //Prevent TAB key default event from firing

      tabKeyPressed: false, // Flag que indica se a tecla TAB foi pressionada

      valueDidChange: Ember.observer('value', function() {
          this.$('input').triggerHandler('change');
          return true;
  	}),

      mask: {
          money: function() {
             var el = this
             ,exec = function(v) {
                v = v.replace(/\D/g,"");
                v = new String(Number(v));
                var len = v.length;
                if (1== len)
                   v = v.replace(/(\d)/,"0,0$1");
                else if (2 == len)
                   v = v.replace(/(\d)/,"0,$1");
                else if (len > 2) {
                   v = v.replace(/(\d{2})$/,',$1');
                   if (len > 5) {
                      var x = len - 5
                      ,er = new RegExp('(\\d{'+x+'})(\\d)');
                      v = v.replace(er,'$1.$2');
                   }
                   if (len > 8) {
                      var x = len - 8
                      ,er = new RegExp('(\\d{'+x+'})(\\d)');
                      v = v.replace(er,'$1.$2');
                   }
                   if (len > 11) {
                      var x = len - 11
                      ,er = new RegExp('(\\d{'+x+'})(\\d)');
                      v = v.replace(er,'$1.$2');
                   }
                }
                return 'R$ ' + v;
             };
             setTimeout(function(){
                el.value = exec(el.value);
             },1);
          }
       },

      didInsertElement() {
  	    this._super(...arguments);

          let inputId = this.$('input').attr('id');
              this.$('label').attr('for', inputId);

          if(!Ember.isEmpty(this.get('value'))) {
              this.$('label').addClass('active');
              if(this.$('input').attr('disabled')!='disabled'){
                  this.$('i').addClass('active');
              }
          }

          if(this.get('preventTab')){
              //Prevent TAB event.
              var _this = this;
              var tabKeyPressed = false;
              this.$('input').keydown(function(e) {
                  tabKeyPressed = e.keyCode == 9;
                  _this.set('tabKeyPressed',tabKeyPressed);
                  if (tabKeyPressed) {
                      e.preventDefault();
                      return;
                  }
              });
          }



          //TODO: Verificar o uso da função bind pois está em desuso no jquery (Deprecated in version 3+)
          //Verificar se uso do da funcao 'on' é mais adequado
          if(Ember.isPresent(this.get('initValue')) && this.get('initValue')){
              this.$('input').bind('keypress change',this.get('mask.money'));
              let value = this.get('value');
              this.$('input').triggerHandler('keypress');
          } //Rodar a mascara na inicialização
          else{
              this.$('input').bind('keypress',this.get('mask.money'));
          }


      },

      actions: {
          keyPress(){
              let keypress = this.get('key-press');
              let valueDidChange = this.get('valueDidChange');

              if(this.get('currentValue') !== this.get('value')){

                  this.set('currentValue', this.get('value'));
              }
              if(Ember.isPresent(keypress) && valueDidChange) {
                  keypress(this.get('value'));
              }
          },
          keyUp(){
              var tabKeyPressed = this.get('tabKeyPressed');
              if(Ember.isPresent(this.get('key-up'))){
                  this.get('key-up')();
              }else if(!tabKeyPressed){
                  this.send('keyPress');
              }

          },
          enter(){
              this.send('keyPress');
          },
          focusOut(){
              let focusOut = this.get('focus-out');

              if(Ember.isPresent(focusOut)) {
                focusOut(this.get('value'));
              } else {

                if(Ember.isPresent(this.get('constraint'))){
                  let constraint = this.get('constraint') || {};

                  let name = this.get('nomeCampo') || 'value';

                  let value = this.get('value');

                  let errors = validate({ [name]: value }, { [name]: constraint });

                  if(errors) {
                    let erro = errors[name][0] || '';

                    this.set('erro', erro);
                  }else{
                    this.set('erro', '');
                  }
                }
              }
          }
      }
  });
