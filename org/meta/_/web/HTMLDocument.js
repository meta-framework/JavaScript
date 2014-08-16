Meta.define(  {
		/**A wrapper for the default (X)HTML Document exposing utility methods.*/
		name: "HTMLDocument",
		package: "org.meta.web.dom",
		prototype: "org.meta.web.dom.XMLDocument",
		type: Meta.STRING_OBJECT_TYPE_SINGLETON,
		require: ["org.meta.logic.Schedule","org.meta.web.dom.DOM","org.meta.web.dom.DOMContainer","org.meta.logic.path.Paths","org.meta.web.css.Style"],
		main: function main(arguments)
		{

			// variables
			
			var nl, s ;

			// 

				this.root = Meta.DEFAULT_DOCUMENT ;
				this.lexicon = { "*": this.root.getElementsByTagName("*") } ;

				/*Initalize the selection of `org.meta.web.dom.Document` to the default `Document` `Object`.*/

				this.select(Meta.DEFAULT_DOCUMENT) ;
				
				/*Set a monitoring `Schedule` for the `Document` ``ready'' event.*/
				
				nl = document.getElementsByTagName("*") ;
				this.DOCUMENT_LENGTH = nl.length ;

				s = new org.meta.logic.Schedule( 10, {auto_repeat: true, repeatable: true} ) ;
				s.add(  {
						target: this,
						action: function(schedule,list) {

								var i ;

									if( (i = list.length) === this.DOCUMENT_LENGTH ) {

											schedule.close( ) ;
											
											this.DOCUMENT_READY = true ;

											org.meta.web.dom.DOM.triggerEvent("ready",Meta.DEFAULT_DOCUMENT) ;

									}
									else { this.DOCUMENT_LENGTH = i ; }

						},
						parameter: [s,nl]
				}  )
				.run( ) ;
				
				/*Register a DOM level one event handler on the `DefaultView` `Object` to detect global load.*/
				
				Meta.DEFAULT_VIEW.onload = function ( ) { org.meta.web.dom.Document.WINDOW_LOADED = true ; }

		},
		local: {
				WINDOW_LOADED: false,
				DOCUMENT_READY: false,
				DOCUMENT_NODE_LENGTH: 0,
				schedules: null,
				/**
				*Create and select an Element.
				*@param name The Element's tag name
				*/
				create: function create(name)
				{

						this.select( org.meta.web.dom.DOM.createElement(name) ) ;

					return this ;

				},
				/**
				* Get the ``id'' attribute of the selected `Node`.
				* @return String
				*/
				id: function id( ) { return this.current.id },
				/**
				* Set the ``class'' attribute of the selected `Node`.
				* @param name (String) The class name.
				* @return this
				*/
				setClass: function setClass(name)
				{

						this.current
						.className = name ;

					return this ;

				},
				/**
				* Get the ``class'' attribute of the selected `Node`.
				* @return String
				*/
				getClass: function getClass( )
				{
				    return this.current
				    .className ;
				},
				hasClass: function hasClass(name)
				{
				
					// set variables
					
					var b = false ;
					var n ;
					var cl ;
					var s ;
					var a ;
					
					// set b
					
						n = this.current ;

						if( !! (cl = n.classList) ) { b = cl.contains(name) ; }
						else {
						
								if( !! (s = n.className) ) {
								
										a = s.split(Meta.CHARACTER_SPACE) ;
										
										Meta.each(
												a,
												function(index,className) {
														if(className === name) { b = true ; return false ; }
												}
										) ;

								}
						
						}
						
					// return b
					
					return b ;					
					
				},
				/**
				*Add a class identifier to the ``class'' attribute of the selected `Node` if it does not exist yet by appending
				*the given class name to the ``class'' attribute's value or using the `classList` Object's methods.
				*@param name (String) The class name to add.
				*@return this
				*/
				addClass: function addClass(name)
				{
				
					// set variables

					var cl ;
					var s1, s2 ;
					var a ;
					
					// set current

						if( ! this.hasClass(name) ) {
						
								if(  !! (cl = this.current.classList)  ) { cl.add(name) ; }
								else {

										if(  !!  ( s2 = this.getClass( ) )  ) { s1 = (s2 + Meta.CHARACTER_SPACE + name) ; }
										else { s1 = name ; }

										this.setClass(s1) ;
								
								}
								
						}
						
					// return this
					
					return this ;

				},
				/**
				* Remove a class name from the value of the selected `Node`'s ``class'' attribute.
				* @link https://developer.mozilla.org/en-US/docs/DOM/element.classList
				* @param name (String) The class name to remove.
				* @return this
				*/
				removeClass: function removeClass(name)
				{
				
					// set variables
					
					var s1, s2 ;
					var cl ;
					var a ;
					
					// set a 
					
						if(  !!  ( s1 = this.getClass( ) )  ) {
						
								if( !! (cl = this.current.classList) ) { cl.remove(name) ; }
								else {
								
										a = s1.split(Meta.CHARACTER_SPACE) ;
										s2 = "" ;

										Meta.each(
												a,
												function(index,value) {
														if(value !== name) { s2 += Meta.CHARACTER_SPACE + value ; }
												}
										) ;
										
										this.setClass(s2) ;
										
								}
						
						}
						
					// return this 
					
					return this ;
					
				},
				toggleClass: function toggleClass(name)
				{

					// set variables
					
					var cl ;
					var b = false ;
					
					// set current
					
						if( this.hasClass(name) ) { this.removeClass(name) ; }
						else { this.addClass(name) ; }

					// return this
					
					return this ;

				},
				style: function style( ) { return new org.meta.web.css.Style(this.current) ; },
				anchors: function( )
				{
				
					//

						this.select("//a") ;
						
					// return
					
					return this ;
					
				},
				/*@ToDo(Utility functions for selection forms...)*/
				load: function(handler)
				{
					
					// set variables
					
					var o ;
					
					// set ?

						o = this.current ;

						if(  org.meta.web.dom.DOM.isLoadable(o)  &&  ( Meta.typeOf(o) !== Meta.STRING_TYPE_WINDOW )  ) {

								org.meta.web.dom.DOM.addEventHandler("load",o,handler)
								.addEventListener("load",o) ;
								
						}
						else {

								org.meta.web.dom.DOM.addEventHandler("load",Meta.DEFAULT_VIEW,handler)

								if(this.WINDOW_LOADED) { org.meta.web.dom.DOM.triggerEvent("load",Meta.DEFAULT_VIEW) ; }
								else { org.meta.web.dom.DOM.addEventListener("load",Meta.DEFAULT_VIEW) ; }
								
						}

					
					// return this

					return this ;

				},
				ready: function(handler) 
				{

					// 
					
						org.meta.web.dom.DOM.addEventHandler("ready",Meta.DEFAULT_DOCUMENT,handler) ;

						if(this.DOCUMENT_READY) { org.meta.web.dom.DOM.triggerEvent("ready",Meta.DEFAULT_DOCUMENT) ; }
					
					// return

					return this ;

				},
				close: function(handler)
				{

					//
					
						org.meta.web.dom.DOM.addEventHandler("close",this.current,handler)
						.addEventListener(
								"beforeunload",
								Meta.DEFAULT_VIEW,
								function(event) { org.meta.web.dom.DOM.triggerEvent("close",Meta.DEFAULT_VIEW,event) ; }
						) ;
						
					// return 
					
					return this ;
				
				},
				/**
				*Associate a handler with the ``focus'' event. The set of Elements which are focusable is subject to change.
				*@link http://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus
				*@param handler (Object,Function) A handler specification.
				*@return this
				*/
				focus: function focus(handler)
				{

					// set current

						org.meta.web.dom.DOM.addEventListener("focus",this.current)
						.addEventHandler("focus",this.current,handler) ;
						
					// return this
					
					return this ;

				},
				blur: function blur(handler)
				{
				
					// set current

						org.meta.web.dom.DOM.addEventListener("blur",this.current)
						.addEventHandler("blur",this.current,handler) ;
						
					// return this
					
					return this ;

				},
				/**
				*Associate a handler with the ``resize'' event.
				*@param handler (Object) A handler specification. A handler specification must contain one of these three properties:
				*``start'', ``during'' and ``stop'' which specify the three stages in the ``resize'' event's life-cycle.
				*@return this
				*/
				resize: function onResize(handler)
				{

					// set variables
					
					var o ;

					// set current

						org.meta.web.dom.DOM.addEventListener(
								"resize",
								Meta.DEFAULT_VIEW,
								function callback$org_pulse_web_dom_Document_onResize(event)
								{

									// set variables
								
									var o ;
									var i1, i2 ;
									var s ;
									
									// set ?
									
										i1 = org.meta.web.dom.Document.select(Meta.DEFAULT_DOCUMENT)
										.getProperty("viewport") ;
										
										/*@Note("IE 7 erroneously fires the resize event whenever descendant `Element`s of the default `Document` 
										are being resized; in order to prevent execution of the associated handlers we test whether the viewport's 
										area actually changed.")*/

										i2 = org.meta.web.dom.Document.viewportArea( ) ;
										
										if(i1 !== i2) {
										
												/*@Note("If the resize event has been paused---indicating an active
												resize---, call the ``during'' resize event.
												Otherwise, if the resize event has not been paused yet, pause it and
												trigger the resize ``start'' event. Run a Schedule instance to detect
												the resize ``stop'' event.")*/

												if( org.meta.web.dom.DOM.isPaused("resize",Meta.DEFAULT_VIEW) ) {					
														org.meta.web.dom.DOM.triggerEvent("resizeDuring",Meta.DEFAULT_VIEW,event) ;
												}
												else {
												
														org.meta.web.dom.DOM.pauseEvent("resize",Meta.DEFAULT_VIEW)
														.triggerEvent("resizeStart",Meta.DEFAULT_VIEW,event);

														/*@Note("If the `Schedule` instance monitoring the resize process does not detect a change 
														of the viewport area, the ``resize'' life-cycle is in the ``stop'' phase and the associated 
														handlers will get called; in addition the resize handler execution will get unpaused and the 
														``Schedule'' will get closed.")*/
														
														s = new org.meta.logic.Schedule( 50, {auto_repeat:true, repeatable:true} ) ;
														s.add(  {
																action: function(schedule) {

																	var o ;
																	var i ;
																	
																		i = org.meta.web.dom.Document.select(Meta.DEFAULT_DOCUMENT)
																		.getProperty("viewport") ;

																		if( org.meta.web.dom.Document.viewportArea( ) === i ) {

																				org.meta.web.dom.DOM.triggerEvent("resizeStop",Meta.DEFAULT_VIEW)
																				.resumeEvent("resize",Meta.DEFAULT_VIEW) ;

																				schedule.close( ) ;

																		}
																		else {
																		
																				org.meta.web.dom.Document.select(Meta.DEFAULT_DOCUMENT)
																				.setProperty( "viewport", org.meta.web.dom.Document.viewportArea( ) ) ;
																				
																		}

																},
																parameter: [s,i2]
														}  )
														.run( ) ;

												}
										
										}
										
									return true ;

								}
						) ;

						if( !! (o = handler.start) ) { org.meta.web.dom.DOM.addEventHandler("resizeStart",Meta.DEFAULT_VIEW,o) ; }
						if( !! (o = handler.during) ) { org.meta.web.dom.DOM.addEventHandler("resizeDuring",Meta.DEFAULT_VIEW,o) ; }
						if( !! (o = handler.stop) ) { org.meta.web.dom.DOM.addEventHandler("resizeStop",Meta.DEFAULT_VIEW,o) ; }
						
					// return this
					
					return this ;

				},
				/**
				* Associate a a handler specification with a ``hover'' event. A ``hover'' event is a compound
				* event consisting of two partial events: ``mouseover'' and ``mouseout''. A handler for the ``mouseover'' part may be specified
				* with the ``enter'' property of the handler specification; a handler for the ``mouseout'' part may be specified with
				* the ``leave'' property of the handler specification.
				* @param handler (Function,Object) A handler specification.
				* @return this
				*/
				hover: function hover(handler)
				{ 
				
					// set variables
					
					var o ;

					// set current

						if(  !!  ( o = handler.enter )  ) {
						
								org.meta.web.dom.DOM.addEventHandler("hoverEnter",this.current,o)
								.addEventListener(
										"mouseover",
										this.current,
										function(event) {
										
											var n ;
											
												n = (event.currentTarget || event.srcElement) ;

												org.meta.web.dom.DOM.triggerEvent("hoverEnter",n,event) ;
												
											return true ;
												
										}
								) ;
								
						}
						if(  !!  ( o = handler.leave )  ) {
						
								org.meta.web.dom.DOM.addEventHandler("hoverLeave",this.current,o)
								.addEventListener(
										"mouseout",
										this.current,
										function(event) {
										
											var n ;
											
												n = (event.currentTarget || event.srcElement) ;
												
												org.meta.web.dom.DOM.triggerEvent("hoverLeave",n,event) ;
												
											return true ;
												
										}
								) ;
								
						}
						
					// return this
					
					return this ;
				
				},
				/**
				*@param handler A handler specification containing the properties ``up'' and ``down''.
				*@return this
				*/
				press: function press(handler)
				{
				
					// set variables
					
					var o ;
					
					// set current
					
						if( !! (o = handler.up) ) {
						
								org.meta.web.dom.DOM.addEventHandler("pressUp",this.current,o)
								.addEventListener(
										"mouseup",
										this.current,
										function(event) {

											var n ;
											
												n = (event.currentTarget || event.srcElement) ;
												org.meta.web.dom.DOM.triggerEvent("pressUp",n,event) ;
												
											return true ;

										}
								) ;
						}
						if( !! (o = handler.down) ) {

								org.meta.web.dom.DOM.addEventHandler("pressDown",this.current,o)
								.addEventListener(
										"mousedown",
										this.current,
										function(event) {

											var n ;
											
												n = (event.currentTarget || event.srcElement) ;
												org.meta.web.dom.DOM.triggerEvent("pressDown",n,event) ;
												
											return true ;

										}
								) ;

						}

					// return this
					
					return this ;
					
				},
				/**
				*@param handler A handler specification containing the two properties ``up'' and ``down''.
				*@return this
				*/
				keyPress: function keyPress(handler)
				{
				
					// set variables
					
					var o ;
					
					// set current
					
						if( !! (o = handler.up) ) {
						
								org.meta.web.dom.DOM.addEventHandler("keyPressUp",this.current,o)
								.addEventListener(
										"keyup",
										this.current,
										function(event) {

											var n ;
											
												n = (event.currentTarget || event.srcElement) ;
												org.meta.web.dom.DOM.triggerEvent("keyPressUp",n,event) ;
												
											return true ;

										}
								);
						
						}
						if( !! (o = handler.down) ) {
						
								org.meta.web.dom.DOM.addEventHandler("keyPressDown",this.current,o)
								.addEventListener(
										"keydown",
										this.current,
										function(event) {

											var n ;
											
												n = (event.currentTarget || event.srcElement) ;
												org.meta.web.dom.DOM.triggerEvent("keyPressDown",n,event) ;
												
											return true ;
											
										}
								) ;

						}

					// return this
					
					return this ;

				},
				/**
				* Associate a handler specification with a ``click'' event.
				* @link http://msdn.microsoft.com/en-us/library/ms536913(v=vs.85).aspx
				* @link http://blog.rednael.com/2009/09/01/TrappingMouseEventsOnTransparentInputElementsOrTextareasInIE.aspx
				* @param handler (Function,Object) A handler specification.
				* @return this
				*/
				click: function click(handler)
				{
				
					// set variables
					
					var o ;
					
					// set current
					
						org.meta.web.dom.DOM.addEventListener("click",this.current)
						.addEventHandler("click",this.current,handler) ;
					
					// return this
					
					return this ;

				},
				/**
				*Associate a handler specification with a double click event.
				*@param handler (Function,Object) A handler specification.
				*@return this
				*/
				doubleClick: function doubleClick(handler)
				{

					// set variables
					
					var o ;
					
					// set current
					
						org.meta.web.dom.DOM.addEventListener("dblclick",this.current)
						.addEventHandler("dblclick",this.current,handler) ;
					
					// return this
					
					return this ;

				},
				move: function move(handler)
				{
					
					// set current
					
						org.meta.web.dom.DOM.addEventListener("mousemove",this.current)
						.addEventHandler("mousemove",this.current,handler) ;
					
					// return this
					
					return this ;

				},
				/**
				*@link https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/wheel?redirectlocale=en-US&redirectslug=DOM%2FDOM_event_reference%2Fwheel
				*@handler (Function,Object) A handler specification.
				*@return this
				*/
				/*@ToDo("implement,test")*/
				wheel: function wheel(handler)
				{
						Meta.error("Awaiting implementation.") ;
				},
				transition: function transition(handler)
				{
				
					// set variables
					
					var f ;
					
					// set current
					
						f = function(event) {
							
							var n ;
							
								n = (event.currentTarget || event.srcEleemnt) ;
								
								org.meta.web.dom.DOM.triggerEvent("transition",n,event) ;

						} ;
						
						org.meta.web.dom.DOM.addEventListener("transitionend",this.current)
						.addEventListener("webkitTransitionEnd",this.current)
						.addEventListener("oTransitionEnd",this.current)
						.addEventHandler("transition",this.current,handler) ;
					
					// return this
					
					return this ;
				
				}
		}
}  ) ;