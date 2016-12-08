import { milesToMeters } from '@/filters';
const SET_ORIGIN = 'SET_ORIGIN';
const SET_ORIGIN_SEARCH_RADIUS = 'SET_ORIGIN_SEARCH_RADIUS';
const SET_DESTINATION = 'SET_DESTINATION';
const SET_DESTINATION_SEARCH_RADIUS = 'SET_DESTINATION_SEARCH_RADIUS';
const SET_DIRECTIONS = 'SET_DIRECTIONS';

const moduleTrip = {
  state: {
    _origin: null,
    _originSearchRadius: milesToMeters(0.5),
    _destination: null,
    _destinationSearchRadius: milesToMeters(0.5),
    _directions: null,
  },

  mutations: {
    [SET_ORIGIN]( state, payload ) {
      state._origin = payload;
    },
    [SET_DESTINATION]( state, payload ) {
      state._destination = payload;
    },
    [SET_DIRECTIONS]( state, payload ) {
      state._directions = payload;
    },
    [SET_ORIGIN_SEARCH_RADIUS]( state, payloadInMeters ) {
      state._originSearchRadius = payloadInMeters;
      // const rounded = +((payloadInMeters / METERS_MILES_CONVERSION).toFixed(2));
      // state._originSearchRadius = rounded;
    },
    [SET_DESTINATION_SEARCH_RADIUS]( state, payloadInMeters ) {
      state._destinationSearchRadius = payloadInMeters;
      // const rounded = +((payloadInMeters / METERS_MILES_CONVERSION).toFixed(2));
      // state._destinationSearchRadius = rounded;
    }
  },

  actions: {
    // origin actions
    [`TRIP.SET_ORIGIN`]( {commit}, payload ) {
      commit(SET_ORIGIN, payload);
    },
    [`TRIP.UNSET_ORIGIN`]( {commit} ) {
      commit(SET_ORIGIN, null);
      commit(SET_DIRECTIONS, null);
    },
    [`TRIP.SET_ORIGIN_SEARCH_RADIUS`]( {commit}, payloadInMeters ) {
      commit(SET_ORIGIN_SEARCH_RADIUS, payloadInMeters);
    },
    // destination actions
    [`TRIP.SET_DESTINATION`]( {commit}, payload ) {
      commit(SET_DESTINATION, payload);
    },
    [`TRIP.UNSET_DESTINATION`]( {commit} ) {
      commit(SET_DESTINATION, null);
      commit(SET_DIRECTIONS, null);
    },
    [`TRIP.SET_DESTINATION_SEARCH_RADIUS`]( {commit}, payloadInMeters ) {
      commit(SET_DESTINATION_SEARCH_RADIUS, payloadInMeters);
    },
    // directions actions
    [`TRIP.SET_DIRECTIONS`]( {state, commit}, payload ) {
      commit(SET_DIRECTIONS, payload);
    }
  },

  getters: {
    tripOrigin( state ) {
      return state._origin;
    },
    tripOriginSearchRadius( state ) {
      return state._originSearchRadius;
    },
    tripDestination( state ) {
      return state._destination;
    },
    tripDestinationSearchRadius( state ) {
      return state._destinationSearchRadius;
    },
    tripDirections( state ) {
      return state._directions;
    },
    tripDistance( state ) {
      if (!state._directions || !state._directions.routes) {
        return;
      }
      return state._directions.routes[0].legs[0].distance.text;
    },
    tripMaxCharge( state ) {
      if (!state._directions || !state._directions.routes) {
        return;
      }
      return ((state._directions.routes[0].legs[0].distance.value / 1609.344) * 0.54);
    }
  }
};

export default moduleTrip;
