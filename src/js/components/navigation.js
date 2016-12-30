import { get, each } from 'lodash';
const STAGGER_DELAY = 25;
const ANIMATED_IN_CLASS = 'entered';

export default {
  computed: {
    navItems() {
      return get(this, '$router.options.routes');
    }
  },
  mounted() {
    const self = this;
    const { $store } = this;

    /**
     * If we used Vue's transition system, its purely based on the data
     * received from navItems computed fn; which means its constantly
     * appending/removing from the DOM. We don't need that, we just need
     * staggered animation on the list whenever it toggles.
     * @type {[type]}
     */
    $store.watch(state => state.ui.navOpen, (status) => {
      if (status) {
        return each(self.$refs.listItems, addEnterClass);
      }
      each(self.$refs.listItems, removeEnterClass);
    });
  }
};

/**
 * Stagger adding of the class name.
 * @param {[type]} node  [description]
 * @param {[type]} index [description]
 */
function addEnterClass(node, index) {
  setTimeout(() => {
    node.classList.toggle(ANIMATED_IN_CLASS, true);
  }, index * STAGGER_DELAY);
}

/**
 * Remove the enter class from all nodes.
 */
function removeEnterClass(node) {
  node.classList.toggle(ANIMATED_IN_CLASS, false);
}
