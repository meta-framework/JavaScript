/*
@identifier org.meta.logic.Iterator
@type abstract
@extend org.meta.Object
@require org.meta.logic.Iterable
@description Abstract object implementing the standard operations of an iterator pattern.
*/
{
		main: function main(iterable)
		{
		
			// preconditions
			
				assert(isInstanceOf(Iterable, iterable), 'Invalid type for argument `iterable`.') ;
				
			//
			
				this.iterable = iterable ;
				this.current_index = -1 ;
				this.current_element = null ;

		},
		local:
		{
				iterable: null,
				/**
				* The index of the current element.
				*
				* @type Integer
				*/
				current_index: null,
				current_element: null,
				hasNext: function hasNext( ) { return this.current_index + 1 < this.iterable.length( ) ; },
				next: function next( )
				{
				
					//
					
						if(this.hasNext( ))
						{
						
								this.current_element = this.iterable.get(++this.current_index) ; // get the element for the next index and increment the index counter
								return this.current_element ;
							
						}
					
					// return
					
					return null ;

				},
				forEach: function forEach(callback, context)
				{
				
					// variables
					
					var a ;
					
					//
					
						a = [,,this] ;

						while(this.hasNext( ))
						{

								a[0] = this.next( );
								a[1] = this.current_index ;

								callback.apply(context, a) ;
								
						}

				}
		}
}