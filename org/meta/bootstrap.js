
/*
* Meta JavaScript Framework bootstrap script v1.0
*
* Copyright 2014 Friedrich Kurz
* Released under the MIT license
* f.a.kurz@googlemail.com
*/
'use strict' ;
(function(GLOBAL_OBJECT) {

	// variables
	// @todo not all of the operation variables are needed; remove the unneeded ones
	
	var Core = { },
		Queue,
		Library,
		Configuration,
		GLOBAL_OBJECT,
		VOID,
		isVoid,
		isSet,
		isNull,
		isBoolean,
		isNumber,
		isInteger,
		isFloat,
		isString,
		isObject,
		isFunction,
		isArray,
		isDate,
		isRegExp,
		isError,
		isNode,
		isWindow,
		isInstanceOf,
		typeOf,
		constructorOf,
		assert,
		error,
		stringQuote,
		stringTokenize,
		stringFormat,
		arrayEmpty,
		arrayCopy,
		arrayRemove,
		arrayIndex,
		functionCopy,
		objectDestroy,
		objectEach,
		objectSome,
		objectEvery,
		objectEmpty,
		objectResolveNamespace,
		objectCreateNamespace,
		objectPrint,
		ringAdd,
		ringPop,
		requestCreate,
		requestSend,
		enqueue,
		dequeue,
		isDefined,
		define,
		undefined,
		require,
		createID ;
 
	// Browser Homogenization
	// Extend native objects in order to bring them up to the latest ECMAScript standard and/or the Mozilla standard (whereever possible).
	// @link http://www.ecma-international.org/ecma-262/5.1/

		if(typeof Object.defineProperty === 'undefined') Object.defineProperty = function defineProperty(object, property, specification)
		{

			//

				object[property] = specification.value ;

		} ;

		if(typeof Object.defineProperties === 'undefined') Object.defineProperties(
				Object,
				'defineProperties',
				{
						value: function defineProperties(obj, props) {
								objectEach(props, function(specification, property) { Object.defineProperty(obj, property, specification) ; }) ;
						},
						configurable: true,
						writable: true,
						enumerable: false
				}
		) ;

		if(typeof Object.create === 'undefined') Object.defineProperty(
				Object,
				'create',
				{
						value: function create(proto, propertiesObject)
						{
				 
							// preconditions
							
								if(! isNull(proto) || ! isObject(proto)) throw new TypeError('Invalid Argument: Formal parameter "proto" must be null or object.') ;
								
							// variables
							
							var object,
								constructor ;
							
							//

								if(prototype === null) object = { } ;
								else
								{
 
										var F = function F( ) { } ;
										F.prototype = prototype ;

										object = new F( ) ;

								}
								
								if(propertiesObject) Object.defineProperties(object, propertiesObject) ;
								/*objectEach(
										properties,
										function(specification, key) { Object.defineProperty(object, key, specification) ; }
								) ;*/
								
							// return

								return object ;

						},
						configurable: true,
						writable: true,
						enumerable: false
				}
		) ;
 
		if(typeof Object.keys === 'undefined') Object.defineProperty(
				Object,
				'keys',
				{
						/**@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys#Polyfill*/
						value: (function( ) {
								if(({toString: null}).propertyIsEnumerable('toString'))
										return function keys( )
										{
								
											// variables
											
											var keys = [ ] ;
											
											//
											
												objectEach(this, function(value, key) { keys[keys.length] = key ; }) ;
												
											// return
											
											return keys ;
											
										}
								else
										return function keys( )
										{
								
											// variables
											
											var keys,
												unenumerable = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
											
											//
											
												keys = [ ] ;
												
												objectEach(this, function(value, key) { keys[keys.length] = key ; }) ;
												
												/**/
												
												array.forEach(unenumerable, function(name) { if(Object.prototype.hasOwnProperty.call(this, name)) keys[keys.length] = name ; }) ;
												
											// return
											
											return keys ;

										}
						})( ),
						configurable: true,
						writable: true,
						enumerable: false
				}
		) ;
 
		if(typeof Function.prototype.bind === 'undefined') Object.defineProperty(
				Function.prototype,
				'bind',
				{
						/**@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind*/
						value: function bind(thisArg)
						{
							var self = this ;
								args = arguments.length > 1 ? arrayCopy(arguments, 2) : null ;
								if(args) return function anonymous( ) { self.apply(context, args) ; }
								else return function anonymous( ) { self.call(context) ; }
						},
						configurable: true,
						writable: true,
						enumerable: true
				}
		) ;
				
		if(typeof Array.prototype.forEach === 'undefined') Object.defineProperty(
				Array.prototype,
				'forEach',
				{
						/*@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype*/
						value: function forEach(callback, context)
						{
						
							// variables
							
							var a,
								index = -1, length = this.length ;
							
							//
							
								a = [,,this] ;
							
								while(++index < length)
								{
								
										a[0] = this[index], a[1] = index ;
										callback.apply(context, a) ;
										
								}

						},
						configurable: true,
						writable: true,
						enumerable: true
				}
		) ;
			
		if(typeof Array.prototype.every === 'undefined') Object.defineProperty(
				Array.prototype,
				'every',
				{
						value: function every(callback, context)
						{
						
							// variables

							var a,
								index = -1, length = this.length ;
							
							//
							
								a = [,,this] ;
							
								while(++index < length)
								{
								
										a[0] = this[index], a[1] = index ;
										
										/*Return with a `false` value upon the first `false` return value of the callback.*/
										if(callback.apply(context, a) === false) return false  ;

								}
								
							// return
							
								return true ;

						},
						configurable: true,
						writable: true,
						enumerable: true
				}
		) ;
				
		if(typeof Array.prototype.some === 'undefined') Object.defineProperty(
				Array.prototype,
				'some',
				{
						value: function some(callback, context)
						{
						
							// variables
							
							var a,
								index = -1, length = this.length ;
							
							//
							
								a = [,,this] ;
							
								while(++index < length)
								{
								
										a[0] = this[index], a[1] = index ;
										
										/*Return with a `true` value upon the first `true` return value of the callback.*/
										if(callback.apply(context, a) === true) return true  ;

								}
								
							// return
							
								return false ;
						
						},
						configurable: true,
						writable: true,
						enumerable: true
				}
		) ;

		if(typeof Array.prototype.indexOf === 'undefined') Object.defineProperty(
				Array.prototype,
				'indexOf',
				{
						value: function indexOf(searchElement, fromIndex) { return typeof fromIndex === 'undefined' ? arrayIndex(this, searchElement, 0, this.length) : arrayIndex(this, searchElement, fromIndex, this.length) ; },
						configurable: true,
						writable: true,
						enumerable: true
				}
		) ;


		if(typeof String.prototype.trim === 'undefined') Object.defineProperty(
				String.prototype,
				'trim',
				{
						value: function stringTrim( )
						{
								return this.replace(/^\s+|\s+$/g, '') ;
						},
						configurable: true,
						writable: true,
						enumerable: true
				}
		) ;

	// Core Object
	
	//- Core Object Attributes

	//-- Context
	
		/**
		* A reference to the global context.
		*
		* This script expects the global context to be referenced by `this` when its being executed. The reference `this` is passed to the set-up function (this function wrapper) as its only formal parameter `GLOBAL_OBJECT`.
		*/
		GLOBAL_OBJECT = Core.GLOBAL_OBJECT = GLOBAL_OBJECT ;
		Core.DEFAULT_WINDOW = (function( ) { try { if(typeof GLOBAL_OBJECT.window !== 'undefined') return GLOBAL_OBJECT.window ; } catch(e) { } return null ; })( ) ;
		Core.DEFAULT_DOCUMENT = (function( ) { try { if(typeof GLOBAL_OBJECT.document !== 'undefined') return GLOBAL_OBJECT.document ; } catch(e) { } return null ; })( ) ;//GLOBAL_OBJECT.document || null ;
		Core.IS_BROWSER = !! Core.DEFAULT_WINDOW && !! Core.DEFAULT_DOCUMENT ;

	//-- UA

		/**
		* @link http://www.quirksmode.org/dom/w3c_cssom.html#screenview
		* @todo review (algorithm is tentative)
		*/
		Core.IS_MOBILE = (function( ) {
 
				var screen ;
 
					if(Core.IS_BROWSER)
					{
 
							try {
									screen = GLOBAL_OBJECT.screen ;
									return screen.availWidth < 400 || screen.availHeight < 400 ;
							}
							catch(e) { }
 
					}
 
					return false ;
		})( ) ;
 
	//--- IE

		/**
		*IE detection.
		*@link http://en.wikipedia.org/wiki/Conditional_comment#Conditional_comments_in_JScript
		*/
		Core.IS_IE = (function( ) {
				/*@cc_on return true ;@*/
				return false ;
		})( ) ;
		/**
		*@link http://en.wikipedia.org/wiki/Conditional_comment#Conditional_comments_in_JScript
		*/
		Core.IE_VERSION = (function( ) {
				
			//
				
				/*@cc_on
					  @if (@_jscript_version > 10) return 10.1 ;
					  @elif (@_jscript_version == 10) return 10.0 ;
					  @elif (@_jscript_version == 9) return 9.0 ;
					  @elif (@_jscript_version == 5.8) return 5.8 ;
					  @elif (@_jscript_version == 5.7 && window.XMLHttpRequest) return 7.0 ;
					  @elif (@_jscript_version == 5.6 || (@_jscript_version == 5.7 && !window.XMLHttpRequest)) return 6.0 ;
					  @elif (@_jscript_version == 5.5) return 5.5 ;
					  @elif (@_jscript_version < 5.5) return 5.4 ;
					  @end
				@*/
				
				return -1.0 ; // not IE

		})( ) ;
		/*@deprecated: refactored into `requestCreate`*/
		Core.IE_XMLHTTP_VERSIONS = ['Msxml2.XMLHTTP.6.0','Msxml2.XMLHTTP.3.0','Microsoft.XMLHTTP'],
 
	//--- Opera
		
		Core.IS_OPERA =	(function( ) { try { Core.IS_BROWSER ? typeof GLOBAL_OBJECT.opera !== 'undefined' : false } catch(e) { return false ; } })( ) ;
		/**
		* @todo complete
		*/
		Core.HTTP_METHODS = {
				GET: 'GET',
				POST: 'POST'
		} ;
	
	//-- XHR

		Core.XHR_READY_STATES = {
				UNSENT: 0,
				OPENEND: 1,
				RECEIVED: 2,
				LOADING: 3,
				DONE: 4
		} ;

	//-- MIME
	
		Core.MIME_TYPES = {
				TEXT: 'text/plain',
				CSS: 'text/css',
				XML: 'application/xml',
				JSON: 'text/json',
				JAVASCRIPT: 'application/javascript'
		} ;
 
	//-- Miscellaneous
		
		VOID = Core.VOID = void(0) ;
//		Core.NULL = null ;
 
	//- Core Object Operations
	// @todo use the homogenized operations of the core objects.

	//-- Type Identification

		/**
		* The MS implementation of the strict equality operator will fail if an undeclared reference is evaluated; using `typeof` will work cross-browser)
		* @link http://msdn.microsoft.com/en-us/library/259s7zc1(v=vs.94).aspx
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Core.isVoid = isVoid = function isVoid(object)
		{
			return typeof object === 'undefined' ;
		} ;
		/**
		* Returns true if the given object contains a property for the given key.
		*
		* Use this instead of `isVoid` to test for a property of core Objects in order to avoid errors. 
		*
		* @implementation IE 8 fails with a ``Object does not support property or method'' error if an undefined property is accessed; hence the try-catch block.
		* @param (String) key A key String.
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Core.isSet = isSet = function isSet(key, object)
		{
				try { return ! isVoid(object[key]) ; }
				catch(e) { return false ; }
		} ;
		/**
		* Test whether the given Object is a null value.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Core.isNull = isNull = function isNull(object)
		{
			return object === null ;
		} ;
		/**
		* Test whether the given Object is an instance of Boolean.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Core.isBoolean = isBoolean = function isBoolean(object)
		{
			return typeof object === 'boolean' ;
		} ;
		/**
		* Test whether the given Object is an instance of Number.
		*
		* This method returns `false` for a `NaN` value. Use `isNaN` to test for a `NaN` value.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Core.isNumber = isNumber = function isNumber(object)
		{
			return typeof object === 'number' ? isNaN(object) ? false : true : false ;
		} ;
		/**
		* Test whether the given Object is an instance of Number for an integer value.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Core.isInteger = isInteger = function isInteger(object)
		{

			//

				if(isNumber(object)) return (object % 1) === 0 ;
				else return false ;

		} ;
		/**
		* Test whether the given Object is an instance of Number for a float value.
		*
		* Floating point numbers whose fractional part is zero (e.g. `1.0`) are treated as integers.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Core.isFloat = isFloat = function isFloat(object)
		{
		
			//
			
				if(isNumber(object)) return (object % 1) !== 0 ;
				else { return false ; }

		} ;
		/**
		* Test whether the given Object is an instance of String
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Core.isString = isString = function isString(object)
		{
				return typeof object === 'string' ;
		} ;
		/*
		* Test whether the given object is an instance of Object.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Core.isObject = isObject = function isObject(object)
		{
				return typeof object === 'object' ? Object.prototype.toString.call(object) ===	'[object Object]' : false ;
		} ;
		/*
		* Test whether the given object is an instance of Function.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Core.isFunction = isFunction = function isFunction(object)
		{
				return typeof object === 'function' ? Object.prototype.toString.call(object) === '[object Function]' : false ;
		} ;
		/*
		* Test whether the given object is an instance of Array.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Core.isArray = isArray = function isArray(object)
		{
				return object instanceof Array ;
		} ;
		/*
		* Test whether the given object is an instance of Date.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Core.isDate = isDate = function isDate(object)
		{
				return isInstanceOf(Date, object) ;
		} ;
		/*
		* Test whether the given object is an instance of RegExp.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Core.isRegExp = isRegExp = function isRegExp(object)
		{
				return isInstanceOf(RegExp, object) ;
		} ;
		/*
		* Test whether the given object is an instance of Error.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Core.isError = isError = function isError(object)
		{
				return isInstanceOf(Error, object) ;
		} ;
		/*
		* Test whether the given object is a node type. 
		*
		* @implementation In case the DOM implementation does not provide a (public) `Node` constructor function, the type test is applied using using duck typing for the `.nodeName` and `.nodeType` attributes of the given object.
		*
		* @param (Object) object An object.
		* @return Boolean
		*/
		Core.isNode = isNode = function isNode(object)
		{
				return typeof Node === 'function' ?
						object instanceof Node :
						typeof Node === typeof object && ! isObject(object) && isString(object.nodeName) && isInteger(object.nodeType) ;
		} ;
		/*
		* Test whether the given Object is the Window Object.
		*
		* @param (Object) object An object.
		* @return Boolean
		* @todo tentative, test
		*/
		Core.isWindow = isWindow = function isWindow(object)
		{
		
			// variables
			
			var s ;
			
			//
 
				if(window) s = Object.prototype.toString.call(window) ;
				else s = '[object Window]' ;
 
			// return
 
				return s === Object.prototype.toString.call(object) && (isSet('self', object) && object.self === object);

		} ;
		/**
		* Return a String type identifying the given Object's type.
		*
		* @param (Object) object An object.
		* @return Boolean
		*/
		Core.typeOf = typeOf = function typeOf(object)
		{

			// variables

			var s ;

			//

				/* First things first, exclude `null` and undefined values.*/
				if(isVoid(object)) return 'Void' ; //CONSTANTS.TYPE_VOID ; }
				else if(isNull(object)) return 'Null' ;// CONSTANTS.TYPE_NULL ; }
				else {

						/*Apply all tests first which do not require (or, are not feasible by) parsing the object tag.*/
						if(isFunction(object) ) return 'Function' ;//return CONSTANTS.TYPE_FUNCTION ; }
						else if(isBoolean(object)) return 'Boolean' ;// CONSTANTS.TYPE_BOOLEAN ; }
						else if(isNumber(object)) return isFloat(object) ? 'Float' : 'Integer' ; //CONSTANTS.TYPE_FLOAT : CONSTANTS.TYPE_INTEGER ; }
						else if(isString(object)) return 'String' ;// CONSTANTS.TYPE_STRING ; }
						else if(isArray(object)) return 'Array' ;
						else if(isDate(object)) return 'Date' ;// CONSTANTS.TYPE_DATE ; }
						else if(isRegExp(object)) return 'RegExp' // CONSTANTS.TYPE_REGEXP ; }
						else if(isError(object)) return 'Error' ;// CONSTANTS.TYPE_ERROR ; }
						else if(isNode(object)) return 'Node' ;//CONSTANTS.TYPE_NODE ; }
						else if(isWindow(object)) return 'Window' ;
						else
						{
						
								/*Use the object tag to identify the type. If the object tag identifies an `Object`, test for a constructor function and return its name (if it exists); otherwise return the part of the object identifying the type.*/
								if((s = Object.prototype.toString.call(object)) === '[object Object]') return isSet('constructor', object) ? object.constructor.name : 'Object' ;
								else return s.substring(8, s.length - 1) ;
/*
								s = s.substring(8, s.length - 1) ;

								switch(s) {
//										case 'Array': return CONSTANTS.TYPE_ARRAY: return CONSTANTS.TYPE_ARRAY ; break ;
//										case CONSTANTS.TYPE_WINDOW: return CONSTANTS.TYPE_WINDOW ; break ;
										/*Instances of a constructor function identify as Objects even though they might have overriden `Object.prototype.toString`; in this case we use the name of the constructor's ''name'' property to identify the type or default to `Object`./
										case 'Object': return isSet('constructor', object) ? object.constructor.name : 'Object' ; break ;
										default: return s ;
								}
*/
						}

				}

			// return

			return 'Unknown' ;

		} ;
 
		Core.constructorOf = constructorOf = function constructorOf(identifier)
		{
				return Library.CONSTRUCTORS[identifier] ;
		} ;

		/**
		* Return a `Boolean` value indicating whether the Object referenced by `b` has a sub-type or same type relation to the object referenced by `a`. 
		*
		* This function builds upon the functionality of the `instanceof` operator. If `a` is an object, then `b` is compared to `a`'s constructor; in any other case the objects are directly compared. 
		* The `instanceof` operator returns true if and only if `o instanceof f` satifies the following conditions: (1) `o` is an Object; (2) `f` is a Function; (3) the creation of `o` involves a call to `f` somewhere in the prototype chain (`f` may also be the constructor).
		* In any case `b` must be an Object instance, not a Function.
		* @implementation We do not directly test for `.isFunction(a)` because (at least) Safari implements the constructors of some core types (e.g. `NodeList`) as something else than `Function` sub-types. This makes this function return the wrong result in a test like `isInstanceOf(nodes, NodeList)` (where `nodes` is a `NodeList` instance).
		* @param a (Object, Function) A potential super-type constructor or super-type instance.
		* @param b (Object) A potential sub-type instance.
		* @return (Boolean) True, if `a` is a super-type of `b`
		*/
		Core.isInstanceOf = isInstanceOf = function isInstanceOf(a, b)
		{

			//
				
				if(isObject(a)) { return b instanceof a.constructor ; }
				else return b instanceof a ;
				
			// return
			
				return false ;
				
		} ;
		
	//- Code Flow Operations
	
		/**
		* Throw a generic error. 
		*
		* The error message may be a string containing formatting tokens. In this case the arguments following the error message argument may contain the substitute strings (or, objects).
		* 
		* @example `error("Invalid type for parameter: %s", typeOf(object));`
		*/
		Core.error = error = function error(message, substitute/*...*/)
		{
		
			// variables
			
			var s ;
			
			//
			
				if(arguments.length > 1) s = stringFormat.apply(null, arguments) ;
				else s = message ;

				throw new Error(s) ;
				
		} ;

		/**
		* Tests for an assertion.
		* 
		* An assertion is a test for the consistency of the actual program state with the intended program state. Assertions for example provide a convenient interface to test for pre- and/ or postconditions of operations (such as validity of arguments or the return value), i.e. to test whether the operation's behavior is as intended.
		* The error message---and potential string substituation arguments---will be passed to `::error` in order to raise a generic error (with a formatted error message).
		*
		* @example `assert(x === y, 'Illegal State: Values have to be equal (x=%s, y=%s).', x, y) ;`
		* @todo re-enable assertion silencing in production mode
		*/
		Core.assert = assert = function assert(assertion, message, substitute/*...*/)
		{
 
			// variables
			
			var s ;
			
			//
 
				/*If the assertion was violated, raise an error.*/
				if(! assertion)
				{
				
						if(arguments.length > 2) error.apply(null, arrayCopy(arguments, 1, arguments.length)) ; //s = stringFormat.apply(null, arrayCopy(arguments, 1, arguments.length)) ;
						else error(message) ; //s = message ;
						
//						throw new Error(s) ;
						
				}
				
			// return
			
				return this ;

		} ;

	//- String Operations

		Core.stringQuote = stringQuote = function stringQuote(string)
		{
		
			// variables
			
			var s = '"',
				index = 0, previous = 0 ;
			
			//

				/*Escape nested quotes.*/

				while((index = string.indexOf('"', previous)) !== -1)
				{

						if(previous < index) s += string.substring(previous, index) ;
						
						s += '\\"' ;
						
						/*Continue after the quote.*/

						previous = index + 1 ;
				
				}
				
				s += string.substring(previous, string.length)  + '"' ;
				
			// return

				return s ;

		} ;
		
		Core.stringTokenize = stringTokenize = function stringTokenize(string, delimiter)
		{
		
			// variables
			
			var a = [ ],
				index = 0, last= 0, i = delimiter.length ;
			
			//
 
				/*Find indexes for the given delimiter and gather leading substrings.*/
				while((index = string.indexOf(delimiter, last)) !== -1)
				{
				
						if(index > last) a[a.length] = string.substring(last, index) ;
						
						last = index + i ;
				
				}
 
				/*Gather a potential trailing substring after the last delimiter's index (or the start index if none was found).*/
				i = string.length ;

				if(last <= i - 1) a[a.length] = string.substring(last, i) ;
			
			// return
			
				return a ;
		
		} ;
		
		Core.stringFormat = stringFormat = function stringFormat(string/*, substitute...*/)
		{
		
			// variables

			var s = '',
				index = -1, counter = 0, previous = 0, last = string.length - 1 ;
				
			//

				while((index = string.indexOf('%', previous)) !== -1)
				{

						/*Assure that the formatting token is not escaped.*/

						if(index === 0 || string.charAt(index - 1) !== '\\')
						{

								/*Prepend potential heading substring, Format depending on key character, set the previous index to the first character after the token sequence and default to skipping the token sequence.*/
								
								switch(string.charAt(index + 1))
								{
/*@todo: more formatting options.*/
										case 's': s += (previous < index ? string.substring(previous, index) : '') + String(arguments[++counter]) ; previous = index + 2 ; break ;
										default: s += string.substring(previous, index + 1) ; previous = index + 1 ;
								}

						}
						else { s += (previous < index ? string.substring(previous, index + 1) : '') ; previous = index + 1 ; }

				}

				/*Append a potential trailing substring.*/

				if(previous <= last) s += string.substring(previous, string.length) ;
				
			// return
			
				return s ;
			
		} ;
		
	//- Array Operations
 
		/**
		* Binary search on an Array type.
		*
		* This method returns the index of the first element within the array which is strictly equal to the reference value.
		*
		* @implementation The search algorithm uses binary search.
		*
		* @param array The target array to search within.
		* @param value The value to search for.
		* @param start The start index.
		* @param end The stop index.
		* 
		* @return (Integer) The index of the first element within the array strictly equal to the given reference value; -1, otherwise.
		* @note used in the polyfill for `Array.prototype.indexOf` in order to allow binary search. Cannot be refactored into the polyfill since the signature of `Array.prototype.indexOf` does not provide for a range search as implemented by this operation..
		*/
		Core.arrayIndex = arrayIndex = function arrayIndex(array, value, start, end)
		{
		
			// variables
			
			var middle, i ;
			
			//

				if(start === end) return array[start] === value ? start : -1 ;
				else if(start < end) {

						middle = start + Math.floor((end - start) / 2) ;

						if((i = arrayIndex(array, value, start, middle)) !== -1) return i ;
						else return arrayIndex(array, value, middle + 1, end) ;
				
				}
			
			// return
			
				return -1 ;
		
		} ;

		Core.arrayEmpty = arrayEmpty = function arrayEmpty(array) { return array.length === 0 ; }
		
		/**
		* Copy a range of a given array starting at the given index.
		* 
		* The stop index is the index of the first element which is not getting copied to the new array, e.g. for `stop === array.length` all elements from `start` up to the last element of the array are being copied.
		*
		* The return value is a new array which references the same objects as the original array ("one level deep" copy).
		*
		* @param (Array) array The array to copy.
		* @param (Integer) start The start index.
		* @param (Integer) stop The stop index.
		*/
		Core.arrayCopy = arrayCopy = function arrayCopy(array, start, stop)
		{
				return Array.prototype.slice.apply(array, [start, stop]) ;
		} ;
 
		Core.arrayRemove = arrayRemove = function arrayRemove(array, index)
		{
				return array.splice(index, 1)[0] ;
		} ;

	//- Function Operations
 
		/**
		* Copies the given function with all its properties (including the ''prototype'' property).
		* @return A copy of the given function.
		*/
		Core.functionCopy = functionCopy = function functionCopy(original)
		{
		
			// variables
			
			var copy, s, o ;
			
			//

				copy = eval(original.toString( )) ;

				/*Copy non-standard properties.*/

				for(s in original)
						if(! (s in Function.prototype)) copy[s] = original[s] ;

			// return
			
				return copy ;
		
		} ;
 
	//- Object Operations
 
		/**
		* Destroy an object.
		*
		* The `for <key> in <object>` control structure is used in order to iterate over all enumerable properties including those inherited through the prototype chain (as opposed to the object iteration operations---`objectEach`, `objectSome`, `objectEvery`---which only iterate over own properties).
		*
		* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
		* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete
		* @todo Apparently the `delete` operator only actually deletes properties which were not inherited through the prototype chain (which are reset to their defaults). It may however indirectly lead to garbage collection on not-inherited properties.
		*/
 
		Core.objectDestroy = objectDestroy = function objectDestroy(object)
		{
 
			//
 
				for(var k in object) delete object[k] ;
 
		} ;
 
		/**
		* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
		*/
		Core.objectEach = objectEach = function objectEach(object, callback, context)
		{
		
			// variables
			
			var a ;
			
			//
			
				a = [,,object] ;
			
				for(var key in object)
						if(Object.prototype.hasOwnProperty.call(object, key))
						{
						
								a[0] = object[key], a[1] = key ;
						
								callback.apply(context, a)
								
						}

		} ;
 
		Core.objectSome = objectSome = function objectSome(object, callback, context)
		{
		
			// variables
			
			var a ;
			
			//
			
				a = [,,object] ;
			
				for(var key in object)
						if(Object.prototype.hasOwnProperty.call(object, key))
						{
						
								a[0] = object[key], a[1] = key ;
						
								if(callback.apply(context, a) === true) return true ;
								
						}
			// return
 
				return false ;
 
		} ;
 
		Core.objectEvery = objectEvery = function objectEvery(object, callback, context)
		{
 
			// variables
			
			var a ;
			
			//
			
				a = [,,object] ;
			
				for(var key in object)
						if(Object.prototype.hasOwnProperty.call(object, key))
						{
						
								a[0] = object[key], a[1] = key ;
						
								if(callback.apply(context, a) === false) return false ;
								
						}
			// return
 
				return true ;

		} ;
 
		Core.objectEmpty = objectEmpty = function objectEmpty(object) { return ! objectSome(object, function( ) { return true ; }) ; }
 		
		/**
		*/
		Core.objectPrint = objectPrint = function objectPrint(object)
		{

			// variables
			
			var s, i1 = 0, i2 ;
			
			//

				if(object === null) s = 'null' ;
				else {
				
						switch(typeof object)
						{
								case 'undefined': s = 'void' ; break ;
								case 'boolean': s = String(object) ; break ;
								case 'number': s = isNaN(object) ? 'NaN' : String(object) + ((object % 1) !== 0 ? 'd' : 'l') ; break ;
								case 'string': s = stringQuote(object) ; break ;
								default: {
								
										if(object instanceof Function) s = (object.name || 'anonymous') + '()' ;
										else if(object instanceof Error) s = (object.type || object.name || 'Error') + ' (@' + (object.fileName || 'unknown') + ': ' + (object.lineNumber || -1) + ': ' + (object.columnNumber || -1) + '): ' + (object.message || object.description || '') ;
										else s = Object.prototype.toString.call(object) ;
										
								}

						}
				
				}
				
			// return
			
				return s ;
				
		} ;
 
		/**
		*/
		Core.objectResolveNamespace = objectResolveNamespace = function objectResolveNamespace(namespace, object)
		{

			// variables
			
			var index = 0, previous = 0,
				s,
				o = object ;
			
			//

				while((index = namespace.indexOf('.', previous)) !== -1)
				{
				
						/*Return early if `previous` equals `index - 1` (substring is empty string): in this case the namespace string contains an invalid sequence `'..'`.*/

						if((s = namespace.substring(previous, index)) === '') return ;
						else {

								if(! isSet(s, o)) return ;
								else if(! isObject((o = o[s]))) return ;
								
								previous = index + 1 ;
								
						}
				
				}
				
				s = namespace.substring(previous, namespace.length) ;
				o = o[s] ;

			// return
			
				return o ;
		
		} ;

		/**
		* Create a namespace for the given namespace identifier string on the given target object.
		*
		* Namespace identifier strings are simple identifier sequences delimited by a dot (e.g. 'a.b.c.d'). This method automatically creates a property if the value for a key is undefined; it will travel along existing object properties but will break on null values.
		*
		* @return The host of the object for the given namespace or undefined if the namespace creation failed.
		*/
		Core.objectCreateNamespace = objectCreateNamespace = function objectCreateNamespace(namespace, object)
		{

			// variables

			var o = object,
				index = 0, previous = 0,
				s ;
			
			//
			
				/*Iterate over the namespace steps.*/

				while((index = namespace.indexOf('.', previous)) !== -1)
				{

						/*Return early if `previous` equals `index - 1` (substring is empty string): in this case the namespace string contains an invalid sequence `'..'`.*/
						if((s = namespace.substring(previous, index)) === '') return ;
						else {

								/*Add a nested object on undefined values; continue with existing property if not null.*/
								if(! isSet(s, o)) o = o[s] = { } ;
								else if(! isObject((o = o[s]))) return ;
								
								previous = index + 1 ;
								
						}
				
				}
				
				if((s = namespace.substring(previous, namespace.length)) === '') return ;

				if(! isSet(s, o)) o = o[s] = { } ;
				else if(! isObject((o = o[s]))) return ;

			// return
			
				return o ;
		
		} ;
 
	//--- Ring Operations
	// @note A ring is a doubly linked list where the list head is designated element
	
		/**
		* Removes the top element of the given ring from the ring and returns the new top element.
		* @return (Object) The new top element of the ring.
		*/
		Core.ringPop = ringPop = function ringPop(ring)
		{

			// variables
 
			var top  ;
 
			//
 
				if((top = ring.next) === ring) top = VOID ; // ring has only one element
				else // ring has at least two elements
				{
 
						/*Unlist the previous top element.*/
						top.previous = ring.previous ;
						ring.previous.next = top ;
 
				}

				/*Remove pointers from the previous top element.*/
				delete ring.next ;
				delete ring.previous ;
 assert(top !== ring || (isSet('next', top) && isSet('previous', top)), '!') ;
			// return

				return top ;
 
		} ;
 
		/**
		* @param (Object) ring The top element of the ring. If this is `null`, the second argument is made into the new top element of the ring.
		* @return The top element of the ring.
		*/
		Core.ringAdd = ringAdd = function ringAdd(ring, element)
		{
// console.log('::ringAdd (%s, %s)', typeOf(ring), element) ;
			//
 
				if(isNull(ring))
				{
 
						element.next = element.previous = element ;

						return element ;
 
				}
				else
				{

						element.next = ring ;
						element.previous = ring.previous ;
						ring.previous.next = element ;
						ring.previous = element ;
 
						return ring ;
 
				}

		} ;
 
	//-- XHR Operations
	
		/**
		* Create an XHR object with the given properties.
		*
		* @todo ready state change handler needs to handle more status-state combinations.
		*/
		Core.requestCreate = requestCreate = function requestCreate(properties)
		{
 
			// variables
 
			var request,
				s ;
 
			//
 
				/*Get a request object.*/
 
				if(Core.IS_IE)
				{
				
						['Msxml2.XMLHTTP.6.0','Msxml2.XMLHTTP.3.0','Microsoft.XMLHTTP'].some(function(version) {
						
								try { return ! isNull((request = new ActiveXObject(version))) ; }
								catch(e) { }
								
						}) ;

				}
				else request = new GLOBAL_OBJECT.XMLHttpRequest( ) ;

				assert(! (isNull(request) || isVoid(request)), 'Illegal State: Unable to create request object.') ;
 
				/*Set properties and ready state change handler.*/
 
				properties.request = request ;
 
				request.onreadystatechange = (function ( )
				{
						
					// variables

					var status = this.request.status,
						state = this.request.readyState,
						handler ;
 
					//

						if((status - 400 > 0) && (handler = this.error)) handler(this) ;
						else switch(state)
						{
								case Core.XHR_READY_STATES.DONE:
										if(status === 200 && (handler = this.done)) handler(this) ;
										else if((handler = this.error)) handler(this) ;
								break ;
								default: /*@todo: state handlers*/;
						}

				}).bind(properties) ;

				if((s = properties.mime))
						if(isSet('overrideMimeType', request)) request.overrideMimeType(s) ;
 
			// return
 
				return request ;
 
		} ;

		Core.requestSend = requestSend = function requestSend(request, properties)
		{
		
			// variables
			
			var method = properties.method,
				url = properties.url,
				o,
				i ;
			
			//
 
				/*Cache prevention.*/
 
				if(properties.cache === false)
				{
						if((i = url.indexOf('?')) !== -1) url += ('&' + String(Date.now( ))) ;
						else url += ('?' + String(Date.now( ))) ;
				}
 
				/*Open request in order to be able to set headers and send it.*/

				request.open(method, url, properties.async) ;
 
				/*Set request method headers.*/
			
				switch(method)
				{
						case Core.HTTP_METHODS.GET:
								request.setRequestHeader('Content-Type', 'XMLHTTP/1.0') ;
						break ;
						case Core.HTTP_METHODS.POST:
								request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded') ;
						break ;
						/*@todo: support for all HTTP methods*/
						default: error('Unsupported Operation: HTTP method currently not supported (method="%s")', method) ;
				}
				
				/*Add headers.*/
				
				if((o = properties.headers)) objectEach(o, function(values, header) {
						values.forEach(function(value) { request.setRequestHeader(header, value) ; }, this) ;
				}, this) ;

				/*As per convention.*/
				
				if(properties.flag) request.setRequestHeader('X-Requested-With', 'XMLHttpRequest') ;
 
				/*Send the request.*/
			
				if(properties.binary) request.sendAsBinary(properties.body) ;
				else request.send(properties.body) ;
		
		} ;
 
	//-- Queue Operations
 
		/**
		* Create a job for the given task list and add it to the queue.
		*/
		Core.enqueue = enqueue = function enqueue(task/*, ...*/)
		{
// console.log('Core::enqueue') ;
			// variables
 
			var job,
				i1 = -1, i2 = arguments.length ;
 
			//
 
				job = Queue.createJob( ) ;
 
				while(++i1 < i2) Queue.addTask(job, arguments[i1]) ;

				Queue.addJob(job) ;
 
		} ;
 
	//-- Library Operations
	
		/**
		* @contract Tests whether the constructor for the given type identifier is defined or not. Might return `false` if the constructor has been set but the requirement process has not been resolved.
		* @todo implement
		*/
		Core.isDefined = isDefined = function isDefined(identifier) { return isSet(identifier, Library.CONTRUCTORS) ; },
		/**
		* @contract Defines a type constructor sans library management (i.e. based on the existing library only).
		* @todo implement using object definition operations `Object.defineProperty`
		* @return (Function) The constructor of the defined type.
		* @deprecated: can be easily replaced by `Object.create(new extend( ), { ... })`
		*/
		Core.define = function define(properties)
		{
 
			// variables
 
			var constructor, extend, main,
				reflect, prototype, local, global ;
 
			//
 

				assert(isSet('identifier', properties), 'Illegal State: Missing required property "identifier"') ;
 
				identifier = properties.identifier ;
 
				assert(! isSet(identifier, Library.CONSTRUCTORS), 'Illegal State: Type already defined (%s)', identifier) ;
 
				/*Create a constructor for the given type and store it on the library.*/
				constructor = Library.CONSTRUCTORS[identifier] = Library.constructorFor(identifier) ;
				Library.defineType(constructor, properties) ;

/*
				reflect = constructor.reflect ;
//				reflect.global = [ ] ; // the list of global property keys
//				reflect.local = [ ] ; // the list of local property keys

 console.log('::define') ;
 console.dir(constructor) ;
				/*Build the the prototype object using the super type constructor and copy global properties.*
				if((extend = properties.extend)) Library.definePrototype(extend, constructor)
/*
				{

						constructor.prototype = new extend( ) ;
console.log('prototype:') ;
console.dir(constructor.prototype) ;
						/*Copy global properties of the super type./
						objectEach(constructor, function(v, k) { constructor[k] = v ; }) ;

				}
*
				/*Validate the main method*
				if((main = constructor.reflect.main = extend ? properties.main || extend.reflect.main : VOID)) assert(main.length > 0, 'Illegal State: Main operation must have at least one formal parameter.') ;
 
				/*Define local properties*
				if((local = properties.local))
				{
 
						prototype = constructor.prototype ;
		 
						objectEach(local, function(v, k) {
								Object.defineProperty(prototype, k, {
										value: v,
										configurable: true,
										writable: true,
										enumerable: true
								}) ;
						}) ;
 
				}
 
				/*Define global properties.*
				if((global = properties.global))
				{
 
						objectEach(global, function(v, k) {
								Object.defineProperty(constructor, k, {
										value: v,
										configurable: true,
										writable: true,
										enumerable: true
								}) ;
						}) ;
 
						/*Copy the super type's global properties (unless its overrides an existing property of the defined constructor).*
						if(extend) objectEach(constructor, function(v, k) { if(! isSet(k, constructor)) constructor[k] = v ; }) ;
						
				}
 console.dir(constructor) ;
*/
			// return
			
			return constructor ;
 
		} ;
 
		Core.undefine = function undefine(identifier)
		{
 
			// preconditions
 
				assert(isSet(identifier, Library.CONSTRUCTORS), 'Invalid Argument: Type not defined (%s)', identifier) ;
				
			// variables
			
			var constructor ;
			
			//
			
				constructor = Library.CONSTRUCTORS[identifier] ;
				
				/*Destroy the constructor and remove it from the library.*/
				objectDestroy(constructor) ;
				delete Library.CONSTRUCTORS[identifier] ;
 
		} ;
 
		/**
		* @tood finish implementation
		*/
		Core.require = require = function require(identifier, callback)
		{
 
			//

				Library.requireType(identifier) ;
				Library.listen(Library.STATE_REQUIREMENT_RESOLVED, function(data) {
/*@quickanddirty*/
if(objectEvery(Library.STATE, function(state) { return state === Library.STATE_REQUIREMENT_RESOLVED ; }))
{

	Library.unlisten(Library.STATE_REQUIREMENT_RESOLVED) ;
	callback( ) ;
	
}
				}) ;
 
		} ;
 
		Core.constructorOf = function constructorOf(identifier) { return Library.CONSTRUCTORS[identifier] || null ; }

	//-- Utility Operations
	
		Core.createID = createID = (function( ) {
		
			var _date = Date.now( ),
				_counter = 0 ;
			
				/*This function encapsulates the variables `_date` and `_counter` defined in the scope of the outer function.*/
				return function createID( )
				{
			
					// variables
					
					var i ;
					
					//
				
						/*If the current date is equal to the last stored date, increase the counter in order to produce a unique id; otherwise, store the current date and reset the counter.*/
						if((i = Date.now( )) === _date) { _counter++ ; }
						else { _date = i ; _counter = 0 ; }

					// return
					
					return i + '-' + _counter ;

				}
		})( ) ;
 
	// Queue Object
	
		Queue = {
				TIMER: VOID,
				TOP: VOID,
				/**
				* The job collection.
				*
				* The `TOP` property stores a wrapper element for the last selected job. The queue switches between jobs to ensure fair time sharing between jobs (round robin); this property ensures that the next selected job will be the first applicable (stopped) job after the last selected job (by traversing the ring queue until either such a job was found or the top element was reached again).
				*/
				JOBS: { },
				JOB_CONSTRUCTOR: (function ( ) {
						/*Define the `Job` constructor and its properties.*/
						function Job( ) { } ;
						Job.STATE_STOPPED = 'stopped' ;
						Job.STATE_ACTIVE = 'active' ;
						/**deprecated: not needed*/
						Job.STATE_PAUSED = 'paused' ;
						Job.STATE_DONE = 'done' ;
						Job.TASK_ASYNC = 1 ;
						Job.TASK_IMPORTANT = 1 << 1 ;
						/*Define the `Job` prototype's properties.*/
						Job.prototype = Object.create(null, {
								constructor: {value: Job, configurable: true, writable: true, enumerable: true},
								/**@return An integer value in {-1, 0, 1, ∞} (-1 indicates the previous state, 0 indicates the current state, 1 the next state, ∞ indicates the next logical default state).*/
								trigger: {value: function trigger(event)
								{
									var current,
										handler ;
										if((current = this.current) && (handler = this.current[event])) return handler.call(null) ;
										return Infinity ;
								}, configurable: true, writable: true, enumerable: true},
						}) ;
						return Job ;
				})( )
		} ;
 
		/*
 		* @contract This operation contains the logic of a single queue cycle. It tests for jobs on the queue (and removes the timer if there are none) and processes the next job. There is no provision for job selection based on priority; jobs share time equally (round robin). This operation also applies the job machine model to the given job. The job machine model contains the following states and transitions:
		*		states are in {"idle", "active", "paused", "done"} (where `-> "idle"` denotes the transition from the pseudo state of job creation to the initial state);
		*		transitions are in {
		*				-> "idle",
		*				"idle" -> "idle", "idle"-> "active", "idle" -> "done"
		*				"active" -> "active", "active" -> "paused", "active" -> "idle"
		*				"paused" -> "paused", "paused" -> "active",
		*				"done" -> "done"
		*		}
		* Where "a" -> "b" denotes a transition from state a to state b. Note that all states may contain a loop to themselves and that "done" is the terminal state.
		* A transition from state a to state b follows a successful call to the event handler for state a. I.e. let <code> denote the event code for state a---and <data> be the event data object---, then if the call `job.handle(<code>, <data>)` returns true, a a transition to the next step may take place; otherwise, it must be checked again later.
		* There may only be one state transition during one call to this operation for a single job. [The semaphor may be removed?]
		*/
		Queue.switchJob = function switchJob( )
		{
 
			// variables
 
			var Job = Queue.JOB_CONSTRUCTOR,
				jobs = Queue.JOBS,
				top,
				job,
				next,
				first,
				task ;
 
			//

				/*If the job collection is empty, clear the timer (if it is set) and return early.*/
				if(objectEmpty(jobs))
				{
 assert(! isSet('TOP', Queue), 'Illegal State: Job collection is empty but queue has top element.') ;
// console.log('(!) queue-empty') ;
						if(Queue.TIMER) GLOBAL_OBJECT.clearInterval(Queue.TIMER) ;
 
						return ;
 
				}
assert(isSet('TOP', Queue), 'Illegal State: Job map is not empty but queue has no top element.') ;
				/*Shift the job queue to ensure fair---round robin---time sharing.*/
				top = Queue.TOP = Queue.TOP.next ;
				job = top.job ;
// console.log('Queue::switchJob (%s)', job.getID( )) ;
// console.log('\tjob-state: %s', job.getState( )) ;
				/*Apply the job machine model.*/
				switch(job.getState( ))
				{
						case Job.STATE_STOPPED:
								if((next = job.trigger(Job.STATE_STOPPED)) === 1 || next === Infinity)
								{
 
										if(! (first = job.tasks)) job.finish( ) ;
										else
										{

												/*Activate the job.*/
												job.activate( ) ;
		 
												/*Adjust the task collection and call the task's callback.*/
												first = job.tasks ;
												task = job.current = first.task ;
												job.tasks = ringPop(first) ;
		 
												task.callback.call(null) ;

												return ;
 
										}
 
								}
								else if(next === -1) { job.finish( ) ; return ; }
								else if(next !== 0) error('Type Error: Invalid return type for job event handler (event=stopped)') ;
						break ;
						/*Repeat the callback execution or stop.*/
						case Job.STATE_ACTIVE:
								if((next = job.trigger(Job.STATE_ACTIVE)) === -1 || next === Infinity) { job.stop( ) ; return ; }
								else if(next !== 0) error('Type Error: Invalid return type for job event handler (event=active)') ;
						break ;
						/**@deprecated*/
						case Job.STATE_PAUSED:
assert(false, 'deprecated job event') ;
								/*Stay paused unless explicitely unpaused.*/
								if((next = job.trigger(Job.STATE_PAUSED)) === -1) { job.activate( ) ; return ; }
						break ;
						/*Remove the job from the queue.*/
						case Job.STATE_DONE:
								Queue.TOP = ringPop(top) ;
assert(isSet(job.getID( ), jobs), '!') ;
								delete jobs[job.getID( )] ;
// console.log('(!) job-removed (%s)', job.getID( )) ;
								objectDestroy(job) ;
// Queue.printQueue( ) ;
						break ;
				}


		} ;

		/**
		* Create a job instance.
		*/
		Queue.createJob = function createJob( )
		{
// console.log('Queue::createJob') ;
			//

				return (function( ) {
					/*Encapsulated properties.*/
					var	_id = createID( ),
						_state = Queue.JOB_CONSTRUCTOR.STATE_STOPPED ;
						/*Create a new `Job` instance and define operations for modification of the closed variables.*/
						return Object.create(new Queue.JOB_CONSTRUCTOR( ), {
								getID: {value: function getID( ) { return _id; }, configurable: true, writable: true, enumerable: true},
								getState: {value: function getState( ) { return _state ; }, configurable: true, writable: true, enumerable: true},
								activate: {value: function activate( )
								{
										assert(_state === this.constructor.STATE_ACTIVE || _state === this.constructor.STATE_STOPPED || _state === this.constructor.STATE_PAUSED , 'Illegal State: Job is not active, stopped or paused (%s).', _id) ;
										_state = this.constructor.STATE_ACTIVE ;
								}, configurable: true, writable: true, enumerable: true},
								stop: {value: function stop( )
								{
										assert(_state === this.constructor.STATE_STOPPED || _state === this.constructor.STATE_ACTIVE, 'Illegal State: Job is not stopped or active (%s).', _id) ;
										_state = this.constructor.STATE_STOPPED ;
								}, configurable: true, writable: true, enumerable: true},
								pause: {value: function pause( )
								{
										assert(_state === this.constructor.STATE_PAUSED || _state === this.constructor.STATE_ACTIVE, 'Illegal State: Job is not paused or active (%s).', _id) ;
								}, configurable: true, writable: true, enumerable: true},
								finish: {value: function finish( )
								{
										assert(_state === this.constructor.STATE_STOPPED, 'Illegal State: Job is not stopped (%s).', _id) ;
										_state = this.constructor.STATE_DONE ;
								}, configurable: true, writable: true, enumerable: true}
						}) ;
				})( ) ;
 
		} ;
		
		Queue.addJob = function addJob(job)
		{
// console.log('Queue::addJob(%s)', job.getID( )) ;
// console.log('timer-active: %s', !!Queue.TIMER) ;
			// preconditions
			
				assert(job instanceof Queue.JOB_CONSTRUCTOR, 'Invalid Argument: Type for formal parameter "job" must be `Job`.') ;
				assert(! isSet(job.getID( ), Queue.JOBS), 'Illegal State: Job for ID already exists (%s).', job.getID( )) ;
			
			// variables
 
			var top ;
			
				/*Add the job to the job map using its id.*/
				Queue.JOBS[job.getID( )] = job ;
 
				/*Enqueue the job on the ring queue.*/
				if((top = Queue.TOP)) ringAdd(top, {job: job}) ;
				else Queue.TOP = ringAdd(null, {job: job}) ;
// Queue.printQueue( ) ;
// console.dir(Queue.JOBS) ;
				/*The queue now has at least one element. Reinstate the queue's watch dog timer if it was not set.*/
				if(! isSet('TIMER', Queue)) Queue.TIMER = GLOBAL_OBJECT.setInterval(
						function( ) {

								try { Queue.switchJob( ) ; }
								catch(e) {
								
										GLOBAL_OBJECT
										.clearInterval(Queue.TIMER) ;
										
										error('Queue Error: %s\nStack Trace: %s', e, e.stack) ;
										
								}
								
						},
						Configuration.get(Configuration.QUEUE_TIMER_INTERVAL)
				) ;


		} ;
 
		Queue.getJob = function getJob(id)
		{
 
			//
			
				return Queue.JOBS[id] ;

		} ;
 
		/**
		* @contract This operation is ought to assure the application of the job machine model to the given job. The job machine model contains the following states and transitions:
		*		states are in {"idle", "active", "paused", "done"} (where `-> "idle"` denotes the transition from the pseudo state of job creation to the initial state);
		*		transitions are in {
		*				-> "idle",
		*				"idle" -> "idle", "idle"-> "active", "idle" -> "done"
		*				"active" -> "active", "active" -> "paused", "active" -> "idle"
		*				"paused" -> "paused", "paused" -> "active",
		*				"done" -> "done"
		*		}
		* Where "a" -> "b" denotes a transition from state a to state b. Note that all states may contain a loop to themselves and that "done" is the terminal state.
		* A transition from state a to state b follows a successful call to the event handler for state a. I.e. let <code> denote the event code for state a---and <data> be the event data object---, then if the call `job.handle(<code>, <data>)` returns true, a a transition to the next step may take place; otherwise, it must be checked again later.
		* There may only be one state transition during one call to this operation for a single job. [The semaphor may be removed?]
		* @deprecated: refactored into `Queue.switchJob`
		*/
		Queue._continueJob = function continueJob(job)
		{

// console.log('Queue::continueJob (%s)', job.getID( )) ;
assert(Queue.TOP.job.getID( ) === job.getID( ), 'Illegal State: Job to continue with is not on the top of the queue.') ;

			// preconditions
 
//				assert(++SEMAPHOR === 1, 'Illegal State: Violation of critical section.') ;
				assert(isSet(job.getID( ), Queue.JOBS), 'Invalid Argument: Job for ID is not queued (%s).') ;
				
			// variables
			
			var Job = Queue.JOB_CONSTRUCTOR,
				tasks,
				task,
				next ;
			
			//
			
// console.log('job-list (pre):') ;
// objectEach(Queue.JOBS, function(job) { Queue.printJob(job) ; }) ;
				/*Assert that the job is stopped.*/
//						assert(job.is(job.constructor.STATE_STOPPED), 'Illegal State: Job for ID is not stopped.') ;
 
				switch(job.getState( ))
				{
						case Job.STATE_STOPPED:
								if((next = job.trigger(Job.STATE_STOPPED)) === 1 || next === Infinity)
								{
 
										job.activate( ) ;
 
										/*Adjust the task collection and call the task's callback.*/
										tasks = job.tasks ;
										task = job.current = tasks ;
										job.tasks = ringPop(tasks) ;
 
										task.callback.call(null) ;

										return ;
 
								}
								else if(next === -1) { job.finish( ) ; return ; }
						break ;
						case Job.STATE_ACTIVE:
								/*Pause if requested by handler; otherwise stop.*/
								if((next = job.trigger(Job.STATE_ACTIVE)) === 1) { job.pause( ) ; return ; }
								else if(next === -1 || next === Infinity) { job.stop( ) ; return ; }
						break ;
						case Job.STATE_PAUSED:
								/*Stay paused unless explicitely unpaused.*/
								if((next = job.trigger(Job.STATE_PAUSED)) === -1) { job.activate( ) ; return ; }
						break ;
						case Job.STATE_DONE:
								/*Remove the job from the queue.*/
								Queue.TOP = ringPop(Queue.TOP) ;
						break ;
				}
 
		} ;
 
		/**
		* @param (Job) A job object.
		* @param (Object) task An object containing at least a function property `callback` which contains the logic of the task. The specification object may also contain state handlers which may apply additional logic to a given state and direct the transition of the job in the job machine model (-1 for back, 0 for stay, +1 for next and ∞ for the default transition).
		*/
		Queue.addTask = function addTask(job, task/*, callback/*, async, important*/)
		{
// console.log('Queue::addTask') ;
			// variables
 
			var tasks,
				next/*, previous */;
 
			//
 
//				task.next = task.previous = task ;

 				if(isVoid(job.tasks)) job.tasks = ringAdd(null, {task: task}) ;
				else ringAdd(job.tasks, {task: task}) ;
/*
				{

						/*Add the task to the end of the list if it is not important; otherwise, find the right spot and add it there.*
						if(! task.important) next = tasks ;
						else
						{
						
								next = tasks ;
				   
								/*Iterate over the list one time to find the right task to prepend the given task to.*
								do { if(! next.task.important) break ; }
								while((next = next.next) !== tasks) ;

						}
				   
						/*Prepend to the first unimportant task or the top element.*
						if(next === tasks) job.tasks = ringAdd(tasks, {task: task}) ;
						else ringAdd(tasks, {task: task}) ;

				}
*/
		} ;
 
		/**
		*
		*/
		Queue.printQueue = function printQueue( )
		{
 
			// variables
 
			var top,
				next ;
 
			//
 
				console.log('====================QUEUE====================') ;
 
				if(Queue.TOP)
				{
 
						/*Iterate over the job ring.*/
						next = top = Queue.TOP ;

						do Queue.printJob(next.job) ;
						while((next = next.next) !== top) ;
						
				}
				else console.log('(Empty)') ;
 
				console.log('=============================================') ;
 
		} ;
 
		/**
		*
		*/
		Queue.printJob = function printJob(job)
		{
 
			// variables
 
			var top, next,
				i = -1 ;
 
			//
 
				/*Print job information.*/
				console.log('---------------------JOB---------------------') ;
				console.log('\n\t• id: %s', job.getID( )) ;
				console.log('\n\t• state: %s', job.getState( )) ;
				console.log('\n\t• tasks: %s', job.tasks ? 'yes' : 'no') ;

				/*Iterate over the task ring.*/
				if((next = top = job.tasks))
				{

						do console.log('> TASK #%s: %s', next.task.callback.name, ++i) ;
						while((next = next.next) !== top) ;
 
				}
				else console.log('(Empty)') ;
 
				console.log('---------------------------------------------') ;

		} ;
 
		/**
		* @deprecated
		*/
		Queue._printJob = function printJob(job)
		{
 
			// variables
 
			var tasks, next,
				current,
				s = 'none',
				counter = -1 ;
 
			//
 
				console.log('----------JOB----------') ;
				console.log('\t• id: %s', job.getID( )) ;
				console.log('\t• state: %s', (function( ) {switch(job.getState( )) { case 0: return 'stopped' ; case 1: return 'active' ; case 2: return 'paused' ; default: return 'done' ;}})( )) ;
 
				if(current = job.current) s = stringFormat('async=%s, important=%s', current.async, current.important) ;
				console.log('\t• current: %s', s) ;
 
				if((tasks = job.tasks) && (next = tasks.next))
				{
						do console.log('> task #%s (async=%s)', ++counter, next.async || false) ;
						while((next = next.next)) ;
				}
				else console.log('(empty)')
 
				console.log('-----------------------') ;

		} ;
	
	// Library Object
	
		Library = {
				RESERVED: ['name', 'prototype', 'super', 'reflect', 'constructor'],
				/**@deprecated*/
				DEFINITIONS: { },
				CONSTRUCTORS: { },
				PACKAGES: { },
				HANDLERS: { },
				STATE: { },
				STATE_DEFINITION_REQUESTED: 1,
				STATE_SUPER_REQUIRED: 2,
				STATE_DEPENDENCIES_REQUIRED: 3,
				/**@deprecated*/
				STATE_TYPE_DEFINED: 4,
				STATE_REQUIREMENT_RESOLVED: 5
		} ;
 
	//- Event Handling
	
		Library.getState = function getState(identifier) { return Library.STATE[identifier] ; } ;
		Library.setState = function setState(identifier, state)
		{

				if(Library.getState(identifier) !== state)
				{
				
						Library.STATE[identifier] = state ;
						Library.trigger(state, {identifier, identifier}) ;
						
				} ;
				
		} ;

		Library.listen = function listen(event, callback)
		{
		
			// variables
			
			var handlers = Library.HANDLERS,
				a ;
			
			//
 
				if(! (a = handlers[event])) a = handlers[event] = [ ];
 
				a[a.length] = callback ;
/*
				if(Library.getState(identifier) === event) callback.call(null) ; // immediately call the callback if the state of the given identifier is the given state
				else
				{

						if(! (o = handlers[identifier])) o = handlers[identifier] = { } ;
						if(! (a = o[event])) a = o[event] = [ ] ;
						
						a[a.length] = callback ;
						
				}
*/
		} ;
 
		Library.unlisten = function unlisten(event) { delete Library.HANDLERS[event] ; } ;

		Library.trigger = function trigger(event, data)
		{
		
			// variables
			
			var handlers = Library.HANDLERS,
				a ;
			
			//
			
//				if(! (o = handlers[identifier])) return ;
				if(! (a = handlers[event])) return ;
// console.log('Library::trigger (%s, %s)', identifier, event) ;
// console.log('handlers:') ; console.dir(a) ;
				a.forEach(function(handler) { handler.call(null, data) ; }) ;
				
//				delete o[event] ; // library events are only executed once
				
//				if(objectEmpty(o)) delete handlers[identifier] ;

		} ;
 
		Library.typeIdentifierToURL = function typeIdentifierToURL(identifier, root, suffix)
		{
// console.log('Library::typeIdentifierToURL (identifier=%s, root=%s, suffix=%s)', identifier, root, suffix) ;
			// variables
 
			var url,
				a,
				slash = '/', dot = '.' ;
 
			//
 
				a = stringTokenize(identifier, dot) ;
 
				url = root ? root + slash : slash ;
				url += suffix ? a.join(slash) + dot + suffix : a.join(slash) ;
 
			// return
 
			return url ;

		} ;

		/**
		* @todo copy the stringified main function into the constructor body
		*
		*	`+ 'if(arguments.length>0){('+<main-function-string>+').apply(this, arguments);}'`
		*
		* (not using `stringFormat` because formatting tokens in the function string may lead to inifinite recursion) this will allow some tricks with instance based variables---e.g. hidden variables using a main function like the following
		*
		*	`function main(argv) { var _hidden ; this.getHidden = function getHidden( ) { return _hidden ; } ; }`
		*
		* ---at the cost of added construction time.
		* @todo check for requirement completion within call to main.
		*/
		Library.constructorFor = function constructorFor(identifier)
		{
 
			// variables
 
			var constructor,
				a,
				name, namespace,
				reflect ;
 
			//
 
 				/*Split the type identifier into name and namespace.*/
				a = stringTokenize(identifier, '.') ;
 
				name = a[a.length - 1] ;
				namespace = a.length > 1 ?
						arrayCopy(a, 0, a.length - 1).join('.') :
						null ;

//				name = Library.DEFINITIONS[identifier].name ;
				constructor = (Function(stringFormat(
						'return function %s(argv){'
						+ 'if(! (this instanceof %s)){throw new Error("Invalid call to constructor (identifier=\\"%s\\")", %s);}'
						+ 'if(arguments.length>0){if(this.constructor.reflect.main){this.constructor.reflect.main.apply(this, arguments);}}'
						+ '}',
						name,
						name,
						identifier
				)))( ) ;

				constructor.reflect = {identifier: identifier, name: name, namespace: namespace} ;

			// return
 
			return constructor ;

		} ;

		/**
		* Define an object type by settings its constructor function's properties.
		*
		* @param (Function) constructor The constructor function of the given type
		* @param (Object) properties An object characterizing the type.
		*
		* @return (Function) The constructor for the defined object type.
		* @todo Use `objectCreate` and `objectDefine` for the local and global property definitions.
		*/
		Library.defineType = function defineType(constructor, properties)
		{
// console.log('Library::defineType (%s)', constructor.reflect.identifier) ;
			// variables

			var reflect,
				extend, main ;
			
			//
 
				/*Get a reference to the reflect property of the constructor.*/
				reflect = constructor.reflect ;
// console.log('reflect:') ;
// console.dir(reflect) ;
				/*Construct the prototype object.*/
				if((extend = properties.extend)) Library.definePrototype(extend, constructor) ;
 
				/*Validate the main operation.*/
				if((main = reflect.main = extend ? properties.main || extend.reflect.main : VOID)) assert(main.length > 0, 'Invalid main method. Formal parameter list may not be empty (identifier="%s")', reflect.identifier) ; // technically, calls to the constructor which are not used to create a prototype object must have at least one argument (and the formal parameter list does not necessarily have to reflect that, i.e. may be undefined); so, this actually only serves as a reminder
 
				/*Put global properties on the constructor function.*/
				Library.defineGlobalProperties(constructor, properties.global) ;

 				/*Put local properties on the constructor's prototype property.*/
				Library.defineLocalProperties(constructor, properties.local) ;

// console.log('Library::defineType(%s):', identifier) ;
// console.dir(constructor) ;
				/*Destroy the property container.*/
				objectDestroy(properties) ;

			// return
// console.log('Library::defineType (post, %s)', constructor.reflect.identifier) ;
// console.dir(constructor) ;
			return constructor ;

		} ;

		/**
		* @param (Function) super_type The constructor of the super type of the given sub type-
		* @param (Function) sub_type The constructor of the sub type for the given super type.
		*/
		Library.definePrototype = function definePrototype(super_type, sub_type/*, compiled*/)
		{
// console.log('Library::definePrototype (%s): %s', constructor.reflect.identifier, identifier) ;
			// variables
			
			var super_type,
				reflect,
				a ;
			
			//
			
				reflect = sub_type.reflect ;

				/*Use the constructor function to create a prototype object for the super type.*/
				sub_type.prototype = new super_type( ) ;
				sub_type.prototype.super = sub_type.super = super_type ; // reflect the super type on instances and constructors of the derived type
//console.log('\tglobal-super-property: %s', constructor.super) ;
//console.log('\tlocal-super-property: %s', constructor.prototype.super) ;

				/*Inherit the main function of the prototype if there is no definition for it on the sub type./
				if(! isSet('main', reflect)) reflect.main = super_type.reflect.main ;

				/*Copy global and local key identifiers of the prototype./
				a = super_type.reflect.global ;
				reflect.global = arrayCOpy(a, 0, a.length) ;
				a = super_type.reflect.local ;
				reflect.local = arrayCopy(a, 0, a.length) ;

 				/*Copy global properties of the prototype constructor to the definition (unless they override global properties specified witin the definition)./
				o = compiled.global = compiled.global || { } ;
				
				if((a = super_type.reflect.global)) a.forEach(function(property) { if(! isSet(property, o)) o[property] = super_type[property] ; }) ;
				*/
 
 

		} ;

		Library.defineGlobalProperties = function defineGlobalProperties(constructor, global)
		{
		
			// variables
			
			var f ;
			
			//

//				a = constructor.reflect.global ;

				if(global) objectEach(global, function(v, k) {
				
						assert(Library.RESERVED.indexOf(k) === -1, 'Invalid use of reserved property name (name="%s", identifier="%s")', k, constructor.reflect.identifier) ;
						
						constructor[k] = v ;
//						a[a.length] = key ;

				}) ;
 
				/*Copy global properties of the super type.*/
// console.log('has-super (%s): %s', constructor.reflect.identifier, !! constructor.super) ;
				if((f = constructor.super)) objectEach(f, function(v, k) {
						if(! isSet(k, constructor)) // don't override constructor properties
						{
						
								assert(Library.RESERVED.indexOf(k) === -1, 'Invalid use of reserved property name (name="%s", identifier="%s"', k, constructor.reflect.identifier) ;
	
								constructor[k] = v ;
								
						}
				}) ;

				/*Copy global properties of the super type.*
				if((a = super_type.reflect.global)) a.forEach(function(v, k)
				{
				
						assert(Library.RESERVED.indexOf(k) === -1, 'Invalid use of reserved property name (name="%s", identifier="%s"', k, reflect.identifier) ;
						
						if(! isSet(k, sub_type)) sub_type[k] = v ;
 
				}) ;
*/
		} ;

		/**
		* @todo assure that object definitions which extend abstract constructor types either are themselves abstract or implement abstract functions.
		*/
		Library.defineLocalProperties = function defineLocalProperties(constructor, local)
		{

			//
				/*Reflect the constructor on the prototype property.*/
				constructor.prototype.constructor = constructor ; // this is relevant for `::typeOf`
				
//				a = constructor.reflect.local ;
				
				/*Fill the prototype property of the type constructor with the local properties of the type definition.*/
				if(local) objectEach(local, function(value, key) {
					
					//
				
						assert(Library.RESERVED.indexOf(key) === -1, 'Invalid use of reserved property name (name="%s", identifier="%s")', key, constructor.reflect.identifier) ;
						
						constructor.prototype[key] = value ;
						
//						if(arrayIndex(a, key, 0, a.length) === -1) a[a.length] = key ;

				}) ;

		} ;

		/**
		* Require the type for the given identifier.
		*
		* Requiring a type is a job involving the following tasks:
		*	(1) Requesting the definition source
		*	(2) Recursive requirement of the super type
		*	(3) Recursive requirements of dependencies
		*	(4) Definition of the constructor function
		*
		* @return (String) The job id of the requirement job for the given type identifier.
		*/
		Library.requireType = function requireType(identifier)
		{
// console.log('Library::requireType(%s)', identifier) ;
			// preconditions
 
				assert(! isSet(identifier, Library.STATE), 'Illegal State: Concurrent requirement job for type (type-identifier=%s).', identifier) ;
 
			// variables
 
			var	Job = Queue.JOB_CONSTRUCTOR, constructor,
				reflect ;
 
			//
  
				Library.STATE[identifier] = null ; // a string identifier for the status of the requirement process
				
				/*Create the constructor function for this type definition before actually requesting the definition.*/
				constructor = Library.CONSTRUCTORS[identifier] = Library.constructorFor(identifier) ; // This allows us to pass a stable reference to the constructor even before it has been completely defined (e.g. to the compiling function for a dependent type's definition)
				reflect = constructor.reflect ;
 
				/*Store the constructor under its namespace on the packages container of the library.*/
				(objectCreateNamespace(reflect.namespace, Library.PACKAGES))[reflect.name] = constructor ;
 
				enqueue({
						callback: function( ) {
// console.log('(!) request-definition (%s)', identifier) ;
								Library.requestDefinition(identifier) ; }, // this sets an entry for the required type on the constructors map of the library
						active: function( ) { // continue once the definition has been parsed
								if(Library.getState(identifier) === Library.STATE_REQUEST_FINISHED) return -1 ;
								else return 0 ;
						}
				}, {
						callback: function( ) {
// console.log('(!) require-super (%s)', identifier) ;
							// variables
						
							var extend ;
						
							//

								/*Conditionally require the super type.*/
								if((extend = reflect.extend) && ! isSet(extend, Library.CONSTRUCTORS)) Library.requireType(extend) ;
						
								Library.setState(identifier, Library.STATE_SUPER_REQUIRED) ;
						
						},
						active: function( ) { // continue if no super type was specified or if the super type is defined; otherwise, repeat.
							var extend ;
								if(! (extend = reflect.extend) || Library.getState(extend) === Library.STATE_REQUIREMENT_RESOLVED) return -1 ;
								else return 0 ;
						}
				}, {
						callback: function( ) {
// console.log('(!) require-dependencies (%s)', identifier) ;
							// variables
						
							var require ;
						
							//

								/*Conditionally require all dependencies.*/
								if((require = reflect.require)) require.forEach(function(dependency) {
										if(! isSet(dependency, Library.CONSTRUCTORS)) requireType(dependency) ;
								}) ;
						
								Library.setState(identifier, Library.STATE_DEPENDENCIES_REQUIRED) ;

						}
				}, {
						callback: function( ) {
// console.log('(!) define-type (%s)', identifier) ;
								Library.defineType(constructor, Library.compileDefinition(identifier)) ;
								Library.setState(identifier, Library.STATE_REQUIREMENT_RESOLVED) ;
						}
				}, {
						callback: function( ) {
//console.log('(!) finish-requirement (%s)', identifier) ;
						}
				}) ;
 
		} ;
 
		/**
		* @deprecated: property remove and refactored into constructor's `reflect` property.
		*/
		Library._definitionCreate = function definitionCreate(identifier)
		{
 
			// variables
 
			var definition, o,
				a,
				name,
				constructor ;
 
			//
 
				/*Create and store a new definition on the definitions collection of the library.*/
				definition = Library.DEFINITIONS[identifier] = { } ;

				/*Split the type identifier into name and namespace.*/
				a = stringTokenize(identifier, '.') ;
 
				name = definition.name = a[a.length - 1] ;
				definition.namespace = a.length > 1 ?
						arrayCopy(a, 0, a.length - 1).join('.'):
						null ;
				
			// return
			
			return definition ;

		} ;

		/**@todo error handling
		**/
		Library.requestDefinition = function requestDefinition(identifier)
		{
 
			//

				requestSend(
						requestCreate({
								mime: Core.MIME_TYPES.JAVASCRIPT,
								error: function( ) {
error('error ("%s") :c', identifier) ;
								},
								done: function(properties)
								{
//console.log('(!) request-done (%s)', identifier) ;
									var definition,
										reflect ;
										
										definition = Library.parseDefinition(identifier, properties.request.responseText) ;
//console.log('\tparsed-definition:') ;
//console.dir(definition) ;
										reflect = Library.CONSTRUCTORS[identifier]
										.reflect ;
										
										objectEach(definition, function(v, k) { // copy the definition properties into the reflect container of the constructor
										
												if(isSet(k, reflect)) assert(reflect[k] === v, 'Definition contains inconsistent property value (identifier=%s, property=%s, value=%s)', identifier, k, v) ;

												reflect[k] = v ;
												
										}) ;
//console.log('\treflect-property:') ;
//console.dir(reflect) ;
										Library.setState(identifier, Library.STATE_REQUEST_FINISHED) ;
										
								}
						}),
						{
								url: Library.typeIdentifierToURL(identifier, Configuration.get(Configuration.LIBRARY_ROOT)),
								method: 'GET',
								async: true,
								cache: false
						}
				) ;
 
		} ;

		/**
		* Parse and validate a type definition.
		*
		* A type definition consists of a comment block at the beginning of the source file containing annotations (such as the type identifier, super type, requirements, etc.) and the actual type definition containing properties of the constructor (`global` properties) as well as properties of object instances (`local` properties).
		*/
		Library.parseDefinition = function parseDefinition(identifier, source)
		{
// console.log('::parseDefinition("%s")', identifier) ;
			// variables
			
			var definition = { },//Library.DEFINITIONS[identifier],
				i,
				s,
				a ;
				
			//

				/*Parse annotation properties and type definition.*/
				
				if(source.indexOf('/*') !== 0) error('Invalid package annotation. Leading string must be empty (identifier="%s")', identifier) ;
				if((i = source.indexOf('*/', 2)) === -1) error('Invalid package annotation. Unterminated comment block (identifier="%s"', identifier) ;
				
				definition.source = source.substring(i + 2, source.length)
				.trim( ) ; // this is the type definition container
				
				/*Parse annotation properties.*/
				s = source.substring(2, i) ;

				stringTokenize(s.trim( ), '@')
				.forEach(function(annotation, index) {
// console.log('annotation-property: %s', annotation) ;
					var a ;
					
							a = Library.parseAnnotation(annotation, index) ;
// console.log('parsed-annotation-property: %s', a) ;
							definition[a[0]] = a[1] ;

				}) ;
				
				assert((s = definition.identifier), 'Illegal State: Missing required annotation (annotation-name="identifier")') ;
				assert(s === identifier, 'Illegal State: Parsed type definition declares different type (expected-identifier="%s", declared-identifier="%s")', identifier, s) ;
				
			// return
			
				return definition ;

		} ;
 
		Library.parseAnnotation = function parseAnnotation(annotation, index)
		{
 
			// variables
 
				var parsed = [ ],
					i,
					name, value,
					a ;
				
				//

					/*Parse property name and value.*/
					
					if((i = annotation.indexOf(' ')) !== -1)
					{
 
							name = annotation.substring(0, i) ;
							value = annotation.substring(i, annotation.length)
							.trim( ) ;
 
							parsed[0] = name ;

							if(value.length === 0) parsed[1] = true ;
							else
							{

									/*Switch depending on annotation name.*/

									switch(name)
									{

											case 'identifier'/*CONSTANTS.ANNOTATION_IDENTIFIER*/: parsed[1] = value ; break ;
											case 'require'/*CONSTANTS.ANNOTATION_REQUIRE/*|| CONSTANTS.ANNOTATION_USE*/:

													/*Split around the comma token.*/
 
													a = stringTokenize(value, ',') ;
													a.forEach(function(value, index, array) { array[index] = value.trim( ) ; }) ;
 
													parsed[1] = a ;
													
											break ;

											default:
											
													switch(value)
													{
															case 'false'/*CONSTANTS.LITERAL_FALSE*/: parsed[1] = false ; break ;
															case 'true'/*CONSTANTS.LITERAL_TRUE*/: parsed[1] = true ; break ;
															default: parsed[1] = value ;
													}
											
											break ;

									}
									
							}

					}
					else parsed[0] = annotation, parsed[1] = true ;
 
			// return
 
			return parsed ;

		} ;

		/**Compile an object definition from its source.*/
		Library.compileDefinition = function compileDefinition(identifier)
		{
// console.log('Library::compileDefinition (%s)', identifier) ;
			// preconditions
 
				assert(isSet(identifier, Library.CONSTRUCTORS), 'Illegal State: Constructor is undefined ("%s")', identifier) ;
 
			// variables
 
			var compiled, reflect,
				constructor,
				names = [ ], values = [ ], imports = [ ], a,
				s ;
 
			//

				constructor = constructorOf(identifier) ;

				/*Add core operations to the scope.*/
				objectEach(Core, function(operation, name) {
						names[names.length] = name ;
						values[values.length] = operation ;
				}) ;
 
				/*Add package containers to the scope.*/
				objectEach(Library.PACKAGES, function(o, name){
						names[names.length] = name ;
						values[values.length] = o ;
				}) ;
 
				reflect = constructor.reflect ;

				/*Add the super type's name and dependency names to the scope.*/
				if((s = reflect.extend)) imports[0] = s ;
				if((a = reflect.require)) imports = imports.concat(a) ;

				/*Iterate over the list of imports; add names and constructors to the scope.*/
				if(imports.length > 0) {

						imports.forEach(function(identifier) {
						
							var constructor ;

								assert(isSet(identifier, Library.CONSTRUCTORS), 'Illegal State: Constructor for required object is undefined ("%s")', identifier) ;
								
								constructor = constructorOf(identifier) ;
								
								names[names.length] = constructor.name ;
								values[values.length] = constructor ;

						}) ;

				}

				/*Add the constructor to the scope.*/
				names[names.length] = reflect.name ;
				values[values.length] = constructor ;

				/*Add the compilation function's body.*/
				names[names.length] = stringFormat('return(%s);', reflect.source) ; // the body of the compiling function

				delete reflect.source ; // has been stored within the compilation functions body and is not needed anymore

				/**/
				assert(names.length === values.length + 1, 'Illegal State: Scope names and values have invalid length') ;
				assert(names.length <= 255, 'Illegal State: Scope exceeds limit of function arity.') ;

				/*Compile the type definition passing the constructed scope.*/
				try { compiled = (Function.apply(null, names)).apply(null, values) ; }
				catch(e) { error('Compilation Error: Unable to compile source (identifier="%s")\nCause: %s', identifier, e) ; }

				assert(isObject(compiled), 'Illegal State: Compilation did not return an object (type-identifier="%s", return-type="%s").', identifier, typeOf(compiled)) ;
			
				if((s = reflect.extend)) compiled.extend = constructorOf(s) ; // add the super type's constructor

			// return
 
				return compiled ;

		} ;

		/**
		* @deprecated
		* @todo: refactor into `Core`.
		*/
		Library._constructorOf = function constructorOf(identifier) { return this.CONSTRUCTORS[identifier] ; } ;

	//- Configuration Object

		Configuration = {
				/**The current configuration settings.*/
				SETTINGS: { },
				/**Key string for the debug mode setting.*/
				DEBUG_MODE: 'debug-mode',
				/**The key string for the "application-root" setting.*/
				APPLICATION_ROOT: 'application-root',
				/**The key string for the "library-root" setting.*/
				LIBRARY_ROOT: 'library-root',
				/**Key string for setting the interval length of the watch dog timer of the job queue.*/
				QUEUE_TIMER_INTERVAL: 'queue-timer-interval'
		} ;
 
		Configuration.set = function set(key, value) { Configuration.SETTINGS[key] = value ; return Configuration ; } ;
		Configuration.get = function get(key) { return Configuration.SETTINGS[key] ; }

	//-- Default Values
	
		Configuration.set(Configuration.DEBUG_MODE, 'debug')
		.set(Configuration.APPLICATION_ROOT, 'test.Application')
		.set(Configuration.LIBRARY_ROOT, '/library/javascript')
		.set(Configuration.QUEUE_TIMER_INTERVAL, 10) ;
// console.log('library-root: %s', Configuration.get(Configuration.LIBRARY_ROOT)) ;

	// Initialize Application

	var identifier = Configuration.get(Configuration.APPLICATION_ROOT) ;
	
		require(identifier, function( ) { constructorOf(identifier).create( ) ; }) ;

})(this) ;