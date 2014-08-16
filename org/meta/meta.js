/*
* Meta JavaScript Library v1.0
*
* Copyright 2014 Friedrich Kurz
* Released under the MIT license
* f.a.kurz@googlemail.com
*/
'use strict' ;
/**
* The set-up function.
*
* Create a `META_CONFIGURATION` object within the scope of this script before running this script in order to pass configuration settings.
*/
(function(configuration) {

	// Hidden Attributes

	var	CONFIGURATION = { },
		CONSTANTS = { },
		DATE = Date.now( ),
		COUNTER = 0,
		QUEUE = [ ],
		/*A map containing a cross reference for object aliases and identifiers.*/
		ALIAS = {TO_ID: { }, FOR_ID: { }},
		PACKAGES = { } ;
		
	//- Configuration Elements
	
		/*@note: Define a `Meta` container object containing all configuration key-value pairs before calling this script in order to pass configuration settings.*/
		/**
		* The relative or absolute path to the root directory for the library.
		* @configuration
		*/
		CONFIGURATION.LIBRARY_ROOT = configuration.LIBRARY_ROOT ;
		/**
		* Running mode identification strings.
		*
		* Purely for reference.
		*/
		CONFIGURATION.RUNNING_MODES = {PRODUCTION: 'production', DEBUG: 'debug'} ;
		CONFIGURATION.RUNNING_MODES.DEFAULT = CONFIGURATION.RUNNING_MODES.PRODUCTION ;
		/**
		* The running mode for the application.
		*
		* May be set to 'debug' in order to enable (additional) analytics, e.g. console output.
		*/
		CONFIGURATION.RUNNING_MODE = configuration.RUNNING_MODE || CONFIGURATION.RUNNING_MODE.DEFAULT ;
		/**
		* Conflict mode identification strings.
		*
		* Purely for reference. In 'override' mode the `Meta` object will be placed on the global object by its name and by the alias `$` (regardless of whether it replaces an existing `$` object).
		*/
		CONFIGURATION.CONFLICT_MODES = {RESOLVE: 'resolve', OVERRIDE: 'override'} ;
		CONFIGURATION.CONFLICT_MODES.DEFAULT = CONFIGURATION.CONFLICT_MODES.OVERRIDE ;
		/**
		* The conflict mode for the application
		*/
		CONFIGURATION.CONFLICT_MODE = configuration.CONFLICT_MODE || CONFIGURATION.CONFLICT_MODES.OVERRIDE ;
		/**
		* Default required objects.
		*
		* These packages are automatically required when the set-up has finished.
		* Use this setting in combination with a singleton type in order to apply the initialization logic for your application (e.g. if `com.project.Project` is the object which contains the initialization logic for your application, set `META_CONFIGURATION.REQUIRE_DEFAULT` to include `'com.project.Project'`; where, `com.project.Project` is defined in a package within the directory `<root>/com/project/project.js` with (at least) the following content:
		*
		*    \/*
		*	* @package com.project
		*	* @provide Project
		*	*\/
		*	{
		*		Project: {
		*			type: Meta.constant('CONSTRUCTOR_TYPE_SINGLETON'),
		*			main: function main(arguments) { <initialization logic> }
		*		}
		*	}
		* Since this object is specified to be a singleton, the constructor will be called upon being required (in order to replace the constructor with the constructed instance to conform to the singleton pattern) and your initialization logic is applied immediately.
		* @type Array
		*/
		CONFIGURATION.REQUIRE_DEFAULT = configuration.REQUIRE_DEFAULT ;
	//- Constants
	
	//-- Type Constants
		
		CONSTANTS.VOID = void(0) ;

	//-- Default Objects
			
		CONSTANTS.IS_BROWSER = !! window;
		/**
		* A reference to the global object. 
		*/
		CONSTANTS.GLOBAL_OBJECT = CONSTANTS.IS_BROWSER ? window.window : this ;
		CONSTANTS.DEFAULT_VIEW = CONSTANTS.IS_BROWSER ? window.window : null ;
		CONSTANTS.DEFAULT_DOCUMENT = CONSTANTS.IS_BROWSER ? window.document : null ;
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

	//-- Browser And Mobile Detection

		/**
		* @link http://www.quirksmode.org/dom/w3c_cssom.html#screenview
		*/
/*@todo: This is tentative*/
		CONSTANTS.IS_MOBILE = CONSTANTS.IS_BROWSER && (window.screen.availWidth < 400 || window.screen.availHeight < 400) ;
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
		
		CONSTANTS.IS_OPERA = CONSTANTS.IS_BROWSER ? !! CONSTANTS.GLOBAL_OBJECT.opera : false ;
		
	//-- Package Management
		
		CONSTANTS.PACKAGE_ANNOTATION = '/*@' ;
		CONSTANTS.PACKAGE_ANNOTATION_PACKAGE = 'package' ;
		CONSTANTS.PACKAGE_ANNOTATION_REQUIRE = 'require' ;
		CONSTANTS.PACKAGE_ANNOTATION_PROVIDE = 'provide' ;
		
	//-- Object Definitions

		CONSTANTS.CONSTRUCTOR_TYPE_ABSTRACT = 'abstract' ;
		CONSTANTS.CONSTRUCTOR_TYPE_FACTORY = 'factory' ;
		CONSTANTS.CONSTRUCTOR_TYPE_SINGLETON = 'singleton' ;
		/**A list of reserved property names for object definitions.*/
		CONSTANTS.RESERVED = ['name', 'prototype', 'super', 'reflect', 'constructor'] ;
		
	//-- Literals
	
	//--- ...

		CONSTANTS.LITERAL_BLOCK_COMMENT_BEGIN = '/*' ;
		CONSTANTS.LITERAL_BLOCK_COMMENT_END = '*/' ;
		CONSTANTS.LITERAL_EMPTY = '' ;
		CONSTANTS.LITERAL_TRUE = 'true' ;
		CONSTANTS.LITERAL_FALSE = 'false',
		CONSTANTS.LITERAL_NULL = 'null' ;
		CONSTANTS.LITERAL_UNDEFINED = 'undefined' ;
		
	//--- Type Strings

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

	//--- Characters

		CONSTANTS.CHARACTERS = {
				ESCAPE: '\\',
				SPACE: ' ',
				SINGLE_QUOTE: '\'',
				DOUBLE_QUOTE: '"',
				DOT: '.',
				COLOR: ';',
				COMMA: ',',
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
		
	//-- Matchers
		
		CONSTANTS.MATCHERS = {
				WHITESPACE_TRIM: /^\s+|\s+$/g
		} ;
		
	// Hidden Utility Functions

		/*@note: These functions contain potentially unsafe operations -- such as use of `eval`, reflective calls to core type functions, asnychronous callback chaining, etc. -- and must be used with caution. For this reason, they are not accessible directly.
		* The implementation of the functions is intended to be as low level as possible so that they may be performance optimized by interpreters: they should therefore only use basic JavaScript (with the exception of the functions themselves).
		*/
		
		function enqueue(id, callback, priority, asynchronous)
		{
		
			// variables
			
			var b,
				head, link, o ;
			
			//
console.log('') ;
console.log('::enqueue (id="%s", priority="%s", asynchronous="%s")', id, priority, asynchronous) ;
/*
				/*Try to find the head of the task for the given id or create it.*/
				
				arraySome(QUEUE, function(link) { if(link.id === id) { head = link ; return true ; } }) ;

				/*Create a link to add to the chain.*/
				
				o = {id: id, callback: callback, priority: priority || false, asynchronous: asynchronous || false, process_id: id + ':' + createID( )};
//o.process_id = id + ':' + createID( ) ;
				if(typeof head === CONSTANTS.LITERAL_UNDEFINED)
				{
				
						/*Create a head element for this task pointing back at itself and add it to the chain.*/

						QUEUE[QUEUE.length] = o.previous = o.next = o ;
						
				}
				else
				{
						
						link = head ;
				
						/*If the given callback is prioritized, make it the new head; otherwise append it.*/

						if(priority)
						{
						
								o.previous = head.previous, o.next = head.next ;
								head.previous.next = o, head.previous = o ;
								
								QUEUE[index] = o ;
								
						}
						else
						{
				
								o.previous = head.previous, o.next = head ;
								head.previous.next = o, head.previous = o ;
								
						}

				}
				
arrayEach(QUEUE, function(head, index) {
		var link = head, i = -1 ;
console.log('\ttask-#%s (id="%s")', index, head.id) ;
		do {
console.log('\t\tprocess-#%s: priority=%s, asynchronous=%s', ++i, link.priority, link.asynchronous) ;
if(link.previous.next.process_id !== link.process_id) throw new Error('Invalid enchainment: invalid `next`pointer on predecessor: "' + link.previous.next.process_id + '".') ;
if(link.next.previous.process_id !== link.process_id) throw new Error('Invalid enchainment: invalid `previous` pointer on successor "' + link.next.previous.process_id + '".') ;
if(i > 10) throw new Error('Faulty break condition') ;
		}
		while((link = link.next).process_id !== head.process_id) ;
}) ;

		}

		function dequeue(id, force)
		{
console.log('') ;
console.log('::dequeue (id="%s", force=%s)', id, force) ;
			// variables
			
			var link,
				index = 0,
				o,
				f ;
				
			//
			
				/*For a dequeue call with unspecified id, dequeue the head of the first element in the queue---if it exists.*/
				
				if(typeof id === CONSTANTS.LITERAL_UNDEFINED) link = QUEUE[index] ;
				else arraySome(QUEUE, function(o, i) { if(o.id === id) { link = o, index = i ; return true ; } }) ;
				
				if(typeof link !== CONSTANTS.LITERAL_UNDEFINED)
				{
					
						/*Only dequeue if the head element for this task chain is either synchronous or is asynchronous and the forced dequeue flag was raised.*/
						
						if(! (b = link.asynchronous) || b && force)
						{
console.log('\thead-element: %s', link.process_id) ;
								
								/*Dechain the link; and either replace the old head it with its successor in the queue or remove the queue element if there is no other successor.*/

								link.previous.next = link.next ;
								link.next.previous = link.previous ;

								/*Replace the old head with its successor in the task chain---if it exists; otherwise, remove the task head from the queue.*/
								if((o = link.next).process_id !== link.process_id) QUEUE[index] = o ;
								else QUEUE.splice(index, 1) ;
arrayEach(QUEUE, function(head, index) {
var link = head, i = -1 ;
console.log('\ttask-#%s (id="%s")', index, head.id) ;
do {
console.log('\t\tprocess-#%s: process-id="%s", priority=%s, asynchronous=%s, (previous="%s", next="%s")', ++i, link.process_id, link.priority, link.asynchronous, link.previous.process_id, link.next.process_id) ;
if(link.previous.next.process_id !== link.process_id) throw new Error('Invalid enchainment: invalid `next`pointer on predecessor: "' + link.previous.next.process_id + '".') ;
if(link.next.previous.process_id !== link.process_id) throw new Error('Invalid enchainment: invalid `previous` pointer on successor "' + link.next.previous.process_id + '".') ;
if(i > 10) throw new Error('Faulty break condition') ;
}
while((link = link.next).process_id !== head.process_id) ;
}) ;

								/*Execute the calback for the removed element.*/
							
								if((f = link.callback) !== null) f.call(null, link.id) ;

						}
						else if(b && typeof force !== CONSTANTS.LITERAL_UNDEFINED) throw new Error('Inconsistent dequeue: unforced dequeue for asynchronous callback.') ;
					
//						dequeue(link.id) ;
//						if(! link.asynchronous) dequeue(id) ;

						
				}
		
		}
				
		function createID( )
		{
		
			// variables
			
			var i, s ;
			
			//
		
				if((i = Date.now( )) === DATE) { COUNTER++ ; }
				else { DATE = i ; COUNTER = 0 ; }

				s = i + "-" + COUNTER ;

			// return
			
			return s ;

		}

		function stringQuote(string)
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

		}
		
		function stringTrim(string)
		{
		
			//
			
				CONSTANTS.MATCHERS.WHITESPACE_TRIM.lastIndex = 0 ;
				
				return string.replace(CONSTANTS.MATCHERS.WHITESPACE_TRIM, CONSTANTS.LITERAL_EMPTY) ;

		}
		
		function stringTokenize(string, delimiter)
		{
		
			// variables
			
			var a = [],
				index = 0, last= 0, i = delimiter.length ;
			
			//
			
				while((index = string.indexOf(delimiter, last)) !== -1)
				{
				
						if(index > last) a[a.length] = string.substring(last, index) ;
						
						last = index + i ;
				
				}
				
				i = string.length ;

				if(last < i - 1) a[a.length] = string.substring(last, i) ;
			
			// return
			
			return a ;
		
		}
		
		function stringFormat(string/*, substitute...*/)
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
			
		}
		
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
		function arrayEach(array, callback, context)
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

		}
		
		/**
		* Iterate over the elements of an Array executing the given callback fixing---if specified---the context to the given object.
		*
		* The callback is executed for each element in the array passing the value, its index and this array just like in `Array.prototype.forEeach`. Unlike `Array.prototype.forEach` this function will immediately return with a true value upon the first true value returned by the passed callback and otherwise will return false.
		*
		* @implementation The implementation follows the ECMAScript language specification version 5 and up.
		* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
		*
		* @param array (Array) The array to be iterated over.
		* @param callback (Function) A callback function to be called for each element in the Array; the callback receives---in this order---the value, its index and the array itself via arguments.
		* @context (Object) A context object; if specified, the callback function is executed within the context of the given object, i.e. the dynamic reference `this` will refer to the object.
		* @return (Boolean) True, if the callback returned true once; false, if the callback never returned true.
		*/

		function arraySome(array, callback, context)
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
		
		}
		
		/**
		* Copy a range of a given array starting at the given index.
		*/
		function arrayCopy(array, start)
		{
				return Array.prototype.slice.call(array, start) ;
		}

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
		function arrayContains(array, value, start, end)
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
		
		}

		/**
		* Copies the given function with all its properties (including the ''prototype'' property).
		* @return A copy of the given function.
		*/
		function functionCopy(original)
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
		
		}
		
	// Object functions
	
		function objectDefineProperty(object, property, specification)
		{

			//
/*@todo: getter/setter where possible.*/
				object[property] = specification.value ;

		}
		
		function objectEach(object, callback, context)
		{
		
			// variables
			
			var a ;
			
			//
			
				a = [,,object] ;
			
				for(var key in object)
						if(object.hasOwnProperty(key))
						{
						
								a[0] = object[key], a[1] = key ;
						
								callback.apply(context, a) ;
								
						}

		}
		
		/**
		*/
		function objectResolveNamespace(namespace, target)
		{
// console.log('::objectResolveNamespace ("%s")', namespace) ;

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

								try
								{
										if(typeof (o = o[s]) === CONSTANTS.LITERAL_UNDEFINED) return ;
								}
								catch(error) { return ; }
								
								previous = index + 1 ;
								
						}
				
				}
				
				s = namespace.substring(previous, namespace.length) ;

				o = o[s] ;

			// return
			
			return o ;
		
		}

		/**
		* Create a namespace for the given namespace identifier string on the given target.
		*
		* Namespace identifier strings are simple identifier sequences delimited by a dot (e.g. 'a.b.c.d'). This method automatically creates a property if the value for a key is undefined; it will travel along existing object properties but will break on null values.
		*
		* @return The host of the object for the given namespace or undefined if the namespace creation failed.
		*/
		function objectCreateNamespace(namespace, target)
		{
		
			// variables

			var o = target,
				index = 0, previous = 0,
				s ;
			
			//

				while((index = namespace.indexOf('.', previous)) !== -1)
				{

						/*Return early if `previous` equals `index - 1` (substring is empty string): in this case the namespace string contains an invalid sequence `'..'`.*/

						if((s = namespace.substring(previous, index)) === '') return ;
						else {

								if(typeof o === 'object')
								{

										try
										{

												/*Add a nested object on undefined values; continue with existing property if not null.*/

												if(typeof o[s] === CONSTANTS.LITERAL_UNDEFINED) o = o[s] = { } ;
												else if(o[s] !== null) o = o[s] ;
												else return ;
												
										}
										catch(error) { return ; }
										
										previous = index + 1 ;
										
								}
								
						}
				
				}
				
				s = namespace.substring(previous, namespace.length) ;

				try {
						if(typeof o[s] === CONSTANTS.LITERAL_UNDEFINED) o[s] = { } ;
				}
				catch(error) { return ; }

			// return
			
			return o ;
		
		}
		
		/**
		*@link https://bugzilla.mozilla.org/show_bug.cgi?id=647484
		*/
