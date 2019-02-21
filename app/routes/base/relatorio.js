import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';


export default Route.extend({

  usuario: service(),

  dicionarioMeses: {
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
  },

  consultaListaUsuarios(this2) {
    return new Promise(function(resolve, reject) {
      var promiseList = [];
      var this3 = this2;
      this2.store.findAll('grupo-compartilhamento', { reload: true }).then(grupos => {
        //Percorre todos os grupos
        for (let i = 0; i < grupos.length; i++) {
          var grupo = grupos.objectAt(i);
          for (let j = 0; j < grupo.listaUsuarios.length; j++) {
            var usuarioCompartilhamento = grupo.listaUsuarios.objectAt(j)

            //Caso o usuário logado esteja no grupo
            if (usuarioCompartilhamento.get('id') == this3.get('usuario').usuario.get('id')) {
              promiseList.push(grupo.get('usuario'));
            }
          }
        }
        Promise.all(promiseList).then(values => {
          var listaUsuarios = [];
          var i = 0;
          while(values[i]) {
            listaUsuarios.push(values[i]);
            i++;
          }
          resolve(listaUsuarios);
        })
      });

    });
  },

  consultaListaAtendimentos(this2) {
    return new Promise(function(resolve, reject) {
      var promiseListUsuario = [];
      var listaGrupos = [];
      var this3 = this2;
      this2.store.findAll('grupo-compartilhamento', { reload: true }).then(grupos => {
        //Percorre todos os grupos
        for (let i = 0; i < grupos.length; i++) {
          var grupo = grupos.objectAt(i);
          for (let j = 0; j < grupo.listaUsuarios.length; j++) {
            var usuarioCompartilhamento = grupo.listaUsuarios.objectAt(j);

            //Caso o usuário logado esteja no grupo
            if (usuarioCompartilhamento.get('id') == this3.get('usuario').usuario.get('id')) {
              listaGrupos.push(grupo.get('id'));
              promiseListUsuario.push(grupo.get('usuario'));
            }

          }
        }
        Promise.all(promiseListUsuario).then(values => {
          var promiseListAtend = [];
          var i = 0;

          promiseListAtend.push(this3.store.query('atendimento', {
            orderBy: 'usuario',
            equalTo: this3.get('usuario').usuario.get('id')
          }));

          while(values[i]) {
            //Caso o usuário logado esteja no grupo
            promiseListAtend.push(this3.store.query('atendimento', {
              orderBy: 'usuario',
              equalTo: values[i].get('id')
            }));
            i++;
          }

          Promise.all(promiseListAtend).then(atendimentos => {
            var listaAtendimentos = [];
            var i = 0;
            while(atendimentos[i]) {
              for (let k = 0; k < atendimentos[i].length; k++) {
                let grupoCompartilhamento = atendimentos[i].objectAt(k).get('grupoCompartilhamento');
                if (atendimentos[i].objectAt(k).get('usuario.id') == this3.get('usuario').usuario.get('id') ||
                    listaGrupos.includes(grupoCompartilhamento.get('id'))) {
                  listaAtendimentos.push(atendimentos[i].objectAt(k));
                }
              }
              i++;
            }
            resolve(listaAtendimentos);
          })

        })
      });

    });
  },

  consultaListaReunioes(this2) {
    return new Promise(function(resolve, reject) {
      var promiseListUsuario = [];
      var listaReunioes = [];
      var listaGrupos = [];
      var this3 = this2;
      this2.store.findAll('grupo-compartilhamento', { reload: true }).then(grupos => {
        //Percorre todos os grupos
        for (let i = 0; i < grupos.length; i++) {
          var grupo = grupos.objectAt(i);
          for (let j = 0; j < grupo.listaUsuarios.length; j++) {
            var usuarioCompartilhamento = grupo.listaUsuarios.objectAt(j);

            //Caso o usuário logado esteja no grupo
            if (usuarioCompartilhamento.get('id') == this3.get('usuario').usuario.get('id')) {
              listaGrupos.push(grupo.get('id'));
              promiseListUsuario.push(grupo.get('usuario'));
            }

          }
        }
        Promise.all(promiseListUsuario).then(values => {
          var promiseListReuniao = [];
          var i = 0;

          promiseListReuniao.push(this3.store.query('reuniao', {
            orderBy: 'usuario',
            equalTo: this3.get('usuario').usuario.get('id')
          }));

          while(values[i]) {
            //Caso o usuário logado esteja no grupo
            promiseListReuniao.push(this3.store.query('reuniao', {
              orderBy: 'usuario',
              equalTo: values[i].get('id')
            }));
            i++;
          }

          Promise.all(promiseListReuniao).then(reunioes => {
            var listaReunioes = [];
            var i = 0;
            while(reunioes[i]) {
              for (let k = 0; k < reunioes[i].length; k++) {
                let grupoCompartilhamento = reunioes[i].objectAt(k).get('grupoCompartilhamento');
                if (reunioes[i].objectAt(k).get('usuario.id') == this3.get('usuario').usuario.get('id') ||
                    listaGrupos.includes(grupoCompartilhamento.get('id'))) {
                  listaReunioes.push(reunioes[i].objectAt(k));
                }
              }
              i++;
            }
            resolve(listaReunioes);
          })
        })
      });

    });
  },

  model() {
    return RSVP.hash({
      gruposUsuario: this.store.query('grupo-compartilhamento', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').userId
      }),
      listaUsuarios: this.get('consultaListaUsuarios')(this),
      listaAtendimentos: this.get('consultaListaAtendimentos')(this),
      listaReunioes: this.get('consultaListaReunioes')(this)
    });
  },

  setupController(controller, model) {

    controller.set('listaAtendimentos', model.listaAtendimentos);
    controller.set('listaReunioes', model.listaReunioes);

    let listaUsuarios = model.listaUsuarios.sortBy('nome');
    listaUsuarios.insertAt(0, this.get('usuario').usuario);
    controller.set('listaUsuarios', listaUsuarios);

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
    controller.set('mes', this.get('dicionarioMeses')[hoje.getMonth()]);
    controller.set('dicionarioMeses', this.get('dicionarioMeses'));

    //Preenche filtro de Grupos de Compartilhamento
    let listaGruposCompartilhamento = model.gruposUsuario.mapBy('nome');
    listaGruposCompartilhamento.insertAt(0, 'Todos');
    listaGruposCompartilhamento.insertAt(1, 'Nenhum');
    controller.set('gruposCompartilhamento', listaGruposCompartilhamento);

    controller.set('nmGrupoCompartilhamento', 'Todos');
    controller.set('nmGrupoCompartilhamentoUsuario', 'Todos');    

  },



});
