

			/**
			 Some useful meta properties. The IE properties are supposed to be set using conditional comments in a splash file.
			 @link http://www.quirksmode.org/css/condcom.html
			 */

				IS_IE_6: false,
				IS_IE_7: false,
				IS_IE_8: false,
				IS_IE_9: false,
				IS_IE_6_OR_LOWER: false,
				IS_IE_7_OR_HIGHER: false,
				IS_IE_8_OR_HIGHER: false,
				IS_IE_9_OR_LOWER: false,
				
			/*
			*Some regular expressions.
			*String literal regular expression by Steven Levithan, http://blog.stevenlevithan.com/archives/match-quoted-string
			*/

				MATCHER_NUMBER: /(\-|\+)?([0-9]+)(?:\.([0-9]+))?/,
				MATCHER_INTEGER: /(\-|\+)?([0-9]+)/,
				MATCHER_FLOAT: /(\-|\+)?([0-9]+)\.([0-9]+)/,
				MATCHER_UPPERCASE: /[A-Z]/, // The equivalent of the POSIX character class `[:upper:]`
				MATCHER_LOWERCASE: /[a-z]/, // The equivalent of the POSIX character class `[:lower:]`
				MATCHER_CLASS: /^(?:[A-Z][a-z]*)+?$/,
				MATCHER_NAME: /[\w\-]+/,
				MATCHER_WHITESPACE: /\s/,
				MATCHER_STRING_LITERAL: RegExp("^([\"'])((?:\\\\\\1|.)*?)\\1$"),
				MATCHER_FORMATTING_TOKEN: /%(?:([a-z]+)|([0-9]+));/g,
				MATCHER_OBJECT_TAG: /\[object\s([a-zA-Z]+)\]//*,
				MATCHER_TRIMMABLE_WHITESPACE: /^\s*(.+)\s*$/,*/

				/**
				*Test two Objects for equality.
				*For the purpose of this method "equality" is defined by the following algorithm: for (a) null or undefined,
				*if and only if true if a is null and b is null, or if a is undefined and b is undefined; (b) Boolean, Number,
				*String if and only if their values are equivalent determined by the comparison operator ('==='); (c) Function or
				*FunctionObject, if and only if the String representations equal.
				*@param A (undefined,null,Object) A Object, null or undefined.
				*@param B (undefined,null,Object) An Object, null or undefined.
				*@return Boolean
				*/
				equals: function equals(A,B) {

					// variables
					
					var b = false ;
					var s = null ;
					
					// set b

						if(  ( s = Meta.typeOf(A) )  ===  Meta.typeOf(B)  ) {

								if(s === Meta.STRING_TYPE_NULL) { b = true ; }
								else if( s === Meta.STRING_TYPE_BOOLEAN || s === Meta.STRING_TYPE_INTEGER || s === Meta.STRING_TYPE_FLOAT || s === Meta.STRING_TYPE_STRING ) { b = (A === B) ; }
								else if(s === Meta.STRING_TYPE_FUNCTION) { b = ( A.toString( ) === B.toString( ) ) ; }

						}

					// return

					return b ;

				},
				/**
				* Rank two primitive (i.e. Boolean, Number or String) values performing conversions to Number equivalents if necessary.
				* @access public
				* @param A (Boolean,Number,String)
				* @param B (Boolean,Number,String)
				* @return (Number) Number with three potential values: 1 indicating a higher value of the first given Object; 0 indicating 
				* equal values of the given Objects; -1 indiciating lower value of the first given Object
				*/
				rank: function rank(A,B) { 
						
					// variables
					
					var r = null , a = null , b = null ;
					
					// set e
								
						if( Meta.isPrimitive(A) && Meta.isPrimitive(B) ) {
						
								if(A === B) r = 0 ;  
								else {
								
										a = A , b = B ;

										/* Convert non Numbers to their Number equivalents; i.e. null to -1, true to 1, false to 0; try 
										* to parse Numbers from Number Strings */

										if( ! Meta.isNumber(A) ) {
										
												if(A === null) { a = -1 ; }
												if( Meta.isBoolean(A) === true ) { a = (A) ? 1 : 0 ; }
												if( Meta.isString(A) === true ) { a = parseFloat(A) ; }
												
										}
										if( ! Meta.isNumber(B) ) {
										
												if(B === null) { b = -1 ; }
												if(B === true || B === false) { b = (B) ? 1 : 0 ; }
												if( Meta.isString(B) === true ) { b = parseFloat(B) ; }
												
										} 

										/* If both values are non Number Strings rank the Strings using the standard comparator. If one
										* is a non Number String rank Numbers before non Numbers. If both are Numbers (including Number
										* equivalents) compare using the standard comparator. */

										if( isNaN(a) && isNaN(b) ) { r = (A > B) ? 1 : -1 ; }
										else if( isNaN(a) || isNaN(b) ) { r = ( isNaN(a) ) ? -1 : 1 ; }
										else {
										
												if(a === b) { r = 0 ;}
												else { r = (a > b) ? 1 : -1 ; }
												
										}

								}
								
						}
						else { throw TypeError("Expected Primitives.\n     > A: " + A + "\n     > B: " + B) ; }

					// return
					
					return r ;

				},
				/*@ToDo(Implement this as a binary search algorithm)*/
				/**
				* Test whether the given iterable host `Object` contains at least one value equal to the given Object value.
				* @param value (Object) An Object value.
				* @param container (Object) An iterable Object.
				* @return Boolean
				*/
				contains: function contains(value,container)
				{
				
					// variables
					
					var b = false ;
					
					// set b

						Meta.each(
								container,
								function anonymous$contains(k,v) {
										if( Meta.equals(value,v) ) { b = true ; return false ; }
								}
						) ;
						
					// return

					return b ;
				
				},
								/** 
				* Return a `Boolean` value indicating whether the given `String` `Object` contains only upper case characters.
				* @param (String) string An input `String`.
				* @return (Boolean)
				*/
				isUpperCase: function isUpperCase(string)
				{
					return ( string.toLocaleUpperCase( ) === string ) ;
				},
				/** 
				* Return a `Boolean` value indicating whether the given `String` `Object` contains only lower case characters.
				* @param (String) string An input `String`.
				* @return (Boolean)
				*/
				isLowerCase: function isLowerCase(string)
				{
					return ( string.toLocaleLowerCase( ) === string ) ;
				},
								isEven: function isEven(number)
				{
					return ( !!! (number % 2) ) ;
				},
				isOdd: function isOdd(number)
				{
					return ! this.isEven(number) ;
				},
				isPrimitive: function isPrimitive(object)
				{
					
					// variables
					
					var b = false ;
					
					// 

						if( Meta.isBoolean(object) ) { b = true ; }
						else if( Meta.isNumber(object) ) { b = true ; }
						else if( Meta.isString(object) ) { b = true ; }

					// return
					
					return b ;

				},
								/**
				* Get the size of an iterable Object. This method depends on the given Object being iterable using Meta#each. Object sizes---like
				* Object length---is a zero based Integer, i.e. e.g. an Object with three mappings or an Array with three entries has size three.
				* Return value for null values is zero.
				* @param object An iterable Object. 
				*/
				size: function size(object) {   

					// variables
					
					var i = 0 ;
					
					// 

						if( ! Meta.isNull(object) ) { Meta.each( object, function anonymous$size( ){ ++i; } ) ; }

					// return

					return i ;

				},
				/**
				* Shuffle an Array, i.e. sort it randomly.
				* @param array (Array) An Array.
				* @return Array
				*/
				shuffle: function shuffle(array)
				{ throw Error("Deprecated.")
					
					// variables 
					
					var i ;
					
					// 

						if( Meta.isArray(array) ) {

								array.sort(  function( ) {

										if(  ( i = Math.random( ) )  <  0.33  ) return 1 ;
										else if(i < 0.66) return 0 ;
										else return -1 ;
								
								}  ) ;
								
						}

					// return
					
					return array ;

				},


