/*
@identifier org.meta.data.collections.DoubleLinkedList
@extend org.meta.data.collections.LinkedList
@implement org.meta.data.collections.Collection
@description A double linked list implementation.
*/
{
		local:
		{
				addUnsorted: function addUnsorted(value)
				{
				
					// variables
					
					var element, current ;
					
					//
					
						element = {value: value, next: null, previous: null} ;
						
						if(! this.isEmpty( ))
						{
 
								current = this.head_element ;
								while(current.next) current = current.next ;

								/*Link the new element*/
								current.next = element ;
								element.previous = current ;
 
						}
						else this.head_element = element ;
						
				},
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
												
												/*Relink the previous an current elements.*/
												if(previous)
												{
														element.previous = previous ;
														previous.next = element ;
												}
												else this.head_element = element ;
												
												current.previous = element ;
										
											// return
										
												return ;

										break ;
										default: previous = current ;
								}
								while((current = current.next)) ;
							
								/*Add the new element as new last element.*/
								previous.next = element ;
								element.previous = previous ;
							
						}
						else this.head_element = element ;

				},
				remove: function remove(index)
				{
				
					// variables
					
					var next, current,
						i = -1 ;
					
					//
 
						if(! this.isEmpty( )) // there is at least one element
						{
 
								current = this.head_element ;
								
								if(index === 0) // remove the head element
								{

										next = this.head_element = this.head_element.next ;
										if(next) next.previous = null ; // next may be null
										
									return current.value ;

								}
								else
								{
										do if(++i === index)
										{
										
												/*Unlink the current element.*/
												current.previous.next = current.next ;
												if((next = current.next)) next.previous = current.previous ;
												
											return current.value ;

										}
										while((current = current.next)) ;

								}
								
						}

					// return
					
						return null ;

				}
		}
}