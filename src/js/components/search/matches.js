export default {
  template: '#components_search_matches',
  data() {
    return {
      inProgress: false,
      query: {
        when: {
          month: null,
          day: null,
          year: null,
          time: null
        },
        flexible: false,
        wouldDrive: true
      }
    };
  },
  methods: {
    onSubmit() {
      fetch('/index.html')
        .then((resp) => {
          console.log(resp);
        });
      // console.log(this, JSON.stringify(this.$data));
    }
  },
  mounted() {
    const { $currentStart, $currentEnd, directions } = this.$store.getters;
    console.log($currentStart, $currentEnd, directions);
  }
};
