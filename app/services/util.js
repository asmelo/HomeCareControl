import Service from '@ember/service';
import config from 'homecarecontrol/config/environment';


export default Service.extend({

  tratarValor(valorParam) {

    if (!valorParam) return 'R$ 0,00';

    if (typeof(valorParam) == 'number') {
      valorParam = valorParam.toFixed(2);
      valorParam = valorParam.replace('.', ',')
    }

    let valor = String(valorParam.replace('R$', '').trim());

    if (valor.length == 1) {
      valor = valor + ',00';
    } else {
      if (!valor.includes(',')) {
        valor = valor + ',00';
      }
    }

    //Coloca o ponto em valores como 99.999,99
    if (valor.length == 8) {
      valor = valor.slice(0, 2) + '.' + valor.slice(2);
    }

    //Coloca o ponto em valores como 9.999,99
    if (valor.length == 7) {
      valor = valor.slice(0, 1) + '.' + valor.slice(1);
    }

    return 'R$ ' + valor;
  },

  calculaValorReuniao(duracao, profissao) {
    if (duracao) {
      let possuiDoisPontos = duracao.indexOf(':') != -1;
      if (possuiDoisPontos) {
        let horas = Number(duracao.split(':')[0]);
        let minutos = Number(duracao.split(':')[1]);
        let valorReuniao = config.APP.valorReuniao;
        if (profissao == 'Fisioterapeuta') {
          valorReuniao = config.APP.valorReuniaoFisio;
        }
        let totalHoras = horas * valorReuniao;
        let totalMinutos = (minutos/60) * valorReuniao
        let total = totalHoras + totalMinutos;
        let totalStr = total.toFixed(2);
        return 'R$ ' + totalStr.replace('.', ',');
      }
    }
    return 'R$ 0,00';
  },

  isLocalhostOrControleDeAssistenciaHost() {
    let hostname = window.location.hostname;
      //if (hostname == 'localhost' || hostname == 'controledeassistencias.firebaseapp.com' || hostname == 'controledeassistencias.web.app') {
      if (hostname == 'controledeassistencias.firebaseapp.com' || hostname == 'controledeassistencias.web.app') {
        return true;
      }
      return false;
  },

  formataAnoEmes: function(data) {
    let ano = data.getFullYear();
    let mes = data.getMonth() + 1;
    var mesStr = mes.toString();
    if (mesStr.length == 1) {
      mesStr = "0" + mesStr;
    }
    return ano + "-" + mesStr;
  },

  formataAnoEmesAtual: function() {
    let dataHoje = new Date;    
    return this.formataAnoEmes(dataHoje);
  },

  formataUsuarioAnoEmesAtual: function(usuarioId) {
    return usuarioId + "_" + this.formataAnoEmesAtual();
  },

  formataUsuarioAnoEmes: function(usuarioId, data) {
    return usuarioId + "_" + this.formataAnoEmes(data);
  },

  formataAnoEmesPorExtenso: function(ano, mes) {
    let dicionarioMeses = {
      "Janeiro": "01",
      "Fevereiro": "02",
      "Março": "03",
      "Abril": "04",
      "Maio": "05",
      "Junho": "06",
      "Julho": "07",
      "Agosto": "08",
      "Setembro": "09",
      "Outubro": "10",
      "Novembro": "11",
      "Dezembro": "12"
    };

    let numeroDoMes = dicionarioMeses[mes];

    return ano + "-" + numeroDoMes;
  },

  formataUsuarioAnoEmesPorExtenso: function(usuarioId, ano, mes) {   
    return usuarioId + "_" + this.formataAnoEmesPorExtenso(ano, mes);
  },  

});
