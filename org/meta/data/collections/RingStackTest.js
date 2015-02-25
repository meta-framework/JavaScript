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
					
					var	arrayShuffle = function(array) { return array.sort(function( ) { return Math.random(1) < 0.5 ? -1 : 1 ; }) ; },
						VALUES,
						CYCLES = 100,
						ELEMENTS = 100 ;
					
					//
					
						VALUES = [ ] ;
						for(var i = -1 ; ++i < ELEMENTS ; ) VALUES[i] = i ;

						out('> values:') ;
						out(VALUES) ;
					
					//--- LinkedList<Number>[sort=void]#get
					
						console.group('LinkedList<Number>[sort=void]#get') ;
					
					//---- LinkedList<Number>[sort=void]#get(ELEMENTS + 1)
					
						console.group('LinkedList<Number>[sort=void]#get(VALUES.length + 1)') ;
					
						list = LinkedList.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.get(VALUES.length + 1)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
					
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.get(ELEMENTS + 1) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;

					//---- LinkedList<Number>#get(ELEMENTS - 1)
					
						console.group('Stack#get(VALUES.length - 1)') ;
					
						stack = LinkedList.create( ) ;
						VALUES.forEach(function(v) { stack.add(v) ; }) ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.get(VALUES.length - 1)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.get(ELEMENTS - 1) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;
					
					// Stack#push
					
						console.group('Stack#push') ;

					//- Sample Result
					
					var stack,
						current,
						values = [ ] ;
					
						stack = RingStack.create( ) ;

						VALUES.forEach(function(v) { stack.push(v) ; }) ;
					
						current = stack.top_element ;
						do values[values.length] = current.value ;
						while((current = current.next) && current !== stack.top_element) ;
					
						out('sample-result:') ;
						out(values) ;
					
					//- Time Profile
					
					var stack,
						then, now, aggregate = 0 ;
					
						for(var i = -1 ; ++i < CYCLES ; )
						{
						
								stack = RingStack.create( ) ;
								then = Date.now( ) ;
								VALUES.forEach(function(v) { stack.push(v) ; }) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
						
						console.groupEnd( ) ;
				
					// Stack#pop
					
						console.group('Stack#pop') ;

					//- Sample Result
					
					var stack,
						removed,
						current,
						values = [ ] ;
					
						stack = RingStack.create( ) ;
						VALUES.forEach(function(v) { stack.push(v) ; }) ;

						removed = stack.pop( ) ;
					
						current = stack.top_element ;
						do values[values.length] = current.value ;
						while((current = current.next) && current !== stack.top_element) ;
					
						out('sample-result:') ;
						out('\t> removed-element: %s', removed) ;
						out('\t> remaining-stack:') ;
						out(values) ;
					
					//- Time Profile
					
					var stack,
						then, now, aggregate = 0 ;
					
						for(var i = -1 ; ++i < CYCLES ; )
						{
						
								stack = RingStack.create( ) ;
								VALUES.forEach(function(v) { stack.push(v) ; }) ;
								then = Date.now( ) ;
								stack.pop( ) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
						
						console.groupEnd( ) ;

				}
		}
}