Variance
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> [Poisson](https://en.wikipedia.org/wiki/Poisson_distribution) distribution [variance](https://en.wikipedia.org/wiki/variance).

The [variance](https://en.wikipedia.org/wiki/variance) for a [Poisson](https://en.wikipedia.org/wiki/Poisson_distribution) random variable is

<div class="equation" align="center" data-raw-text="\operatorname{Var}\left( X \right) = \lambda" data-equation="eq:variance">
	<img src="https://cdn.rawgit.com/distributions-io/poisson-variance/cdf3141f91a589faa97880e43c6a0017881cdd1b/docs/img/eqn.svg" alt="Variance for a Poisson distribution.">
	<br>
</div>

where `lambda > 0` is the mean parameter.


## Installation

``` bash
$ npm install distributions-poisson-variance
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var variance = require( 'distributions-poisson-variance' );
```

#### variance( lambda[, opts] )

Computes the [variance](https://en.wikipedia.org/wiki/variance) for a [Poisson](https://en.wikipedia.org/wiki/Poisson_distribution) distribution with parameter `lambda`. `lambda` may be either a [`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), an [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), a [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays), or a [`matrix`](https://github.com/dstructs/matrix).

``` javascript
var matrix = require( 'dstructs-matrix' ),
	data,
	mat,
	out,
	i;

out = variance( 2 );
// returns ~2.000

lambda = [ 2, 4, 8, 16 ];
out = variance( lambda );

// returns [ ~2.000, ~4.000, ~8.000, ~16.000 ]

lambda = new Float32Array( lambda );
out = variance( lambda );
// returns Float64Array( [~2.000,~4.000,~8.000,~16.000] )

lambda =  matrix( [ 2, 4, 8, 16 ], [2,2] );
/*
	[ 2 4,
	  8 16 ]
*/

out = variance( lambda );
/*
	[ ~2.000 ~4.000,
	  ~8.000 ~16.000 ]
*/
```

The function accepts the following `options`:

* 	__accessor__: accessor `function` for accessing `array` values.
* 	__dtype__: output [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) or [`matrix`](https://github.com/dstructs/matrix) data type. Default: `float64`.
*	__copy__: `boolean` indicating if the `function` should return a new data structure. Default: `true`.
*	__path__: [deepget](https://github.com/kgryte/utils-deep-get)/[deepset](https://github.com/kgryte/utils-deep-set) key path.
*	__sep__: [deepget](https://github.com/kgryte/utils-deep-get)/[deepset](https://github.com/kgryte/utils-deep-set) key path separator. Default: `'.'`.

For non-numeric `arrays`, provide an accessor `function` for accessing `array` values.

``` javascript
var lambda = [
	[0,2],
	[1,4],
	[2,8],
	[3,16]
];

function getValue( d, i ) {
	return d[ 1 ];
}

var out = variance( lambda, {
	'accessor': getValue
});
// returns [ ~2.000, ~4.000, ~8.000, ~16.000 ]
```

To [deepset](https://github.com/kgryte/utils-deep-set) an object `array`, provide a key path and, optionally, a key path separator.

``` javascript
var lambda = [
	{'x':[9,2]},
	{'x':[9,4]},
	{'x':[9,8]},
	{'x':[9,16]}
];

var out = variance( lambda, 'x|1', '|' );
/*
	[
		{'x':[9,~2.000]},
		{'x':[9,~4.000]},
		{'x':[9,~8.000]},
		{'x':[9,~16.000]},
	]
*/

var bool = ( data === out );
// returns true
```

By default, when provided a [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) or [`matrix`](https://github.com/dstructs/matrix), the output data structure is `float64` in order to preserve precision. To specify a different data type, set the `dtype` option (see [`matrix`](https://github.com/dstructs/matrix) for a list of acceptable data types).

``` javascript
var lambda, out;

lambda = new Float64Array( [ 2,4,8,16 ] );

out = variance( lambda, {
	'dtype': 'int32'
});
// returns Int32Array( [ 2,4,8,16 ] )

// Works for plain arrays, as well...
out = variance( [2,4,8,16], {
	'dtype': 'int32'
});
// returns Int32Array( [ 2,4,8,16 ] )
```

By default, the function returns a new data structure. To mutate the input data structure (e.g., when input values can be discarded or when optimizing memory usage), set the `copy` option to `false`.

``` javascript
var lambda,
	bool,
	mat,
	out,
	i;

lambda = [ 2, 4, 8, 16 ];

out = variance( lambda, {
	'copy': false
});
// returns [ ~2.000, ~4.000, ~8.000, ~16.000 ]

bool = ( data === out );
// returns true

mat = matrix( [ 2, 4, 8, 16 ], [2,2] );
/*
	[ 2 4,
	  8 16 ]
*/

out = variance( mat, {
	'copy': false
});
/*
	[ ~2.000 ~4.000,
	  ~8.000 ~16.000 ]
*/

bool = ( mat === out );
// returns true
```


## Notes

*	If an element is __not__ a positive number, the [variance](https://en.wikipedia.org/wiki/variance) is `NaN`.

	``` javascript
	var lambda, out;

	out = variance( -1 );
	// returns NaN

	out = variance( 0 );
	// returns NaN

	out = variance( null );
	// returns NaN

	out = variance( true );
	// returns NaN

	out = variance( {'a':'b'} );
	// returns NaN

	out = variance( [ true, null, [] ] );
	// returns [ NaN, NaN, NaN ]

	function getValue( d, i ) {
		return d.x;
	}
	lambda = [
		{'x':true},
		{'x':[]},
		{'x':{}},
		{'x':null}
	];

	out = variance( lambda, {
		'accessor': getValue
	});
	// returns [ NaN, NaN, NaN, NaN ]

	out = variance( lambda, {
		'path': 'x'
	});
	/*
		[
			{'x':NaN},
			{'x':NaN},
			{'x':NaN,
			{'x':NaN}
		]
	*/
	```

*	Be careful when providing a data structure which contains non-numeric elements and specifying an `integer` output data type, as `NaN` values are cast to `0`.

	``` javascript
	var out = variance( [ true, null, [] ], {
		'dtype': 'int8'
	});
	// returns Int8Array( [0,0,0] );
	```


## Examples

``` javascript
var matrix = require( 'dstructs-matrix' ),
	variance = require( 'distributions-poisson-variance' );

var lambda,
	mat,
	out,
	tmp,
	i;

// Plain arrays...
lambda = new Array( 10 );
for ( i = 0; i < lambda.length; i++ ) {
	lambda[ i ] = i + 1;
}
out = variance( lambda );

// Object arrays (accessors)...
function getValue( d ) {
	return d.x;
}
for ( i = 0; i < lambda.length; i++ ) {
	lambda[ i ] = {
		'x': lambda[ i ]
	};
}
out = variance( lambda, {
	'accessor': getValue
});

// Deep set arrays...
for ( i = 0; i < lambda.length; i++ ) {
	lambda[ i ] = {
		'x': [ i, lambda[ i ].x ]
	};
}
out = variance( lambda, {
	'path': 'x/1',
	'sep': '/'
});

// Typed arrays...
lambda = new Float64Array( 10 );
for ( i = 0; i < lambda.length; i++ ) {
	lambda[ i ] = i + 1;
}
out = variance( lambda );

// Matrices...
mat = matrix( lambda, [5,2], 'float64' );
out = variance( mat );

// Matrices (custom output data type)...
out = variance( mat, {
	'dtype': 'uint8'
});
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```



## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. The [Compute.io](https://github.com/compute-io) Authors.


[npm-image]: http://img.shields.io/npm/v/distributions-poisson-variance.svg
[npm-url]: https://npmjs.org/package/distributions-poisson-variance

[travis-image]: http://img.shields.io/travis/distributions-io/poisson-variance/master.svg
[travis-url]: https://travis-ci.org/distributions-io/poisson-variance

[codecov-image]: https://img.shields.io/codecov/c/github/distributions-io/poisson-variance/master.svg
[codecov-url]: https://codecov.io/github/distributions-io/poisson-variance?branch=master

[dependencies-image]: http://img.shields.io/david/distributions-io/poisson-variance.svg
[dependencies-url]: https://david-dm.org/distributions-io/poisson-variance

[dev-dependencies-image]: http://img.shields.io/david/dev/distributions-io/poisson-variance.svg
[dev-dependencies-url]: https://david-dm.org/dev/distributions-io/poisson-variance

[github-issues-image]: http://img.shields.io/github/issues/distributions-io/poisson-variance.svg
[github-issues-url]: https://github.com/distributions-io/poisson-variance/issues