/*@deprecated*/
		function objectExtend(object, specification)
		{
throw 'Deprecated' ;
			// variables
			
			var o,
				f ;

			//

				if(typeof Object.defineProperty !== CONSTANTS.LITERAL_UNDEFINED)
				{
				
						o = {value: specification.value, writable: specification.writable, configurable: specification.configurable, enumerable: specification.enumerable} ;
						
						if((specification.get || specification.set) && (writable === true || typeof value !== CONSTANTS.LITERAL_UNDEFINED)) throw new Error('Invalid property description: specifying getter or setter is incompatible with specifying `writable` as `true` or a non-undefined `value` property.') ;
						
						if((f = o.get)) o.get = f ;
						if((f = o.set)) o.set = f ;
				
						Object.defineProperty(
								object,
								specification.property,
								o
						) ;
						
				}
				else object[specification.property] = specification.value ;
				
			// return
			
			return object ;

		}

		function objectPrint(object)
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
				
		}

		/**
		* Define an object constructor.
		*
		* This method does not test for existing definitions and consequently will override existing ones. Use with care.
		*
		* @return (Function) The constructor for the defined object.
		*/
		function objectDefine(namespace, name, definition)
		{

			// variables

			var constructor,
				identifier,
				f,
				s,
				i,
				a,
				o ;
			
			//
			
				s = namespace + '.' + name ;

				/*Create the constructor function.*/
/*@todo: re-evaluate the necessity of a hidden `id` value to safely distinguish between object instances; the `===` operator may already do that.*/
				constructor = (new Function('return function ' + name + '(){if(!Meta.instanceOf(' + s + ', this)){throw new Error("Invalid call to constructor without keyword `new` (identifier=\\"' + s + '\\").");}if(arguments.length>0){if(this.constructor.reflect.type===Meta.constant("CONSTRUCTOR_TYPE_ABSTRACT")){throw new Error("Invalid call to constructor of abstract object (object-identifier=\\"" + this.constructor.reflect.identifier + "\\")");}var f ; if((f=this.constructor.reflect.main)){f.apply(this, arguments);}}}'))
				.call(null) ;
				constructor.reflect = {name: s, package: namespace, identifier: s, type: definition.type, extend: definition.extend, main: definition.main,  prototype: null, global: [ ], local: [ ]} ;
				
				/*The main method must specify a non-empty formal parameter list in order to safely discriminate between instantiations for use as a prototype Object and regular instantiations.*/

				if(!! (f = definition.main))
						if(f.length === 0) throw Error('Invalid main method. Formal parameter list may not be empty (object-identifier="' + constructor.reflect.identifier + '").') ;
						
				/*Create an instance of the prototype object and reference its global properties.*/

				if(typeof (s = definition.extend) !== CONSTANTS.LITERAL_UNDEFINED) objectDefinePrototype(constructor, s, definition) ;

				constructor.prototype.constructor = constructor ;

				/*Put global properties on the constructor function.*/
/*@todo: refactor to `objectDefineGlobal`*/
				if(typeof (o = definition.global) !== CONSTANTS.LITERAL_UNDEFINED)
				{
						
						a = constructor.reflect.global ;

						objectEach(o, function(value, key) {
						
								if(arrayContains(CONSTANTS.RESERVED, key, 0, CONSTANTS.RESERVED.length) !== -1) throw new Error('Invalid use of reserved property name (name="' + key + '", identifier="' + constructor.reflect.identifier + '")') ;
								
								constructor[key] = value ;
								a[a.length] = key ;

						}) ;
//console.log('\tconstructor-properties: %s', a) ;
				}

				if(typeof (o = definition.local) !== CONSTANTS.LITERAL_UNDEFINED) objectDefineLocalProperties(constructor, o) ;

			// return
			
			return constructor ;

		}
		
		/**
		* @param constructor (Function)
		* @param identifier (String)
		* @param definition (Object)
		*/
		function objectDefinePrototype(constructor, identifier, definition)
		{

			// variables
			
			var o,
				prototype,
				f,
				s,
				a ;
			
			//
			
				o = constructor.reflect ;

				/*Use the constructor function to create a new instance.*/

				if(! (prototype = objectResolveNamespace(identifier, CONSTANTS.GLOBAL_OBJECT))) Meta.error('Prototype object has not been defined (identifier="%s", object-identifier="%s")', identifier, constructor.reflect.identifier) ;

				/*Reflect the prototype constructor.*/
				
				o.prototype = prototype instanceof Function ? prototype : prototype.constructor ;

				/*Create an instance of the prototype object to extend.*/

				constructor.prototype = prototype instanceof Function ? new prototype( ) : new prototype.constructor( ) ;
						
				/*Reference the main function if it exists on the prototype constructor but not on the defined object.*/
				
				if(typeof (f = o.main) === CONSTANTS.LITERAL_UNDEFINED) f = o.prototype.reflect.main ;
				
				o.main = f ;
				
				/*Copy local key identifiers of the prototype.*/
				
				f = o.prototype ;

				o.local = arrayCopy(f.reflect.local, 0) ;

				/*Reference global properties of the prototype unless they override global properties specified witin the definition.*/
				
				o = definition.global = definition.global || { } ;
				
				if((a = f.reflect.global)) arrayEach(a, function(property) { if(typeof o[property] === CONSTANTS.LITERAL_UNDEFINED) o[property] = f[property] ; }) ;

		}
		
		function objectDefineLocalProperties(constructor, local)
		{

			// variables
			
			var a ;

			//
/*todo: assure that object definitions which extend abstract constructor types either are themselves abstract or implement abstract functions.*/
				/*Reflect the constructor on the prototype property. This is required for correct type detection.*/

				constructor.prototype.constructor = constructor ;
		
				/*
				* Create the `super` property which contains overriden properties of the prototype object.
				* @note The reserved keyword `super` may be used as property name but not as a variable identifier.
				* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Reserved_Words#Reserved_word_usage
				*/

				constructor.prototype.super = { } ;
				
				a = constructor.reflect.local ;
	
				objectEach(local, function(value, key) {
				
					// variables
					
					var o ;
					
					//
				
						if(arrayContains(CONSTANTS.RESERVED, key, 0, CONSTANTS.RESERVED.length) !== -1) throw new Error('Invalid use of reserved property name (name="' + key + '")') ;
						
						/*Add overriden local properties to the `super` property.*/
						
						if(typeof ( o = constructor.prototype[key]) !== CONSTANTS.LITERAL_UNDEFINED) constructor.prototype.super[key] = o ;
						
						constructor.prototype[key] = value ;
						
						if(arrayContains(a, key, 0, a.length) === -1) a[a.length] = key ;

				}) ;

		}
		
		/**
		* Require the object identified by the given identifier string.
		*
		* @pre The object for the given identifier must be defined.
		* @post The constructor for the object is initialized and the constructor---or object in case of a singleton type---is placed on the global object under its own name in the namespace identified by the package. The `REQUIRED` object reflects this by containing a reference to the constructor or object.
		* @param identifier (String) The string identifier of the object to require.
		* @return (Object) The initialized constructor for the object identified by the given identifier string or its instance (in case of a singleton type).
		**/
