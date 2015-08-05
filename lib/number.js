'use strict';

// MODULES //

var isPositive = require( 'validate.io-positive-primitive' );


// VARIANCE //

/**
* FUNCTION variance( lambda )
*	Computes the distribution variance for a Poisson distribution with parameter lambda.
*
* @param {Number} lambda - mean parameter
* @returns {Number} distribution variance
*/
function variance( lambda ) {
	if ( !isPositive( lambda ) ) {
		return NaN;
	}
	return lambda;
} // end FUNCTION variance()


// EXPORTS

module.exports =  variance;
