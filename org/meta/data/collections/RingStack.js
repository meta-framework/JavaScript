/*
@identifier org.meta.data.collections.RingStack
@extend org.meta.data.collections.Ring
@implement org.meta.data.collections.Stack
@description A simple stack implementation extending `org.meta.data.collections.Ring`
*/
{
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
				addSorted: function( ) { error('Unsupported Operation') ; },
				/**
				* Return the value of the first element on the stack without removing it.
				*
				* @abstract
				* @implementation This simply proxies a call to for RingStack#head in order conform with the Stack interface.
				* @return The value of the first element on the stack or null
				*/
				top: function top( ) { return this.head( ) ; },
				push: function push(value)
				{
				
						this.addUnsorted(value) ;
						this.head_element = this.head_element.previous ;
				
				},
				pop: function pop( )
				{

					//
					
						if(! this.isEmpty( )) return this.remove(0) ;
					
					// return
					
					return null ;
							
				}
		}
}