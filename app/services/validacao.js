import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

/*global validate*/
/*eslint no-undef: "error"*/

export default Service.extend({

  alerta: service(),

  init() {
    this._super(...arguments);

    validate.validators.cpf = function(cpf) {
      if(isEmpty(cpf)) return "CPF inválido";

      cpf = cpf.replace(/\./g, '');
      cpf = cpf.replace(/-/g, '');

      var numeros, digitos, soma, i, resultado, digitos_iguais;
      digitos_iguais = 1;
      if (cpf.length < 11)
            return "CPF inválido";
      for (i = 0; i < cpf.length - 1; i++)
        if (cpf.charAt(i) != cpf.charAt(i + 1)){
            digitos_iguais = 0;
            break;
        }
      if (!digitos_iguais){
        numeros = cpf.substring(0,9);
        digitos = cpf.substring(9);
        soma = 0;
        for (i = 10; i > 1; i--)
              soma += numeros.charAt(10 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
              return "CPF inválido";
        numeros = cpf.substring(0,10);
        soma = 0;
        for (i = 11; i > 1; i--)
              soma += numeros.charAt(11 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
              return "CPF inválido";
        return undefined;
      }else{
        return "CPF inválido";
      }
    };

    validate.validators.cnpj = function(cnpj) {
      if(!isEmpty(cnpj)){
        cnpj = cnpj.replace(/[^\d]+/g,'');

         if (cnpj.length != 14)
          return "CNPJ inválido";

         // Elimina CNPJs invalidos conhecidos
         if (cnpj == "00000000000000" ||
             cnpj == "11111111111111" ||
             cnpj == "22222222222222" ||
             cnpj == "33333333333333" ||
             cnpj == "44444444444444" ||
             cnpj == "55555555555555" ||
             cnpj == "66666666666666" ||
             cnpj == "77777777777777" ||
             cnpj == "88888888888888" ||
             cnpj == "99999999999999")
             return "CNPJ inválido";

         // Valida DVs
         let tamanho = cnpj.length - 2
         let numeros = cnpj.substring(0,tamanho);
         let digitos = cnpj.substring(tamanho);
         let soma = 0;
         let pos = tamanho - 7;
         for (let i = tamanho; i >= 1; i--) {
           soma += numeros.charAt(tamanho - i) * pos--;
           if (pos < 2)
                 pos = 9;
         }
         let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
         if (resultado != digitos.charAt(0))
            return "CNPJ inválido";

         tamanho = tamanho + 1;
         numeros = cnpj.substring(0,tamanho);
         soma = 0;
         pos = tamanho - 7;
         for (let i = tamanho; i >= 1; i--) {
           soma += numeros.charAt(tamanho - i) * pos--;
           if (pos < 2)
                 pos = 9;
         }
         resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
         if (resultado != digitos.charAt(1))
               return "CNPJ inválido";
      }
      return undefined;
    }

    validate.validators.data = function(valor) {
      if(!isEmpty(valor)){
        let date = null;
        if(typeof(valor) == "object"){
          let dia = valor.getDate().toString();
          if(dia.length == 1) { dia = '0' + dia; }
          let mes = (valor.getMonth() + 1).toString();
          if(mes.length == 1) { mes = '0' + mes; }
          date = dia + '/' + mes + '/' + valor.getFullYear();
        }else{
          date = valor;
        }


        var ardt=new Array;
        var ExpReg=new RegExp("(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}");
        ardt=date.split("/");

        if ( date.search(ExpReg)==-1){
          return "Data inválida";
        }
        else if (ardt[2]<1902)
          return "Data inválida";
        else if (((ardt[1]==4)||(ardt[1]==6)||(ardt[1]==9)||(ardt[1]==11))&&(ardt[0]>30))
          return "Data inválida";
        else if ( ardt[1]==2) {
          if ((ardt[0]>28)&&((ardt[2]%4)!=0))
            return "Data inválida";
          if ((ardt[0]>29)&&((ardt[2]%4)==0))
            return "Data inválida";
        }
      }
      return undefined;
    };

    validate.validators.mesAno = function(date) {
      if(!isEmpty(date)){
        var ardt=new Array;
        var ExpReg=new RegExp("(0[1-9]|1[012])/[12][0-9]{3}");
        ardt=date.split("/");

        if ( date.search(ExpReg)==-1){
          return "Data inválida. Digite apenas o mês e o ano. (Ex.: 12/2023)";
        }
        else if (ardt[1]<1902)
          return "Data inválida";
        else if (ardt[1]>2099)
          return "Data inválida";
      }
      return undefined;
    };

  },



  validar(campos, constraints) {
    let errors = validate(campos, constraints, {fullMessages: false});

    if (errors) {
      //Exibe um toast para cada mensagem de erro retornada
      //Transforma em um objeto Json para poder navegar nele
      let errorsObj = JSON.parse(JSON.stringify(errors))
      for (let campo in errorsObj) {
        let listaErros = errorsObj[campo]
        for (let idx = 0; idx < listaErros.length; idx++) {
          this.get('alerta').erro(listaErros[idx])
        }
      }
      return false;
    } else {
      return true;
    }
  },

  validarConfirmaSenha(nameSenha, nameConfirmaSenha, valueSenha, valueConfirmaSenha, constraints, iniciarValidacao) {
    if(!isEmpty(iniciarValidacao) && Object.keys(iniciarValidacao.fields).length===0)
       iniciarValidacao = this.inicializarValidacao(iniciarValidacao, constraints);

    if(!isEmpty(iniciarValidacao) && eval('!iniciarValidacao.fields.' + nameConfirmaSenha))
        if(!isEmpty(valueConfirmaSenha))
            eval('iniciarValidacao.fields.'+ nameConfirmaSenha + '= true');

    if(isEmpty(iniciarValidacao) || eval('iniciarValidacao.fields.' + nameConfirmaSenha)){
      let erro = (validate({ [nameSenha]: valueSenha, [nameConfirmaSenha]: valueConfirmaSenha }, { [nameSenha]: constraints[nameSenha], [nameConfirmaSenha]: constraints[nameConfirmaSenha] }, {fullMessages: false}));
      if(erro)
        if(eval('erro.' + nameConfirmaSenha))
          return eval('erro.' + nameConfirmaSenha + '[0]');
    }
  },

  inicializarValidacao(iniciarValidacao, fields){
    for(let field in fields){
      eval('iniciarValidacao.fields.' + field + ' = false');
    }
    return iniciarValidacao;
  },

  validateForm(values, constraints){
    let errors = validate(values,constraints);
    return (errors ? false : true);
  }

});
