/*
@identifier org.meta.data.collections.RingStackTest
@extend org.meta.Object
@require org.meta.data.collections.RingStack
@description Tests `org.meta.data.collections.RingStack`
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
					
					//- RingStack<Number>

						console.group('RingStack<Number>') ;

						VALUES = [ ] ;
						for(var i = -1 ; ++i < ELEMENTS ; ) VALUES[i] = i ;

						out('> values:') ;
						out(VALUES) ;
						
					//--- Ring<Number>#add
					
						console.group('RingStack<Number>#push') ;

					//---- Result Profile

					var stack,
						next,
						values = [ ] ;

						stack = RingStack.create( ) ;
						VALUES.forEach(function(v) { stack.push(v) ; }) ; // fill the stack
					
						next = stack.head_element ; // collect stack values
						do values[values.length] = next.value ;
						while((next = next.next) && next !== stack.head_element) ;
			
						out('sample-result:') ;
						out(values) ;
					
						stack.destroy( ) ;

					//---- Time Profile
					
					var stack,
						aggregate = 0, index = -1, then, now ;
					
						for( ; ++index < CYCLES ; )
						{
								stack = RingStack.create( ) ;
								then = Date.now( ) ;
								VALUES.forEach(function(v) { stack.push(v) ; }) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								stack.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
						
						console.groupEnd( ) ;
					
					//--- RingStack<Number>#pop
					
					var stack,
						removed,
						next,
						values = [ ] ;
					
						console.group('RingStack<Number>#pop') ;
					
						stack = RingStack.create( ) ;
						VALUES.forEach(function(v) { stack.push(v) ; }) ;
					
					//----- Result Sample
					
						removed = stack.pop( ) ;

						next = stack.head_element ; // collect stack values
						do values[values.length] = next.value ;
						while((next = next.next) && next !== stack.head_element) ;
					
						out('sample-result: %s', removed) ;
						out('remaining-stack:') ;
						out(values) ;
						
					//----- Time Profile
					
					var stack,
						aggregate = 0, index = -1, then, now ;
					
						for( ; ++index < CYCLES ; )
						{
								stack = RingStack.create( ) ;
								VALUES.forEach(function(v) { stack.push(v) ; }) ;
								then = Date.now( ) ;
								stack.pop( );
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;

					//--- RingStack<Number>#contains
					
					var stack ;
					
						console.group('RingStack<Number>#contains') ;

						stack = RingStack.create( ) ;
						VALUES.forEach(function(v) { stack.push(v) ; }) ;

					//---- RingStack<Number>#contains(value: Null)
					
						console.group('RingStack<Number>#contains(NULL)') ;
					
					//----- Result Sample
					
						out('sample-result: %s', stack.contains(NULL)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								stack.contains(NULL) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;
					
					//---- RingStack<Number>#contains(value: Void)
					
						console.group('RingStack<Number>#contains(VOID)') ;
					
					//----- Result Sample
					
						out('sample-result: %s', stack.contains(VOID)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								stack.contains(VOID) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
				
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;

					//----
					
						console.group('RingStack<Number>#contains(VALUES[VALUES.length - 1])') ;
					
					//----- Result Sample
					
						out('sample-result: %s', stack.contains(VALUES[VALUES.length - 1])) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								stack.contains(VALUES[VALUES.length - 1]) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;
					
					//----
					
						console.group('RingStack<Number>#contains(ELEMENTS)') ;
					
					//----- Result Sample
					
						out('sample-result: %s', stack.contains(ELEMENTS)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								stack.contains(ELEMENTS) ;
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