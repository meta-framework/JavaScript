/*
@identifier org.meta.data.collections.RingQueueTest
@extend org.meta.Object
@require org.meta.data.collections.RingQueue
@description Tests org.meta.data.collections.RingQueue
*/
{
		global:
		{
				create: function create( )
				{

					// variables
					
					var	VALUES,
						CYCLES = 100,
						ELEMENTS = 100 ;
					
					//
					
					//- RingQueue<Number>

						console.group('RingQueue<Number>') ;

						VALUES = [ ] ;
						for(var i = -1 ; ++i < ELEMENTS ; ) VALUES[i] = i ;

						out('> values:') ;
						out(VALUES) ;
						
					//--- Ring<Number>#add
					
						console.group('RingQueue<Number>#enqueue') ;

					//---- Result Profile

					var queue,
						next,
						values = [ ] ;

						queue = RingQueue.create( ) ;
						VALUES.forEach(function(v) { queue.enqueue(v) ; }) ; // fill the queue
					
						next = queue.head_element ; // collect queue values
						do values[values.length] = next.value ;
						while((next = next.next) && next !== queue.head_element) ;
			
						out('sample-result:') ;
						out(values) ;
					
						queue.destroy( ) ;

					//---- Time Profile
					
					var queue,
						aggregate = 0, index = -1, then, now ;
					
						for( ; ++index < CYCLES ; )
						{
								queue = RingQueue.create( ) ;
								then = Date.now( ) ;
								VALUES.forEach(function(v) { queue.enqueue(v) ; }) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								queue.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
						
						console.groupEnd( ) ;
					
					//--- RingQueue<Number>#dequeue
					
					var queue,
						removed,
						next,
						values = [ ] ;
					
						console.group('RingQueue<Number>#dequeue') ;
					
						queue = RingQueue.create( ) ;
						VALUES.forEach(function(v) { queue.enqueue(v) ; }) ;
					
					//----- Result Sample
					
						removed = queue.dequeue( ) ;

						next = queue.head_element ; // collect queue values
						do values[values.length] = next.value ;
						while((next = next.next) && next !== queue.head_element) ;
					
						out('sample-result: %s', removed) ;
						out('remaining-queue:') ;
						out(values) ;
						
					//----- Time Profile
					
					var queue,
						aggregate = 0, index = -1, then, now ;
					
						for( ; ++index < CYCLES ; )
						{
								queue = RingQueue.create( ) ;
								VALUES.forEach(function(v) { queue.enqueue(v) ; }) ;
								then = Date.now( ) ;
								queue.dequeue( );
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;

					//--- RingQueue<Number>#contains
					
					var queue ;
					
						console.group('RingQueue<Number>#contains') ;

						queue = RingQueue.create( ) ;
						VALUES.forEach(function(v) { queue.enqueue(v) ; }) ;

					//---- RingQueue<Number>#contains(value: Null)
					
						console.group('RingQueue<Number>#contains(NULL)') ;
					
					//----- Result Sample
					
						out('sample-result: %s', queue.contains(NULL)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								queue.contains(NULL) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;
					
					//---- RingQueue<Number>#contains(value: Void)
					
						console.group('RingQueue<Number>#contains(VOID)') ;
					
					//----- Result Sample
					
						out('sample-result: %s', queue.contains(VOID)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								queue.contains(VOID) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
				
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;

					//----
					
						console.group('RingQueue<Number>#contains(VALUES[VALUES.length - 1])') ;
					
					//----- Result Sample
					
						out('sample-result: %s', queue.contains(VALUES[VALUES.length - 1])) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								queue.contains(VALUES[VALUES.length - 1]) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;
					
					//----
					
						console.group('RingQueue<Number>#contains(ELEMENTS)') ;
					
					//----- Result Sample
					
						out('sample-result: %s', queue.contains(ELEMENTS)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								queue.contains(ELEMENTS) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;
						console.groupEnd( ) ;
						console.groupEnd( ) ;

				}
		}
}