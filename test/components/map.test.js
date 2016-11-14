import { expect, should, assert } from 'chai';
import Vue from 'vue';
import * as components from '@/components';
import * as mixins from '@/mixins';

describe('components/map.test.js', () => {

	context('initializes 1', () => {
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

	context('initializes 2', () => {
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

		it('initializes ok2', () => {
			console.log('loaded and: ', $vm.$data);
		});

	});

});
