/**
 * Reusable button component; will create a button where all properties and
 * contents can be set inline. Specifically the important one is the :invoke
 * attribute, which should be a *callable function*.
 */
export default {
  render(createElement) {
    return createElement('button', {
      on: {click:this.invoke}
    }, this.$slots.default);
  },
  props: {
    invoke: {
      type: Function,
      required: true
    }
  }
};
