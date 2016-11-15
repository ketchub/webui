import { expect, should, assert } from 'chai';
import Vue from 'vue';
import * as components from '@/components';
import * as mixins from '@/mixins';

describe('components/mapView/unit', () => {

	context('unit', () => {
		let $vm;

		before((done) => {
			let mapView = Object.assign({}, components.mapView);
			mapView.template = '<div><div class="map-instance"></div></div>';

			const Instance = Vue.extend(mapView);
			$vm = new Instance({
				mixins: [mixins.google]
			});

			$vm
				.$mount()
				.$watch('mapLoaded', () => { done(); });
		});

		after(() => {
			$vm.$destroy(); $vm = null;
		});

		it('initializes ok', () => {
			console.log('loaded and: ', $vm.$data);
		});

	});

});
