import moment from 'moment';

export default {
  template: '#components_calendry-view',
  props: {
    value: {
      // this is not settable, yet (cannot pass in an initial value)
      required: true
    }
  },
  data() {
    return {
      activeMonthKey: `${this.$monthMapMoment.get('year')}-${this.$monthMapMoment.get('month')}`,
      activeDateKey: this.$selectedDate
    };
  },
  methods: {
    choose(_moment) {
      this.$selectedDate = _moment;
      const formatted = this.$selectedDate.format('YYYY-MM-DD');
      this.$refs.input.value = formatted;
      this.$emit('input', formatted);
      this.$forceUpdate();
    },
    isSelected(_moment) {
      return _moment.isSame(this.$selectedDate, 'date');
    },
    header() {
      return this.$monthMapMoment && this.$monthMapMoment.format('MMM - YYYY');
    },
    monthMap() {
      return getMonthMap(this.$monthMapMoment);
    },
    prev() {
      this._setActiveMonthKey('subtract');
    },
    next() {
      this._setActiveMonthKey('add');
    },
    _setActiveMonthKey(method) {
      this.$monthMapMoment[method](1, 'months');
      this.activeMonthKey = `${this.$monthMapMoment.get('year')}-${this.$monthMapMoment.get('month')}`;
      this.$forceUpdate();
    }
  },
  beforeCreate() {
    this.$monthMapMoment = moment();
  },
  mounted() {
    this.choose(moment());
  }
};

/**
 * This caches the generated month maps to avoid instantiating moment()s
 * for every month list.
 * @param {Moment} $$moment Pass in a moment object and the calendar for the
 * month the moment is in will be derived.
 * @return {array} Loop to display for the month.
 */
const monthMapCache = {};
function getMonthMap( $$moment ) {
  // Key is string '{year}-{month}', where month is 0-indexed.
  const key = `${$$moment.get('year')}-${$$moment.get('month')}`;

  if (monthMapCache[key]) {
    return monthMapCache[key];
  }

  const monthStart         = moment($$moment).startOf('month');
  const monthEnd           = moment(monthStart).endOf('month');
  const calendarStart      = moment(monthStart).subtract(monthStart.day(), 'days');
  const calendarEnd        = moment(monthEnd).add((6 - monthEnd.day()), 'days');
  const calendarDayCount   = Math.abs(calendarEnd.diff(calendarStart, 'days'));

  monthMapCache[key]       = (function( daysInCalendar, calendarStart, _array ){
    for( var _i = 0; _i <= daysInCalendar; _i++ ){
      let m = moment(calendarStart).add(_i, 'days');
      m._inMonth = m.isSame(monthStart, 'month');
      _array.push(m);
    }
    return _array;
  })( calendarDayCount, calendarStart, []);

  return monthMapCache[key];
}
