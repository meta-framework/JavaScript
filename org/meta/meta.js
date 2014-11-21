/*
* Meta JavaScript Library v1.0
*
* Copyright 2014 Friedrich Kurz
* Released under the MIT license
* f.a.kurz@googlemail.com
*/
'use strict' ;
(function(GLOBAL_OBJECT) {
	var	TASKS = {/*QUEUE: [ ], IDS: { }*/},
		CONSTANTS = { },
		CONFIGURATION = { },
		CORE = { },
		/**
		* Contains the constructor functions of defined objects mapped to their identifiers (i.e. the concatenation of namespace and name using a dot character).
		*/
		LIBRARY = {CONSTRUCTORS: { }, PACKAGES: { }},

		DATE = Date.now( ),
		COUNTER = 0,
		/**A map containing a cross reference for object aliases and identifiers.
		* @deprecated
		*/
		ALIAS = {TO_ID: { }, FOR_ID: { }},
		/**@deprecated*/
		PACKAGES = { } ;

	// Constants
	
	//- Type Constants
		
		CONSTANTS.VOID = void(0) ;

	//- Other Constants
			
		/**
		* A reference to the global object. 
		*
		* This script expects the global context to be referenced by `this` when its being executed. The reference `this` is passed to set-up function (this function wrapper) as its only formal parameter `GLOBAL_OBJECT`.
		*/
		CONSTANTS.GLOBAL_OBJECT = GLOBAL_OBJECT ;
		CONSTANTS.DEFAULT_VIEW = GLOBAL_OBJECT.window || null ;
		CONSTANTS.DEFAULT_DOCUMENT = GLOBAL_OBJECT.document || null ;
		CONSTANTS.IS_BROWSER = !! CONSTANTS.DEFAULT_VIEW && !! CONSTANTS.DEFAULT_DOCUMENT ;
		/**@deprecated*/
		CONSTANTS.DEFAULT_REQUEST = (function( ) {

			// variables
			
			var r = null ;
			
			//
		
				if(CONSTANTS.IS_IE)
				{
/*@todo: ie branch*/
				}
				else if(CONSTANTS.GLOBAL_OBJECT.XMLHttpRequest) { r = XMLHttpRequest ; }
				
			// return
			
			return r ;

		})( ) ;

	//- Browser And Mobile Detection

		/**
		* @link http://www.quirksmode.org/dom/w3c_cssom.html#screenview
		*/
/*@todo: This is tentative*/
		CONSTANTS.IS_MOBILE = CONSTANTS.IS_BROWSER && (window.screen.availWidth < 400 || window.screen.availHeight < 400) ;
 
	//-- Internet Explorer

		/**
		*IE detection.
		*@link http://en.wikipedia.org/wiki/Conditional_comment
		*/
		CONSTANTS.IS_IE = (function( ) {
		
			// variables
			
			var b = false ;
			
			//
			
				/*@cc_on b = true ;*/
				
			// return
				
			return b ;

		})( ) ;
		CONSTANTS.IE_VERSION = (function( ) {
		
			// variables
		
				var f = -1.0 ;
				
			//
				
				/*@cc_on
				 
					  @if (@_jscript_version > 10) i = 10.1 ;
					  @elif (@_jscript_version == 10) i = 10.0 ;
					  @elif (@_jscript_version == 9) i = 9.0 ;
					  @elif (@_jscript_version == 5.8) i = 5.8 ;
					  @elif (@_jscript_version == 5.7 && window.XMLHttpRequest) i = 7 ;
					  @elif (@_jscript_version == 5.6 || (@_jscript_version == 5.7 && !window.XMLHttpRequest)) i = 6 ;
					  @elif (@_jscript_version == 5.5) i = 5.5 ;
					  @elif (@_jscript_version < 5.5) i = 5.4 ;
					  @end
		 
				@*/
				
			// return
				
			return f ;

		})( ) ;
 
		CONSTANTS.MS_ACTIVEX_XHR_VERSIONS = ['Msxml2.XMLHTTP.6.0','Msxml2.XMLHTTP.3.0','Microsoft.XMLHTTP'],
 
	//-- Opera
		
		CONSTANTS.IS_OPERA = CONSTANTS.IS_BROWSER ? !! CONSTANTS.GLOBAL_OBJECT.opera : false ;
		
	//- Package Management
		
		CONSTANTS.ANNOTATION = '/*@' ;
		CONSTANTS.ANNOTATION_IDENTIFIER = 'identifier' ;
		CONSTANTS.ANNOTATION_REQUIRE = 'require' ;
		CONSTANTS.ANNOTATION_USE = 'use' ;
		/**@deprecated*/
		CONSTANTS.ANNOTATION_PROVIDE = 'provide' ;
		
	//- Type Definitions
	
		/**@deprecated: moved to global `define` function*/
		CONSTANTS.CONSTRUCTOR_TYPE_ABSTRACT = 'abstract' ;
		CONSTANTS.CONSTRUCTOR_ABSTRACT = 'abstract' ;
		/**@deprecated: moved to global `define` function*/
		CONSTANTS.CONSTRUCTOR_TYPE_FACTORY = 'factory' ;
		CONSTANTS.CONSTRUCTOR_FACTORY = 'factory' ;
		/**@deprecated: moved to global `define` function*/
		CONSTANTS.CONSTRUCTOR_TYPE_SINGLETON = 'singleton' ;
		/**@deprecated: constructor type removed*/
		CONSTANTS.CONSTRUCTOR_SINGLETON = 'singleton' ;
		/**List of constructor type identifier strings.*/
		CONSTANTS.CONSTRUCTOR_TYPES = [CONSTANTS.CONSTRUCTOR_ABSTRACT, CONSTANTS.CONSTRUCTOR_FACTORY] ;
		/**A list of reserved property names for object definitions.*/
		CONSTANTS.RESERVED = ['name', 'prototype', 'super', 'reflect', 'constructor'] ;
 
	//- Literals
	
	//-- ...

		CONSTANTS.LITERAL_BLOCK_COMMENT_BEGIN = '/*' ;
		CONSTANTS.LITERAL_BLOCK_COMMENT_END = '*/' ;
		CONSTANTS.LITERAL_EMPTY = '' ;
		CONSTANTS.LITERAL_TRUE = 'true' ;
		CONSTANTS.LITERAL_FALSE = 'false',
		CONSTANTS.LITERAL_NULL = 'null' ;
		CONSTANTS.LITERAL_UNDEFINED = 'undefined' ;
		
	//-- Type Strings

		CONSTANTS.TYPE_VOID = 'Void' ;
		CONSTANTS.TYPE_NULL = 'Null' ;
		CONSTANTS.TYPE_BOOLEAN = 'Boolean' ;
		CONSTANTS.TYPE_NUMBER = 'Number' ;
		CONSTANTS.TYPE_INTEGER = 'Integer' ;
		CONSTANTS.TYPE_FLOAT = 'Float' ;
		CONSTANTS.TYPE_STRING = 'String' ;
		CONSTANTS.TYPE_DATE = 'Date' ;
		CONSTANTS.TYPE_REGEXP = 'RegExp' ;
		CONSTANTS.TYPE_ERROR = 'Error' ;
		CONSTANTS.TYPE_ARRAY = 'Array' ;
		CONSTANTS.TYPE_FUNCTION = 'Function' ;
		CONSTANTS.TYPE_OBJECT = 'Object' ;
		CONSTANTS.TYPE_WINDOW = (function( ) { if(CONSTANTS.IS_BROWSER) { var s = Object.prototype.toString.call(window) ; return s.substring(8, s.length - 1) ; } return 'Window' ; })( ) ;
		CONSTANTS.TYPE_NODE = 'Node' ;
		CONSTANTS.OBJECT_TAG = '[object Object]' ;
		CONSTANTS.ARRAY_TAG = '[object Array]' ;
		CONSTANTS.FUNCTION_TAG = '[object Function]' ;

	//-- Characters

		CONSTANTS.CHARACTERS = {
				ESCAPE: '\\',
				SPACE: ' ',
				SINGLE_QUOTE: '\'',
				DOUBLE_QUOTE: '"',
				DOT: '.',
				COMMA: ',',
				SEMICOLON: ';',
				COLON: ':',
				HYPHEN: '-',
				UNDERSCORE: '_',
				PLUS: '+',
				EQUALS: '=',
				AMPERSAND: '&',
				HASH: '#',
				DOLLAR: '$',
				ASTERISK: '*',
				AT: '@',
				SLASH: '/',
				BRACE_LEFT: '(',
				BRACE_RIGHT: ')',
				LINE_FEED: '\n',
				TABULATOR: '\t'
		} ;
		
	//--
	
		CONSTANTS.UNENUMERABLE = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'] ;
 
	//- XHR
	
	//-- HTTP Method
	
		CONSTANTS.HTTP_METHOD_GET = 'GET' ;
		CONSTANTS.HTTP_METHOD_POST = 'POST' ;
//		CONSTANTS.HTTP_METHOD_PULL = 'PULL' ;
//		CONSTANTS.HTTP_METHOD_GET = 'GET' ;
	
	//-- Ready States

		CONSTANTS.XHR_READY_STATE_UNSENT = 0 ;
		CONSTANTS.XHR_READY_STATE_OPENEND = 1 ;
		CONSTANTS.XHR_READY_STATE_RECEIVED = 2 ;
		CONSTANTS.XHR_READY_STATE_LOADING = 3 ;
		CONSTANTS.XHR_READY_STATE_DONE = 4 ;

	//-- MIME Extensions
	
		CONSTANTS.MIME_TEXT = 'text/plain' ;
		CONSTANTS.MIME_CSS = 'text/css' ;
		CONSTANTS.MIME_XML = 'application/xml' ;
		CONSTANTS.MIME_JSON = 'text/json' ;
		CONSTANTS.MIME_JAVASCRIPT = 'application/javascript' ;
 
	// Configuration
	
		CONFIGURATION = { } ;
		/**The current configuration settings.*/
		CONFIGURATION.SETTINGS = { } ;
		/**The key string for the "application-root" setting.*/
		CONFIGURATION.APPLICATION_ROOT = 'application-root' ;
		/**The key string for the "library-root" setting.*/
		CONFIGURATION.LIBRARY_ROOT = 'library-root' ;
	//- Default Values
	
		CONFIGURATION.SETTINGS[CONFIGURATION.APPLICATION_ROOT] = null ;
		CONFIGURATION.SETTINGS[CONFIGURATION.LIBRARY_ROOT] = '/' ;
		/**Configuration keys and default values
		* @deprecated: unnecessary
		*/
//		CONFIGURATION.KEYS = { APPLICATION_ROOT: 'application-root', LIBRARY_ROOT: 'library-root' /*, ... */} ;
		/**
		* @deprecated: unnecessary
		*/
//		CONFIGURATION.DEFAULTS = {'application-root': null, 'library-root': '/'/*, ... */} ;
//		CONFIGURATION.KEYS = {metaLibraryRoot: 'LIBRARY_ROOT', metaRunningMode: 'RUNNING_MODE', metaRequireDefault: 'REQUIRE_DEFAULT', metaApplicationRoot: 'APPLICATION_ROOT'} ;
		/**
		* The relative or absolute path to the root directory for the library.
		* @configuration
		* @deprecated: moved to `CONFIGURATION.DEFAULTS`
		*/
//		CONFIGURATION.LIBRARY_ROOT = '/' ;
		/**
		* Running mode identification strings.
		*
		* Debug mode is intended to be as stable as possible while providing additional debugging information.
		* In production mode performance is emphasized.
		*
		* For reference.
		*/
		CONFIGURATION.RUNNING_MODES = {PRODUCTION: 'production', DEBUG: 'debug'} ;
		/**
		* The running mode for the application.
		*
		* May be set to 'debug' in order to enable (additional) analytics, e.g. console output.
		*/
		CONFIGURATION.RUNNING_MODE = CONFIGURATION.RUNNING_MODES.DEBUG ;
		/**
		* Default required objects.
		*
		* A comma seperated list of object identifier strings. These objects are imported by default.
		*
		* @type String
		* @deprecated: not needed
		*/
//		CONFIGURATION.REQUIRE_DEFAULT = '' ;
		/**
		* @deprecated: moved to `CONFIGURATION.DEFAULTS`
		**/
//		CONFIGURATION.APPLICATION_ROOT = null ;

	//- Matchers
		
		CONSTANTS.MATCHERS = {
				WHITESPACE_TRIM: /^\s+|\s+$/g
		} ;
		
	// Core Operations
	
	var queueAdd,
		queueNext,
		queueSwitch,
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
		stringTrim,
		stringTokenize,
		stringFormat,
		arrayEach,
		arraySome,
		arrayEvery,
		arrayCopy,
		arrayRemove,
		arrayContains,
		functionCopy,
		functionBind,
		/**@deprecated*/
		functionNewConstructor,
		objectEach,
		objectKeys,
		objectPrint,
		objectDefineProperty,
		objectResolveNamespace,
		objectCreateNamespace,
		objectPrint,
		definitionParse,
		/**@deprecated*/
		definitionImport,
		definitionRequire,
		definitionParseAnnotation,
		definitionCompile,
		constructorCreate,
		typeIdentifierToURL,
		typeDefine,
		typeDefinePrototype,
		typeDefineGlobalProperties,
		typeDefineLocalProperties,
		requestCreate,
		requestSend,
		/**@deprecated*/
		requestSetMIMEType,
		constant,
		id ;
 
	//- Process Management
	
		/**
		* Enqueue a task.
		*
		* A task may be enqueued as the successor to parent task by passing the parent's id string. Enqueuing child to parent tasks forms "task chains"; elements of a task chain have to be processed sequentially. Elements in two different task chains may processed in any order.
		*
		* @param (Function) task A task function.
		* @param (String) [optional] parent The id of the immediately preceding task for the given task.
		*/
		CORE.queueAdd = queueAdd = function queueAdd(task, parent, async)
		{
// console.log('queueAdd (parent="%s", async="%s")', parent, async) ;
			// variables
 
			var wrapper,
				s,
				o ;
 
			//

				/*Descendant tasks inherit the id of the task chain head.*/

				s = parent || id( ) ;
 
				/*Wrap the task chain.*/
 
				wrapper = {task: task, id: s, async: async || false} ;
 
				/*In case a parent task was given, chain with the parent task; otherwise add to the task map.*/
 
				if(parent)
				{

						assert(isSet(parent, TASKS), 'Illegal State: Parent task for ID is unknown ("' + parent + '")') ;

						/*Iterate over the task chain's elements and append the wrapper to the last element.*/
 
						o = TASKS[parent] ;
 
						while(o.next) o = o.next ;

						o.next = wrapper, wrapper.previous = o ;

				}
				else TASKS[s] = wrapper ;
 
			// return

			return s ;
 
		} ;
 
		/**
		* Dequeue a task.
		* @todo should be split into `queueRemove` and `queueNext`
		*/
		CORE.queueNext = queueNext = function queueNext(id)
		{
// console.log('queueNext (id="%s")', id) ;
			// preconditions
 
			assert(isSet(id, TASKS), 'Illegal State: Task for ID is unknown ("' + id + '")') ;
 
			// variables
 
			var wrapper, next ;
 
			//
 
				/*Retain a reference to the task wrapper and delete the task from the id map.*/
 
				wrapper = TASKS[id] ;
 
				/*Determine whether the task chain is empty after removing the task chain head. If it is not empty replace the task head with its immediate successor and flag it as waiting for the asynchronous task to finish; otherwise delete the entry.*/

				if((next = wrapper.next))
				{
 
						TASKS[id] = next ;
						next.waiting = true ;
 
						delete wrapper.next ;
						delete next.previous ;
 
				}
				else delete TASKS[id] ;
 
				/*Process the task.*/
 
				wrapper.task.call(null, id) ;
 
				/*Determine time behaviour of the task. In case of an asynchronous task, switch to another task chain; otherwise try to process the next task right away.*/

				if(wrapper.async) queueSwitch( ) ;
				else if(next)	queueNext(next.id) ;
 
		} ;
 
		/**Switch the currently active task chain.*/
		CORE.queueSwitch = queueSwitch = function queueSwitch( )
		{
 //console.log('queueSwitch ()') ;
			// variables
 
			var id ;
 
			//
	
				/*Determine a task chain which is not waiting for an asynchronous task to finish.*/

				objectEach(TASKS, function(wrapper) {
						if(! wrapper.waiting) { id = wrapper.id ; return false ; }
				}) ;

				if(id) queueNext(id) ;
 
			// return
 
			return id ;
 
		} ;
	
	//- Type Identification

		/**
		* The MS implementation of the strict equality operator will fail if an undeclared reference is evaluated; using `typeof` will work cross-browser)
		* @link http://msdn.microsoft.com/en-us/library/259s7zc1(v=vs.94).aspx
		* @param (Object) object An Object.
		* @return Boolean
		*/
		CORE.isVoid = isVoid = function isVoid(object)
		{
			return typeof object === CONSTANTS.LITERAL_UNDEFINED ;
		} ;
		/**
		* Returns true if the given object contains a property for the given key.
		*
		* Use this instead of `isVoid` to test for a property of core Objects in order to avoid errors.
		*
		* @note IE 8 fails with a ``Object does not support property or method'' error if an undefined property is accessed; hence the try-catch block.
		* @param (String) key A key String.
		* @param (Object) object An Object.
		* @return Boolean
		*/
		CORE.isSet = isSet = function isSet(key, object)
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
		CORE.isNull = isNull = function isNull(object)
		{
			return object === null ;
		} ;
		/**
		* Test whether the given Object is an instance of Boolean.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		CORE.isBoolean = isBoolean = function isBoolean(object)
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
		CORE.isNumber = isNumber = function isNumber(object)
		{
			return typeof object === 'number' ? isNaN(object) ? false : true : false ;
		} ;
		/**
		* Test whether the given Object is an instance of Number for an integer value.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		CORE.isInteger = isInteger = function isInteger(object)
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
		CORE.isFloat = isFloat = function isFloat(object)
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
		CORE.isString = isString = function isString(object)
		{
			return typeof object === 'string' ;
		} ;
		/*
		* Test whether the given object is an instance of Object.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		CORE.isObject = isObject = function isObject(object)
		{
			return typeof object === 'object' ? Object.prototype.toString.call(object) ===	CONSTANTS.OBJECT_TAG : false ;
		} ;
		/*
		* Test whether the given object is an instance of Function.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		CORE.isFunction = isFunction = function isFunction(object)
		{
			return typeof object === 'function' ? Object.prototype.toString.call(object) === CONSTANTS.FUNCTION_TAG : false ;
		} ;
		/*
		* Test whether the given object is an instance of Array.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		CORE.isArray = isArray = function isArray(object)
		{
			return object instanceof Array ;
		} ;
		/*
		* Test whether the given object is an instance of Date.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		CORE.isDate = isDate = function isDate(object)
		{
			return isInstanceOf(Date, object) ;
		} ;
		/*
		* Test whether the given object is an instance of RegExp.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		CORE.isRegExp = isRegExp = function isRegExp(object)
		{
			return isInstanceOf(RegExp, object) ;
		} ;
		/*
		* Test whether the given object is an instance of Error.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		CORE.isError = isError = function isError(object)
		{
			return isInstanceOf(Error, object) ;
		} ;
		/*
		* Test whether the given object is a node type. 
		*
		* In case the DOM implementation does not provide a (public) `Node` constructor function, the type test is applied using using duck typing for the `.nodeName` and `.nodeType` attributes of the given object.
		*
		* @param (Object) object An object.
		* @return Boolean
		*/
		CORE.isNode = isNode = function isNode(object)
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
		*/
		CORE.isWindow = isWindow = function isWindow(object)
		{
		
			// variables
			
			var s ;
			
			//
			
				s = Object.prototype.toString.call(object) ;

				if(s === '[object ' + CONSTANTS.TYPE_WINDOW + ']') { return true ; }

			// return
			
			return false ;

		} ;
		/**
		* Return a String type identifying the given Object's type.
		*
		* @param (Object) object An object.
		* @return Boolean
		*/
		CORE.typeOf = typeOf = function typeOf(object)
		{

			// variables

			var s ;

			//

				/* First things first, exclude `null` and `undefined`.*/

				if(isVoid(object)) { return CONSTANTS.TYPE_VOID ; }
				else if(isNull(object)) { return CONSTANTS.TYPE_NULL ; }
				else {

						if(isFunction(object) ) { return CONSTANTS.TYPE_FUNCTION ; }
						else if(isBoolean(object)) { return CONSTANTS.TYPE_BOOLEAN ; }
						else if(isNumber(object)) { return isFloat(object) ? CONSTANTS.TYPE_FLOAT : CONSTANTS.TYPE_INTEGER ; }
						else if(isString(object)) { return CONSTANTS.TYPE_STRING ; }
						else if(isDate(object)) { return CONSTANTS.TYPE_DATE ; }
						else if(isRegExp(object)) { return CONSTANTS.TYPE_REGEXP ; }
						else if(isError(object)) { return CONSTANTS.TYPE_ERROR ; }
						else if(isNode(object)) { return CONSTANTS.TYPE_NODE ; }
						else {
						
								/*Parse the object tag for the type name.*/

								s = Object.prototype.toString.call(object) ;
								s = s.substring(8, s.length - 1) ;

								switch(s) {
										case CONSTANTS.TYPE_ARRAY: return CONSTANTS.TYPE_ARRAY ; break ;
										case CONSTANTS.TYPE_WINDOW: return CONSTANTS.TYPE_WINDOW ; break ;
										/*Instances of a constructor function identify as Objects even though they might have overriden `Object.prototype.toString`; in this case we use the name of the constructor's ''name'' property to identify the type or default to `Object`.*/
										case CONSTANTS.TYPE_OBJECT: return !! object.constructor ? object.constructor.name : s ; break ;
										default: return 'Unknown' ;
								}

						}

				}

			// return

			return null ;

		} ;
		
		/**
		* Return the constructor for the given identifier (if it exists).
		*
		* @param (String) identifier A type identifier string.
		*
		* @return (Function) The constructor function for the type for the given type identifier string.
		*/
		CORE.constructorOf = constructorOf = function constructorOf(identifier) { return LIBRARY.CONSTRUCTORS[identifier] || null ; } ;

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
		CORE.isInstanceOf = isInstanceOf = function isInstanceOf(a, b)
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
		* String substitution for the error message applies.
		* 
		* @example `error("Invalid type for parameter: %s", typeOf(object));`
		*/
		CORE.error = error = function error(message/*, substitute...*/)
		{
		
			// variables
			
			var s ;
			
			//
			
				if(arguments.length > 1) s = stringFormat.apply(null, arguments) ;
				else s = message ;

				throw new Error(s) ;
				
		} ;

		/**
		* @todo In production mode, suppress assertion errors. Assertions are debugging statements which confirm the consistency of the actual program state with the intended program state.
		*/
		CORE.assert = assert = function assert(assertion, message/*, substitute...*/)
		{
		
			// variables
			
			var s ;
			
			//

				if(! assertion)
				{
				
						if(arguments.length > 2) s = stringFormat.apply(null, arrayCopy(arguments, 1, arguments.length)) ;
						else s = message ;
						
						throw new Error(s) ;
						
				}
				
			// return
			
			return this ;

		} ;

	//- String Operations

		CORE.stringQuote = stringQuote = function stringQuote(string)
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
		
		CORE.stringTrim = stringTrim = function stringTrim(string)
		{
		
			//
			
				CONSTANTS.MATCHERS.WHITESPACE_TRIM.lastIndex = 0 ;
				
				return string.replace(CONSTANTS.MATCHERS.WHITESPACE_TRIM, CONSTANTS.LITERAL_EMPTY) ;

		} ;
		
		CORE.stringTokenize = stringTokenize = function stringTokenize(string, delimiter)
		{
		
			// variables
			
			var a = [],
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
		
		CORE.stringFormat = stringFormat = function stringFormat(string/*, substitute...*/)
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
		* Iterate over the elements of an Array executing the given callback fixing---if specified---the context to the given object.
		*
		* The callback is executed for each element in the array passing the value, its index and this array.
		*
		* @implementation The implementation follows the ECMAScript language specification version 5 and up.
		* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
		*
		* @param callback (Function) A callback function to be called for each element in the Array; the callback receives---in this order---the value, its index and the array itself via arguments.
		* @context (Object) A context object; if specified, the callback function is executed within the context of the given object, i.e. the dynamic reference `this` will refer to the object.
		*/
		CORE.arrayEach = arrayEach = function arrayEach(array, callback, context)
		{
		
			// variables
			
			var a,
				index = -1, length = array.length ;
			
			//
			
				a = [,,array] ;
			
				while(++index < length)
				{
				
						a[0] = array[index], a[1] = index ;
						callback.apply(context, a) ;
						
				}

		} ;
		
		/**
		* Iterate over the elements of an Array executing the given callback fixing---if specified---the context to the given object.
		*
		* The callback is executed for each element in the array passing the value, its index and this array just like in `arrayEeach`. Unlike `arrayEach` this function will immediately return with a true value upon the first true value returned by the passed callback and otherwise will return false.
		*
		* @implementation The implementation follows the ECMAScript language specification version 5 and up.
		* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
		*
		* @param array (Array) The array to be iterated over.
		* @param callback (Function) A callback function to be called for each element in the Array; the callback receives---in this order---the value, its index and the array itself via arguments.
		* @context (Object) A context object; if specified, the callback function is executed within the context of the given object, i.e. the dynamic reference `this` will refer to the object.
		* @return (Boolean) True, if the callback returned true once; false, if the callback never returned true.
		*/
		CORE.arraySome = arraySome = function arraySome(array, callback, context)
		{
		
			// variables
			
			var a,
				index = -1, length = array.length ;
			
			//
			
				a = [, , array] ;
			
				while(++index < length)
				{
				
						a[0] = array[index], a[1] = index ;
						
						if(callback.apply(context, a) === true) return true  ;

				}
				
			// return
			
			return false ;
		
		} ;

		/**
		* Iterate over the elements of an Array executing the given callback and breaking iteration if the callback returns false.
		*
		* The callback is executed for each element in the array passing the value, its index and this array just like in `arrayEach`. Unlike `arrayEach` this function will immediately return with false upon the first false value returned by the passed callback and otherwise will return true.
		*
		* @implementation The implementation follows the ECMAScript language specification version 5 and up.
		* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
		*
		* @param callback (Function) A callback function to be called for each element in the Array; the callback receives---in this order---the value, its index and the array itself via arguments.
		* @context (Object) A context object; if specified, the callback function is executed within the context of the given object, i.e. the dynamic reference `this` will refer to the object.
		* @return (Boolean) True, if the callback never returned false; false, if the callback returned false once.
		*/
		CORE.arrayEvery = arrayEvery = function arrayEvery(array, callback, context)
		{
			var a,
				index = -1, length = array.length ;
			
			//
			
				a = [, , array] ;
			
				while(++index < length)
				{
				
						a[0] = array[index], a[1] = index ;
						
						if(callback.apply(context, a) === false) return false  ;

				}
				
			// return
			
			return true ;

		} ;
		
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
		CORE.arrayCopy = arrayCopy = function arrayCopy(array, start, stop)
		{
				return Array.prototype.slice.apply(array, [start, stop]) ;
		} ;

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
		*/
		CORE.arrayContains = arrayContains = function arrayContains(array, value, start, end)
		{
		
			// variables
			
			var middle, i ;
			
			//

				if(start === end) return array[start] === value ? start : -1 ;
				else if(start < end) {

						middle = start + Math.floor((end - start) / 2) ;

						if((i = arrayContains(array, value, start, middle)) !== -1) return i ;
						else return arrayContains(array, value, middle + 1, end) ;
				
				}
			
			// return
			
			return -1 ;
		
		} ;
 
		CORE.arrayRemove = arrayRemove = function arrayRemove(array, index)
		{
				array.splice(index, 1) ;
		} ;

	//- Function Operations
	
		CORE.functionBind = functionBind = function functionBind(fn, context, args)
		{
				if(args) return function anonymous( ) { fn.apply(context, Arrargs) ; }
				else return function anonymous( ) { fn.call(context) ; }
		} ;
 
		/**
		* Copies the given function with all its properties (including the ''prototype'' property).
		* @return A copy of the given function.
		*/
		CORE.functionCopy = functionCopy = function functionCopy(original)
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
		* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
		*/
		CORE.objectEach = objectEach = function objectEach(object, callback, context)
		{
		
			// variables
			
			var a ;
			
			//
			
				a = [,,object] ;
			
				for(var key in object)
						if(Object.prototype.hasOwnProperty.call(object, key))
						{
						
								a[0] = object[key], a[1] = key ;
						
								callback.apply(context, a) ;
								
						}

		} ;
		/**
		* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys#Polyfill
		*/
		CORE.objectKeys = objectKeys = (function( ) {
				if(({toString: null}).propertyIsEnumerable('toString'))
						return function objectKeys(object)
						{
						
							// preconditions
							
								assert(!! object && (typeof object === 'object' || typeof object === 'function'), 'Illegal Argument: object for formal parameter `object` has invalid type.') ;
								
							// variables
							
							var keys ;
							
							//
							
								keys = [ ] ;
								
								objectEach(object, function(value, key) { keys[keys.length] = key ; }) ;
								
							// return
							
							return keys ;
							
						}
				else
						return function objectKeys(object)
						{
						
							// preconditions
							
								assert(!! object && (typeof object === 'object' || typeof object === 'function'), 'Illegal Argument: object for formal parameter `object` has invalid type.') ;
								
							// variables
							
							var keys ;
							
							//
							
								keys = [ ] ;
								
								objectEach(object, function(value, key) { keys[keys.length] = key ; }) ;
								
								/**/
								
								arrayEach(CONSTANTS.UNENUMERABLE, function(name) { if(Object.prototype.hasOwnProperty.call(object, name)) keys[keys.length] = name ; }) ;
								
							// return
							
							return keys ;

						}
		})( ) ;
		
		/**
		*/
		CORE.objectPrint = objectPrint = function objectPrint(object)
		{

			// variables
			
			var s, i1 = 0, i2 ;
			
			//

				if(object === null) s = CONSTANTS.LITERAL_NULL ;
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

		CORE.objectDefineProperty = objectDefineProperty = function objectDefineProperty(object, property, specification)
		{

			//
/*@todo: getter/setter where possible.*/
				object[property] = specification.value ;

		} ;
		
		/**
		*/
		CORE.objectResolveNamespace = objectResolveNamespace = function objectResolveNamespace(namespace, target)
		{

			// variables
			
			var index = 0, previous = 0,
				s,
				o = target ;
			
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
		* Create a namespace for the given namespace identifier string on the given target.
		*
		* Namespace identifier strings are simple identifier sequences delimited by a dot (e.g. 'a.b.c.d'). This method automatically creates a property if the value for a key is undefined; it will travel along existing object properties but will break on null values.
		*
		* @return The host of the object for the given namespace or undefined if the namespace creation failed.
		*/
		CORE.objectCreateNamespace = objectCreateNamespace = function objectCreateNamespace(namespace, target)
		{

			// variables

			var o = target,
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
 
	//- XHR Operations
	
		/**
		* Create an XHR object with the given properties.
		*
		* @todo ready state change handler needs to handle more status-state combinations.
		*/
		CORE.requestCreate = requestCreate = function requestCreate(properties)
		{
 
			// variables
 
			var request,
				f,
				s ;
 
			//
 
				/*Get a request object.*/
 
				if(CONSTANTS.IS_IE)
				{
				
						arraySome(CONSTANTS.MS_ACTIVEX_XHR_VERSIONS, function(version) {
						
								try { if(! isNull((request = new ActiveXObject(version)))) { return true ; } }
								catch(e) { }
								
						}) ;

				}
				else request = new CONSTANTS.GLOBAL_OBJECT.XMLHttpRequest( ) ;

				assert(! (isNull(request) || isVoid(request)), 'Illegal State: Unable to create request object.') ;
 
				/*Set properties and ready state change handler.*/
 
				properties.request = request ;
 
				f = request.onreadystatechange = functionBind(function ( )
				{
						
					// variables

					var status = this.request.status,
						state = this.request.readyState ;
 
					//

						if((status - 400 > 0) && (f = this.error)) f(this) ;
						else switch(state)
						{
								case CONSTANTS.XHR_READY_STATE_DONE:
										if(status === 200 && (f = this.done)) f(this) ;
										else if((f = this.error)) f(this) ;
								break ;
								default: /*@todo: state handlers*/;
						}

				}, properties) ;

				if((s = properties.mime))
						if(isSet('overrideMimeType', request)) request.overrideMimeType(s) ;
 
			// return
 
			return request ;
 
		} ;

		CORE.requestSend = requestSend = function requestSend(request, properties)
		{
		
			// variables
			
			var method = properties.method,
				o ;
			
			//
			
				request.open(method, properties.url, properties.async) ;
			
				switch(method)
				{
						case CONSTANTS.HTTP_METHOD_GET:
								request.setRequestHeader('Content-Type', 'XMLHTTP/1.0') ;
						break ;
						case CONSTANTS.HTTP_METHOD_POST:
								request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded') ;
						break ;
						/*@todo: all HTTP methods*/
						default: error('Unsupported Operation: HTTP method currently not supported (method="%s")', method) ;
				}
				
				/*Add headers.*/
				
				if((o = properties.headers))
						objectEach(o, function(values, header) {
								arrayEach(values, function(value) { request.setRequestHeader(header, value) ; }, this) ;
						}, this) ;

				/*As per convention.*/
				
				if(properties.flag) request.setRequestHeader('X-Requested-With', 'XMLHttpRequest') ;
			
				/*Send the request.*/
			
				if(properties.binary) request.sendAsBinary(properties.body) ;
				else request.send(properties.body) ;
		
		} ;
		
		/**@deprecated: merged with `requestCreate`.*/
		CORE.requestSetMIMEType = requestSetMIMEType = function requestSetMIMEType(request, mime)
		{
				if(isSet('overrideMimeType', request)) request.overrideMimeType(mime) ;
		} ;
		
	//-- Library Operations
	
		CORE.constructorCreate = constructorCreate = function constructorCreate(name, body, parameter)
		{
		
			// variables
			
			var constructor,
				s ;
			
			//
			
				s = parameter ? parameter.join(CONSTANTS.CHARACTERS.COMMA) : '' ;

			// return
			
				return (Function(stringFormat('return function %s(%s){%s}', name, s, body)))( ) ;
		} ;
	
		CORE.typeIdentifierToURL = typeIdentifierToURL = function typeIdentifierToURL(identifier, root, suffix)
		{
 
			// variables
 
			var url,
				a,
				slash = CONSTANTS.CHARACTERS.SLASH, dot = CONSTANTS.CHARACTERS.DOT ;
 
			//
 
				a = stringTokenize(identifier, dot) ;
 
				url = root ? root + slash : slash ;
				url += suffix ? a.join(slash) + dot + suffix : a.join(slash) ;
 
			// return
 
			return url ;

		} ;

		/**
		* Define an object type.
		*
		* This operation does not test for existing definitions and consequently will override existing ones. Use with care.
		*
		* @return (Function) The constructor for the defined object type.
		*/
		CORE.typeDefine = typeDefine = function typeDefine(constructor, definition)
		{

			// variables

			var constructor,
				reflect,
				f,
				s,
				i,
				a,
				o ;
			
			//
/*@deprecated: property `name` must be specified within passed constructor's `reflect` property
				/*Get name substring from identifier.*

				a = stringTokenize(identifier, CONSTANTS.CHARACTERS.DOT) ;
				s = a[a.length - 1] ;
@*/
				/*Get a reference to the `reflect` property of the constructor function.*/
				
				reflect = constructor.reflect ;

/*@deprecated: these properties must be specified within the passed constructor's `reflect` property
				o.identifier = identifier,
				o.type = definition.type || CONSTANTS.CONSTRUCTOR_FACTORY,
				o.extend = definition.extend, o.main = definition.main,
@*/
				reflect.global = [ ], reflect.local = [ ] ;
/*@deprecated: property `namespace` must be specified within passed constructor's `reflect` property
				a = arrayCopy(a, 0, a.length - 1) ;
				s = a.join(CONSTANTS.CHARACTERS.DOT) ;

				o.namespace = s ;
@*/

				/*The main method must specify a non-empty formal parameter list in order to safely discriminate between instantiations for use as a prototype Object and regular instantiations.*/

				if((f = definition.main))
				{

						assert(f.length !== 0, 'Invalid main method. Formal parameter list may not be empty (type-identifier="%s")', reflect.identifier) ;
						reflect.main = f ;
						
				}
						
				/*Create an instance of the prototype object and reference its global properties.*/

				if((s = reflect.extend)) typeDefinePrototype(constructor, s, definition) ;
				
				/*Reflect the constructor on instances.*/

				constructor.prototype.constructor = constructor ;

				/*Put local properties on the constructor's prototype property.*/
				
				if((o = definition.local)) typeDefineLocalProperties(constructor, o) ;
				
				/*Put global properties on the constructor function.*/
				
				if((o = definition.global)) typeDefineGlobalProperties(constructor, o) ;

			// return
			
			return constructor ;

		} ;
		
		/**
		* @param constructor (Function)
		* @param identifier (String) The prototype identifier string.
		* @param definition (Object)
		*/
		CORE.typeDefinePrototype = typeDefinePrototype = function typeDefinePrototype(constructor, identifier, definition)
		{

			// variables
			
			var prototype,
				o,
				a ;
			
			//
			
				o = constructor.reflect ;

				/*Use the constructor function to create a new instance.*/

				assert((prototype = LIBRARY.CONSTRUCTORS[identifier]), 'Illegal state: prototype has not been defined (prototype-identifier="%s", type-identifier="%s")', identifier, constructor.reflect.identifier) ;

				/*Reflect the prototype constructor.*/
				
				o.prototype = identifier ;

				/*Create an instance of the prototype object to extend.*/

				constructor.prototype = new prototype( ) ;

				/*Inherit the main function of the prototype if there is no definition for it on the sub type.*/

				if(! isSet('main', o)) o.main = prototype.reflect.main ;
				
				/*Copy local key identifiers of the prototype.*/

				a = prototype.reflect.local ;
				o.local = arrayCopy(a, 0, a.length) ;

				/*Copy global properties of the prototype constructor to the definition (unless they override global properties specified witin the definition).*/
				
				o = definition.global = definition.global || { } ;
				
				if((a = prototype.reflect.global)) arrayEach(a, function(property) { if(! isSet(property, o)) o[property] = prototype[property] ; }) ;

		} ;
		
		CORE.typeDefineGlobalProperties = typeDefineGlobalProperties = function typeDefineGlobalProperties(constructor, global)
		{
		
			// variables
			
			var a ;
			
			//

				a = constructor.reflect.global ;

				objectEach(global, function(value, key) {
				
						if(arrayContains(CONSTANTS.RESERVED, key, 0, CONSTANTS.RESERVED.length) !== -1) error('Invalid use of reserved property name (name="%s", identifier="%s")', key, constructor.reflect.identifier) ;
						
						constructor[key] = value ;
						a[a.length] = key ;

				}) ;

		} ;
		
		/**
		* @todo assure that object definitions which extend abstract constructor types either are themselves abstract or implement abstract functions.
		*/
		CORE.typeDefineLocalProperties = typeDefineLocalProperties = function typeDefineLocalProperties(constructor, local)
		{

			// variables
			
			var a ;

			//
				/*Reflect the constructor on the prototype property. This is required for correct type detection.*/

				constructor.prototype.constructor = constructor ;
				
				/*
				* Create the `super` property which contains overriden properties of the prototype object.
				* @note The reserved keyword `super` may be used as property name but not as a variable identifier.
				* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Reserved_Words#Reserved_word_usage
				*/

				/*@deprecated: removed (reflective call to super type supplies this function)*/

//				constructor.prototype.super = { } ;

				a = constructor.reflect.local ;
				
				/*Fill the prototype property of the type constructor with the local properties of the type definition.*/
	
				objectEach(local, function(value, key) {
				
					// variables
					
					var o ;
					
					//
				
						assert(arrayContains(CONSTANTS.RESERVED, key, 0, CONSTANTS.RESERVED.length) === -1, 'Invalid use of reserved property name (name="%s")', key) ;
						
						/*@deprecated: removed (reflective call to super type supplies this function)
						
						Add overriden local properties to the `super` property.*/
						
//						if(typeof ( o = constructor.prototype[key]) !== CONSTANTS.LITERAL_UNDEFINED) constructor.prototype.super[key] = o ;
						
						constructor.prototype[key] = value ;
						
						if(arrayContains(a, key, 0, a.length) === -1) a[a.length] = key ;

				}) ;

		} ;
		
		/**
		* Import an object definition using XHR, build its constructor and put it in the library.
		*/
		CORE.definitionRequire = definitionRequire = function definitionRequire(identifier)
		{
 
			// variables
 
			var id ;
 
			//
 
				/*Skip already imported definitions. An alreay imported definition will not be `undefined` in `LIBRARY.CONSTRUCTORS` (i.e. either a constructor or a constructor placeholder exists).*/
 
				if(! isSet(identifier, LIBRARY.CONSTRUCTORS))
				{
//console.log('definitionRequire("%s")', identifier) ;
						/*Import the definition for the given identifier.*/

						id = queueAdd(function(id) {
//console.log('download-definition ("%s")', identifier) ;
								requestSend(
										requestCreate({
												mime: CONSTANTS.MIME_JAVASCRIPT,
												/*@todo: `queueDump` to remove an entire task chain and call to `queueDump` on error*/
												error: function( ) { },
												done: function(properties) {

														/*Store the retrieved object definition in the library as a placeholder and continue.*/
														
														LIBRARY.CONSTRUCTORS[identifier] = properties.request.responseText ;
												
														queueNext(id) ;
														
												}
										}),
										{
												url: typeIdentifierToURL(identifier, CONFIGURATION.SETTINGS[CONFIGURATION.LIBRARY_ROOT]),
												method: 'GET',
												async: true
										}
								) ;
						}, null, true) ;
// console.log('task-id: "%s"', id) ;
						/*Parse object definition and put it on the constructor map of the library as a placeholder.*/

						queueAdd(function(wrapper) {
//console.log('parse-definition("%s")', identifier) ;
							var parsed, o,
								constructor,
								name ;
							
								parsed = LIBRARY.CONSTRUCTORS[identifier] = definitionParse(LIBRARY.CONSTRUCTORS[identifier]) ;
//console.dir(parsed) ;
								/*Create the constructor function before actually parsing the object definition and store the parsed object definition (including the source to be parsed). We do this in order to be able to pass a reference to the constructor when parsing the source of a dependent object definition; i.e. one that requires this object).*/
								
								name = parsed.name ;
								
								constructor = constructorCreate(
										name,
										stringFormat(
											'var o=this.constructor;'
											+ 'if(! (this instanceof %s)){throw new Error("Invalid call to constructor (identifier=\\"%s\\")");}'
											+ 'if(arguments.length>0){o.reflect.main.apply(this, arguments);}',
											name,
											identifier
										)
								) ;
								constructor.reflect = parsed ;
								
								/*Create an entry by name in the packages container and an entry by identifier within the constructor map.*/
								o = objectCreateNamespace(parsed.namespace, LIBRARY.PACKAGES) ;
								o[name] = LIBRARY.CONSTRUCTORS[identifier] = constructor ;
//console.dir(constructor) ;
						},
						id) ;
 
						/*Recursively import the super type (if specified).*/
 
						queueAdd(function(id) {
//console.log('require-dependencies ("%s")', identifier) ;
							var s ;
							
								if((s = LIBRARY.CONSTRUCTORS[identifier].reflect.extend))
								{
//console.log('extend-object: "%s"', s) ;
										/*Create a new task chain for requiring the super type definition. Upon completion continue with this task chain.*/

										s = definitionRequire(s) ;
								 
										queueAdd(function( ) { queueNext(id) ;}, s) ;
								 
								}
								else queueNext(id) ;

						},
						id, true) ; // flagged as asynchronous in order to wait for the requirements to be resolved
 
						/*Recursively import dependencies (if specified).*/
 
						queueAdd(function(id) {
						
							var a, list ;
								
								if((a = LIBRARY.CONSTRUCTORS[identifier].require))
								{
//console.log('require-objects: %s', a) ;
										list = arrayCopy(a, 0, a.length) ;
								 
										/*Iterate over the array of required definitions.*/
										arrayEach(a, function(identifier, index, array) {
										
											var s ;
											
												s = definitionRequire(identifier) ;
//console.log('require-object (#%s): "%s"', index, identifier) ;
												queueAdd(function( ) {
												
														/*Once all requirements have been resolved continue with the parent definition requirement process.*/
														
														arrayRemove(list, list.indexOf(identifier)) ;
														
														if(array.length === 0) queueNext(id) ;
														
														
												}, s) ;
												
										}) ;
								}
								else queueNext(id) ;

						},
						id, true) ;
 
						/*Compile the definition source, define the object type and finish*/

						queueAdd(function(wrapper) {
//console.log('compile-definition ("%s")', identifier) ;
								typeDefine(LIBRARY.CONSTRUCTORS[identifier], definitionCompile(identifier)) ;
								
//								queueNext(id) ;

						},
						id) ;
 
						queueNext(id) ;

				}
 
			// return
 
			return id ;
 
		} ;
 
		/**
		* Parse and validate an object source.
		*/
		CORE.definitionParse = definitionParse = function definitionParse(source)
		{
//console.log('definitionParse') ;
			// variables
			
			var parsed = { },
				i,
				s,
				a ;
				
			//

				/*Parse annotation properties and definition container.*/
				
				if(source.indexOf(CONSTANTS.LITERAL_BLOCK_COMMENT_BEGIN) !== 0) error('Invalid package annotation. Leading string must be empty (identifier="%s")', identifier) ;
				if((i = source.indexOf(CONSTANTS.LITERAL_BLOCK_COMMENT_END, 2)) === -1) error('Invalid package annotation. Unterminated comment block (identifier="%s"', identifier) ;
				
				parsed.source = stringTrim(source.substring(i + 2, source.length)) ;
				
				/*Iterate over annotation properties.*/

				s = source.substring(2, i) ;

				arrayEach(
						stringTokenize(stringTrim(s), '@'),
						function(annotation, index) {
						
							var a ;
							
									a = definitionParseAnnotation(annotation, index) ;
						  
									parsed[a[0]] = a[1] ;

						}
				) ;
				
				assert((s = parsed.identifier), 'Illegal State: Missing required annotation (annotation-name="identifier")') ;

				a = stringTokenize(s, CONSTANTS.CHARACTERS.DOT) ;
				parsed.name = a[a.length - 1] ;
 
				assert(a.length > 0, 'Illegal State: Identifier is invalid; no namespace ("%s")', s) ;
 
				parsed.namespace = arrayCopy(a, 0, a.length - 1).join(CONSTANTS.CHARACTERS.DOT) ;

			// return
			
			return parsed ;

		} ;
 
		CORE.definitionParseAnnotation = definitionParseAnnotation = function definitionParseAnnotation(annotation, index)
		{
 
			// variables
 
				var parsed = [ ],
					i,
					name, value,
					a ;
				
				//

					/*Parse property name and value.*/
					
					if((i = annotation.indexOf(CONSTANTS.CHARACTERS.SPACE)) !== -1)
					{
 
							name = annotation.substring(0, i) ;
							value = stringTrim(annotation.substring(i, annotation.length)) ;
 
							parsed[0] = name ;

							if(value.length === 0) parsed[1] = true ;
							else
							{

									/*Switch depending on annotation name.*/

									switch(name)
									{
											case CONSTANTS.ANNOTATION_IDENTIFIER: parsed[1] = value ; break ;
											case CONSTANTS.ANNOTATION_REQUIRE || CONSTANTS.ANNOTATION_USE:

													/*Split around the comma token.*/
 
													a = stringTokenize(value, CONSTANTS.CHARACTERS.COMMA) ;
													arrayEach(a, function(value, index, array) { array[index] = stringTrim(value) ; }) ;
 
													parsed[1] = a ;
													
											break ;

											default:
											
													switch(value)
													{
															case CONSTANTS.LITERAL_FALSE: parsed[1] = false ; break ;
															case CONSTANTS.LITERAL_TRUE: parsed[1] = true ; break ;
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
		CORE.definitionCompile = definitionCompile = function definitionCompile(identifier)
		{
 
			// preconditions
 
			assert(isSet(identifier, LIBRARY.CONSTRUCTORS), 'Illegal State: Constructor is undefined ("%s")', identifier) ;
 
			// variables
 
			var constructor = LIBRARY.CONSTRUCTORS[identifier],
				reflect = constructor.reflect,
				s,
				a1 = [ ], a2, names = [ ], values = [ ], // scope of the compiling function (the names are defined as formal parameter and the values passed as arguments)
				definition ;
 
			//
 
				/*Add the names and constructors of required objects to the scope.*/
 
				if((s = reflect.extend)) a1[0] = s ;
				if((a2 = reflect.require)) a1.concat(a2) ;
 
				if(a1.length > 0) {
 
						arrayEach(a1, function(identifier) {
						
							var f ;
						
								assert(isSet(identifier, LIBRARY.CONSTRUCTORS), 'Illegal State: Constructor for required object is not defined ("%s")', identifier) ;
								
								f = LIBRARY.CONSTRUCTORS[identifier] ;
								
								names[names.length] = f.reflect.name ;
								values[values.length] = f ;
								
						}) ;
 
				}
 
				/*Add the constructor to the scope.*/
				
				names[names.length] = reflect.name, values[values.length] = constructor ;
				names[names.length] = stringFormat('return(%s);', reflect.source) ; // the body of the compiling function
 
				/*The source string is now stored within the body of the compiling function and does not have to be stored on the constructor anymore.*/
 
				delete reflect.source ;
 
				/**/
				
				assert(names.length === values.length + 1, 'Illegal State: Scope names and values have invalid length') ;
				assert(names.length <= 255, 'Illegal State: Scope exceeds limit of function arity.') ;

				/*Compile the type definition passing the constructed scope.*/
				
				try { definition = (Function.apply(null, names)).apply(null, values) ; }
				catch(e) { error('Compilation Error: Unable to compile source (identifier="%s")', identifier) ; }

				assert(isObject(definition), 'Illegal State: Compilation did not return an object (type-identifier="%s").', identifier) ;
 
			// return
 
			return definition ;

		} ;
 
	//- Utility Operations
		

		
		CORE.constant = constant = function constant(key) { return CONSTANTS[key] || null ; } ;

		CORE.id = id = function id( )
		{
		
			// variables
			
			var i, s ;
			
			//
		
				if((i = Date.now( )) === DATE) { COUNTER++ ; }
				else { DATE = i ; COUNTER = 0 ; }

				s = i + '-' + COUNTER ;

			// return
			
			return s ;

		} ;
 
	// Get Configuration Data
/*@deprecated
	var e,
		o1, o2,
		s ;
		
		e = CONSTANTS.DEFAULT_DOCUMENT.documentElement ;
		
		if(! (o1 = e.dataset)) error('`Element.datatset` not supported.') ;
		else {
		
				o2 = CONFIGURATION.KEYS ;

				for(var key in o1)
						if(typeof (s = o2[key]) !== CONSTANTS.TYPE_VOID) CONFIGURATION[s] = o1[key] ;
						else error('Unknown configuration key (key="%s")', key) ;

		}
*/
/*@deprecated: hacky
	//- Resolve Configuration Settings
	
	var settings = CONFIGURATION.SETTINGS ;
	
	if(CONSTANTS.IS_BROWSER)
	{

		var d = CONSTANTS.DEFAULT_DOCUMENT.documentElement,
			s = d.getAttribute('app-settings'),
			a;
console.log('app-settings: %s', s) ;
			a = stringTokenize(s, ';') ;
console.log(a) ;
			arrayEach(a, function(setting, index) {
console.log('setting (#%s): "%s", %s', index, setting, stringTokenize(setting, '=')) ;
				var a = stringTokenize(setting, '='),
					s1 = stringTrim(a[0]),
					s2 = stringTrim(a[1]) ;
console.log('setting-key: "%s"', s1) ;
console.log('setting-value: "%s"', s2) ;
					/*Override configuration setting in case of a valid key.*
					if(isSet(s1, settings)) settings[s1] = s2 ;
					else throw new Error('Unknown configuration key ("' + s1 + '")') ;

			}) ;
	}
	else
	{
/*@todo non-browser fork*
 throw new Error('Non-browser context currently not supported!') ;
	}
console.dir(settings) ;
*/
	// Browser Homogenization
	//
	// Extend native Object prototypes in order to bring them up to the latest ECMAScript standard and/or the Mozilla standard (where possible).
	// @link http://www.ecma-international.org/ecma-262/5.1/

		if(typeof Object.defineProperty === CONSTANTS.LITERAL_UNDEFINED || CONFIGURATION.RUNNING_MODE === CONFIGURATION.RUNNING_MODES.DEBUG)
				Object.defineProperty = objectDefineProperty ;
				
		if(typeof Object.defineProperties === CONSTANTS.LITERAL_UNDEFINED || CONFIGURATION.RUNNING_MODE === CONFIGURATION.RUNNING_MODES.DEBUG)
				Object.defineProperties = function defineProperties(object, specifications) {
						objectEach(specifications, function(specification, property) { Object.defineProperty(object, property, specification) ; }) ;
				} ;

		if(typeof Object.create === CONSTANTS.LITERAL_UNDEFINED || CONFIGURATION.RUNNING_MODE === CONFIGURATION.RUNNING_MODES.DEBUG)
				Object.defineProperty(
						Object,
						'create',
						{
								/**
								* @param prototype (Object) [optional] A prototype object.
								* @param definitions (Object) [optional] A container object with object definitions.
								*/
								value: function create(prototype, definitions)
								{
								
									// variables
									
									var object,
										F ;
									
									//

										if(prototype) {
										
												F = new Function( ) ;
												F.prototype = prototype ;
												
												object = new F( ) ;
												
										}
										else object = { } ;

										if(definitions) Object.defineProperties(object, definitions) ;
										
									// return
									
									return object ;
								
								}
						}
				) ;
				
		if(! isSet('keys', Object) || CONFIGURATION.RUNNING_MODE === CONFIGURATION.RUNNING_MODES.DEBUG)
				Object.defineProperty(
						Object,
						'keys',
						{
								value: function keys(object) { return objectKeys(object) ; }
						}
				) ;
		
		if(typeof Function.prototype.bind === CONSTANTS.LITERAL_UNDEFINED || CONFIGURATION.RUNNING_MODE === CONFIGURATION.RUNNING_MODES.DEBUG)
				Object.defineProperty(
						Function.prototype,
						'bind',
						{
								value: function bind(context/*, argument...*/) { return functionBind(this, context, arrayCopy(arguments, 1, arguments.length)) ; }
								/*@deprecated: refactored into `functionBind`
								{

									// variables
									
									var bound, f,
										a ;
									
									//
									
										f = this ;
										
										if(arguments.length > 1)
										{
										
												a = arrayCopy(arguments, 1, arguments.length) ;
												bound = function( ) { return f.apply(context, a.concat(Array.prototype.slice.call(arguments, 0))) ; } ;
										
										}
										else bound = function( ) { return f.apply(context, arguments) ; } ;
												
									// return
									
									return bound ;
								
								}
								*/
						}
				) ;

		/*@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype*/

		if(typeof Array.prototype.forEach === CONSTANTS.LITERAL_UNDEFINED || CONFIGURATION.RUNNING_MODE === CONFIGURATION.RUNNING_MODES.DEBUG)
				Object.defineProperty(
						Array.prototype,
						'forEach',
						{
								/**
								* A proxy for `arrayEach`.
								*/
								value: function forEach(callback, context) { arrayEach(this, callback, context) ; },
								configurable: true,
								writable: true,
								enumerable: false
						}
				) ;
			
		if(typeof Array.prototype.every === CONSTANTS.LITERAL_UNDEFINED || CONFIGURATION.RUNNING_MODE === CONFIGURATION.RUNNING_MODES.DEBUG)
				Object.defineProperty(
						Array.prototype,
						'every',
						{
								/**
								* A proxy for `arrayEvery`
								*/
								value: function every(callback, context){ return arrayEvery(this, callback, context) ; },
								configurable: true,
								writable: true,
								enumerable: false
						}
				) ;
				
		if(typeof Array.prototype.some === CONSTANTS.LITERAL_UNDEFINED || CONFIGURATION.RUNNING_MODE === CONFIGURATION.RUNNING_MODES.DEBUG)
				Object.defineProperty(
						Array.prototype,
						'some',
						{
								/**
								* @link {arraySome}
								*/
								value: function some(callback, context) { return arraySome(this, callback, context) ; },
								configurable: true,
								writable: true,
								enumerable: false
						}
				) ;

		if(typeof Array.prototype.indexOf === CONSTANTS.LITERAL_UNDEFINED || CONFIGURATION.RUNNING_MODE === CONFIGURATION.RUNNING_MODES.DEBUG)
				Object.defineProperty(
						Array.prototype,
						'indexOf',
						{
								/**
								* @implementation The implementation follows the ECMAScript language specification version 5 and up.
								* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
								*/
								value: function indexOf(value, start) { return arrayContains(this, value, start || 0, this.length) ; },
								configurable: true,
								writable: true,
								enumerable: false
						}
				) ;


		if(typeof String.prototype.trim === CONSTANTS.LITERAL_UNDEFINED || CONFIGURATION.RUNNING_MODE === CONFIGURATION.RUNNING_MODES.DEBUG)
				Object.defineProperty(
						String.prototype,
						'trim',
						{
								/**
								* @link http://stackoverflow.com/questions/498970/how-do-i-trim-a-string-in-javascript
								*/
								value: function trim( ) { return stringTrim(this) ; },
								configurable: true,
								writable: true,
								enumerable: false
						}
				) ;
		
	// Retrieve And Apply Configuration

	requestSend(
			requestCreate({
					mime: CONSTANTS.MIME_JSON,
					done: function (properties)
					{
/*@qnd*/
var o = Function('return(' + properties.request.responseText + ');')(),
	s,
	f ;

if((s = o[CONFIGURATION.LIBRARY_ROOT])) CONFIGURATION.SETTINGS[CONFIGURATION.LIBRARY_ROOT] = s ;
else error('Illegal State: Missing required configuration setting in configuration file ("%s")', CONFIGURATION.LIBRARY_ROOT) ;

if((s = o[CONFIGURATION.APPLICATION_ROOT])) CONFIGURATION.SETTINGS[CONFIGURATION.APPLICATION_ROOT] = s ;
else error('Illegal State: Missing required configuration setting in configuration file ("%s")', CONFIGURATION.APPLICATION_ROOT) ;

s = definitionRequire(CONFIGURATION.SETTINGS[CONFIGURATION.APPLICATION_ROOT]) ;

queueAdd(function( ) {

console.log('library:') ;
console.dir(LIBRARY.PACKAGES) ;
console.log('o0O0o0O0o0O0o0O0o0O0o\n^application-start!^\no0O0o0O0o0O0o0O0o0O0o') ;
f = constructorOf(CONFIGURATION.SETTINGS[CONFIGURATION.APPLICATION_ROOT]) ;
var o = new f(null) ;
console.dir(o) ;

}, s) ;

					},
					error: function(properties) {
console.log('error! :c') ;
					}
			}),
			{
					url: '/configuration.json',
					method: CONSTANTS.HTTP_METHOD_GET,
					async: true,
					flag: true				
			}
	) ;

})(this) ;