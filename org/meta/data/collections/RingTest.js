/*
@identifier org.meta.data.collections.RingTest
@require org.meta.data.collections.Ring, org.meta.data.collections.Collection
@extend org.meta.Object
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
					
					//- Ring<Number>

						console.group('Ring<Number>') ;

					//-- Ring<Number> [sort=void]

						console.group('Ring<Number>[sort=void]') ;
					
						VALUES = [ ] ;
						for(var i = -1 ; ++i < ELEMENTS ; ) VALUES[i] = i ;

						out('> values:') ;
						out(VALUES) ;
						
					//--- Ring<Number>#add
					
						console.group('Ring<Number>[sort=void]#add') ;

					//---- Result Profile

					var list,
						next,
						values = [ ] ;

						list = Ring.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ; // fill the list
					
						next = list.head_element ; // collect list values
						do values[values.length] = next.value ;
						while((next = next.next) && next !== list.head_element) ;
			
						out('sample-result:') ;
						out(values) ;
					
						list.destroy( ) ;

					//---- Time Profile
					
					var aggregate = 0, index = -1, then, now
						list ;
					
						for( ; ++index < CYCLES ; )
						{
								list = Ring.create( ) ;
								then = Date.now( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
						
						console.groupEnd( ) ;
					
					//--- Ring<Number>[sort=void]#get
					
						console.group('Ring<Number>[sort=void]#get') ;
					
					//---- Ring<Number>[sort=void]#get(ELEMENTS + 1)
					
						console.group('Ring<Number>[sort=void]#get(VALUES.length + 1)') ;
					
						list = Ring.create( ) ;
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

					//---- Ring<Number>#get(VALUES.length - 1)
					
						console.group('Ring<Number>[sort=void]#get(VALUES.length - 1)') ;
					
						list = Ring.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.get(VALUES.length - 1)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.get(VALUES.length - 1) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;

						console.groupEnd( ) ;
					
					//--- Ring<Number>#remove
					
						console.group('Ring<Number>[sort=void]#remove') ;
					
					//---- Ring<Number>#remove(0)
					
						console.group('Ring<Number>[sort=void]#remove(0)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = Ring.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						removed = list.remove(0) ;
					
						current = list.head_element ;
						do values[values.length] = current.value ;
						while((current = current.next) && current !== list.head_element) ;
					
						out('sample-result:') ;
						out('\t> removed-element: %s', removed) ;
						out('\t> remaining-list:') ;
						out(values) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								list = Ring.create( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								then = Date.now( ) ;
								list.remove(0) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;
					
					//---- Ring<Number>#remove(VALUES.length - 1)
					
						console.group('Ring<Number>[sort=void]#remove(VALUES.length - 1)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = Ring.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						removed = list.remove(VALUES.length - 1) ;
					
						current = list.head_element ;
						do values[values.length] = current.value ;
						while((current = current.next) && current !== list.head_element) ;
					
						out('sample-result:') ;
						out('\t> removed-element: %s', removed) ;
						out('\t> remaining-list:') ;
						out(values) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								list = Ring.create( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								then = Date.now( ) ;
								list.remove(VALUES.length - 1) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;
					
						console.groupEnd( ) ;

					//--- Ring<Number>#contains
					
						console.group('Ring<Number>#contains') ;

						list = Ring.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;

					//---- Ring<Number>#contains(value: Null)
					
						console.group('Ring<Number>#contains(NULL)') ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.contains(NULL)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.contains(NULL) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;
					
					//---- Ring<Number>#contains(value: Void)
					
						console.group('Ring<Number>#contains(VOID)') ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.contains(VOID)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.contains(VOID) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
				
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;

					//----
					
						console.group('Ring<Number>#contains(7)') ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.contains(7)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.contains(7) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;
					
					//----
					
						console.group('Ring<Number>#contains(1000)') ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.contains(1000)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.contains(1000) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;
						console.groupEnd( ) ;
						console.groupEnd( ) ;
						
					//-- Ring<Number>[sort=default]

						console.group('Ring<Number>[sort=default]') ;
					
						VALUES = [ ] ;
						for(var i = -1 ; ++i < ELEMENTS / 2 ; ) VALUES[i] = i ;
						for(var i = -1 ; ++i < ELEMENTS / 2 ; ) VALUES[(ELEMENTS / 2) + i] = i ; // duplicates
						VALUES = arrayShuffle(VALUES) ; // unsort

						out('> values:') ;
						out(VALUES) ;
						
					//--- Ring<Number>[sorted]#add
					
						console.group('Ring<Number>[sort=default]#add') ;

					//---- Result Profile

					var list,
						next,
						values = [ ] ;
						
						list = Ring.create({attributes: Collection.SORTED_COLLECTION}) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;

						next = list.head_element ;
						do values[values.length] = next.value ;
						while((next = next.next) && next !== list.head_element) ;

						out('sample-result:') ;
						out(values) ;

					//---- Time Profile

					var aggregate = 0, index = -1, then, now
						list ;
						for( ; ++index < CYCLES ; )
						{
								list = Ring.create({attributes: Collection.SORTED_COLLECTION}) ;
								then = Date.now( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;
						
						console.groupEnd( ) ;
						
						console.groupEnd( ) ;

					//- Ring<String>
					
					var ASCII = ['!', '\"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', ',','c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~'],
						VALUES = [ ] ;

						for(var i = -1 ; ++i < ELEMENTS ; )
						{
								VALUES[i] = arrayCopy(arrayShuffle(ASCII), Math.floor(128 * Math.random( )))
								.join('')
						}
						
						console.group('Ring<String>') ;
						out('values:') ;
						out(VALUES) ;

					//-- Ring<String>[sort=void]
					
						console.group('Ring<String>[sort=void]') ;

					//--- Ring<String>[sort=void]#add
					
						console.group('Ring<String>[sort=void]#add') ;

					//---- Result Profile

					var list,
						next,
						values = [ ] ;

						list = Ring.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ; // fill the list
					
						next = list.head_element ; // collect list values
						do values[values.length] = next.value ;
						while((next = next.next) && next !== list.head_element) ;
			
						list.destroy( ) ;

						out('sample-result:') ;
						out(values) ;

					//---- Time Profile
					
					var aggregate = 0, index = -1, then, now
						list ;

						for( ; ++index < CYCLES ; )
						{
								list = Ring.create( ) ;
								then = Date.now( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}

						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;

						console.groupEnd( ) ;
					
					//--- Ring<String>[sort=void]#get
					
						console.group('Ring<String>[sort=void]#get') ;
					
					//---- Ring<Number>[sort=void]#get(VALUES.length + 1)
					
						console.group('Ring<String>[sort=void]#get(VALUES.length + 1)') ;
					
						list = Ring.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.get(VALUES.length + 1)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
					
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.get(VALUES.length + 1) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						list.destroy( ) ;
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;

					//---- Ring<String>#get(VALUES.length - 1)
					
						console.group('Ring<String>[sort=void]#get(VALUES.length - 1)') ;
					
						list = Ring.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.get(VALUES.length - 1)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;

						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.get(VALUES.length - 1) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						list.destroy( ) ;
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;

						console.groupEnd( ) ;
					
					//--- Ring<Number>#remove
					
						console.group('Ring<String>[sort=void]#remove') ;
					
					//---- Ring<Number>#remove(0)
					
						console.group('Ring<String>[sort=void]#remove(0)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = Ring.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						removed = list.remove(0) ;
					
						current = list.head_element ;
						do values[values.length] = current.value ;
						while((current = current.next) && current !== list.head_element) ;
					
						list.destroy( ) ;
					
						out('sample-result:') ;
						out('\t> removed-element: %s', removed) ;
						out('\t> remaining-list:') ;
						out(values) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								list = Ring.create( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								then = Date.now( ) ;
								list.remove(0) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;
					
					//---- Ring<Number>#remove(VALUES.length - 1)
					
						console.group('Ring<String>[sort=void]#remove(VALUES.length - 1)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = Ring.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						removed = list.remove(VALUES.length - 1) ;
					
						current = list.head_element ;
						do values[values.length] = current.value ;
						while((current = current.next) && current !== list.head_element) ;
					
						list.destroy( ) ;
					
						out('sample-result:') ;
						out('\t> removed-element: %s', removed) ;
						out('\t> remaining-list:') ;
						out(values) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;

						for( ; ++index < CYCLES ; )
						{
								list = Ring.create( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								then = Date.now( ) ;
								list.remove(VALUES.length - 1) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;
					
						console.groupEnd( ) ;

					//--- Ring<Number>#contains
					
						console.group('Ring<String>#contains') ;

						list = Ring.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;

					//---- Ring<Number>#contains(value: Null)
					
						console.group('Ring<String>#contains(NULL)') ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.contains(NULL)) ;
					
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.contains(NULL) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}

						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;
					
					//---- Ring<Number>#contains(VOID)
					
						console.group('Ring<String>[sort=void]#contains(VOID)') ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.contains(VOID)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.contains(VOID) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
				
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;

					//----
					
						console.group('Ring<String>[sort=void]#contains(VALUES[VALUES.length - 1])') ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.contains(VALUES[VALUES.length - 1])) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;

						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.contains(VALUES[VALUES.length - 1]) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;
					
					//----
					
						console.group('Ring<String>[sort=void]#contains(\'\')') ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.contains('')) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.contains('') ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						list.destroy( ) ; // this instance was used for all `Ring#contains` tests
					
						console.groupEnd( ) ;
					
						console.groupEnd( ) ;
						
						console.groupEnd( ) ;
					
					//-- Ring<String>[sorted]
					
						console.group('Ring<String>[sort=default]') ;

					//--- Ring<String>#add
					
						console.group('Ring<String>[sort=default]#add') ;

					//---- Result Profile

					var list,
						next,
						values = [ ] ;

						list = Ring.create({attributes: Collection.SORTED_COLLECTION}) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ; // fill the list
					
						next = list.head_element ; // collect list values
						do values[values.length] = next.value ;
						while((next = next.next) && next !== list.head_element) ;

						list.destroy( ) ;
			
						out('sample-result:') ;
						out(values) ;

					//---- Time Profile
					
					var aggregate = 0, index = -1, then, now,
						list ;

						for( ; ++index < CYCLES ; )
						{
								list = Ring.create({attributes: Collection.SORTED_COLLECTION}) ;
								then = Date.now( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}

						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
					//--- Ring<String>[sort=void]#get
					
						console.group('Ring<String>[sort=default]#get') ;
					
					//---- Ring<Number>[sort=void]#get(VALUES.length + 1)
					
						console.group('Ring<String>[sort=default]#get(VALUES.length + 1)') ;
					
						list = Ring.create({attributes: Collection.SORTED_COLLECTION}) ;
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
					
						list.destroy( ) ;
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;

					//---- Ring<String>#get(VALUES.length - 1)
					
						console.group('Ring<String>[sort=default]#get(VALUES.length - 1)') ;
					
						list = Ring.create({attributes: Collection.SORTED_COLLECTION}) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.get(VALUES.length - 1)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;

						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.get(VALUES.length - 1) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						list.destroy( ) ;
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;

						console.groupEnd( ) ;
					
					//--- Ring<Number>#remove
					
						console.group('Ring<String>[sort=default]#remove') ;
					
					//---- Ring<Number>#remove(0)
					
						console.group('Ring<String>[sort=default]#remove(0)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = Ring.create({attributes: Collection.SORTED_COLLECTION}) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						removed = list.remove(0) ;
					
						current = list.head_element ;
						do values[values.length] = current.value ;
						while((current = current.next) && current !== list.head_element) ;
					
						list.destroy( ) ;
					
						out('sample-result:') ;
						out('\t> removed-element: %s', removed) ;
						out('\t> remaining-list:') ;
						out(values) ;
					
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								list = Ring.create({attributes: Collection.SORTED_COLLECTION}) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								then = Date.now( ) ;
								list.remove(0) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;
					
					//---- Ring<Number>#remove(VALUES.length - 1)
					
						console.group('Ring<String>[sort=default]#remove(VALUES.length - 1)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = Ring.create({attributes: Collection.SORTED_COLLECTION}) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						removed = list.remove(VALUES.length - 1) ;
					
						current = list.head_element ;
						do values[values.length] = current.value ;
						while((current = current.next) && current !== list.head_element) ;
					
						list.destroy( ) ;
					
						out('sample-result:') ;
						out('\t> removed-element: %s', removed) ;
						out('\t> remaining-list:') ;
						out(values) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								list = Ring.create( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								then = Date.now( ) ;
								list.remove(VALUES.length - 1) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;
					
						console.groupEnd( ) ;

					//--- Ring<Number>#contains
					
						console.group('Ring<String>[sort=default]#contains') ;

						list = Ring.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;

					//---- Ring<Number>#contains(value: Null)
					
						console.group('Ring<String>[sort=default]#contains(NULL)') ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.contains(NULL)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.contains(NULL) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;
					
					//---- Ring<Number>#contains(value: Void)
					
						console.group('Ring<String>[sort=default]#contains(VOID)') ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.contains(VOID)) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.contains(VOID) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
				
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;

					//----
					
						console.group('Ring<String>[sort=default]#contains(VALUES[VALUES.length - 1])') ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.contains(VALUES[VALUES.length - 1])) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.contains(VALUES[VALUES.length - 1]) ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						console.groupEnd( ) ;
					
					//----
					
						console.group('Ring<String>[sort=default]#contains(\'\')') ;
					
					//----- Result Sample
					
						out('sample-result: %s', list.contains('')) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								then = Date.now( ) ;
								list.contains('') ;
								now = Date.now( ) ;
								aggregate += now - then ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
						list.destroy( ) ; // this instance was used for all `Ring.contains` tests.
					
						console.groupEnd( ) ;
					
						console.groupEnd( ) ;
						
						console.groupEnd( ) ;

				}
		}
}