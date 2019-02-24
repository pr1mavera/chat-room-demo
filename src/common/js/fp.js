'use strict'

// ************************************

export const trace = function(tag) {
	return function log(x) {
		console.log(tag, x)
		return x
	}
}

export const filterOut = function(predicateFn, arr) {
	return filterIn( not( predicateFn ), arr )
}

export const unary = function(fn) {
	return function onlyOneArg(arg) {
		return fn( arg )
	}
}

export const not = function(predicate) {
	return function negated(...args) {
		return !predicate( ...args )
	}
}

export const reverseArgs = function(fn) {
	return function argsReversed(...args) {
		return fn( ...args.reverse() )
	}
}

export const spreadArgs = function(fn) {
	return function spreadFn(argsArr) {
		return fn( ...argsArr )
	}
}

export const partial = function(fn, ...presetArgs) {
	return function partiallyApplied(...laterArgs) {
		return fn( ...presetArgs, ...laterArgs )
	}
}

export const partialRight = function(fn, ...presetArgs) {
	return function partiallyApplied(...laterArgs) {
		return fn( ...laterArgs, ...presetArgs )
	}
}

export const curry = function(fn, arity = fn.length) {
	return (function nextCurried(prevArgs) {
		return function curried(nextArg) {
			var args = [ ...prevArgs, nextArg ]

			return args.length >= arity
					? fn( ...args )
					: nextCurried( args )
		}
	})( [] )
}

export const uncurry = function(fn) {
	return function uncurried(...args) {
		var ret = fn

		for (let i = 0; i < args.length; i++) {
			ret = ret( args[i] )
		}

		return ret
	}
}

export const zip = function(arr1, arr2) {
	var zipped = []
	arr1 = [...arr1]
	arr2 = [...arr2]

	while (arr1.length > 0 && arr2.length > 0) {
		zipped.push( [ arr1.shift(), arr2.shift() ] )
	}

	return zipped
}

export const compose = function(...fns) {
    return fns.reduceRight( function reducer(fn1, fn2) {
        return function composed( ...args ) {
            return fn2( fn1( ...args ) )
        }
    } )
}

export const prop = function(name, obj) {
	return obj[name]
}

export const first = function(arr) {
	return arr[0]
}

export const last = function(arr) {
	return arr[arr.length - 1]
}

export const setProp = function(name, obj, val) {
	var o = Object.assign( {}, obj )
	o[name] = val
	return o
}

export const unboundMethod = function(methodName, argCount = 2) {
	return curry(
		(...args) => {
			var obj = args.pop()
			return obj[methodName]( ...args )
		},
		argCount
	)
}

export const pipe = reverseArgs(compose)

// curried list operators
export const map = unboundMethod( 'map', 2 )
export const filter = unboundMethod( 'filter', 2 )
export const filterIn = filter
export const reduce = unboundMethod( 'reduce', 3 )
export const each = unboundMethod( 'forEach', 2 )
export const flatMap = curry( function flatMap(mapperFn, arr) {
	return arr.reduce( function reducer(list, v) {
		return list.concat( mapperFn( v ) )
	}, [] )
} )
