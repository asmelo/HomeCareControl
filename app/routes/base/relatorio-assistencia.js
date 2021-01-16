import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import config from 'homecarecontrol/config/environment';

export default Route.extend({

  usuario: service(),  

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
      listaUsuarios: this.store.findAll('usuario'),
      setores: this.store.findAll('setor')      
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
    
    controller.set('setores', model.setores);    
    
    if (this.get('usuario').usuario.isCoordenador) {
      this.store.findAll('assistencia').then(assistencias => {
        controller.set('listaAssistencias', assistencias);
      });
    } else {        
      this.store.query('assistencia', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').usuario.get('id')
      }).then(assistencias => {
        controller.set('listaAssistencias', assistencias);
      });
    }

    if (this.get('usuario').usuario.isCoordenador) {
      let listaUsuarios = model.listaUsuarios.sortBy('nome');
      this.removeUsuarioLogadoEusuarioDeDesenvolvimento(listaUsuarios);
      listaUsuarios.insertAt(0, this.get('usuario').usuario);
      controller.set('listaUsuarios', listaUsuarios);
    } else {
      controller.set('listaUsuarios', [this.get('usuario').usuario]);
    }
    

    controller.set('usuarioFiltro', this.get('usuario').usuario);

    later(controller, function() {
      controller.send('ordernarAssistenciaPorSetor');
    }, 2000);

    var hoje = new Date;

    //Preenche filtro de Anos
    let listaAnos = [hoje.getFullYear() - 1, hoje.getFullYear(), hoje.getFullYear() + 1];
    controller.set('listaAnos', listaAnos);
    controller.set('ano', hoje.getFullYear());

    //Preenche filtro de Meses do Filtro
    let listaMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    controller.set('listaMeses', listaMeses);
    controller.set('mes', dicionarioMeses[hoje.getMonth()]);
    controller.set('dicionarioMeses', dicionarioMeses);

    //Preenche filtro de Meses das férias
    let listaMesesFerias = ['Não definido', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    controller.set('listaMesesFerias', listaMesesFerias);

    //Preenche filtro de Setores
    let listaSetores = model.setores.sortBy('nome').mapBy('nome');    
    listaSetores.insertAt(0, 'Todos');
    controller.set('listaSetores', listaSetores);
    controller.set('nmSetor', 'Todos');

    //Preeche filtro de Turnos        
    let turnos = ['Todos'].concat(config.APP.turnos);
    controller.set('listaTurnos', turnos);
    controller.set('turno', 'Todos');   

  },

  removeUsuarioLogadoEusuarioDeDesenvolvimento: function(listaUsuarios) {
    for (let i = 0; i < listaUsuarios.length; i++) {
      if (listaUsuarios[i].id == this.get('usuario').usuario.id) {
        listaUsuarios.splice(i, 1);
      }
      if (listaUsuarios[i].isDesenvolvedor) {
        listaUsuarios.splice(i, 1);
      }
    }
  }

});
