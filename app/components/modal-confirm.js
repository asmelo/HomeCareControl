import Component from '@ember/component';

export default Component.extend({

  didInsertElement() {
    this.$('.modal').modal();
  },

  actions: {

      actionConfirm() {
          this.get('actionConfirm')();
      }

  }

});
