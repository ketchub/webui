import { expect, should, assert } from 'chai';
import getApp from '@/bootstrap/instance';
import Vue from 'vue';

describe('components/map.test.js', () => {

	before(() => {
		let div = document.createElement('div');
		div.setAttribute('id', 'application');
		document.body.appendChild(div);
	});

	it('initializes ok', () => {
		const app = getApp();
		console.log(getApp);
		console.log('application', app);
		// app.$mount('#application');
		console.log('vuez again2 wtf loremz ipsum: ', Vue);
	});

});
