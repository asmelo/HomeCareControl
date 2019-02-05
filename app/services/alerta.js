import Service from '@ember/service';

export default Service.extend({

  init() {
      toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: true,
        progressBar: true,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        onclick: null,
        showDuration: '300',
        hideDuration: '1000',
        timeOut: '8000',
        extendedTimeOut: '1000',
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut'
      };
    },

    fixedToast: {
      "closeButton": false,
      "newestOnTop": false,
      "progressBar": false,
      "preventDuplicates": false,
      "timeOut": 0,
      "extendedTimeOut": 0,
      "tapToDismiss": false
    },

    fechar() {
      toastr.clear();
    },

    sucesso(message, options) {
      toastr.success(message, "Sucesso", options);
    },

    info(message, options) {
      toastr.info(message, 'Notificação', options);
    },

    aviso(message, options) {
      toastr.warning(message, 'Aviso', options);
    },

    erro(message, options) {
      toastr.error(message, 'Erro', options);
    },

    confirmErro(message, buttons) {
      toastr.error(message + '<br /><br />'+buttons, 'Erro', this.get('fixedToast'));
    },

});
