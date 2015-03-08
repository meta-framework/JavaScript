/*
@identifier org.meta.data.collections.RingIterator
@extend org.meta.data.collections.LinkedListIterator
@description A ring iterator.
*/
{
		main: function main(ring, head_element)
		{

				this.iterable = ring ;

				this.current_index = 0 ;
				this.current_element = head_element ;
				
				this.head_element = head_element ;

		},
		local:
		{
				/**
				* @implementation All elements in a ring are linked. The iterator therefore has completed a single iteration cycle once it reaches the head element for the second time. This operation therefore checks whether the next element (for a given current element) is the head element.
				/
				hasNext: function hasNext( ) { return !! this.current_element && this.current_element.next !== this.head_element ; },
*/
				next: function next( )
				{

					// variables
					
					var element, next ;
					
					//

						element = this.current_element ;
					
						/*Set the next element (and next element's index---if the element exists).*/
						if((next = element.next) === this.head_element) this.current_element = null ;
						else
						{
						
								this.current_element = next ;
								this.current_index++ ;
							
						}

					// return
					
						return element.value ;
				
				}

		}
}
