/*
@identifier org.meta.data.collections.DoubleLinkedListTest
@require org.meta.data.collections.DoubleLinkedList
@extend org.meta.Object
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
					
					//- DoubleLinkedList<Number>

						console.group('DoubleLinkedList<Number>') ;

					//-- DoubleLinkedList<Number> [sort=void]

						console.group('DoubleLinkedList<Number>[sort=void]') ;
					
						VALUES = [ ] ;
						for(var i = -1 ; ++i < ELEMENTS ; ) VALUES[i] = i ;

						out('> values:') ;
						out(VALUES) ;
						
					//--- DoubleLinkedList<Number>#add
					
						console.group('DoubleLinkedList<Number>[sort=void]#add') ;

					//---- Result Profile

					var list,
						next,
						values = [ ] ;

						list = DoubleLinkedList.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ; // fill the list
					
						next = list.head_element ; // collect list values
						do values[values.length] = next.value ;
						while((next = next.next)) ;
			
						out('sample-result:') ;
						out(values) ;
					
						list.destroy( ) ;

					//---- Time Profile
					
					var aggregate = 0, index = -1, then, now
						list ;
					
						for( ; ++index < CYCLES ; )
						{
								list = DoubleLinkedList.create( ) ;
								then = Date.now( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
						
						console.groupEnd( ) ;
					
					//--- DoubleLinkedList<Number>[sort=void]#get
					
						console.group('DoubleLinkedList<Number>[sort=void]#get') ;
					
					//---- DoubleLinkedList<Number>[sort=void]#get(ELEMENTS + 1)
					
						console.group('DoubleLinkedList<Number>[sort=void]#get(VALUES.length + 1)') ;
					
						list = DoubleLinkedList.create( ) ;
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

					//---- DoubleLinkedList<Number>#get(VALUES.length - 1)
					
						console.group('DoubleLinkedList<Number>[sort=void]#get(VALUES.length - 1)') ;
					
						list = DoubleLinkedList.create( ) ;
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
					
					//--- DoubleLinkedList<Number>#remove
					
						console.group('DoubleLinkedList<Number>[sort=void]#remove') ;
					
					//---- DoubleLinkedList<Number>#remove(0)
					
						console.group('DoubleLinkedList<Number>[sort=void]#remove(0)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = DoubleLinkedList.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						removed = list.remove(0) ;
					
						current = list.head_element ;
						do values[values.length] = current.value ;
						while((current = current.next)) ;
					
						out('sample-result:') ;
						out('\t> removed-element: %s', removed) ;
						out('\t> remaining-list:') ;
						out(values) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								list = DoubleLinkedList.create( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								then = Date.now( ) ;
								list.remove(0) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;
					
					//---- DoubleLinkedList<Number>#remove(VALUES.length - 1)
					
						console.group('DoubleLinkedList<Number>[sort=void]#remove(VALUES.length - 1)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = DoubleLinkedList.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						removed = list.remove(VALUES.length - 1) ;
					
						current = list.head_element ;
						do values[values.length] = current.value ;
						while((current = current.next)) ;
					
						out('sample-result:') ;
						out('\t> removed-element: %s', removed) ;
						out('\t> remaining-list:') ;
						out(values) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								list = DoubleLinkedList.create( ) ;
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

					//--- DoubleLinkedList<Number>#contains
					
						console.group('DoubleLinkedList<Number>#contains') ;

						list = DoubleLinkedList.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;

					//---- DoubleLinkedList<Number>#contains(value: Null)
					
						console.group('DoubleLinkedList<Number>#contains(NULL)') ;
					
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
					
					//---- DoubleLinkedList<Number>#contains(value: Void)
					
						console.group('DoubleLinkedList<Number>#contains(VOID)') ;
					
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
					
						console.group('DoubleLinkedList<Number>#contains(7)') ;
					
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
					
						console.group('DoubleLinkedList<Number>#contains(1000)') ;
					
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
						
					//-- DoubleLinkedList<Number>[sort=default]

						console.group('DoubleLinkedList<Number>[sort=default]') ;
					
						VALUES = [ ] ;
						for(var i = -1 ; ++i < ELEMENTS / 2 ; ) VALUES[i] = i ;
						for(var i = -1 ; ++i < ELEMENTS / 2 ; ) VALUES[(ELEMENTS / 2) + i] = i ; // duplicates
						VALUES = arrayShuffle(VALUES) ; // unsort

						out('> values:') ;
						out(VALUES) ;
						
					//--- DoubleLinkedList<Number>[sorted]#add
					
						console.group('DoubleLinkedList<Number>[sort=default]#add') ;

					//---- Result Profile

					var list,
						next,
						values = [ ] ;
						
						list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;

						next = list.head_element ;
						do values[values.length] = next.value ;
						while((next = next.next)) ;

						out('sample-result:') ;
						out(values) ;

					//---- Time Profile

					var aggregate = 0, index = -1, then, now
						list ;
						for( ; ++index < CYCLES ; )
						{
								list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
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

					//- DoubleLinkedList<String>
					
					var ASCII = ['!', '\"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', ',','c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~'],
						VALUES = [ ] ;

						for(var i = -1 ; ++i < ELEMENTS ; )
						{
								VALUES[i] = arrayCopy(arrayShuffle(ASCII), Math.floor(128 * Math.random( )))
								.join('')
						}
						
						console.group('DoubleLinkedList<String>') ;
						out('values:') ;
						out(VALUES) ;

					//-- DoubleLinkedList<String>[sort=void]
					
						console.group('DoubleLinkedList<String>[sort=void]') ;

					//--- DoubleLinkedList<String>[sort=void]#add
					
						console.group('DoubleLinkedList<String>[sort=void]#add') ;

					//---- Result Profile

					var list,
						next,
						values = [ ] ;

						list = DoubleLinkedList.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ; // fill the list
					
						next = list.head_element ; // collect list values
						do values[values.length] = next.value ;
						while((next = next.next)) ;
			
						list.destroy( ) ;

						out('sample-result:') ;
						out(values) ;

					//---- Time Profile
					
					var aggregate = 0, index = -1, then, now
						list ;

						for( ; ++index < CYCLES ; )
						{
								list = DoubleLinkedList.create( ) ;
								then = Date.now( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}

						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;

						console.groupEnd( ) ;
					
					//--- DoubleLinkedList<String>[sort=void]#get
					
						console.group('DoubleLinkedList<String>[sort=void]#get') ;
					
					//---- DoubleLinkedList<Number>[sort=void]#get(VALUES.length + 1)
					
						console.group('DoubleLinkedList<String>[sort=void]#get(VALUES.length + 1)') ;
					
						list = DoubleLinkedList.create( ) ;
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

					//---- DoubleLinkedList<String>#get(VALUES.length - 1)
					
						console.group('DoubleLinkedList<String>[sort=void]#get(VALUES.length - 1)') ;
					
						list = DoubleLinkedList.create( ) ;
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
					
					//--- DoubleLinkedList<Number>#remove
					
						console.group('DoubleLinkedList<String>[sort=void]#remove') ;
					
					//---- DoubleLinkedList<Number>#remove(0)
					
						console.group('DoubleLinkedList<String>[sort=void]#remove(0)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = DoubleLinkedList.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						removed = list.remove(0) ;
					
						current = list.head_element ;
						do values[values.length] = current.value ;
						while((current = current.next)) ;
					
						list.destroy( ) ;
					
						out('sample-result:') ;
						out('\t> removed-element: %s', removed) ;
						out('\t> remaining-list:') ;
						out(values) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								list = DoubleLinkedList.create( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								then = Date.now( ) ;
								list.remove(0) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;
					
					//---- DoubleLinkedList<Number>#remove(VALUES.length - 1)
					
						console.group('DoubleLinkedList<String>[sort=void]#remove(VALUES.length - 1)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = DoubleLinkedList.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						removed = list.remove(VALUES.length - 1) ;
					
						current = list.head_element ;
						do values[values.length] = current.value ;
						while((current = current.next)) ;
					
						list.destroy( ) ;
					
						out('sample-result:') ;
						out('\t> removed-element: %s', removed) ;
						out('\t> remaining-list:') ;
						out(values) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;

						for( ; ++index < CYCLES ; )
						{
								list = DoubleLinkedList.create( ) ;
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

					//--- DoubleLinkedList<Number>#contains
					
						console.group('DoubleLinkedList<String>#contains') ;

						list = DoubleLinkedList.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;

					//---- DoubleLinkedList<Number>#contains(value: Null)
					
						console.group('DoubleLinkedList<String>#contains(NULL)') ;
					
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
					
					//---- DoubleLinkedList<Number>#contains(VOID)
					
						console.group('DoubleLinkedList<String>[sort=void]#contains(VOID)') ;
					
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
					
						console.group('DoubleLinkedList<String>[sort=void]#contains(VALUES[VALUES.length - 1])') ;
					
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
					
						console.group('DoubleLinkedList<String>[sort=void]#contains(\'\')') ;
					
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
					
						list.destroy( ) ; // this instance was used for all `DoubleLinkedList#contains` tests
					
						console.groupEnd( ) ;
					
						console.groupEnd( ) ;
						
						console.groupEnd( ) ;
					
					//-- DoubleLinkedList<String>[sorted]
					
						console.group('DoubleLinkedList<String>[sort=default]') ;

					//--- DoubleLinkedList<String>#add
					
						console.group('DoubleLinkedList<String>[sort=default]#add') ;

					//---- Result Profile

					var list,
						next,
						values = [ ] ;

						list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ; // fill the list
					
						next = list.head_element ; // collect list values
						do values[values.length] = next.value ;
						while((next = next.next)) ;

						list.destroy( ) ;
			
						out('sample-result:') ;
						out(values) ;

					//---- Time Profile
					
					var aggregate = 0, index = -1, then, now,
						list ;

						for( ; ++index < CYCLES ; )
						{
								list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
								then = Date.now( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}

						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
					//--- DoubleLinkedList<String>[sort=void]#get
					
						console.group('DoubleLinkedList<String>[sort=default]#get') ;
					
					//---- DoubleLinkedList<Number>[sort=void]#get(VALUES.length + 1)
					
						console.group('DoubleLinkedList<String>[sort=default]#get(VALUES.length + 1)') ;
					
						list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
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

					//---- DoubleLinkedList<String>#get(VALUES.length - 1)
					
						console.group('DoubleLinkedList<String>[sort=default]#get(VALUES.length - 1)') ;
					
						list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
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
					
					//--- DoubleLinkedList<Number>#remove
					
						console.group('DoubleLinkedList<String>[sort=default]#remove') ;
					
					//---- DoubleLinkedList<Number>#remove(0)
					
						console.group('DoubleLinkedList<String>[sort=default]#remove(0)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						removed = list.remove(0) ;
					
						current = list.head_element ;
						do values[values.length] = current.value ;
						while((current = current.next)) ;
					
						list.destroy( ) ;
					
						out('sample-result:') ;
						out('\t> removed-element: %s', removed) ;
						out('\t> remaining-list:') ;
						out(values) ;
					
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								then = Date.now( ) ;
								list.remove(0) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;
					
					//---- DoubleLinkedList<Number>#remove(VALUES.length - 1)
					
						console.group('DoubleLinkedList<String>[sort=default]#remove(VALUES.length - 1)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;
					
					//----- Result Sample
					
						removed = list.remove(VALUES.length - 1) ;
					
						current = list.head_element ;
						do values[values.length] = current.value ;
						while((current = current.next)) ;
					
						list.destroy( ) ;
					
						out('sample-result:') ;
						out('\t> removed-element: %s', removed) ;
						out('\t> remaining-list:') ;
						out(values) ;
						
					//----- Time Profile
					
					var aggregate = 0, index = -1, then, now ;
						for( ; ++index < CYCLES ; )
						{
								list = DoubleLinkedList.create( ) ;
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

					//--- DoubleLinkedList<Number>#contains
					
						console.group('DoubleLinkedList<String>[sort=default]#contains') ;

						list = DoubleLinkedList.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;

					//---- DoubleLinkedList<Number>#contains(value: Null)
					
						console.group('DoubleLinkedList<String>[sort=default]#contains(NULL)') ;
					
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
					
					//---- DoubleLinkedList<Number>#contains(value: Void)
					
						console.group('DoubleLinkedList<String>[sort=default]#contains(VOID)') ;
					
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
					
						console.group('DoubleLinkedList<String>[sort=default]#contains(VALUES[VALUES.length - 1])') ;
					
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
					
						console.group('DoubleLinkedList<String>[sort=default]#contains(\'\')') ;
					
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
					
						list.destroy( ) ; // this instance was used for all `DoubleLinkedList.contains` tests.
					
						console.groupEnd( ) ;
					
						console.groupEnd( ) ;
						
						console.groupEnd( ) ;

/*
					// variables
					
					var	arrayShuffle = function(array) { return array.sort(function( ) { return Math.random(1) < 0.5 ? -1 : 1 ; }) ; },
						VALUES,
						CYCLES = 100,
						ELEMENTS = 100 ;
					
					//
					
					//- DoubleLinkedList<Number>

						console.group('DoubleLinkedList<Number>') ;

					//-- DoubleLinkedList<Number> [sort=void]

						console.group('DoubleLinkedList<Number>[sort=void]') ;
					
						VALUES = [ ] ;
						for(var i = -1 ; ++i < ELEMENTS ; ) VALUES[i] = i ;

						out('> values:') ;
						out(VALUES) ;
						
					//--- DoubleLinkedList<Number>#add
					
						console.group('DoubleLinkedList<Number>[sort=void]#add') ;

					//---- Result Profile
					
					var list,
						next,
						values = [ ] ;

						list = DoubleLinkedList.create( ) ;
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
								list = DoubleLinkedList.create( ) ;
								then = Date.now( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
						
						console.groupEnd( ) ;

					//--- DoubleLinkedList<Number>[sort=void]#get
					
						console.group('DoubleLinkedList<Number>[sort=void]#get') ;
					
					//---- DoubleLinkedList<Number>[sort=void]#get(ELEMENTS + 1)
					
						console.group('DoubleLinkedList<Number>[sort=void]#get(VALUES.length + 1)') ;
					
						list = DoubleLinkedList.create( ) ;
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

					//---- DoubleLinkedList<Number>#get(VALUES.length - 1)
					
						console.group('DoubleLinkedList<Number>[sort=void]#get(VALUES.length - 1)') ;
					
						list = DoubleLinkedList.create( ) ;
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

					//--- DoubleLinkedList<Number>#remove
					
						console.group('DoubleLinkedList<Number>[sort=void]#remove') ;
					
					//---- DoubleLinkedList<Number>#remove(0)
					
						console.group('DoubleLinkedList<Number>[sort=void]#remove(0)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = DoubleLinkedList.create( ) ;
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
								list = DoubleLinkedList.create( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								then = Date.now( ) ;
								list.remove(0) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;
					
					//---- DoubleLinkedList<Number>#remove(VALUES.length - 1)
					
						console.group('DoubleLinkedList<Number>[sort=void]#remove(VALUES.length - 1)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = DoubleLinkedList.create( ) ;
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
								list = DoubleLinkedList.create( ) ;
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

					//--- DoubleLinkedList<Number>#contains
					
						console.group('DoubleLinkedList<Number>#contains') ;

						list = DoubleLinkedList.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;

					//---- DoubleLinkedList<Number>#contains(value: Null)
					
						console.group('DoubleLinkedList<Number>#contains(NULL)') ;
					
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

					//---- DoubleLinkedList<Number>#contains(value: Void)
					
						console.group('DoubleLinkedList<Number>#contains(VOID)') ;
					
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
					
						console.group('DoubleLinkedList<Number>#contains(7)') ;
					
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
					
						console.group('DoubleLinkedList<Number>#contains(1000)') ;
					
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
/*
					//-- DoubleLinkedList<Number>[sort=default]

						console.group('DoubleLinkedList<Number>[sort=default]') ;
					
						ELEMENTS = 50 ;
						VALUES = [ ] ;
						for(var i = -1 ; ++i < ELEMENTS ; ) VALUES[i] = i ;
						for(var i = -1 ; ++i < ELEMENTS ; ) VALUES[ELEMENTS + i] = i ; // duplicates
						VALUES = arrayShuffle(VALUES) ; // unsort

						out('> values:') ;
						out(VALUES) ;
						
					//--- DoubleLinkedList<Number>[sorted]#add
					
						console.group('DoubleLinkedList<Number>[sort=default]#add') ;

					//---- Result Profile

					var list,
						next,
						values = [ ] ;
						
						list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
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
								list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
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

					//- DoubleLinkedList<String>
					
					var ASCII = ['!', '\"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', ',','c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~'],
						VALUES = [ ] ;

						for(var i = -1 ; ++i < ELEMENTS ; )
						{
								VALUES[i] = arrayCopy(arrayShuffle(ASCII), Math.floor(128 * Math.random( )))
								.join('')
						}
						
						console.group('DoubleLinkedList<String>') ;
						out('values:') ;
						out(VALUES) ;

					//-- DoubleLinkedList<String>[sort=void]
					
						console.group('DoubleLinkedList<String>[sort=void]') ;

					//--- DoubleLinkedList<String>[sort=void]#add
					
						console.group('DoubleLinkedList<String>[sort=void]#add') ;

					//---- Result Profile

					var list,
						next,
						values = [ ] ;

						list = DoubleLinkedList.create( ) ;
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
								list = DoubleLinkedList.create( ) ;
								then = Date.now( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}

						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;
						console.groupEnd( ) ;
					
					//--- DoubleLinkedList<String>[sort=void]#get
					
						console.group('DoubleLinkedList<String>[sort=void]#get') ;
					
					//---- DoubleLinkedList<Number>[sort=void]#get(VALUES.length + 1)
					
						console.group('DoubleLinkedList<String>[sort=void]#get(VALUES.length + 1)') ;
					
						list = DoubleLinkedList.create( ) ;
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

					//---- DoubleLinkedList<String>#get(VALUES.length - 1)
					
						console.group('DoubleLinkedList<String>[sort=void]#get(VALUES.length - 1)') ;
					
						list = DoubleLinkedList.create( ) ;
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
					
					//--- DoubleLinkedList<Number>#remove
					
						console.group('DoubleLinkedList<String>[sort=void]#remove') ;
					
					//---- DoubleLinkedList<Number>#remove(0)
					
						console.group('DoubleLinkedList<String>[sort=void]#remove(0)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = DoubleLinkedList.create( ) ;
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
								list = DoubleLinkedList.create( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								then = Date.now( ) ;
								list.remove(0) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;
					
					//---- DoubleLinkedList<Number>#remove(VALUES.length - 1)
					
						console.group('DoubleLinkedList<String>[sort=void]#remove(VALUES.length - 1)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = DoubleLinkedList.create( ) ;
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
								list = DoubleLinkedList.create( ) ;
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

					//--- DoubleLinkedList<Number>#contains
					
						console.group('DoubleLinkedList<String>#contains') ;

						list = DoubleLinkedList.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;

					//---- DoubleLinkedList<Number>#contains(value: Null)
					
						console.group('DoubleLinkedList<String>#contains(NULL)') ;
					
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
					
					//---- DoubleLinkedList<Number>#contains(VOID)
					
						console.group('DoubleLinkedList<String>[sort=void]#contains(VOID)') ;
					
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
					
						console.group('DoubleLinkedList<String>[sort=void]#contains(VALUES[VALUES.length - 1])') ;
					
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
					
						console.group('DoubleLinkedList<String>[sort=void]#contains(\'\')') ;
					
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
					
						list.destroy( ) ; // this instance was used for all `DoubleLinkedList#contains` tests
					
						console.groupEnd( ) ;
					
						console.groupEnd( ) ;
						
						console.groupEnd( ) ;
					
					//-- DoubleLinkedList<String>[sorted]
					
						console.group('DoubleLinkedList<String>[sort=default]') ;

					//--- DoubleLinkedList<String>#add
					
						console.group('DoubleLinkedList<String>[sort=default]#add') ;

					//---- Result Profile

					var list,
						next,
						values = [ ] ;

						list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
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
								list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
								then = Date.now( ) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}

						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;
					
					//--- DoubleLinkedList<String>[sort=void]#get
					
						console.group('DoubleLinkedList<String>[sort=default]#get') ;
					
					//---- DoubleLinkedList<Number>[sort=void]#get(VALUES.length + 1)
					
						console.group('DoubleLinkedList<String>[sort=default]#get(VALUES.length + 1)') ;
					
						list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
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

					//---- DoubleLinkedList<String>#get(VALUES.length - 1)
					
						console.group('DoubleLinkedList<String>[sort=default]#get(VALUES.length - 1)') ;
					
						list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
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
					
					//--- DoubleLinkedList<Number>#remove
					
						console.group('DoubleLinkedList<String>[sort=default]#remove') ;
					
					//---- DoubleLinkedList<Number>#remove(0)
					
						console.group('DoubleLinkedList<String>[sort=default]#remove(0)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
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
								list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
								VALUES.forEach(function(v) { list.add(v) ; }) ;
								then = Date.now( ) ;
								list.remove(0) ;
								now = Date.now( ) ;
								aggregate += now - then ;
								list.destroy( ) ;
						}
					
						out('average-time (cycles=%s, elements=%s, aggregate=%sms): %sms', CYCLES, ELEMENTS, aggregate, aggregate/CYCLES) ;

						console.groupEnd( ) ;
					
					//---- DoubleLinkedList<Number>#remove(VALUES.length - 1)
					
						console.group('DoubleLinkedList<String>[sort=default]#remove(VALUES.length - 1)') ;
					
					var list,
						current,
						values = [ ],
						removed ;

						list = DoubleLinkedList.create({sort: DoubleLinkedList.SORT_DEFAULT}) ;
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
								list = DoubleLinkedList.create( ) ;
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

					//--- DoubleLinkedList<Number>#contains
					
						console.group('DoubleLinkedList<String>[sort=default]#contains') ;

						list = DoubleLinkedList.create( ) ;
						VALUES.forEach(function(v) { list.add(v) ; }) ;

					//---- DoubleLinkedList<Number>#contains(value: Null)
					
						console.group('DoubleLinkedList<String>[sort=default]#contains(NULL)') ;
					
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
					
					//---- DoubleLinkedList<Number>#contains(value: Void)
					
						console.group('DoubleLinkedList<String>[sort=default]#contains(VOID)') ;
					
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
					
						console.group('DoubleLinkedList<String>[sort=default]#contains(VALUES[VALUES.length - 1])') ;
					
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
					
						console.group('DoubleLinkedList<String>[sort=default]#contains(\'\')') ;
					
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
					
						list.destroy( ) ; // this instance was used for all `DoubleLinkedList.contains` tests.
					
						console.groupEnd( ) ;
					
						console.groupEnd( ) ;
						
						console.groupEnd( ) ;
*/
				}
		}
}