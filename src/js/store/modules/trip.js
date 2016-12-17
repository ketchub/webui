import { milesToMeters } from '@/filters';
const SET_ORIGIN = 'SET_ORIGIN';
const SET_ORIGIN_SEARCH_RADIUS = 'SET_ORIGIN_SEARCH_RADIUS';
const SET_DESTINATION = 'SET_DESTINATION';
const SET_DESTINATION_SEARCH_RADIUS = 'SET_DESTINATION_SEARCH_RADIUS';
const SET_DIRECTIONS = 'SET_DIRECTIONS';
const SET_CONTAINMENT_POLYGON = 'SET_CONTAINMENT_POLYGON';

const moduleTrip = {
  state: {
    _origin: null,
    _originSearchRadius: milesToMeters(0.5),
    _destination: null,
    _destinationSearchRadius: milesToMeters(0.5),
    _directions: null,
    _containmentPolygon: null
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
    },
    [SET_DESTINATION_SEARCH_RADIUS]( state, payloadInMeters ) {
      state._destinationSearchRadius = payloadInMeters;
    },
    [SET_CONTAINMENT_POLYGON]( state, payload ) {
      state._containmentPolygon = payload;
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
      commit(SET_CONTAINMENT_POLYGON, null);
      commit(SET_ORIGIN_SEARCH_RADIUS, milesToMeters(0.5));
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
      commit(SET_CONTAINMENT_POLYGON, null);
      commit(SET_DESTINATION_SEARCH_RADIUS, milesToMeters(0.5));
    },
    [`TRIP.SET_DESTINATION_SEARCH_RADIUS`]( {commit}, payloadInMeters ) {
      commit(SET_DESTINATION_SEARCH_RADIUS, payloadInMeters);
    },
    // directions actions
    [`TRIP.SET_DIRECTIONS`]( {commit}, payload ) {
      commit(SET_DIRECTIONS, payload);
      // payload received by this action should only ever be a valid set of
      // directions; not null. This is also the only way to invoke committing
      // SET_CONTAINMENT_POLYGON (there is no external action).
      const bounds = payload.routes[0].bounds;
      const boundsNE = bounds.getNorthEast().toJSON();
      const boundsSW = bounds.getSouthWest().toJSON();
      const boundsNW = {lat:boundsNE.lat, lng:boundsSW.lng};
      const boundsSE = {lat:boundsSW.lat, lng:boundsNE.lng};
      commit(SET_CONTAINMENT_POLYGON, [boundsNE, boundsSE, boundsSW, boundsNW]);
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
    },
    tripContainmentPolygon( state ) {
      return state._containmentPolygon;
    }
  }
};

export default moduleTrip;
