/*
@identifier org.meta.standard.Iterator
@type abstract
@extend org.meta.standard.Object
@require org.meta.standard.Iterable
@description Abstract object implementing the standard operations of an iterator pattern.
*/
{
		main: function main(iterable)
		{
		
			// preconditions
			
				assert(isInstanceOf(Iterable, iterable), 'Invalid type for argument `iterable`.') ;
				
			//
			
				this.iterable = iterable ;

		},
		local:
		{
				iterable: null,
				current: -1,
				next: function next( )
				{
				
					// variables
					
					var i ;
					
					//
					
						if((i = ++this.current) < this.iterable.length( )) return this.iterable.get(i) ;
						else throw new Error('Index out of bounds.') ;
						
					// return
					
					return null ;

				},
				hasNext: function hasNext( )
				{
					return this.current + 1 < this.iterable.length( ) ;
				},
				forEach: function forEach(callback, context)
				{
				
					// variables
					
					var a ;
					
					//
					
						a = [,,this.iterable] ;

						while(this.hasNext( ))
						{

								a[0] = this.next( ), a[1] = this.current ;

								callback.apply(context, a) ;
								
						}

				}
		}
}