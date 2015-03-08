/*
@abstract
@extend org.meta.logic.Iterable
@identifier org.meta.data.collections.Collection
@description An abstract type defininig core collection operations.
*/
{
		main: function main(attributes,/* limit,*/ comparator)
		{
				this.attributes = attributes ;
//				this.limit = limit ;
				this.comparator = comparator ;
		},
		global:
		{
				SORTED_COLLECTION: 1,
//				SORT_DEFAULT: 1,
//				SORT_CUSTOM: 1 << 1,
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators
				* @todo refactor into `Comparable` or `compareTo(a, b)`
				* @todo use `String.prototype.localeCompare` where possible
				* @todo The initial `typeOf(a)` test is expensive. Should be `if(isVoid(a)) return isVoid(b) ? 0 : Number.POSITIVE_INFINITY ; else if(isNull(a)) ... ; else return Number.POSITIVE_INFINITY ;`
				* @todo number comparisons are really slow (slower than string comparisons)!?
				*/
				DEFAULT_COMPARATOR: function compare(a, b)
				{
					
					// variables
 
					var length ;
 
					//
 
						if(isVoid(a)) return isVoid(b) ? 0 : Number.POSITIVE_INFINITY ;
						else if(isNull(a)) return isNull(b) ? 0 : Number.POSITIVE_INFINITY ;
						else if(isBoolean(a)) return isBoolean(b) ? (a === b ? 0 : (a === true ? 1 : -1)) : Number.POSITIVE_INFINITY ; // `true` ranks higher than `false`
						else if(typeof a === 'number'/*isNumber(a)*/) return typeof b === 'number' /*isNumber(b)*/ ? (a === b ? 0 : (a > b ? 1 : -1)) : Number.POSITIVE_INFINITY ; // the `Core::isNumber` operation is really slow for some reason
						else if(isString(a))
						{
								if(isString(b))
								{
										if((length = a.length) > b.length) return 1 ;
										else if(length < b.length) return -1 ;
										else
										{
 
												/*Find the first pair of character within the strings whose character codes are not equal and compare character codes.*/
												for(var i = -1 ; ++i < length ; )
												{
 
														char_code_a = a.charCodeAt(i) ;
														char_code_b = b.charCodeAt(i) ;
 
														if(char_code_a > char_code_b) return 1 ;
														else if(char_code_a < char_code_b) return -1 ;

												}
												
												return 0 ;
												
										}
 
								}
								else return Number.POSITIVE_INFINITY ;
						}
						else return Number.POSITIVE_INFINITY ; // non primitive types cannot be compared

				},
				create: function create(properties)
				{
				
					// variables
					
					var collection,
						attributes = 0, limit,
						comparator ;
					
					//
					
						if(properties)
						{
						
								attributes |= properties.attributes || 0 ;
 
								if((attributes & Collection.SORTED_COLLECTION) !== 0) comparator = properties.comparator || Collection.DEFAULT_COMPARATOR ;
/*@deprecated
								if((attributes & LinkedList.SORT_CUSTOM) !== 0)
								{
								
										comparator = properties.comparator ;
									
										if(! isFunction(comparator)) error('Invalid Argument: Custom sorting was specified but comparator property is not a function.') ;
									
								}
								else if((attributes & LinkedList.SORT_DEFAULT) !== 0) comparator = Collection.DEFAULT_COMPARATOR ;
								else comparator = null ;
*/
								collection = new this(attributes, comparator) ;
//								list.add = this.addSorted ; // use the sorted addition algorithm
							
						}
						else collection = new this(0, null) ;
						
					// return
					
						return collection ;

				}
		},
		local:
		{
				/**@type Integer*/
				attributes: null,
				/**@type Function*/
				comparator: null,
				/**
				* @abstract
				*/
				isEmpty: function isEmpty( ) { },
				/**
				* @abstract
				*/
				length: function length( ) { },
				add: function add(value)
				{
 
						if((this.attributes & Collection.SORTED_COLLECTION) === 0) this.addUnsorted(value) ;
						else this.addSorted(value) ;
/*
					// variables
					
					var current, element ;
					
					//
					
						element = {value: value, next: null} ;
					
						if(! this.isEmpty( ))
						{
 
								current = this.head_element ;
								while(current.next) current = current.next ;
 
								current.next = element ; // append the element at the end of the list
							
						}
						else this.head_element = element ;
*/
				},
				/**@abstract*/
				addUnsorted: function addUnsorted( ) { },
				/**@abstract*/
				addSorted: function addSorted( ) { },
				/**
				* @abstract
				*/
				get: function get( ) { },
				contains: function contains(value)
				{
 
					// variables
 
					var comparator,
						iterator,
						next ;
 
					//
 
						if(! (comparator = this.comparator)) comparator = function(a, b) { return a === b ? 0 : -1 ; } ;
 
						iterator = this.iterator( ) ;

						while(iterator.hasNext( ))
						{
								next = iterator.next( ) ;
								if(comparator(value, next) === 0) return true ;
						}

						iterator.destroy( ) ;

					// return
					
						return false ;

				},
				/**
				* @param (Function) cf A characterizing function.
				* @param (Object) context The context object.
				*/
				find: function find(cf, context)
				{
 
					// variables
 
					var iterator,
						context = context || null,
						next ;
 
					//

						iterator = this.iterator( ) ;
 
						while(iterator.hasNext( ))
						{
								next = iterator.next( ) ;
								if(cf.call(context, next.value) === true) return next.value ;
						}
					
						iterator.destroy( ) ;
 
					// return

						return null ;
 
				},
				/**
				* @abstract
				*/
				iterator: function iterator( ) { }
		}
}