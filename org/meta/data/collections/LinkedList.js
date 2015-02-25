/*
@identifier org.meta.data.collections.LinkedList
@extend org.meta.data.collections.Collection
@implement org.meta.data.collections.Collection
@require org.meta.logic.Iterator
@description A linked list implementation.
*/
(function( ) {
var LinkedList$Iterator = define('org.meta.data.collections.LinkedList$Iterator', {
		extend: Iterator,
		main: function main(list, head_element)
		{
				this.iterable = list ;
				
				this.current_index = -1 ;
				this.current_element = head_element ;
				
				this.head_element = head_element ;

		},
		local:
		{
				head_element: null,
				hasNext: function hasNext( ) { return !! this.current_element.next ; },
				next: function next( )
				{
					
					// variables
					
					var element ;
					
					//
					
						if(this.hasNext( ))
						{
						
								element = this.current_element = this.current_element.next ;
								this.current_index++ ;
								
								return element.value ;
								
						}
						
					// return
					
						return null ;
						
				},
				forEach: function forEach(callback, context)
				{
					// variables
					
					var a = [,,this] ;
					
					//
					
						while(this.hasNext( ))
						{
						
								a[0] = this.next( ) ;
								a[1] = this.current_index ;
								
								callback.apply(context, a) ;
								
						}

				}
		}
}) ;
return {
		global:
		{
				SORT_DEFAULT: 1,
				SORT_CUSTOM: 1 << 1,
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
					
					var list,
						attributes, limit,
						comparator ;
					
					//
					
						if(properties)
						{
						
								attributes = 0 | (properties.sort || 0) ;
							
								if((attributes & LinkedList.SORT_CUSTOM) !== 0)
								{
								
										comparator = properties.comparator ;
									
										if(! isFunction(comparator)) error('Invalid Argument: Custom sorting was specified but comparator property is not a function.') ;
									
								}
								else if((attributes & LinkedList.SORT_DEFAULT) !== 0) comparator = LinkedList.DEFAULT_COMPARATOR ;
								else comparator = null ;
							
								list = new this(comparator) ;
								list.add = this.addSorted ; // use the sorted addition algorithm
							
						}
						else list = new this(null) ;
						
					// return
					
						return list ;

				},
				addSorted: function addSorted(value)
				{
				
					// variables
					
					var previous, current, element ;
					
					//
					
						element = {value: value, next: null} ;

						if(! this.isEmpty( ))
						{
						
								current = this.head_element ;

								do switch(this.comparator(value, current.value))
								{
										/*Values are equal; append to current element.*/
										case 0:

												element.next = current.next ; // append the rest of the list to the new element
												current.next = element ; // append the new element to the current element
										
											// return

												return ;

										break ;
										/*Given value ranks lower than current value; prepend to current element.*/
										case -1:
 
												if(previous) previous.next = element ;
												else this.head_element = element ;

												element.next = current ;
										
											// return
										
												return ;

										break ;
										/*Given value ranks higher than current value or is uncomparable; cycle reference to the previous element.*/
										default: previous = current ;
								}
								while((current = current.next)) ;
							
								previous.next = element ; // new last element
							
						}
						else this.head_element = element ;

				}
		},
		local:
		{
				head_element: null,
				isEmpty: function isEmpty( ) { return ! this.head_element ; },
				iterator: function iterator( )
				{
						return new LinkedList$Iterator(this, this.head_element) ;
				},
				head: function head( )
				{
 
					//

						if(this.isEmpty( )) error('Null Pointer Error: LinkedList is empty') ;
 
					// return
 
					return this.head_element.value ;

				},
				length: function length( )
				{
 
					// variables
 
					var length = 0,
						next ;
 
					//
 
						if((next = this.head_element.next))
						{
								do length++ ;
								while((next = next.next)) ;
						}

					// return
 
					return length ;

				},
				add: function add(value)
				{
				
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
						
				},
				/**
				* Return the value at the given index.
				*/
				get: function get(index)
				{
				
					// variables
					
					var next,
						i = -1 ;
					
					//
					
						if(! this.isEmpty( ))
						{
 
								next = this.head_element ;
 
								// return
							
								do if(++i === index) return next.value ;
								while((next = next.next)) ;
 
						}
					
					// return
					
						return null ;
					
				},
				remove: function remove(index)
				{
				
					// variables
					
					var previous, current,
						i = -1 ;
					
					//
 
						if(! this.isEmpty( )) // there is at least one element
						{
 
								current = this.head_element ;
 
								if(index === 0) this.head_element = this.head_element.next ; // remove the head element
								else
								{
 
										previous = this.head_element ;
 
										do if(++i === index)
										{
										
												previous.next = current.next ;

												break ;
											
										}
										else previous = current ;
										while((current = current.next)) ;
 
								}
 
								return current.value ;
 
						}

					// return
					
						return null ;

				}
		}
} ;
})( )