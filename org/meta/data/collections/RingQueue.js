/*
@identifier org.meta.data.collections.RingQueue
@extend org.meta.data.collections.Ring
@implement org.meta.data.collections.Queue
@description A simple stack implementation extending org.meta.data.collections.Ring
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
				* @implementation This simply proxies a call to for RingQueue#head in order conform with the Queue interface.
				* @return The value of the first element on the stack or null
				*/
				first: function first( ) { return this.head( ) ; },
				last: function last( )
				{
				
						if(! this.isEmpty( )) return this.head_element.previous.value ; // this may be the head element itself (if queue length is one).
					
					// return
					
					return null ;

				},
				enqueue: function enqueue(value) { this.addUnsorted(value) ; },
				dequeue: function dequeue( )
				{

					//
					
						if(! this.isEmpty( )) return this.remove(0) ;
					
					// return
					
					return null ;
							
				}
		}
}