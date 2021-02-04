import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';


export default Route.extend({

  usuario: service(),
  util: service(),

  inicializarUsuario(this2) {
    this2.get('usuario').inicializarUsuario();
    return new Promise(function(resolve) {
      setTimeout(function(resolve) {
        resolve();
      }, 1000, resolve);
    });
  },  

  model() {
    return RSVP.hash({      
      timeout: this.get('inicializarUsuario')(this),
      listaUsuarios: this.store.findAll('usuario')      
    });
  },

  setupController(controller, model) {

    let dicionarioMeses = {
      0: "Janeiro",
      1: "Fevereiro",
      2: "Março",
      3: "Abril",
      4: "Maio",
      5: "Junho",
      6: "Julho",
      7: "Agosto",
      8: "Setembro",
      9: "Outubro",
      10: "Novembro",
      11: "Dezembro"
    };
     
    if (this.get('usuario').usuario.isCoordenador) {
      var anoEMes = this.get('util').formataAnoEmesAtual();
      this.store.query('atendimento', {
        orderBy: 'anoMes',
        equalTo: anoEMes
      }).then(atendimentos => {
        controller.set('listaAtendimentos', atendimentos);
      });
    } else {        
      var usuarioAnoMes = this.get('util').formataUsuarioAnoEmesAtual(this.get('usuario').usuario.get('id'));
      this.store.query('atendimento', {
        orderBy: 'usuarioAnoMes',
        equalTo: usuarioAnoMes
      }).then(atendimentos => {
        controller.set('listaAtendimentos', atendimentos);
      });
    }

    if (this.get('usuario').usuario.isCoordenador) {
      this.store.findAll('reuniao').then(reunioes => {
        controller.set('listaReunioes', reunioes);
      });
    } else {        
      this.store.query('reuniao', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').usuario.get('id')
      }).then(reunioes => {
        controller.set('listaReunioes', reunioes);
      });
    }

    if (this.get('usuario').usuario.isCoordenador) {      
      let listaUsuarios = this.removeUsuarioLogadoUsuarioDeDesenvolvimentoEInativo(model.listaUsuarios.sortBy('nome'));
      listaUsuarios.insertAt(0, this.get('usuario').usuario);
      controller.set('listaUsuarios', listaUsuarios);
    } else {
      controller.set('listaUsuarios', [this.get('usuario').usuario]);
    }    

    controller.set('usuarioFiltro', this.get('usuario').usuario);

    later(controller, function() {
      controller.send('ordernarAtendimentoPorPaciente');
    }, 2000);

    var hoje = new Date;

    //Preenche filtro de Anos
    let listaAnos = [hoje.getFullYear() - 1, hoje.getFullYear(), hoje.getFullYear() + 1];
    controller.set('listaAnos', listaAnos);
    controller.set('ano', hoje.getFullYear());

    //Preenche filtro de Meses
    let listaMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    controller.set('listaMeses', listaMeses);
    controller.set('mes', dicionarioMeses[hoje.getMonth()]);
    controller.set('dicionarioMeses', dicionarioMeses);    

  },

  removeUsuarioLogadoUsuarioDeDesenvolvimentoEInativo: function(listaUsuarios) {
    let listaFinal = [];
    for (let i = 0; i < listaUsuarios.length; i++) {
      if ((listaUsuarios[i].id != this.get('usuario').usuario.id) && !listaUsuarios[i].isDesenvolvedor && listaUsuarios[i].isAtivo) {
        listaFinal.push(listaUsuarios[i]);
      }      
    }
    return listaFinal;
  }

});
