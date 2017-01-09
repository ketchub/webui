import moment from 'moment';

export default {
  template: '#components_modals_trip-set-date-time',
  data() {
    let query = {
      date: null,
      hour: null,
      minute: null,
      period: null
    };
    if (this.$store.getters.tripWhen) {
      let m = moment(this.$store.getters.tripWhen);
      query.date = m.format('YYYY-MM-DD');
      query.hour = m.format('h');
      query.minute = m.format('mm');
      query.period = m.format('A');
    }
    return { query };
  },
  methods: {
    asap() {
      this.$store.dispatch('TRIP.SET_WHEN', null);
      this.closeModal();
    },
    save() {
      const mm = moment(this.query.date);
      mm.minute(+(this.query.minute));
      mm.second(0);

      // hour (interpret by am/pm)
      let hour = +(this.query.hour);
      mm.hour(hour);
      if (this.query.period === 'AM' && hour === 12) {
        mm.hour(0);
      }
      if (this.query.period === 'PM' && hour < 12) {
        mm.hour(hour + 12);
      }

      this.$store.dispatch('TRIP.SET_WHEN', mm.toISOString());
      this.closeModal();
    }
  },
  mounted() {
    if (!this.$store.getters.tripWhen) {
      const t = getTimeDefault();
      this.query.hour = t.hour;
      this.query.minute = t.minute;
      this.query.period = t.period;
    }
  }
};

function getTimeDefault() {
  const now = moment();
  let hour = +(now.format('h'));
  let minute = +(now.format('m'));
  const period = now.format('A');

  switch(true) {
    case minute < 15:
      minute = 15;
      break;
    case minute >= 15 && minute < 30:
      minute = 30;
      break;
    case minute >= 30 && minute < 45:
      minute = 45;
      break;
    default: // @todo; this doesn't account for 11:45 *pm* -> 12:00 am
      minute = '00';
      hour += 1;
  }

  return { hour, minute, period };
}
