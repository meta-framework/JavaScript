/*
@identifier org.meta.data.collections.Ring
@extend org.meta.data.collections.DoubleLinkedList
@implement org.meta.data.collections.Stack
@require org.meta.data.collections.RingIterator
@description A ring buffer implementation.
*/
{
		local:
		{
				iterator: function iterator( ) { return new RingIterator(this, this.head_element) ; },
				addSorted: function addSorted(value)
				{
				
					// variables
					
					var element, previous, current ;
					
					//
					
						element = {value: value, next: null, previous: null} ;

						if(! this.isEmpty( ))
						{

								current = this.head_element ;

								do switch(this.comparator(value, current.value))
								{
										/*Values are equal; append to current element.*/
										case 0:

												/*Link the new element.*/
												element.next = current.next ;
												element.previous = current ;
 
												/*Relink the current element and its successor.*/
												if((next = current.next)) next.previous = element ;
												current.next = element ;
										
											// return

												return ;

										break ;
										/*Given value ranks lower than current value; prepend to current element.*/
										case -1:
 
												/*Link the new element.*/
												element.next = current ;
												element.previous = current.previous ;
												
												/*Relink the previous and current elements.*/
												current.previous.next = element ;
												current.previous = element ;
 
												if(current === this.head_element) this.head_element = element ; // update the reference to the ring head element
 
											// return
										
												return ;

										break ;
										default: previous = current ;
								}
								while((current = current.next) && current !== this.head_element) ;
							
								/*Add the new element as new last element.*/
								element.previous = current.previous ;
								element.next = current ;
 
								current.previous.next = element ;
								current.previous = element ;
 
						}
						else
						{
 
								this.head_element = element ; // set the new element as the head element
								element.next = element.previous = element ; // link the element with itself
 
						}

				},
				addUnsorted: function addUnsorted(value)
				{

					// variables
					
					var element, current ;
					
					//
					
						element = {value: value, next: null, previous: null} ;
						
						if(! this.isEmpty( ))
						{
 
								/*Link the new element.*/
								element.next = this.head_element ;
								element.previous = this.head_element.previous ;
 
								/*Relink the head and the last element.*/
								this.head_element.previous.next = element ;
								this.head_element.previous = element ;
 
						}
						else
						{
 
								this.head_element = element ; // set the new element as the head element
								element.next = element.previous = element ; // link the element with itself

						}

				},
				/**
				* Return the value at the given index.
				*/
				get: function get(index)
				{
				
					// variables
					
					var next, head,
						i = -1 ;
					
					//
					
						if(! this.isEmpty( ))
						{
 
								next = head = this.head_element ;
 
								// return
							
								do if(++i === index) return next.value ;
								while((next = next.next) && next !== head) ;
 
						}
					
					// return
					
						return null ;
					
				},
				remove: function remove(index)
				{
 
					// variables
 
					var current, next, head,
						i = -1 ;
 
					//
 
						current = this.head_element ;

						if(index === 0)
						{
 
								if((next = current.next) === current) this.head_element = null ;
								else
								{

										current.previous.next = next ;
										next.previous = current.previous ;
 
										this.head_element = next ;
 
								}
 
								return current.value ;
 
						}
						else
						{
 
								head = this.head_element ;
 
								do if(++i === index)
								{
 
										next = current.next ;
		 
										current.previous.next = next ;
										next.previous = current.previous ;
 
										return current.value ;
		 
								}
								while((current = current.next) && current !== head) ;
 
						}
 
					// return
 
					return null ;

				}
		}
}