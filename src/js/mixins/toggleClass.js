export default {
  methods: {
    toggleBodyClass( className ) {
      document.body.classList.toggle(className);
    },
    toggleDocumentClass( className ) {
      document.documentElement.classList.toggle(className);
    },
    toggleNav(){
      const navClass = 'nav-open';
      if (document.documentElement.classList.contains(navClass)) {
        document.body.removeEventListener('touchmove', touchMover);
        this.toggleDocumentClass(navClass);
        return;
      }
      document.body.addEventListener('touchmove', touchMover);
      this.toggleDocumentClass(navClass);
    }
  }
};

function touchMover(e) {
  // e.preventDefault(); return false;
}