/*@deprecated: constructor initialization has been dropped*/
/*@todo: remove*/
		function objectUse(identifier, alias)
		{ throw new Error('Deprecated') ;
console.log('::objectUse ("%s")', identifier, alias) ;
			// variables
			
			var s,
				constructor,
				name,
				a,
				i,
				f,
				o,
				host ;
			
			//
			
				/*Return early if the object has already been required. Flag as used in order to prevent an infinite recursion loop (i.e. if this object requests use of an object which itself or whose own requested object use this object).*/
				
				if((s = ALIAS.TO_ID[alias]))
						if(s !== identifier) throw new Error('Alias is already defined (alias="' + alias + '", defined-for="' + s + '"')
						else return this ;
						
				/*Get the constructor of the object and use the object name as alias if not specified.*/
				
				if(! (constructor = objectResolveNamespace(identifier, CONSTANTS.GLOBAL_OBJECT))) throw new ReferenceError('Object is undefined (identifier="' + identifier + '"') ;
				
				s = alias || constructor.reflect.name ;
				
				ALIAS.TO_ID[s] = identifier ;
				ALIAS.FOR_ID[identifier] = s ;
			
				o = constructor.reflect ;
				
				/*Use objects requested by this object.*/
console.log('\tused-objects: %s', o.use) ;
				if((a = o.use))
				{
				
						i = a.length ;
						
						while(--i >= 0) objectUse(a[i]) ;

				}

				/*Queue the call to the constructor initializer since the dependencies may have not been resolved yet.*/

				enqueue(function(id) {

					// variables
					
					var host,
						name ;
				
						/*Call the constructor initializer with the constructor function as context---if defined.*/
						
						if((f = o.init)) f.call(f) ;
console.log('\thas-initializer: %s', !! f) ;						
						/*Create the namespace corresponding to the object's package on the global object.*/
						
						host = objectCreateNamespace(identifier, CONSTANTS.GLOBAL_OBJECT) ;
						name = o.name ;

						/*If the constructor type is `'singleton'`, immediately create an instance and replace the constructor with this instance on the global object; otherwise set the constructor to its namespace on the global object.*/

						if(o.type === CONSTANTS.CONSTRUCTOR_TYPE_SINGLETON) { o = host[name] = new constructor(null) ; }
						else o = host[name] = constructor ;

				}, false, true, '') ;

		}
		
		function packageRequire(identifier)
		{

			// variables
			
			var request,
				url,
				a ;

			//
//console.log('::packageRequire ("%s", %s)', identifier, Meta.typeOf(identifier)) ;
				/*Put a placeholder null value on the `PACKAGES` map in order to prevent redundant imports.*/
				
				PACKAGES[identifier] = null ;
				
				/*Request the package.*/

/*@note: this is a convention; a custom package -> url mapping function should be made optional.*/

				a = stringTokenize(identifier, CONSTANTS.CHARACTERS.DOT) ;

//s = CONSTANTS.LIBRARY_ROOT + '/' + identifier.replace(/[.]/g, '/') + '.js?' + Date.now( ) ;
				url = CONFIGURATION.LIBRARY_ROOT
				+ CONSTANTS.CHARACTERS.SLASH
				+ a.join(CONSTANTS.CHARACTERS.SLASH)
				+ CONSTANTS.CHARACTERS.SLASH
				+ a[a.length - 1] + '.js' ;

/*@todo: this needs a fork for non browser contexts.*/

				request = new CONSTANTS.DEFAULT_REQUEST( ) ;
				
				if(typeof request.overrideMimeType !== CONSTANTS.LITERAL_UNDEFINED) request.overrideMimeType('application/javascript') ;

				request.onreadystatechange = function onreadystatechange( )
				{
					
					// variables
					
					var parsed,
						definitions,
						s,
						a ;
					
					//

						if(request.readyState === 4)
/*@todo: there needs to be a rollback on error.*/
								if(request.status !== 200) { request.abort( ) ; Meta.error('Error requesting package: url="%s"', url) ; }
								else
								{

										/*Parse the package content from the source string and validate it.*/
										
										parsed = packageParse(identifier, request.responseText) ;

										if((s = parsed.package) !== identifier) throw new Error('Invalid package (requested="' + identifier + '", got="' + s + '")') ;
										if(! (a = parsed.provide)) throw new Error('Missing required annotation (name="' + CONSTANTS.PACKAGE_ANNOTATION_PROVIDE + '"') ;
										if(parsed.deprecated) throw new Error('Package has been deprecated (identifier="' + identifier + '")') ;

										PACKAGES[identifier] = a ;
										
										/*Recursively require packages.*/

										if((a = parsed.require)) arrayEach(a, function(value) { if(! (value in PACKAGES)) packageRequire(value) ; }) ;

										/*Try to parse the package content.*/

										try { definitions = new Function('return (' + parsed.source + ');').call(null) ; }
										catch(error) { Meta.error('Error parsing package (package="%s"): %s', identifier, Meta.print(error)) ; }

										/*Define the packages's objects.*/

										a = parsed.provide ;

										objectEach(definitions, function(definition, name) {
										
											// variables
											
											var f,
												o ;
											
											//

												if(a.indexOf(name) === -1) Meta.error('Package provides undeclared object (object-name="%s", package-identifier="%s")', name, identifier) ;

												f = objectDefine(identifier, name, definition) ;
												o = objectCreateNamespace(identifier + CONSTANTS.CHARACTERS.DOT + name, CONSTANTS.GLOBAL_OBJECT) ;
												
												/*If the constructor type is singleton, replace the constructor with an instance in order to conform to the singleton pattern.*/

												if(definition.type === CONSTANTS.CONSTRUCTOR_TYPE_SINGLETON) o[name] = new f(null) ;
												else o[name] = f ;

										}) ;

								}

				} ;
				request.open('GET', url, false) ;

				/*Flag as XMLHttpRequest.*/
				
				request.setRequestHeader('Content-Type', 'XMLHttp/1.0') ;
				request.setRequestHeader('X-Requested-With', 'XMLHttpRequest') ;

				request.send(null) ;

		}
		
		function packageParse(identifier, source)
		{
		
			// variables
			
			var parsed = { },
				i,
				s ;
				
			//

				/*Parse annotations.*/
				
//				parsed = packageParseAnnotations(identifier, source) ;
				
				if(source.indexOf(CONSTANTS.LITERAL_BLOCK_COMMENT_BEGIN) !== 0) throw new Error('Invalid package annotation. Leading string must be empty (identifier="' + identifier + '").') ;
				if((i = source.indexOf(CONSTANTS.LITERAL_BLOCK_COMMENT_END, 2)) === -1) throw new Error('Invalid package annotation. Unterminated comment block (identifier="' + identifier + '")') ;
				
				s = source.substring(2, i) ;

				arrayEach(
						stringTokenize(stringTrim(s), '@'),
						function(value, index) {
						
							// variables
							
							var a ;
							
							//

								i = value.indexOf(' ') ;
								a = stringTokenize(value.substring(i, value.length), ',') ;
								
								switch((s = value.substring(0, i)))
								{
										case CONSTANTS.PACKAGE_ANNOTATION_PACKAGE: parsed[s] = stringTrim(a[0]) ; break ;
										default:
										{
										
												parsed[s] = a ;
												arrayEach(a, function(value, index, array) { array[index] = stringTrim(value) ; }) ;
											
										}
								}

						}
				) ;

				parsed.source = source ;

			// return
			
			return parsed ;

		}
		
		function packageParseAnnotations(identifier, source)
		{ throw 'deprecated' ;

			// variables
			
			var parsed = { },
				i,
				s,
				a ;
				
			//
				
				if(source.indexOf(CONSTANTS.LITERAL_BLOCK_COMMENT_BEGIN) !== 0) throw new Error('Invalid package annotation. Leading string must be empty (identifier="' + identifier + '").') ;
				if((i = source.indexOf(CONSTANTS.LITERAL_BLOCK_COMMENT_END, 2)) === -1) throw new Error('Invalid package annotation. Unterminated comment block (identifier="' + identifier + '")') ;
				
				s = source.substring(2, i) ;

				arrayEach(
						stringTokenize(stringTrim(s), '@'),
						function(value, index) {

								i = value.indexOf(' ') ;
								a = stringTokenize(value.substring(i, value.length), ',') ;
								
								switch((s = value.substring(0, i)))
								{
										case CONSTANTS.PACKAGE_ANNOTATION_PACKAGE: parsed[s] = stringTrim(a[0]) ; break ;
										default:
										{
										
												parsed[s] = a ;
												arrayEach(a, function(value, index, array) { array[index] = stringTrim(value) ; }) ;
											
										}
								}

						}
				) ;

			// return
			
			return parsed ;

		}
	
	// Native object extensions
	//
	// Extend native Object prototypes in order to bring them up to the latest ECMAScript standard and/or the Mozilla standard (where possible).
	// All functions which potentially extend the standard are moved to the Meta object in order to avoid interference with other libraries.
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
		
		if(typeof Function.prototype.bind === CONSTANTS.LITERAL_UNDEFINED || CONFIGURATION.RUNNING_MODE === CONFIGURATION.RUNNING_MODES.DEBUG)
				Object.defineProperty(
						Function.prototype,
						'bind',
						{
								value: function bind(context/*, argument...*/)
								{

									// variables
									
									var bound, f,
										a ;
									
									//
									
										f = this ;
										
										if(arguments.length > 1)
										{
										
												a = arrayCopy(arguments, 1) ;
												bound = function( ) { return f.apply(context, a.concat(Array.prototype.slice.call(arguments, 0))) ; } ;
										
										}
										else bound = function( ) { return f.apply(context, arguments) ; } ;
												
									// return
									
									return bound ;

								
								}
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
								*
								* @link arrayEach
								*/
								value: function forEach(callback, context)
								{

									//
									
										arrayEach(this, callback, context) ;

								},
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
								* Iterate over the elements of an Array executing the given callback and breaking iteration if the callback returns false.
								*
								* The callback is executed for each element in the array passing the value, its index and this array just like in `Array.prototype.forEeach`. Unlike `Array.prototype.forEach` this function will immediately return with a false value upon the first false value returned by the passed callback and otherwise will return true.
								*
								* @implementation The implementation follows the ECMAScript language specification version 5 and up.
								* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
								*
								* @param callback (Function) A callback function to be called for each element in the Array; the callback receives---in this order---the value, its index and the array itself via arguments.
								* @context (Object) A context object; if specified, the callback function is executed within the context of the given object, i.e. the dynamic reference `this` will refer to the object.
								* @return (Boolean) True, if the callback never returned false; false, if the callback returned false once.
								*/
								value: function every(callback, context)
								{
								
									//
									
										for(var i1 = -1, i2 = this.length ; ++i1 < i2 ; )
												if(callback.apply(context, [this[i1], i1, this]) === false) return false ;
											
									// retrun
									
									return true ;

								},
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
								value: function some(callback, context)
								{
								
									//
									
										return arraySome(this, callback, context) ;
								
								},
								configurable: true,
								writable: true,
								enumerable: false
						}
				) ;
