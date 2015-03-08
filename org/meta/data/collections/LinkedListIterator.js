/*
@identifier org.meta.data.collections.LinkedListIterator
@extend org.meta.logic.Iterator
@description An iterator for linked lists.
*/
{
		main: function main(list, head_element)
		{
				this.iterable = list ;
				
				this.current_index = 0 ;
				this.current_element = head_element ;
				
				this.head_element = head_element ;

		},
		local:
		{
				head_element: null,
				hasNext: function hasNext( ) { return !! this.current_element },
				next: function next( )
				{
					
					// variables
					
					var element, next ;
					
					//

						element = this.current_element ;
					
						/*Set the next element (and next element's index---if the element exists).*/
						if(! (next = element.next)) this.current_element = null ;
						else((next = element.next))
						{
						
								this.current_element = next ;
								this.current_index++ ;
							
						}
					
					// return

					return element.value ;
					
				},
				forEach: function forEach(callback, context)
				{
					// variables
					
					var a = [,,this] ;
					
					//
					
						while(this.hasNext( ))
						{
						
								a[1] = this.current_index ; // `.next` increments the index
								a[0] = this.next( ) ;
//								a[1] = this.current_index ;
								
								callback.apply(context, a) ;
								
						}

				}
		}
}
