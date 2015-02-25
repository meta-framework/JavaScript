/*
@identifier org.meta.data.collections.RingStack
@extend org.meta.data.collections.Ring
@implement org.meta.data.collections.Stack
@require org.meta.logic.Iterator
@description A simple stack implementation based on the core ring operations.
*/
(function( ) {
var RingStack$Iterator = define('org.meta.data.collections.RingStack$Iterator', {
		extend: Iterator,
		main: function main(stack, top_element)
		{

				this.iterable = stack ;

				this.current_index = -1 ;
				this.current_element = top_element ;
				
				this.top_element = top_element ;

		},
		local:
		{
				top_element: null,
				hasNext: function hasNext( ) { return this.current_element.next !== this.top_element ; },
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
				create: function create(properties)
				{

					// return
					
						return new this(null) ;

				}
		},
		local:
		{
				top_element: null,
				iterator: function iterator( ) { return new RingStack$Iterator(this, this.top_element) ; },
				/**
				* @return (Boolean) Boolean value indicating whether there is at least one element on top of the stack.
				*/
				isEmpty: function isEmpty( ) { return ! this.top_element ; },
				top: function top( )
				{
				
					//
					
						if(this.isEmpty( )) error('Null Pointer Error: RingStack is empty.') ;
				
					// return
					
					return this.top_element.value ;
					
				},
				add: function add(value) { this.push(value) ; }
				push: function push(value)
				{
				
					// variables
					
					var element ;
					
					//
					
						element = {value: value} ;

						if(! this.top_element) this.top_element = ringAdd(null, element) ;
						else // push the element and cycle the top element
						{
							
								ringAdd(this.top_element, element) ;
								this.top_element = this.top_element.previous ;
							
						}
					
				},
				pop: function pop( )
				{
				
					// variables
					
					var top_element,
						value ;
					
					//
					
						if(! this.top_element) error('Null Pointer Error: Stack is empty.') ;
					
						value = this.top_element.value ;
					
						if((top_element = ringPop(this.top_element))) this.top_element = top_element ;
						else this.top_element = null ;
					
					// return
					
					return value ;
				
				}
		}
}
})( )