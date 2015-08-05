/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Deep close to:
	deepCloseTo = require( './utils/deepcloseto.js' ),

	// Validate a value is NaN:
	isnan = require( 'validate.io-nan' ),

	// Module to be tested:
	variance = require( './../lib' ),

	// Function to apply element-wise
	VARIANCE = require( './../lib/number.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-variance', function tests() {

	it( 'should export a function', function test() {
		expect( variance ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				variance( [1,2,3], {
					'accessor': value
				});
			};
		}
	});

	it( 'should throw an error if provided an array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				variance( [1,2,3], {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a typed-array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				variance( new Int8Array([1,2,3]), {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a matrix and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				variance( matrix( [2,2] ), {
					'dtype': value
				});
			};
		}
	});

	it( 'should return NaN if the first argument is neither a number, array-like, or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			true,
			undefined,
			null,
			// NaN, // allowed
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( isnan( variance( values[ i ] ) ) );
		}
	});

	it( 'should compute the distribution variance when provided a number', function test() {
		assert.closeTo( variance( 2 ), 2, 1e-5 );
		assert.closeTo( variance( 4  ), 4, 1e-5 );
		assert.closeTo( variance( 8  ), 8, 1e-5 );
		assert.closeTo( variance( 16  ), 16, 1e-5 );
	});

	it( 'should compute the distribution variance when provided a plain array', function test() {
		var lambda, actual, expected;

		lambda = [ 2, 4, 8, 16 ];
		expected = [ 2, 4, 8, 16 ];

		actual = variance( lambda );
		assert.notEqual( actual, lambda );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Mutate...
		actual = variance( lambda, {
			'copy': false
		});
		assert.strictEqual( actual, lambda );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );
	});

	it( 'should compute the distribution variance when provided a typed array', function test() {
		var lambda, actual, expected;

		lambda = new Float64Array ( [ 2,4,8,16 ] );
		expected = new Float64Array( [ 2,4,8,16 ] );

		actual = variance( lambda );
		assert.notEqual( actual, lambda );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Mutate:
		actual = variance( lambda, {
			'copy': false
		});
		expected = new Float64Array( [ 2,4,8,16 ] );
		assert.strictEqual( actual, lambda );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );
	});

	it( 'should compute the distribution variance and return an array of a specific type', function test() {
		var lambda, actual, expected;

		lambda = [ 2, 4, 8, 16 ];
		expected = new Int32Array( [ 2,4,8,16 ] );

		actual = variance( lambda, {
			'dtype': 'int32'
		});
		assert.notEqual( actual, lambda );
		assert.strictEqual( actual.BYTES_PER_ELEMENT, 4 );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );
	});

	it( 'should compute the distribution variance using an accessor', function test() {
		var lambda, actual, expected;

		lambda = [
			{'lambda':2},
			{'lambda':4},
			{'lambda':8},
			{'lambda':16}
		];
		expected = [ 2, 4, 8, 16 ];

		actual = variance( lambda, {
			'accessor': getValue
		});
		assert.notEqual( actual, lambda );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Mutate:
		actual = variance( lambda, {
			'accessor': getValue,
			'copy': false
		});
		assert.strictEqual( actual, lambda );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		function getValue( d ) {
			return d.lambda;
		}
	});

	it( 'should compute an element-wise distribution variance and deep set', function test() {
		var data, actual, expected;

		data = [
			{'x':[9,2]},
			{'x':[9,4]},
			{'x':[9,8]},
			{'x':[9,16]}
		];

		expected = [
			{'x':[9,2]},
			{'x':[9,4]},
			{'x':[9,8]},
			{'x':[9,16]}
		];

		actual = variance( data, {
			'path': 'x.1'
		});
		assert.strictEqual( actual, data );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Specify a path with a custom separator...
		data = [
			{'x':[9,2]},
			{'x':[9,4]},
			{'x':[9,8]},
			{'x':[9,16]}
		];

		actual = variance( data, {
			'path': 'x/1',
			'sep': '/'
		});
		assert.strictEqual( actual, data );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );
	});

	it( 'should compute an element-wise distribution variance when provided a matrix', function test() {
		var mat,
			out,
			d1,
			d2,
			i;

		d1 = new Float64Array( 25 );
		d2 = new Float64Array( 25 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i / 10;
			d2[ i ] = VARIANCE( i / 10 );
		}
		mat = matrix( d1, [5,5], 'float64' );
		out = variance( mat );

		assert.deepEqual( out.data, d2 );

		// Mutate...
		out = variance( mat, {
			'copy': false
		});
		assert.strictEqual( mat, out );
		assert.deepEqual( mat.data, d2 );
	});

	it( 'should compute an element-wise distribution variance and return a matrix of a specific type', function test() {
		var mat,
			out,
			d1,
			d2,
			i;

		d1 = new Float64Array( 25 );
		d2 = new Float32Array( 25 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i + 1;
			d2[ i ] = VARIANCE( i + 1 );
		}
		mat = matrix( d1, [5,5], 'float64' );
		out = variance( mat, {
			'dtype': 'float32'
		});

		assert.strictEqual( out.dtype, 'float32' );
		assert.deepEqual( out.data, d2 );
	});

	it( 'should return an empty data structure if provided an empty data structure', function test() {
		assert.deepEqual( variance( [] ), [] );
		assert.deepEqual( variance( matrix( [0,0] ) ).data, new Float64Array() );
		assert.deepEqual( variance( new Int8Array() ), new Float64Array() );
	});

});