/*
		if(! isSet('equals', Array.prototype))
				/**
				* Tests the host array for equality with the given object using the given comparator function or the strict equality operator.
				*
				* A comparator must be a callback as specified in `Array.prototype.every` that returns a boolean value. If the comparator returns false once, the array is not equal to the given object (in case it is an array as well).
				*
				* @param object (Object) An object to compare this array to for equality.
				* @param comparator [optional] (Function) A comparator function.
				*
				* @return (Boolean) True, if the given object is an array with same size as this array and every element is equal to every element within this array as specified by the given comparator or the strict equality operator; false, otherwise.
				*
				Array.prototype.equals = function equals(object, comparator)
				{
					
					// variables
					
					var f ;
					
					//
					
						if(object instanceof Array)
						{
						
								if(this.length < object.length) return false ;
								else {
								
										if(this.isFunction(comparator)) f = comparator ;
										else f = function(value, index) { return value === object[index] ; }

										return this.every(f) ;
										
								}

						}

					// return
					
					return false ;
				
				} ;
*/
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

/*
		if(! isSet('isUpperCase', String.prototype))
				/**
				* @note the strict equality operator `===` cannot be used here as `toLocaleUpperCase` returns a different String Object.
				* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators
				/
				String.prototype.isUpperCase = function isUpperCase( ) { return isSet('toLocaleUpperCase', this) ? this.toLocaleUpperCase( ) == this : this.toUpperCase( ) == this ; }

		if(! isSet('isLowerCase', String.prototype))
				/**
				* @note the strict equality operator `===` cannot be used here as `toLocaleLowerCase` returns a different String Object.
				* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators
				/
				String.prototype.isLowerCase = function isLowerCase( ) { return isSet('toLocaleLowerCase', this) ? this.toLocaleLowerCase( ) == this : this.toLowerCase( ) == this ; }
				
		if(! isSet('format', String.prototype))
				/**
				* @implementation The host string is tokenized using the percentage sign `'%'` as token delimiter to avoid using regular expressions.
				/
				String.prototype.format = function format(substitute_1/*, ..., substitute_n*)
				{
					return stringFormat.apply(null, [this].concat(arrayCopy(arguments))) ;
				}

		if(! isSet('quote', String.prototype))
				String.prototype.quote = function( )
				{
						return stringQuote(this) ;
				} ;
*/

	// Define Meta
	
	var Meta ;
	
		/**
		* The `Meta` function.
		*
		* This function adds potentially namespaced Objects (e.g. 'a.b.c.d.E') under short names (e.g. 'E') to the local scope of the callback by passing them as arguments.
		* In order to do that, this function expects a callback with a non-empty formal parameter list. The formal parameter list is parsed in order to match the declared names with objects in the library. When invoking the callback, the objects matching the names are passed to it in the defined order as arguments. The scope of the callback then contains short name references to the objects matching the declared names.
		*
		* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope
		*
		* @param (Function) callback The callback to be executed.
		*/
		Meta = function Meta(callback)
		{

			// variables
			
			var a1, a2,
				s,
				i,
				f ;
			
			//

				/*Parse the formal parameter list specified while creating the the callback function.*/

				s = callback.toString( ) ;
				i = s.indexOf('(') ;
				a1 = stringTokenize(s.substring(i + 1, s.indexOf(')', i)), ',') ;

				a2 = [ ] ;

				arrayEach(a1, function(alias, index) {
					
					// variables
					
					var s ;
					
					//
					
						s = stringTrim(alias) ;

						if((s = ALIAS.TO_ID[s])) a2[a2.length] = objectResolveNamespace(s, CONSTANTS.GLOBAL_OBJECT) ;
						else throw new Error('Undefined alias (alias="' + alias + '")') ;

				}) ;

				callback.apply(null, a2) ;

		} ;
		
		Meta.require = function require(identifier/*, ..., identifier*/)
		{

			//

				arrayEach(arguments, function(value) {
						if(! (value in PACKAGES)) packageRequire(value) ;
				}) ;
/*
				i = arguments.length ;

				while(--i >= 0)
				{
				
						s = arguments[i] ;
console.log('\trequire-package: "%s"', s) ;
						if(! (s in PACKAGES))
						{
						
								/*Flag the package as required in order to prevent redundant imports.*
								
								PACKAGES[s] = true ;
						
								enqueue(function( ) { packageRequire(s) ; }, true, true) ;
								
						}

				}
*/
			// return
			
			return this ;
		
		} ;

		/**
		* A proxy for `objectUse`.
		* @deprecated: this does the wrong thing.
		*/
		Meta.use = function use(identifier, alias)
		{ 		
console.log('Meta::use("%s", "%s")', identifier, alias) ;
			// variables
			
			var i,
				s1, s2,
				a ;

			//

				/*Parse the package identifier.*/
				
				if((i = identifier.lastIndexOf('.')) === -1) throw new Error('Invalid identifier (identifier="' + identifier + '")') ;
				
				s1 = identifier.substring(0, i) ;
				
				/*...*/
				
				if(typeof (a = PACKAGES[s1]) === CONSTANTS.LITERAL_UNDEFINED) throw new ReferenceError('Package is undefined (package-identifier="' + s + '")') ;

				if((s2 = identifier.substring(i + 1)) === CONSTANTS.CHARACTERS.ASTERISK) arrayEach(a, function(value, index) { var s = s1 + '.' + value ; ALIAS.TO_ID[value] = s ; ALIAS.FOR_ID[s] = value ; }) ;
				else ALIAS.TO_ID[s2] = identifier, ALIAS.FOR_ID[identifier] = s2 ;

			// return
							
			return this ;
		
		} ;

		Meta.define = function define(definition)
		{

			// preconditions

				if(typeof definition.package === CONSTANTS.LITERAL_UNDEFINED) throw new ReferenceError('Invalid object definition. Missing required property "package".') ;
				if(typeof definition.name === CONSTANTS.LITERAL_UNDEFINED) throw new ReferenceError('Invalid object definition. Missing required property "name".') ;
			
			// variables
			
			var o,
				f,
				s ;

			//
			
				o = objectCreateNamespace(definition.package + '.' + definition.name, CONSTANTS.GLOBAL_OBJECT) ;

				/*Add the object to the library. In case of a singleton constructor type replace the constructor with its instance.*/
				
				f = objectDefine(definition.package, (s = definition.name), definition) ;
				
				if(definition.type === CONSTANTS.CONSTRUCTOR_TYPE_SINGLETON) o[s] = new f( ) ;
				else o[s] = f ;

			// return
			
			return this ;

		} ;

	// Type identification utility functions.

		/**
		* The MS implementation of the strict equality operator will fail if an undeclared reference is evaluated; using `typeof` will work cross-browser)
		* @link http://msdn.microsoft.com/en-us/library/259s7zc1(v=vs.94).aspx
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Meta.isVoid = function isVoid(object)
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
		Meta.isSet = function isSet(key, object)
		{
				try { return ! this.isVoid(object[key]) ; }
				catch(e) { return false ; }
		} ;
		/**
		* Test whether the given Object is a null value.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Meta.isNull = function isNull(object)
		{
			return object === null ;
		} ;
		/**
		* Test whether the given Object is an instance of Boolean.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Meta.isBoolean = function isBoolean(object)
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
		Meta.isNumber = function isNumber(object)
		{
			return typeof object === 'number' ? isNaN(object) ? false : true : false ;
		} ;
		/**
		* Test whether the given Object is an instance of Number for an integer value.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Meta.isInteger = function isInteger(object)
		{

			//

				if(this.isNumber(object)) return (object % 1) === 0 ;

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
		Meta.isFloat = function isFloat(object)
		{
		
			//
			
				if(this.isNumber(object)) return (object % 1) !== 0 ;
				else { return false ; }

		} ;
		/**
		* Test whether the given Object is an instance of String
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Meta.isString = function isString(object)
		{
			return typeof object === 'string' ;
		} ;
		/*
		* Test whether the given object is an instance of Object.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Meta.isObject = function isObject(object)
		{
			return typeof object === 'object' ? Object.prototype.toString.call(object) ===	CONSTANTS.OBJECT_TAG : false ;
		} ;
		/*
		* Test whether the given object is an instance of Function.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Meta.isFunction = function isFunction(object)
		{
			return typeof object === 'function' ? Object.prototype.toString.call(object) === CONSTANTS.FUNCTION_TAG : false ;
		} ;
		/*
		* Test whether the given object is an instance of Array.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Meta.isArray = function isArray(object)
		{
			return object instanceof Array ;
		} ;
		/*
		* Test whether the given object is an instance of Date.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Meta.isDate = function isDate(object)
		{
			return this.instanceOf(Date, object) ;
		} ;
		/*
		* Test whether the given object is an instance of RegExp.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Meta.isRegExp = function isRegExp(object)
		{
			return this.instanceOf(RegExp, object) ;
		} ;
		/*
		* Test whether the given object is an instance of Error.
		*
		* @param (Object) object An Object.
		* @return Boolean
		*/
		Meta.isError = function isError(object)
		{
			return this.instanceOf(Error, object) ;
		} ;
		/*
		* Test whether the given object is a node type. 
		*
		* In case the DOM implementation does not provide a (public) `Node` constructor function, the type test is applied using using duck typing for the `.nodeName` and `.nodeType` attributes of the given object.
		*
		* @param (Object) object An object.
		* @return Boolean
		*/
		Meta.isNode = function isNode(object)
		{
			return typeof Node === 'function' ?
						object instanceof Node :
						typeof Node === typeof object && ! Meta.isObject(object) && Meta.isString(object.nodeName) && Meta.isInteger(object.nodeType) ;
		} ;
		/*
		* Test whether the given Object is the Window Object.
		*
		* @param (Object) object An object.
		* @return Boolean
		*/
		Meta.isWindow = function isWindow(object)
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
		Meta.typeOf = function typeOf(object)
		{

			// variables

			var s ;

			//

				/* First things first, exclude `null` and `undefined`.*/

				if(this.isVoid(object)) { return CONSTANTS.TYPE_VOID ; }
				else if(this.isNull(object)) { return CONSTANTS.TYPE_NULL ; }
				else {

						if(this.isFunction(object) ) { return CONSTANTS.TYPE_FUNCTION ; }
						else if(this.isBoolean(object)) { return CONSTANTS.TYPE_BOOLEAN ; }
						else if(this.isNumber(object)) { return this.isFloat(object) ? CONSTANTS.TYPE_FLOAT : CONSTANTS.TYPE_INTEGER ; }
						else if(this.isString(object)) { return CONSTANTS.TYPE_STRING ; }
						else if(this.isDate(object)) { return CONSTANTS.TYPE_DATE ; }
						else if(this.isRegExp(object)) { return CONSTANTS.TYPE_REGEXP ; }
						else if(this.isError(object)) { return CONSTANTS.TYPE_ERROR ; }
						else if(this.isNode(object)) { return CONSTANTS.TYPE_NODE ; }
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
		* Return a `Boolean` value indicating whether the Object referenced by `b` has a sub-type or same type relation to the object referenced by `a`. 
		*
		* This function builds upon the functionality of the `instanceof` operator. If `a` is an object, then `b` is compared to `a`'s constructor; in any other case the objects are directly compared. 
		* The `instanceof` operator returns true if and only if `o instanceof f` satifies the following conditions: (1) `o` is an Object; (2) `f` is a Function; (3) the creation of `o` involves a call to `f` somewhere in the prototype chain (`f` may also be the constructor).
		* In any case `b` must be an Object instance, not a Function.
		* @implementation We do not directly test for `.isFunction(a)` because (at least) Safari implements the constructors of some core types (e.g. `NodeList`) as something else than `Function` sub-types. This makes this function return the wrong result in a test like `Meta.instanceOf(nodes, NodeList)` (where `nodes` is a `NodeList` instance).
		* @param a (Object, Function) A potential super-type constructor or super-type instance.
		* @param b (Object) A potential sub-type instance.
		* @return (Boolean) True, if `a` is a super-type of `b`
		*/
		Meta.instanceOf = function instanceOf(a, b)
		{

			//
				
				if(this.isObject(a)) { return b instanceof a.constructor ; }
				else return b instanceof a ;
				
			//
			
			return false ;						
				
		} ;
		
	// Logging and code flow utility functions.

		Meta.log = function log(object/*, substitute...*/)
		{

			// variables

			var	s ;

			// 

				if(this.isSet('console', CONSTANTS.GLOBAL_OBJECT))
				{
				
						if(this.isString(object)) { console.log.apply(null, arguments) ; return ; }
						
						if(this.instanceOf(Error, object)) {
				
								s = objectPrint(object) ;
								
								if(object.stack) { s += '\n' + object.stack ; }
								
						}
						else { s = objectPrint(object) ; }
						
						console.log(s) ;
				
				}


			// return

			return this ;

		} ;
		Meta.debug = function debug(identifier)
		{
		
				try {
						Meta.error(identifier) ;
				}
				catch(error) { Meta.log(error) ; }

		} ;
		/**
		* Throw a generic error. 
		*
		* String substitution for the error message applies.
		* 
		* @example `Meta.error("Invalid type for parameter: %s", Meta.typeOf(object));`
		*/
		Meta.error = function error(message/*, substitute...*/)
		{
		
			// variables
			
			var s ;
			
			//
			
				if(arguments.length > 1) s = stringFormat.apply(null, arguments) ;
				else s = message ;

				throw new Error(s) ;
				
		} ;
		/*
		* A convenience method which throws a generic error passing the given error message if the result of evaluating the assertion expression (passed as the first argument) is negative.
		*
		* String substitution for the error message applies.
		*
		* @example `Meta.assert(i < 100, "Limit exceeded (limit=%s).", i)`;
		* @param assertion (Boolean) The result of evaluating an assertion expression.
		* @param message (String) The error message to be thrown if the assertion expression evaluated to `false`.
		* @param substitute (Object...) A varying number of elements used to format the error message.
		* @return (this)
		*/
		Meta.assert = function assert(assertion, message/*, substitute...*/)
		{
		
			// variables
			
			var s ;
			
			//

				if(! assertion)
				{
				
						if(arguments.length > 2) s = stringFormat(message, Array.prototype.slice.call(arguments, 2)) ;
						else s = message ;
						
						throw new Error(s) ;
						
				}
				
			// return
			
			return this ;

		} ;
			
	// Object utility functions.
	
		Meta.print = function print(object, options)
		{
		
			// variables
			
			var s,
				b,
				i ;
			
			//

				s = objectPrint(object) ;

				if(! options || (options && (! this.isNumber(options.depth) || --options.depth >=0)))
				{
				
						if(s === CONSTANTS.OBJECT_TAG)
						{

								s = '' ;
								
								objectEach(object, function(value, key) { s += (s === '' ? '' : ', ') + key + '=' + this.print(value, options) ; }, this) ;
								
								s = '{' + s + '}' ;
								
						}
						else if(s === CONSTANTS.ARRAY_TAG)
						{

								s = '' ;
								
								arrayEach(object, function(value, index) { s += (index > 0 ? ', ' : '') + this.print(value, options) ; }, this) ;
								
								s = '[' + s + ']' ;
							
						}
						
				}
				
				if(options && (typeof options.length !== CONSTANTS.LITERAL_UNDEFINED && s.length > options.length)) s = s.substring(0, options.length) + '...' ;

			// return
			
			return s ;
		
		} ;

		/**
		* Create a new Object.
		* @link https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
		* @param prototype [optional] (Object) A prototype Object whose properties to to copy.
		* @return Object
		*/
/*@deprecated: moved to Object#create*/
		Meta.create = function create(prototype) { throw 'Deprecated' ; return objectCreate(prototype) ; }
		
		/**
		* Extend the given object with the given property.
		*
		* Only the specification properties `property` and `value` are available cross-browser; all other properties need to be used with provision of a fallback for legacy and non-standard implementations of the ECMAScript standard.
		*
		* @param (Object) object An Object to extend with the given property and value.
		* @param (Object) specification An Object specifying at least the property and value to extend the given Object with. 
		*/
/*@deprecated: moved to Object#defineProperty*/
		Meta.extend = function extend(object, specification)
		{
throw 'Deprecated' ;
			// preconditions
			
			if(! this.isSet(specification.property)) throw new Error('Missing specification property (name="property")') ;
			if(! this.isSet(specification.value)) throw new Error('Missing specification property (name="value")') ;
		
			//

				objectExtend(object, specification) ;
				
			// return
			
			return object ;

		
		} ;

		/**
		* Parses a literal value from a string representation.
		*
		* @param (String) string A string for a literal.
		* @return Object
		*/
/*@deprecated*/
		Meta.parse = function parse(string)
		{ throw 'Deprecated' ;

			// variables

			var o = null ;

			// 
			
				try {
				
						o = Function("return " + string + ";")
						.call(null) ;
						
				}
				catch(e) { o = string ; }

			// return

			return o ;

		} ;
/*@todo: remove*/
/*@deprecated*/
		Meta.keys = function keys(object)
		{ throw 'Deprecated' ;
		
			// variables
			
			var a = null, s ;
			
			// 
			
				if( this.isObject(object) || this.isFunction(object) ) {
				
						if(Object.prototype.getOwnPropertyNames) { a = object.getOwnPropertyNames( ) ; }
						else {
						
								a = [ ] ;
								
								for(s in object) { a[a.length] = s ; }

						}

				}
			
			// return
			
			return a ;
		
		} ;
		/**
		* An iterator for the standard iterable Objects. This method will iterate arrays, Array-like objects and objects.
		* @param object (Object) The iterable Object
		* @param callback (Function) The function to call on each entry in the iterable Object. The callback will receive the value for the key or index, the key or index itself and a reference to the object iterated over in this order.
		* @param context (Object) [optional] The Object to be used as the value of `this` in the callback Function
		* @return this
		*/
		Meta.each = function each(object,callback,context)
		{

			//

				if(Meta.isArray(object)) arrayEach(object, callback, context) ;
				else objectEach(object, callback, context) ;
/*
				{
				
						for(var i1 = -1, i2 = object.length ; ++i1 < i2 ; )
								if(callback.apply(o, [i1, object[i1]]) === false) break ;

				}
				else {

						for(s in object)
								if(callback.apply(o, [s,object[s]]) === false) break ;
				
				}
*/
			// return

			return this ;	
			
		} ;
		/**
		* Merge two iterable Objects. This function adds or replaces values on the first given Object in case a mapping for a key exists in the second given Object. The return value is the first passed Object.
		* @param A (Object) An iterable Object.
		* @param B (Object) Another iterable Object.
		* @param override (Boolean,Function) `Boolean` flag to indicate whether existing properties of the first given `Object` shall be replaced by those of the second given `Object`; or a `Function` for more sophisticated override algorithms.
		* @return Object
		*/
/*@todo: remove or split up and move to core objects (Object.merge, Array.merge, ...)*/
/*@deprecated*/
		Meta.merge = function merge(A, B, override)
		{ throw 'Deprecated' ;

			// variables 
			
			var b1, b2, a = null ;

			// 

				b1 = this.isFunction(override) ;
				b2 = (!! override) ;

				if(b1) { a = [null,A,B] ; }

				/*@Note("If a `Function` was passed as the `override` parameter overriding is supposed to be handled by passing
				the current key, the target and the iterated `Object` to the callback. Otherwise the property on the target is
				overriden if and only if the `override` parameter was evaluated to a `Boolean` true value.")*/

				Meta.each(
						B,
						function anonymous$merge(key,value) {

							var o ;

								if(b1) {
								
										a[0] = key ;

										if( override.apply(Meta.DEFAULT_VIEW,a) === false ) { return false ; }
								
								}
								else if(  b2  ||  Meta.isVoid( A[key] )  ) { A[key] = value ; }

						}
				) ;
				
			// return

			return A ;
						
		} ;
		/**
		* Copy an iterable object. This function only performs a shallow copy
		* @param object (Object,Array) An iterable object.
		* @return Object
		*/
/*@todo: remove or move move to core objects.*/
/*@deprecated*/
		Meta.copy = function copy(object)
		{ throw 'Deprecated' ;
			// variables

			var o = null ;

			//
			
				/*All Arrays are Objects. So, the order of type checking is important here.*/

				if(this.isArray(object)) { o = array_copy(object) ; }
				else if(this.isObject(object)) { o = { } ; this.merge(o, object) ; }
				else if(this.isFunction(object)) { o = function_copy(object) ; }

			// return

			return o ;

		} ;
		/**
		* Return a Boolean value indicating whether the object accessible on the target object using the given String is set, i.e. if it is not undefined.
		* @param (String) identifier An identifier `String`.
		* @param (Object) object An object.
		* @return Boolean
		*/
		Meta.has = function has(identifier, object)
		{
				return ! Meta.isVoid(objectResolveNamespace(identifier, object)) ;
		} ;
		/**
		* Evaluate a namespaced object identifier string on a given object (e.g. "name.space.Object.property") on a given Object.
		*
		* This method returns null for undefined properties. If you need if a property for a given identifier is not set use Meta::has instead.
		*
		* @param path (String) A namespace object identifier string.
		* @param object (Object) The target Object for the identifier evaluation.
		* @return Object
		*/
		Meta.get = function get(identifier, object)
		{
				return objectResolveNamespace(identifier, object) || null ;
		} ;
		/**
		* Evaluate a namespaced object identifier (e.g. "name.space.Object.property") on a given Object and sets its value.
		*
		* This function returns a boolean value indicating whether the object was set, i.e. in case the namespace could be created.
		*
		* @param identifier (String) The namespace identifier to set the given value to.
		* @param value (Object) The value to be set.
		* @param object (Object) The target Object.
		* @return void
		*/
		Meta.set = function set(identifier, value, object)
		{

			// variables
			
			var o, s, i = 0 ;
			
			//
			
				if((i = identifier.lastIndexOf('.')) !== -1)
				{
				
						if((o = objectCreateNamespace(identifier.substring(0, i), object)))
						{

								if((s = identifier.substring(i + 1, identifier.length)))
								{

										o[s] = value ;

									return true ;
								
								}

						
						}
				
				}

			// return
			
			return false ;

		} ;
		
	// Library set-up utility functions.
		
		/**
		* {@link createID}
		*/
		Meta.createID = createID ;
		
	// Other functions.
		
		Meta.configuration = function configuration(key) { return CONIFGURATION[key] ; }
		Meta.constant = function constant(key) { return CONSTANTS[key] ; }

	// Globalize Meta.
		
		switch(CONFIGURATION.CONFLICT_MODE)
		{
		
				case 'override': CONSTANTS.GLOBAL_OBJECT.$ = CONSTANTS.GLOBAL_OBJECT.Meta = Meta ; break ;
				case 'resolve': CONSTANTS.GLOBAL_OBJECT.Meta = Meta ; break ;
				default: throw new Error('Invalid conflict mode (conflict-mode="' + CONFIGURATION.CONFLICT_MODE + '")') ;
		
		}
		
	// Require, Use Defaults
	
	var a ;
	
		if((a = CONFIGURATION.REQUIRE_DEFAULT)) { Meta.require.apply(Meta, a) ; }
		
		if((a = CONFIGURATION.USE_DEFAULT)) { Meta.use.apply(Meta, a) ; }

})(CONFIGURATION) ;

delete this.CONFIGURATION ;