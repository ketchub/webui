const { expect, should, assert } = require('chai');

describe(testName(__filename), () => {

	before((done) => {
		setTimeout(() => {
			// console.log('ehhhho');
			done();
		}, 1000);
	});

	it('should run the test', (done) => {
		expect('alpha').to.equal('alpha');
		done();
	});

});