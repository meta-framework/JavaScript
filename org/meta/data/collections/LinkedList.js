/*
@identifier org.meta.data.collections.LinkedList
@extend org.meta.data.collections.Collection
@implement org.meta.data.collections.Collection
@require org.meta.data.collections.LinkedListIterator
@description A linked list implementation.
*/
{
		local:
		{
				head_element: null,
				isEmpty: function isEmpty( ) { return ! this.head_element ; },
				iterator: function iterator( )
				{
						return new LinkedListIterator(this, this.head_element) ;
				},
				head: function head( )
				{
 
					//

						if(this.isEmpty( )) error('Null Pointer Error: List is empty') ;
 
					// return
 
					return this.head_element.value ;

				},
				length: function length( )
				{
 
					// variables
 
					var iterator,
						length = 0 ;
 
					//
 
						iterator = this.iterator( ) ;
						while(iterator.hasNext( )) length++, iterator.next( ) ;
/*@deprecated
						if((next = this.head_element.next))
						{
								do length++ ;
								while((next = next.next)) ;
						}
*/
					// return
 
					return length ;

				},
				addUnsorted: function addUnsorted(value)
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
}