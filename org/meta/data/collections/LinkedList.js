/*
@identifier org.meta.data.collections.LinkedList
@extend org.meta.logic.Iterable
@require org.meta.logic.Iterator
@description A linked list implementation.
*/
(function( ) {
var LinkedList$Iterator = define('org.meta.data.collections.LinkedList$Iterator', {
		extend: Iterator,
		main: function main(list)
		{
				this.iterable = list ;
				this.current_index = -1 ;
				this.current_element = list.head ;

		},
		local:
		{
				/**@type org.meta.data.collections.LinkedList*/
				list: null,
				hasNext: function hasNext( ) { return !! this.current_element.next ; },
				next: function next( )
				{
					
					//
					
						if(this.hasNext( ))
						{
						
								this.current_element = this.current_element.next ;
								this.current_index++ ;
								
								return this.current_element ;
								
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
		main: function main(/*attributes, limit,*/ comparator)
		{
//				this.attributes = attributes ;
//				this.limit = limit ;
				this.comparator = comparator ;

				this.head = {next: null} ;
		},
		global:
		{
				SORT_DEFAULT: 1,
				SORT_CUSTOM: 1 << 1,
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators
				* @todo refactor into `Comparable` or `compareTo(a, b)`
				* @todo use `String.prototype.localeCompare` where possible
				*/
				DEFAULT_COMPARATOR: function compare(a, b)
				{
					
					//
					
						switch(typeOf(a))
						{
								case TYPE_VOID: return isVoid(b) ? 0 : Number.POSITIVE_INFINITY ; break ;
								case TYPE_NULL: return isNull(b) ? 0 : Number.POSITIVE_INFINITY ; break ;
								case TYPE_BOOLEAN:
										if(isBoolean(b)) return a === b ? 0 : (a === false ? -1 : 1) ; // `true` ranks higher than `false`
										else return Number.POSITIVE_INFINITY ;
								break ;
								case TYPE_NUMBER:
										if(isNumber(b)) return a < b ? -1 : (a > b ? 1 : 0) ;
										 // do not use the comparison operator first since testing for number inequality should be faster
										else return Number.POSITIVE_INFINITY ;
								break ;
								case TYPE_STRING:
										if(isString(b))
										{
										
											var length = a.length ;
											
												if(length < b.length) return -1 ;  // do not use the comparison operator first since testing for length inequality entails string inequality and this should be faster
												else if(length > b.length) return 1 ;
												else // iterate over characters and compare char codes
												{
												
													var i = -1,	char_code_a, char_code_b ;
													
														while(++i < length)
																if((char_code_a = a.charCodeAt(i)) !== (char_code_b = b.charCodeAt(i))) return char_code_a < char_code_b ? -1 : 1 ;
													
														return 0 ; // strings are completely identical
												
												}
										}
										else return Number.POSITIVE_INFINITY ;
								break ;
								default: return Number.POSITIVE_INFINITY ; // non primitive types cannot be compared with the default comparator
						}

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
									
										assert(isFunction(comparator), 'Invalid Argument: Custom sorting was specified but comparator property is not a function.') ;
									
								}
								else if((attributes & LinkedList.SORT_DEFAULT) !== 0) comparator = LinkedList.DEFAULT_COMPARATOR ;
								else comparator = null ;
							
								list = new this(/*attributes, limit,*/ comparator) ;
							
								list.add = LinkedList.addSorted ; // use the sorted addition algorithm
							
						}
						else list = new this(/*attributes || 0, limit || -1,*/ null) ;
						
					// return
					
						return list ;

				},
				addSorted: function addSorted(value)
				{
				
					// variables
					
					var previous, next, element ;
					
					//
					
						element = {value: value, next: null} ;

						if((next = this.head.next))
						{
						
								previous = this.head ;

								do switch(this.comparator(value, next.value)) // start comparison with the element following the list head (the list head is a pseudo element)
								{
										/*Values are equal; append to current element.*/
										case 0:
												element.next = next.next ;
												next.next = element ;
										
											// return

												return ;
										break ;
										/*Given value ranks lower than current value; prepend to current element.*/
										case -1:
												previous.next = element ;
												element.next = next ;
										
											// return
										
												return ;
										break ;
										/*Given value ranks height than current value or is uncomparable; cycle reference to the previous element.*/
										default: previous = next ;
								}
								while((next = next.next)) ;
							
								previous.next = element ; // new last element
							
						}
						else this.head.next = element ;

				}
		},
		local:
		{
				head: null,
				length: function length( )
				{
 
					// variables
 
					var length = 0,
						next ;
 
					//
 
						if((next = this.head.next))
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
					
					var next, element ;
					
					//
					
						element = {value: value, next: null} ;
					
						if((next = this.head.next))
						{
					
								while(next.next) next = next.next ;
								next.next = element ;
							
						}
						else this.head.next = element ;
						
				},
				get: function get(index)
				{
				
					// variables
					
					var next,
						i = -1 ;
					
					//
					
						if((next = this.head.next))
						{
					
							// return
							
								do if(++i === index) return next ;
								while((next = next.next)) ;
							
							// return

								return null ;
							
						}
					
					// return
					
						return null ;
					
				},
				remove: function remove(index)
				{
				
					// variables
					
					var previous, next,
						i = -1 ;
					
					//
 
						if((next = this.head.next))
						{
						
								previous = this.head ;
							
								do if(++i === index)
								{
								
										previous.next = next.next ;
								
									// return

										return true ;
									
								}
								else previous = next ;
								while((next = next.next)) ;
							
						}

					// return
					
						return false ;

				},
				iterator: function iterator( )
				{
						return new LinkedList$Iterator(this) ;
				},
				contains: function contains(value)
				{
 
					// variables
 
					var self = this,
						comparator,
						iterator,
						next ;
 
					//
 
						comparator = this.comparator ? function(a, b) { return self.comparator(a, b) === 0 ; } : function(a, b) { return a === b ; } ;
						iterator = this.iterator( ) ;
 
						while(iterator.hasNext( ))
						{
								next = iterator.next( ) ;
 
								if(comparator(value, next.value) === 0) return true ;
						}

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
 
					// return

						return null ;
 
				}
		}
} ;
})( )