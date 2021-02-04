import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

    total: 0,
    count: 0,
    erros: 0,

    util: service(),

    actions: {
        migrarDados() {
            this.set('total', 0);
            this.set('count', 0);
            this.set('erros', 0);
            $('loading').css('display', '');                          
            this.store.findAll('atendimento').then(atendimentos => {
                atendimentos.forEach(atendimento => {                    
                    let ano = atendimento.get('dtAtendimento').getFullYear();
                    if (ano < 2020) {
                        this.set('count', this.get('count') + 1);
                        this.criarBackupEExcluirAtendimento(atendimento);
                    }
                    this.set('total', this.get('total') + 1);                                        
                });
                $('loading').css('display', 'none');
            });
        
        }

    },

    criarBackupEExcluirAtendimento: function(atendimento) {
        let valorTratado = this.get('util').tratarValor(atendimento.get('valor')); 

        let atendimentoOld = this.get('store').createRecord('atendimento-old', {
            dtAtendimento: atendimento.get('dtAtendimento'),
            valor: valorTratado,
            paciente: atendimento.get('paciente'),        
            usuario: atendimento.get('usuario'),
            tipo: atendimento.get('tipoAtendimento'),
            anoMes: atendimento.get('anoMes'),
            usuarioAnoMes: atendimento.get('usuarioAnoMes')
        });
    
        let self = this;
        atendimentoOld.save().then(function() {
            self.excluirAtendimento(atendimento);
        }).catch(function() {
            self.set('erros', self.get('erros') + 1);
        })
    },

    excluirAtendimento: function(atendimento) {
        atendimento.deleteRecord();            
        atendimento.save();
    }
});
