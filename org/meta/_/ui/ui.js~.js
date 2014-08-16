/**
* Meta UI core library set-up script.
* @author friedrich alexander kurz, 2012, f.a.kurz@googlemail.com
* @legal GNU General Public License, http://www.gnu.org/licenses/gpl-3.0.html
*/
(  function( ) {

Meta.require("org.meta.web.dom.Path")
.require("org.meta.web.dom.DOM")
.require("org.meta.web.css.Style")
.require("org.meta.web.css.StyleSheet") ;

var Path = org.meta.web.dom.Path,
	DOM = org.meta.web.dom.DOM
	Style = org.meta.web.css.Style,
	StyleSheet = org.meta.web.css.StyleSheet ;

Meta.define(  {
		/**
		The UI class providing utility functions for creating and maintaining user interfaces.
		@link http://www.quirksmode.org/js/keys.html
		@link https://developer.mozilla.org/en/DOM/event.keyCode
		@link https://developer.mozilla.org/en/DOM/event.charCode
		@link https://developer.mozilla.org/en/DOM/Event/UIEvent/KeyEvent
		@link http://stackoverflow.com/questions/743129/mobile-detection-using-javascript
		@link https://developer.mozilla.org/en-US/docs/Mobile/Viewport_meta_tag
		@link https://developer.mozilla.org/en-US/docs/DOM/Using_full-screen_mode
		*/
		name: "UI",
		package: "org.meta.ui",
		prototype: "org.meta.core.Eventable",
		type: Meta.STRING_OBJECT_TYPE_SINGLETON,
		require: ["org.meta.web.css.StyleSheet"],
		/**
		@Link http://stackoverflow.com/questions/826782/css-rule-to-disable-text-selection-highlighting
		*/
		main: function main(arguments)
		{

			//
			
		},
		local: {
				IS_MOBILE: false,
				SCREEN_HEIGHT: -1,
				SCREEN_WIDTH: -1,
				KEYCODE_ESC: 27,
				//.. more key codes
				PUSH_FRAME: null,
				FULL_SCREEN_NODE: null,
				DEFAULT_STYLE: null,
				style: null,
				captureKey: function captureKey(event)
				{
				
					// set variables
					
					var o = { } ;
					
					// set this
					
						o.code = {
								code: (  ( event.keyCode || event.charCode ).toString( )  )
						} ;
					
					// return o
					
					return o ;

				},
				captureMouse: function(event)
				{
				
					// set variables
					
					var o1 = { }, o2 ;
					var i1, i2, i3, i4, i5, i6, i7, i8, i9 ;
					
					// set this

						/*@Note("Capture the mouse cursor's position.")*/
						
						i1 = o1.y, i2 = o1.x ;
						i3 = o1.y = event.clientY, i4 = o1.x = event.clientX ;
						
						/*@Note("Capture the cursor displacement delta values.")*/
						
						o1.delta = { y: 0, x: 0 }

						i5 = o1.delta.y = i3 - i1, i6 = o1.delta.x = i4 - i2 ;
						
						/*@Note("The time passed since the last mouse movement")*/

						i7 = Date.now( ) ;
						i8 = i7 - o1.time ;

						o1.time = i8 ;
						
						/*@Note("Calculate the speed of the cursor movement. The diagonal movement distance is assessed by calculating
						the hypotenuse of the triangle formed by the cursor position values.")*/
						
						o1.speed = { z: 0, y: 0, x: 0 } ;
						
						i9 = o1.delta.z = Math.sqrt(  ( Math.pow(i5,2) + Math.pow(i6,2) )  ) ;

						o1.speed.z = i9 / i8 ;
						o1.speed.x = i6 / i8 ;
						o1.speed.y = i5 / i8 ;

					// return o1
					
					return o1 ;

				},
				goFullScreen: function goFullScreen(node)
				{

					// set variables
					
					var n ;
					
					// set root
					
						if( ! this.isFullScreen( ) ) {
						
								if(!! node.requestFullScreen) { node.requestFullScreen( ) ; }
								else if(!! node.mozRequestFullScreen) { node.mozRequestFullScreen( ) ; }
								else if(!! node.webkitRequestFullScreen) { node.webkitRequestFullScreen( ) ; }
								
								this.FULL_SCREEN_NODE = node ;
								
						}
					
					// return this
					
					return this ;

				},
				cancelFullScreen: function cancelFullScreen( )
				{

					// set variables
					
					var f ;
					
					// set root
					
						( document.cancelFullScreen || document.mozCancelFullScreen || document.webkitCancelFullScreen ) 
						.call(document) ;

						this.FULL_SCREEN_NODE = null ;
					
					// return this
					
					return this ;

				},
				isFullScreen: function isFullScreen( )
				{
					return (!! this.properties.full_screen_node) ;
				},
				toggleFullScreen: function toggleFullScreen(node)
				{
				
					// set node
				
						if( this.isFullScreen( ) ) { this.cancelFullScreen( ) ; }
					
						this.goFullScreen(node) ;
					
					// return this
					
					return this ;

				},
				/**
				* Watch key presses on the key for the given key-code and react to it with the given handler.
				* @param code (Integer) The key code for the key to watch.
				* @param handler (Function,Object) The handler to associate with the key press on the key for the given key-code.
				* @return this
				*/
				onKey: function onKey(code,handler)
				{ Meta.error("Under review.") ;

					// set variables
					
					var o ;
					
					// set handlers
					
						o = {
								target: this,
								action: function(handler,event) {
								
										o = this.captureKey(event)
								
								},
								parameter: handler
						} ;
						this.handlers.addHandler(code,handler) ;

					return this ;

				},
				$OLD_onKey: function onKey( )
				{ Meta.error("Deprecation") ;
				
						this.captureKey(event)
						.callEventHandler(this.properties.key.code,event) ;
					
					return this ;

				},
				onMouse: function mouse(handler)
				{ Meta.error("Under review.") ;
				
						this.handlers.addHandler("mouse",handler) ;
					
					return this ;

				},
				$OLD_onMouse: function mouse(event)
				{ Meta.error("Deprecation") ;

						this.captureMouse(event)
						.callEventHandler("mouse",event) ;
					
					return this ;

				}
		}
}  )
.define(  {
		name: "Transitions",
		package: "org.meta.ui",
		prototype: "org.meta.core.Object",
		type: Meta.STRING_OBJECT_TYPE_SINGLETON,
		init: function init( ) {
		
			var f ;
			
				this.listeners = [] ;
			
				f = (
						Meta.DEFAULT_VIEW.requestAnimationFrame || Meta.DEFAULT_VIEW.mozRequestAnimationFrame ||
						Meta.DEFAULT_VIEW.webkitRequestAnimationFrame || Meta.DEFAULT_VIEW.oRequestAnimationFrame || 
						Meta.DEFAULT_VIEW.msRequestAnimationFrame
				) ;
						
				if( Meta.isNull(f) ) { 
				
						f = ( 
								Meta.has("setImmediate",Meta.DEFAULT_VIEW) ? 
								Meta.DEFAULT_VIEW.setImmediate:
								function animationFrame(callback) { Meta.DEFAULT_VIEW.setTimeout(callback,0) ; }
						) ;
						
				}
				
				this.prototype.animationFrame = f ;

		},
		main: function main(arguments)
		{

				this.pool = [ ] ;
				this.trash = [ ] ;
/*
				this.schedule = new org.meta.core.Schedule(
						this.DEFAULT_INTERVAL,
						{ repeatable: true, auto_repeat: true }
				)
				.add(  {
						target: this,
						action: function( ) { org.meta.ui.UI.animationFrame(Meta.DEFAULT_VIEW,this.frame) ; }
				}  ) 
				.run( )
				.pause( ) ;
*/

//				this.sheet = new StyleSheet(null) ;
/*
				org.meta.web.dom.Document.select(document)
				.ready(  {
						action: function(style) { this.sheet = new org.meta.web.dom.StyleSheet(  { media: "screen", type: "text/css" }  ) ; },
						target: this
				}  ) ;

				if( ! Meta.getSetting("org.meta.ui.Transitions.JS_TRANSITIONS") ) {

						org.meta.web.dom.Document.select(document)
						.ready(   {

								action: function( ) {

									// set variables

									var s ;
									var o ;
									
										s = org.meta.web.dom.Document.select(Meta.DEFAULT_DOCUMENT.body)
										.getAttribute("style") ;
										
										o = { "border-color": "black" } ;

										Meta.each(
												org.meta.web.css.CSS.VENDOR_PREFIXES,
												function(index,prefix) { o[ (prefix + "-transition") ] = "border-color 1ms linear" ; }
										) ;
										
										org.meta.web.dom.Document.transition(  {
												action: function(style) { 

														org.meta.ui.Transitions.CSS_TRANSITIONS = true ;
														
														org.meta.web.dom.Document.select(Meta.DEFAULT_DOCUMENT.body) ;

														if(!! style) { org.meta.web.dom.Document.setAttribute("style",style) ; }
														else { org.meta.web.dom.Document.removeAttribute("style") ; }

												},
												singleton: true,
												parameter: s
										}  )  ;
										
										Meta.each(
												o,
												function(name,value) { org.meta.web.dom.Document.style(name,value) ; }
										) ;
										
										org.meta.web.dom.Document.style("border-color","white") ;

								},
								target: this

						}  ) ;

				}
*/
			// return this
			
			return this ;

		},
		local: {
				DEFAULT_INTERVAL: 20,
				CSS_TRANSITIONS: null,
				schedule: null,
				pool: null,
				trash: null,
				sheet: null,
				numberTransition: function numberTransition(from,to,steps,fn)
				{
				
					// set variables
					
					var a = [ ] ;
					var i = 0 ;
					
					// set a
					
						/*@Note("The number of steps for this transition. The duration is shortened")*/
/*
						i3 = duration % org.meta.ui.Transitions.STANDARD_INTERVAL ;
						i2 = (duration - i3) / org.meta.ui.Transtions.STANDARD_INTERVAL ;
*/
						for( ; ++i <= steps ; ) { a[ (i - 1) ] = fn( (i / steps), from, to ) ; }

					// return a
					
					return a ;
				
				},
				addTransition: function addTransition(transition)
				{

					// set variables
					
					var o1, o2 ;
					var s1, s2, s3, s4, s5, s6, s7 ;
					var i1, i2, i3 ;

						if(!!! org.meta.ui.Transitions.CSS_TRANSITIONS) {

								if(  !!  ( i1 = transition.getDelay( ) )  ) {
										
										org.meta.core.Schedule(i)
										.add(  {
												target: function(transition) { this.pool.push(transition) ; },
												parameter: transition
										}  ) ;

								}
								else { this.pool.push(transition) ; }
						
								if( this.schedule.isPaused( ) ) { this.schedule.resume( ) ; }
								
						}
						else {
						
								org.meta.web.dom.Document.select( transition.getTarget( ) ) ;
								
								s3 = org.meta.web.dom.Document.getProperty("PULSE_ELEMENT_ID") + "-transition-" + Date.now( ) ;
								
								s2 = org.meta.web.dom.Document.getName( ) + "[class~=\"" + s3 + "\"]" ;
								
								s1 = s2 + "{" ;
								
								i1 = transition.getDuration( ) ;
								i2 = transition.getDelay( ) ;

								s4 = transition.getProperties( ).join(",") ;
								
								o = transition.getTimingFunction( ) ;
								
								if(  Meta.isFunction(o) ) {
										if(  ( s5 = Meta.getFunctionName(o) )  ===  "timingFunctionLinear"  ) { s5 = "linear" ; }
										else if(  ( s5 = Meta.getFunctionName(o) )  ===  "timingFunctionEase"  ) { s5 = "ease" ; }
										else if(s5 === "timingFunctionEaseIn") { s5 = "ease-in" ; }
										else if(s5 === "timingFunctionEaseInOut") { s5 = "ease-in-out" ; }
										else if(s5 === "timingFunctionEaseOut") { s5 = "ease-out" ; }
								}
								else if( Meta.isString(o) ) { s5 = o ; }
								else { s5 = "ease" ; }
								
								Meta.each(
										org.meta.ui.CSS.VENDOR_PREFIXES,
										function(index,prefix) {
										
											s1 += prefix + "-transition-delay:" + i2 + "ms;" ;
											s1 += prefix + "-transition-property:" + s4 + ";" ;
											s1 += prefix + "-transition-duration:" + i1 + "ms;" ;
											s1 += prefix + "-transition-timing-function:" + s5 + ";"  ;
										
										}
								) ;
								
								s1 += "transition-delay:" + i2 + "ms;" ;
								s1 += "transition-property:" + s4 + ";" ;
								s1 += "transition-duration:" + i1 + "ms;" ;
								s1 += "transition-timing-function:" + s5 + ";" ;
								
								s1 += "}" ;

								o1 = { } ;
								o2 = { } ;
								i1 = ( transition.getLength( ) - 1 ) ;
								s5 = ( transition.getUnit( ) || "" ) ;

								Meta.each(
										transition.getSteps( ),
										function(property,steps) {
										
												o1[property] = steps[0] + s5 ;
												o2[property] = steps[i1] + s5 ;
										
										}
								) ;

								this.sheet.addRule(s1) ;

								org.meta.web.dom.Document.setStyle(o1)
								.transition(  {
										action: function(transition,selector,className) {
										
											var i ;

												transition.onStop( ) ;
												
												org.meta.web.dom.Document.select( transition.getTarget( ) )
												.removeClass(className) ;
												
												i = this.sheet.getRule(selector)
												.index ;
												 
												this.sheet.clearRule(i) ;

										},
										target: this,
										parameter: [transition,s2,s3],
										singleton: true 
								}  )
								.addClass(s3)
								.setStyle(o2) ;
								
								transition.onStart( ) ;

						}
				
					// return this

					return this ;
					
				},
				discard: function discard( )
				{
				
					// set variables
					
					var i1, i2 ;

					// set this
					
						/*@Note("Remove the `Transition` `Object`s for the indexes within the `trash` `Array` and trigger the
						`stop` event.")*/

						for( i1 = this.trash.length ; --i1 >= 0 ; ) { 
						
								i2 = this.trash[i1] ;
								
								this.pool.splice(i2,1)[0] 
								.onStop( ) ; 
								
						}
						
						if( this.pool.length === 0 ) { this.schedule.pause( ) ; }
						
					// return this
					
					return this ;

				},
				frame: function frame( ) 
				{
				
					// set this
				
						this.trash = [ ] ;
													
						Meta.each(
								this.pool,
								function(index,transition) {
								
									var i1, i2 ;
									
										if(  ( i1 = transition.getPosition( ) )  ===  -1  ) { transition.onStart( ) ; }

										i2 = ( transition.getLength( ) - 1 ) ;
										
										if(i1 < i2) { transition.next( ) ; }
										else if(i1 === i2) { this.trash.push(index) ; }
								
								},
								this
						) ;
						
						this.discard( ) ;
						
					// return this
					
					return this ;
				
				}				
		}
}  )
.define(  { 
		name: "Transition",
		package: "org.meta.ui",
		prototype: "org.meta.core.Eventable",
		main: function main(target,parameter)
		{

			// set variables

			var o ;
			var i1, i2 ;

			// set this

				this.target = target ;
				this.parameter = parameter ;
				
				this.handlers = { } ;

				this.position = -1 ;
				this.parameter.timing_function = (parameter.timing_function || org.meta.ui.Transition.TIMING_FUNCTION_EASE) ;
				
				o = parameter.properties ;
				
				this.parameter.properties = Meta.isArray(o) ? o : [o] ;
				
				o = this.parameter.to ;
				
				this.parameter.to = Meta.isArray(o) ? o : [o] ;

				this.setLength( )
				.setSteps( ) ;

			// return this
			
			return this ;

		},
		global: {
				STANDARD_INTERVAL: 20,
				/** 
				* The following are some default Bézier functions used to smoothen animations.
				* @link https://developer.mozilla.org/en/CSS/timing-function
				*/
				TIMING_FUNCTION_LINEAR: function timingFunctionLinear(time,p0,p1)
				{
					return ( (1 - time) * p0 + time * p1 ) ;
				},
				TIMING_FUNCTION_EASE: function timingFunctionEase(time,p0,p1) 
				{
					var n1, n2, n3 ;
						n1 = (p1 - p0) ;
						n2 = p0 + (0.015 * n1) ;
						n3 = p0 + (0.985 * n1)
					return (  org.meta.math.Math.FUNCTION_BEZIER_CUBIC( time, p0, n2, n3, p1 )  ) ;
				},
				TIMING_FUNCTION_EASE_IN: function timingFunctionEaseIn(time,p0,p1) 
				{
					var n1, n2, n3 ;
						n1 = (p1 - p0) ;
						n2 = p0 + (0.1 * n1) ;
						n3 = p0 + (0.25 * n1)
					return (  org.meta.math.Math.FUNCTION_BEZIER_CUBIC( time, p0, n2, n3, p1 )  ) ;
				},
				TIMING_FUNCTION_EASE_IN_OUT: function timingFunctionEaseInOut(time,p0,p1)
				{
					var n1, n2, n3 ;
						n1 = (p1 - p0) ;
						n2 = p0 + (0.005 * n1) ;
						n3 = p0 + (0.995 * n1)
					return (  org.meta.math.Math.FUNCTION_BEZIER_CUBIC( time, p0, n2, n3, p1 )  ) ;
				},
				TIMING_FUNCTION_EASE_OUT: function timingFunctionEaseOut(time,p0,p1) 
				{
					var n1, n2, n3 ;
						n1 = (p1 - p0) ;
						n2 = p0 + (0.75 * n1) ;
						n3 = p0 + (0.985 * n1)
					return (  org.meta.math.Math.FUNCTION_BEZIER_CUBIC( time, p0, n2, n3, p1 )  ) ;
				}
		},
		local: {
				target: null,
				parameter: null,
				position: null,
				length: null,
				steps: null,
				run: function run( )
				{
				
					// set root

						this.position = -1 ;
						
						org.meta.ui.Transitions.addTransition(this) ;
						
					// return this

						return this ;

				},
				next: function next( )
				{

					// set variables
					
					var i ;
					var o  = { } ;
					
					// set target
					
						/*@Note("Boundaries.")*/
						
						i = ++this.position ;
						
						Meta.each(
								this.getProperties( ),
								function(index,property) {
								
									var s ;
										
										s = (this.parameter.unit || "") ;
										o[property] = this.steps[property][i] + s ;
										
								},
								this
						) ;
						
						org.meta.web.dom.Document.select(this.target)
						.setStyle(o) ;
						
					// return this
					
					return this ;

				},
				getTarget: function getTarget( ) { return this.target ; },
				getPosition: function getPosition( ) { return this.position ; },
				getSteps: function getSteps( ) { return this.steps ; },
				getLength: function getLength( ) { return this.length ; },
				getProperties: function getProperties( ) { return ( this.parameter.properties || null ) ; },
				getDuration: function getProperties( ) { return ( this.parameter.duration || 0 ) ; },
				getDelay: function getDelay( ) { return ( this.parameter.delay || 0 ) ; },
				getUnit: function getUnit( ) { return this.parameter.unit || null ; },
				getTimingFunction: function getTimingFunction( ) { return this.parameter.timing_function || org.meta.ui.Transition.TIMING_FUNCTION_EASE ; },
				start: function start(handler)
				{
				
						this.addListener("start",handler) ;
					return this ;

				},
				stop: function stop(handler)
				{

						this.addListener("stop",handler) ;
					return this ;

				},
				onStart: function onStart( )
				{

						this.triggerEvent("start") ;
					return this ;

				},
				onStop: function onStop( )
				{

						this.triggerEvent("stop") ;
					return this ;

				},
				close: function close( )
				{ 
				
						this.position = (this.steps.length - 1) ;

					return this ; 
					
				},
				setLength: function setLength( )
				{
				
					// set variables
					
					var i1, i2 ;
					
					// set length

						i1 = this.parameter.duration ;
						i2 = i1 % org.meta.ui.Transitions.STANDARD_INTERVAL ;
						
						this.length = (i1 - i2) / org.meta.ui.Transitions.STANDARD_INTERVAL ;

					// return this
					
					return this ;
				
				},
				setSteps: function setSteps( )
				{
				
					// set variables
					
					var o ;
					var a1, a2 ;
					
					// set steps
					
						this.steps = { } ;
					
						a1 = this.parameter.properties ;	
						a2 = this.parameter.to ;

						Meta.each(
								a1,
								function(index,property) {

									var o1, o2 ;
									var i1, i2 ;
									
										o1 = org.meta.web.dom.Document.select(this.target)
										.getStyle(property) ;

										o2 = a2[index] ;
										
										i1 = ( Meta.parseNumber(o1) || 0 ) ;

										if( Meta.isNumber(i1) ) {
										
												i2 = Meta.parseNumber(o2) ;
										
												this.steps[property] = org.meta.ui.Transitions.numberTransition(
														i1,
														i2,
														this.length,
														this.parameter.timing_function
												) ;
												
										}
										else {
											Meta.error("Non-Number transitions awaiting implementation.") ;
										}

								},
								this
						) ;
						
					// return this
					
					return this ;
				
				}
		}
}  )
.define(  {
		name: "Component",
		package: "org.meta.ui",
		prototype: "org.meta.core.Eventable",
		main: function main(root) { this.root = root ; },
		global: {
				STATE_IDLE: 0,
				STATE_READY: 1,
				STATE_REQUESTING: 2,
				STATE_BUSY: 3,
				STATE_DEFUNCT: 4,
				newInstance: function newInstance(root) { return new this(root) ; }
		},
		local: {
				/**
				* The root `Node` for this `Component` instance.
				* @type Node
				*/
				root: null,
				/**The component id. If none is specified, `Component.getID` returns the object ID instead.*/
				id: null,
				/**The state integer. Defaults to zero.*/
				state: 0,
				/**
				* An optional container for wrapped `Component` instance's.
				* @type Object
				*/
				components: null,
				add: function add(component)
				{
				
					// preconditions
					
					Meta.assert(Meta.instanceOf(org.meta.ui.Component,component), "Invalid type for parameter component") ;
					
					//
					
						this.components[this.components.length] = component ;
						
					// return
					
					return ;
				
				},
				remove: function remove( ) { Meta.error("Stub") ; },
				/**
				* Queue the execution of a handler. This method performs a sequence of status tests to ensure that the execution
				* of the handler is legitimate at this point in time: (1) the host Component is tested for a ready status; (2) the
				* immediate handler execution is flagged; (3) the status is tested again to test if it was prevented using a 
				* status change handler; (3) status is set to busy, if the handler is not asynchronous it will be executed and
				* the status will be reset to ready. Asynchronous handlers must reset the status manually upon their completion.
				* @param handler (Object,Function) A handler specification.
				* @return this
				*/
				getId: function getId( )
				{

					// set variables
					
					var s = null ;
					
					// set s
					
						if( !!! (s = this.id) ) { s = this.instanceId( ); }
					
					// return s
					
					return s ;

				},
				setId: function setId(id)
				{

						this.id = id ;
					return this ;
					
				},
				getRoot: function( )
				{
					return this.root ;
				},
				setRoot: function(root)
				{

						this.root = root ;

					return this ;

				},
				hasProperty: function hasProperty(key) { return org.meta.web.dom.DOM.hasProperty(key,this.root) ; },
				getProperty: function getProperty(key) { return org.meta.web.dom.DOM.getProperty(key,this.root) ; },
				setProperty: function setProperty(key,value) { return org.meta.web.dom.DOM.setProperty(key,value,this.root) ; },
				getComponents: function getComponents( )
				{
					return this.components ;
				},
				height: function height( )
				{
					return this.style.height( ) ;
					/*
					return org.meta.web.dom.Document.select(this.root)
					.getHeight( ) ;
					*/

				},
				width: function width( )
				{
					return this.style.width( ) ;
/*
					return org.meta.web.dom.Document.select(this.root)
					.getWidth( ) ;
*/
				},
/*@ToDo(review)*/
				setState: function setState(state)
				{
				
					// set variables
					
					var i ;

					// set state
					
						/*@Note("Prevent state change on defunct Components.")*/

						if( (i = this.state) !== org.meta.ui.Component.STATE_DEFUNCT ) {
						
								this.state = state ;
								this.triggerEvent(  "stateChange",  {old_state: i, new_state: state}  ) ;
								
						}
						
					// return this
					
					return this ;

				},
				/**
				* Set the given state on the given list of `Component`s.
				* @param state (Integer) A `Component` state `Integer`.
				* @param targets (Array,Object) A target list or map.
				* @param force (Boolean) Optional `Boolean` value indicating whether the state should be forced upon the target
				* if it is busy.
				* @return this
				*/
				pushState: function pushState(state,targets,force)
				{

					// set list
					
						Meta.each(
								targets,
								function(index,component) {
								
									var i ;
									
										i = component.getState( ) ;
										
										if(  ( i === org.meta.ui.Component.STATE_BUSY & !! force )  ||  i !== org.meta.ui.Component.STATE_BUSY  ) {
												component.setState(state) ;
										}
										
								}
						) ;
					
					// return this
					
					return this ;
							
				},
				show: function show(deep)
				{ Meta.error("review") ;

					// set root
/*
					org.meta.web.dom.Document.select(this.root)
					.style("visibility","visible") ;

					if(!! deep) {
					
							org.meta.web.dom.Document.find("//*[style('visibility')='hidden']") ;
							
							if( !! org.meta.web.dom.Document.size( ) ) {
									org.meta.web.dom.Document.each(   function( ) { this.style("visibility","visible") ; }  ) ;
							}
					
					}
					
					// return this
					
					return this ;
*/
				},
				hide: function hide(deep)
				{ Meta.error("review") ;
/*
					// set root
					
					org.meta.web.dom.Document.select(this.root)
					.style("visibility","hidden") ;

					if(!! deep) {
					
							org.meta.web.dom.Document.find("//*[style('visibility')='visible']") ;
							
							if( !! org.meta.web.dom.Document.size( ) ) {
									org.meta.web.dom.Document.each(   function( ) { this.style("visibility","hidden") ; }  ) ;
							}
					
					}
*/
					// return this
					
					return this ;

				},
				clip: function clip(mode)
				{ Meta.error("review") ;
				
					// set variables
					
					var s ;
					
					// set root
					
						if(mode == org.meta.ui.Component.CLIP_MODE_FULL) {
/*
								if(! Meta.IS_IE_7) {

										/*@note("Fallback to impossibly high values for clip top and clip left in case either property of
										the `Element` has not been layouted yet.")*

										i1 = ( org.meta.web.dom.Document.getHeight( ) || 100000 ) ;
										i2 = ( org.meta.web.dom.Document.getWidth( ) || 100000 ) ;

										s = "rect(" + i1 + "px auto auto " + i2 + "px)" ;
										
										org.meta.web.dom.Document.style("clip",s) ;
										
								}
								else { 
								
										s = "rect(1px 1px 1px 1px)" ;
										
										if( org.meta.web.dom.DOM.getName(this.root) === "body" ) {
								
												org.meta.web.dom.Document.children( )
												.each(  function( ) { this.style("clip",s) ; }  ) ;
												
										}
										else { org.meta.web.dom.Document.style("clip",s) ; }
										
								}
*/
								s = "10000000px auto auto 1000000px" ;
								
						}
						else if(mode === org.meta.ui.Component.CLIP_MODE_NONE) {
/*
						if(! Meta.IS_IE_7) { org.meta.web.dom.Document.style("clip","auto") ; }
						else { 
						
								if( org.meta.web.dom.Document.getName( ) === "body" ) {
						
										org.meta.web.dom.Document.children( )
										.each(  function( ) { this.style("clip","auto") ; }  ) ;
										
								}
								else { org.meta.web.dom.Document.style("clip","auto") ; }
								
						}
*/
								s = "auto auto auto auto" ;
								
						}
					
						s = "rect(" + s + ")" ;
						
						org.meta.web.dom.Document.select(this.root)
						.style("clip",s) ;
					
					// return this
					
					return this ;

				},
				/**
				A shorthand function for adding a state change handler wich reacts to the state transition from idle to
				ready.
				@param handler (Object,Function) A handler specification.
				*/
				ready: function(handler)
				{
					
					// set tshi
						
						this.addListener(
								"stateChange",
								{
									target: this,
									action: function(handler,event) {

											if(event.old_state === org.meta.ui.Component.STATE_IDLE && event.new_state === org.meta.ui.Component.STATE_READY) {
													this.handle(handler,event) ;
											}

									},
									parameter: handler
								}
						) ;

				},
				/**
				A shorthand function for adding a state change handler wich reacts to the state transition to defunct.
				@param handler (Object,Function) A handler specification.
				*/
				dispose: function dipose( )
				{
					
					// set this
						
						this.addListener(
								"stateChange",
								{
									target: this,
									action: function(handler,event) {
									
											if(event.new_state === org.meta.ui.Component.STATE_DEFUNCT) {
													this.handle(handler,event) ;
											}

									},
									parameter: handler
								}
						) ;

				},
				queueHandler: function queue(handler,event)
				{ 
Meta.error("Under review") ;
					// set variables
					
					var o ;
					
					// set this

						if(this.state === org.meta.ui.Component.STATE_READY) {

								/*@Note("Give tied-in Components the change to interrupt handler execution by setting this Component
								to idle using the `stateChange` event (which is fired when `setState` is called).")*/

								this.setState(org.meta.ui.Component.STATE_REQUESTING) ;
								
								if(this.state !== org.meta.ui.Component.STATE_IDLE) {
								
										this.setState(org.meta.ui.Component.STATE_BUSY)
										.handle(handler,event) ; 
										
										if(!!! handler.async) { this.setState(org.meta.ui.Component.STATE_READY) ; }
										
								}
								
						}
					
					// return this
					
					return this ;

				},
/*/@*/
				/*@ToDo(review)*/
				onHover: function onHover(handler)
				{

					// set variables
					
					var o1 = { }, o2 ;
					
					// set root
					
						if( !! (o2 = handler.enter) ) {
						
								o1.enter = {
										action: function(handler) { this.queue(handler) ; },
										parameter: o2,
										target: this
								} ;
								
						}

						if( !! (o2 = handler.leave) ) {
						
								o1.leave = {
										action: function(handler) { this.queue(handler) ; },
										parameter: o2,
										target: this
								} ;
								
						}

						org.meta.web.dom.Document.select(this.root)
						.onHover(o1) ;

					// return this 

					return this ;

				}
		}
}  ) ;

Meta.require("org.meta.ui.Component") ;

var Component = org.meta.ui.Component ;

Meta.define(  {
		name: "Movable",
		package: "org.meta.ui",
		prototype: "org.meta.ui.Component",
		type: Meta.STRING_OBJECT_TYPE_ABSTRACT,
		local: {
				/** 
				* Displace the root Node of this Movable instance without an animated transition by the given delta.
				* @param (Object) parameter The parameter for this shift. Must contain either or both of the following two
				* properties: ``horizontal'', ``vertical''
				* @return this
				*/
				shift: function shift(parameter)
				{

					// set variables
					
					var o = { } ;
					var n ;

					// set root
						
						this.queue(  {
								target: this,
								action: function(parameter) {

									var o = { } ;
									var n ;
								
										if( !! (n = parameter.vertical) ) { o.top = (n + pulse.	ui.CSS.ABSOLUTE_MEASURES.PIXEL) ; }
										if( !! (n = parameter.horizontal) )  { o.left = (n + org.meta.ui.CSS.ABSOLUTE_MEASURES.PIXEL) ; }

										org.meta.web.dom.Document.select(this.root)
										.setStyle(o) ;

								},
								parameter: parameter
						}  ) ;
				
					// return this
				
					return this ;
				
				},
				move: function move(parameter)
				{

					// set variables
					
					var t = null ;
					var o1, o2 ;
					
						o1 = {
								properties: [ ],
								to: [ ],
								unit: "px",
								duration: parameter.duration
						} ;

						if( !! (o2 = parameter.vertical) ) {
						
								o1.properties.push("top") ;
								o1.to.push(o2.to) ;
								
						}
						if( !! (o2 = parameter.horizontal) ) {

								o1.properties.push("left") ;
								o1.to.push(o2.to) ;

						}

						t = org.meta.ui.Transition(this.root,o1) ;
						
						this.queue(  {
								target: this,
								action: function(transition) { transition.run( ) ; },
								parameter: t
						}  ) ;
				
					// return this
					
					return t ;
				
				},
				moveHorizontally: function moveHorizontally(parameter)
				{
Meta.error("Deprecation") ;
					// set variables

					var t = null ;
					
					// set t

						t = org.meta.ui.Transition(
								this.root,
								{
										properties: "left",
										unit: org.meta.ui.CSS.ABSOLUTE_MEASURES.PIXEL,
										to: parameter.to,
										duration: parameter.duration,
										boundary: parameter.boundary,
										delay: 50,
										timing_function: ( parameter.timing_function || org.meta.ui.Transition.TIMING_FUNCTION_EASE )
								}
						) 
						.start(  { target: this, action: function( ) { this.setState(org.meta.ui.Component.STATE_BUSY) ; } }  )
						.stop(  { target: this, action: function( ) { this.setState(org.meta.ui.Component.STATE_READY) ; } }  ) ;
						
					// return t
					
					return t ;

				},
				moveVertically: function moveVertically(parameter)
				{
Meta.error("Deprecation") ;
					// set variables
					
					var t = null ;
					
					// set t

						t = org.meta.ui.Transition(
								this.root,
								{
										properties: "top",
										unit: org.meta.ui.CSS.ABSOLUTE_MEASURES.PIXEL,
										to: parameter.to,
										duration: parameter.duration,
										boundary: parameter.boundary,
										delay: 50,
										timing_function: ( parameter.timing_function || org.meta.ui.Transition.TIMING_FUNCTION_EASE )
								}
						) 
						.start(  { target: this, action: function( ) { this.setState(org.meta.ui.Component.STATE_BUSY) ; } }  )
						.stop(  { target: this, action: function( ) { this.setState(org.meta.ui.Component.STATE_READY) ; } }  )

					// return t
					
					return t ;

				}
		}
}  )
.define(  {
		name: "Morphable",
		package: "org.meta.ui",
		prototype: "org.meta.ui.Component",
		type: Meta.STRING_OBJECT_TYPE_ABSTRACT,
		local: {
				/**
				* Resize the root `Node` using the given parameter.
				* @param parameter (Object) The resize parameter.
				* @return this
				*/
				resize: function resize(parameter)
				{
					//..
				},
				/**
				* Animate a resize process on the root `Node` using the given parameter.
				* @param parameter (Object) The morph parameter.
				* @return this
				*/
				morph: function morph(parameter)
				{
					
					// set variables
					
					var t ;
					var o ;
					var d1, d2 ;

					// set t
					
						o = {
							properties: [ ],
							to: [ ],
							unit: "px",
							duration: parameter.duration
						} ;
					
						if( !! (d = parameter.height) ) {
						
								o.properties.push("height") ;
								o.to.push(d) ;

						}
						if( !! (d = parameter.width) ) {						
						
								o.properties.push("width") ;
								o.to.push(d) ;

						}
						
						t = org.meta.ui.Transition(this.root,o)
						.run( ) ;
						
					// return t
					
					return t ;

				},
				transform: function transform(handler)
				{ Meta.error("Deprecation") ;

						this.addListener("transform") ;

					return this ;

				},
				onTransform: function onTransform(event)
				{ Meta.error("Under review.") ;

						this.triggerEvent("transform") ;

					return this ;

				}
		}
}  )
.define(  {
		name: "Draggable",
		package: "org.meta.ui",
		prototype: "org.meta.ui.Movable",
		type: Meta.STRING_OBJECT_TYPE_ABSTRACT,
		global: {
				STANDARD_PERIMETER: 0.3,
				EVENT_DRAG_START: "dragStart",
				EVENT_DRAG_DURING: "dragDuring",
				EVENT_DRAG_STOP: "dragStop"
		},
		local: {
				pick: function pick( )
				{ Meta.error("Deprecation") ;

					// set variables
					
					var a ;

					// set this

						org.meta.ui.UI.mouse(  {
								target: this,
								action: function(event) {
										if(event.type === "mousemove") { this.tug( ) ; }
										else if(event.type == "mouseup") { this.drop( ) ; }
								}
						}  ) ;
						
						a = this.getLevels( ) ;
						
						o = {
								type: org.meta.ui.Draggable.EVENT_DRAG_START,
								levels: { y: a[0], x: a[1] }
						} ;

						this.onDrag(o) ;

					// return this
					
					return this ;

				},
				tug: function tug( )
				{ Meta.error("Deprecation") ;

					// set variables
					
					var o1, o2 ;
					var d ;
					var b1, b2 ;
					var i1 = 0, i2 = 0, i3, i4, i5, i6, i7, i8 ;
					var a ;
					
					// set this
					
						o1 = org.meta.ui.UI.getProperty("mouse") ;
						
						/*@Note("Test if the cursor exited the perimeter of the bounding rectangle of the containing `Node`. If the cursor 
						has indeed exited the perimeter, the drag and drop sequence must be terminated since mouse capturing cannot be reliably
						maintained in that case (e.g. when the cursor exists the browser window).")*/
						
						d = ( this.parameter.perimeter || org.meta.ui.Draggable.STANDARD_PERIMETER ) ;

						if( this.isWithinPerimeter(o1.y,o1.x,d) ) {

								b1 = this.parameter.lock_vertical ;
								b2 = this.parameter.lock_horizontal ;
								
								org.meta.web.dom.Document.select(this.root) ;
								
								i1 = org.meta.web.dom.Document.getGlobalOffsetTop( ) + (b1 ? 0 : o1.delta.y)  ;
								i2 = org.meta.web.dom.Document.getGlobalOffsetLeft( ) + (b2 ? 0 : o1.delta.x) ;

								o2 = { height: org.meta.web.dom.Document.getOffsetHeight( ), width: org.meta.web.dom.Document.getOffsetWidth( ) } ;

								if( ! this.isWithinBounds(i1,i2,this.properties.bounds,o2) ) {
								
										org.meta.web.dom.Document.select(this.root) ;

										i3 = org.meta.web.dom.Document.getOffsetHeight( ) ;
										i4 = org.meta.web.dom.Document.getOffsetWidth( ) ;
										
										org.meta.web.dom.Document.parent( ) ;
										
										i1 = i2 = 0 ;
								
										if(! b1) { i1 = (o1.delta.y < 0) ? 0 : Meta.parseNumber( org.meta.web.dom.Document.getStyle("padding-top") ) + org.meta.web.dom.Document.getHeight( ) - i3 ; }
										if(! b2) { i2 = (o1.delta.x < 0) ? 0 : Meta.parseNumber( org.meta.web.dom.Document.getStyle("padding-left") ) + org.meta.web.dom.Document.getWidth( ) - i4 ; }

								}
								else {
								
										org.meta.web.dom.Document.select(this.root) ;
										
										i3 = Meta.parseNumber( org.meta.web.dom.Document.getStyle("top") ) ;
										i4 = Meta.parseNumber( org.meta.web.dom.Document.getStyle("left") ) ;
										
										i1 = i3 + (b1 ? 0 : o1.delta.y) ;
										i2 = i4 + (b2 ? 0 : o1.delta.x) ;
										
								}
								
								o1 = { vertical: i1, horizontal: i2 } ;

								this.shift(o1) ;
								
								a = this.getLevels( ) ;

								this.onDrag(  {
										type: org.meta.ui.Draggable.EVENT_DRAG_DURING,
										levels: { y: a[0], x: a[1] } 
								}  ) ;
								
								/*@ToDo("Call event ``dragDuring''.")*/
						
						}
						else { this.drop( ) ; }

					// return this
					
					return this ;

				},
				drop: function drop( )
				{ Meta.error("Deprecation") ;

					// set variables
					
					var o ;
					
					// set ?
					
						org.meta.ui.UI.removeHandlerByTargetId("mouse",this.reflect.objectID) ;
						
						a = this.getLevels( ) ;
						
						this.onDrag(  {
								type: org.meta.ui.Draggable.EVENT_DRAG_STOP,
								levels: { y: a[0], x: a[1] }
						}  ) ;
						
					// return this
					
					return this ;

				},
				drag: function(handler)
				{ Meta.error("Deprecation") ;
				
					// set variables
					
					var o ;

					// set handlers
					
						if( !! (o = handler.start) ) { this.addListener("dragStart",o) ; }
						if( !! (o = handler.during) ) { this.addListener("dragDuring",o) ; }
						if( !! (o = handler.stop) ) { this.addListener("dragStop",o) ; }
					
					// return this
					
					return this ;

				},
				onDrag: function(event)
				{ Meta.error("Under review.") ;


					// set variables
					
					var s ;
					
					// set ?
					
						if( !! (s = event.type) === org.meta.ui.Draggable.EVENT_DRAG_START ) { s = "dragStart" ; }
						else if(s === org.meta.ui.Draggable.EVENT_DRAG_DURING) { s = "dragDuring" ; }
						else if(s === org.meta.ui.Draggable.EVENT_DRAG_STOP) { s = "dragStop" ; }
						
						this.triggerEvent(s,event) ;
					
					// return this
					
					return this ;

				},
				/** 
				* Destroy this `org.meta.ui.Panel` instance removing the mousemove handlers from `org.meta.ui.UI` in the
				* process. 
				*/
				dispose: function( )
				{
				
					// set variables
					
					var s ;
					
					// set ?
					
						s = this.reflect.objectID ;
					
						if(!!! this.parameter.prevent_drag_and_drop) {

								org.meta.ui.UI.removeHandlerByTargetID("mouse",s) ;
								org.meta.web.dom.Document.select(Meta.DEFAULT_VIEW)
								.removeHandlerByTargetID("resizeStop",s) ;

						}
						
					// return this
					
					return this ;
						
				},
				setBounds: function setBounds( )
				{

					// set variables
					
					var i1, i2, i3, i4 ;
					
					// set properties.bounds
								
						org.meta.web.dom.Document.select(this.root)
						.parent( ) ;

						i1 = org.meta.web.dom.Document.getGlobalOffsetTop( ) ;
						i2 = org.meta.web.dom.Document.getGlobalOffsetLeft( ) ;
						
						/*@Note("Add the spatial extension of the content area to the offset values in order to get the coordinates 
						of the container.")*/

						i3 = i1 + Math.ceil( org.meta.web.dom.Document.getHeight( ) ) ;
						i4 = i2 + Math.ceil( org.meta.web.dom.Document.getWidth( ) ) ;
						
						this.properties.bounds = { top: i1, right: i4, bottom: i3, left: i2 } ;

					// return this
					
					return this ;
					
				},
				getLevels: function getLevels( )
				{
				
					// set variables
					
					var a = null ;
					var i1, i2, i3, i4, i5, i6 ;

					// set a
						
						i1 = Meta.parseNumber(
								org.meta.web.dom.Document.select(this.root)
								.getStyle("top")
								|| 0
						) ;
						i2 = Meta.parseNumber(
								org.meta.web.dom.Document.select(this.root)
								.getStyle("left")
								|| 0
						) ;
						
						i3 = org.meta.web.dom.Document.getOffsetHeight( ), i4 = org.meta.web.dom.Document.getOffsetWidth( ) ;
						
						i5 = org.meta.web.dom.Document.parent( )
						.getHeight( ) ;
						i6 = org.meta.web.dom.Document.getWidth( ) ;
						
						/*@Note("The level is the relative height or width of the draggable object compared to its containing object's ajdusted height or width
						(height or width minus draggable object's height or width).")*/

						a = [
								( i1 / (i5 - i3) ),
								( i2 / (i6 - i4) )
						] ;
						
					// return a
					
					return a ;

				}
		}
}  )

Meta.define(  {
		/**
		* An Object wrapper for image content.
		*/	
		name: "Image",
		package: "org.meta.ui",
		prototype: "org.meta.ui.Component",
		/**
		*Initialize an instance of `org.meta.ui.Image`.
		*@return this
		*/
		main: function main(root,parameter)
		{ Meta.error("review") ;
	
			// set variables
			
			var t ;
			var s ;

			// set this

				try {
						
						this.handlers = new org.meta.core.Eventable.Handlers(null) ;
//						this.properties = { } ;
						this.root = root ;

						s = org.meta.web.dom.Document.select(root)
						.getAttribute("src") ;
						
						org.meta.web.dom.Document.setProperty("src",s)
						.removeAttribute("src") ;
						
						this.ready(  { action: this.load, target: this, parameter: s }  ) ;
						
				}
				catch(e) { Meta.logError(e) ; }

		},
		global: {
				MODE_AUTO: "auto",
				MODE_HEIGHT: "height",
				MODE_WIDTH: "width",
				MODE_COVER: "cover",
				MODE_CONTAIN: "contain",
				ALIGN_TOP: "top",
				ALIGN_RIGHT: "right",
				ALIGN_BOTTOM: "bottom",
				ALIGN_LEFT: "left",
				ALIGN_CENTER: "center",
				DATA: null,
				/**
				* Return an `Object` view of the given ``IMG'' `Element`'s attributes.
				* @link https://developer.mozilla.org/en/DOM/HTMLImageElement
				* @param image (Element) An ``IMG'' `Element`.
				* and subsequently set the style so as to make the the `Element` be layouted in its natural aspect ratio.
				* @return Object
				*/
				getImageData: function getImagedata(image)
				{
				
					// set variables
					
					var o = null ;
					var s ;
					var n1, n2 ;

					// set o
					
						s = org.meta.web.dom.Document.select(this.root)
						.getAttribute("src") ;

						n1 = org.meta.web.dom.Document.getHeight( ) ;
						n2 = org.meta.web.dom.Document.getWidth( ) ;

						o = {
						
								height: n1,
								width: n2,
								ratio: (n1 / n2),
								url: s,
								complete: (  ( Meta.isNumber(n1) && n1 > 0 )  &&  ( Meta.isNumber(n2) && n2 > 0 )  )
					
						} ;
						
					// return o
					
					return o ;
				
				}
		},
		local: {
				/**
				* Scale the root ``IMG'' `Element` according to parameters.
				* @param target The target `Node`.
				* @param mode One of the mode parameter options (either ``auto'', ``height'', ``width'' or ``contain''). 
				* @param align One of the align parameter options (either ``top'', ``right'', ``bottom'' or ``left'').
				* @param data (Object) An optional data `Object` as obtained by `org.meta.ui.Images.getInfo`.
				* @return this
				*/
				scale: function scale(mode,align)
				{

					// set node

						this.scaleTo(mode,align)

					// return this
					
					return this ;

				},
				load: function load(url)
				{

					// set variables
					
					var t ;
					var s1, s2 ;
					
					// set ?

						this.setState(org.meta.ui.Component.STATE_BUSY) ;

						org.meta.web.dom.Document.select(this.root) ;

						s1 = org.meta.web.dom.Document.getAttribute("class") ;
						s2 = org.meta.web.dom.Document.getAttribute("style") ;
						
						org.meta.web.dom.Document.onLoad(  {
								action: function(classes,style) {
								
										this.DATA = this.getImageData(this.root) ;

										org.meta.web.dom.Document.setAttribute("class",classes)
										.setAttribute("style",style) ;

										this.setState(org.meta.ui.Component.STATE_READY) ;

										this.handlers.triggerEvent("imageLoad") ;
										
								},
								target: this,
								parameter: [s1,s2]
						}  )
						.setAttribute("src",url) ;

					// return this
					
					return this ;
					
				},
				onImageLoad: function onImageLoad(handler)
				{ Meta.error("Under review.") ;

					// set this

						this.handlers.addHandler("imageLoad",handler) ;
						
					// return this
					
					return this ;

				},
				/**
				* Fit an ``IMG'' `Node` according to parameters.
				* @param node The target ``IMG'' `Node`.
				* @param mode The mode parameter.
				* @param align The align parameter.
				* @return this
				*/
				scaleTo: function scaleTo(mode,align)
				{

					// set variables
					
					var s1, s2, s3 ;
					var o ;
					var f ;
				
					// set node

						if(mode === org.meta.ui.Image.MODE_AUTO) { o = this.scaleAutomatically(align) ; }
						else if(mode === org.meta.ui.Image.MODE_HEIGHT) { o = this.scaleToHeight(align) ; }
						else if(mode === org.meta.ui.Image.MODE_WIDTH) { o = this.scaleToWidth(align) ; }
						else if(mode === org.meta.ui.Image.MODE_CONTAIN) { o = this.scaleToContain(align) ; }
						else if(mode === org.meta.ui.Image.MODE_COVER) { o = this.scaleToCover(align) ; }
						else { Meta.logWarning( "Unknown mode parameter.\n\t> mode: \"" + mode + "\"", "org.meta.ui.Image", "scaleTo" ) ; }

					    org.meta.web.dom.Document.select(this.root) ;
					    
						Meta.each(
								o,
								function(name,value) { org.meta.web.dom.Document.style(name,value) ; }
						) ;


				},
				scaleAutomatically: function scaleAutomatically(align)
				{
				
					// set variables
					
					var o ;
					var f1, f2, f3, f4 ;

					// set o
					
						/* Gather style data for the given image Node. */

						org.meta.web.dom.Document.select(this.root)
						.parent( ) ;
						
						f1 = org.meta.web.dom.Document.getHeight( ) ;
						f2 = org.meta.web.dom.Document.getWidth( ) ;

						if(  !!  ( s = org.meta.web.dom.Document.getStyle("padding-top") )  ) { f3 = Meta.parseNumber(s) ; }
						if(  !!  ( s = org.meta.web.dom.Document.getStyle("padding-left") )  ) { f4 = Meta.parseNumber(s) ; }

						if( Meta.isString(align) ) {

								if(align === org.meta.ui.Images.ALIGN_BOTTOM) { f3 += (f1 - this.DATA.height) ; }
								else if(align === org.meta.ui.Images.ALIGN_RIGHT) { f4 += (f2 - this.DATA.width ) ; }
								else if(align === org.meta.ui.Images.ALIGN_CENTER) {

										f3 += (f1 - this.DATA.height) / 2 ;
										f4 += (f2 - this.DATA.width) / 2 ;

								}
								
						}
						else if( Meta.isObject(align) ) {
						
								f3 += ( align.top || 0 ) * f1 ;
								f4 += ( align.left || 0 ) * f2 ;
						
						}
					
						o = { 
								position: "absolute",
								height: (this.DATA.height + "px"),
								width: (this.DATA.width + "px"),
								top: (f3 + "px"),
								left: (f4 + "px")
						} ;							
					
					// return o
					
					return o ;
				
				},
				/**
				* Return a style `Object` for the given ``IMG'' `Node` with the pivotal CSS property values to fit the height of the
				* containing `Node`.
				* @param align (String) The align parameter.
				* ratio.
				* @return Object
				*/
				scaleToHeight: function scaleToHeight(align)
				{

					// set variables

					var o = null ;
					var f1, f2, f3, f4 = 0, f5 = 0 ;
					var s ;

					// set o

						/* Gather style data for the given image Node. */

						org.meta.web.dom.Document.select(this.root)
						.parent( ) ;

						f1 = org.meta.web.dom.Document.getHeight( ) ;
						f2 = org.meta.web.dom.Document.getWidth( ) ;

						/*@Note(The adjusted width of the ``IMG'' `Node` given the container's height and the image source's natural aspect)*/

						f3 = f1 / this.DATA.ratio ;

						if(  !!  ( s = org.meta.web.dom.Document.getStyle("padding-top") )  ) { f4 = Meta.parseNumber(s) ; }
						if(  !!  ( s = org.meta.web.dom.Document.getStyle("padding-left") )  ) { f5 = Meta.parseNumber(s) ; }
						if( Meta.isString(align) ) {

								if(align === org.meta.ui.Image.ALIGN_RIGHT) { f5 += (f2 - f3) ; }
								else if(align === org.meta.ui.Image.ALIGN_CENTER) { f5 += (f2 - f3) / 2 ; } // align center
								
						}
						else if( Meta.isObject(align) ) {
						
								f4 += ( align.top || 0 ) * f1 ;
								f5 += ( align.left || 0 ) * f2 ;
						
						}
						
						/*@Note(Set the ``top'' and ``left'' CSS property values in order to align the ``IMG'' `Node' within the containing `Node`)*/

						o = {
								position: "absolute",
								height: (f1 + "px"),
								width: (f3 + "px" ),
								top: (f4 + "px"),
								left: (f5 + "px")
						} ;

					// return o

					return o ;

				},
				/**
				* Return a style `Object` for the given ``IMG'' `Node` with the pivotal CSS property values to fit the width of the
				* containing `Node`.
				* @param align (String) The align parameter.
				* @Note 1 The adjusted height of the ``IMG'' `Node` given the container's height and the image source's natural aspect
				* ratio.
				* @Note 2 Set the ``top'' and ``left'' CSS property values in order to align the ``IMG'' `Node' within the containing 
				* `Node`. 
				* @return Object
				*/
				scaleToWidth: function scaleToWidth(align)
				{

					// set variables

					var o = null ;
					var f1, f2, f3, f4 = 0, f5 = 0 ;
					var s ;

					// set o

						org.meta.web.dom.Document.select(this.root)
						.parent( ) ;

						f1 = org.meta.web.dom.Document.getHeight( ) ;
						f2 = org.meta.web.dom.Document.getWidth( ) ;
						/*@Note 1*/
						f3 = f2 * this.DATA.ratio ;
						/*/@Note 1*/
						if(  !!  ( s = org.meta.web.dom.Document.getStyle("padding-top") )  ) { f4 = Meta.parseNumber(s) ; }
						if(  !!  ( s = org.meta.web.dom.Document.getStyle("padding-left") )  ) { f5 = Meta.parseNumber(s) ; }
						/*@Note 2*/
						if( Meta.isString(align) ) {
						
								/* Set the alignment; defaults to `ALIGN_TOP`. */

								if(align === org.meta.ui.Image.ALIGN_BOTTOM) { f4 += (f1 - f3) ; }
								else if(align === org.meta.ui.Image.ALIGN_CENTER) { f4 += (f1 - f3) / 2 ; } // align center
								
						}
						else if( Meta.isObject(align) ) {
						
								f4 += ( align.top || 0 ) * f1 ;
								f5 += ( align.left || 0 ) * f2 ;
						
						}
						/*/@Note 2*/
						o =  {
								position: "absolute",
								height: (f3 + "px"),
								width: (f2 + "px" ),
								top: (f4 + "px"),
								left: (f5 + "px")
						} ;

					// return o

					return o ;

				},
				/**
				* Return a style `Object` for the given ``IMG'' `Node` with the pivotal CSS property values to fill the containing 
				* `Node`'s content area.
				* @param align (String) The align parameter.
				* @Note 1 If the image source's natural aspect ratio is upright and the containing `Node` accomodates it, fit to height.
				* @Note 2 If the image source's natural aspect ratio is upright and the containing `Node` does not accomodate it, fit 
				* to width.
				* @Note 3 If the image source's natural aspect ratio is not upright and the containing `Node` does not accomodate it, fit to 
				* height.
				* @Note 4 If the image source's natural aspect ratio is not upright and the containing `Node` accomodate it, fit to width.
				* `Node`. 
				* @return Object
				*/
				scaleToCover: function scaleToCover(align)
				{

					// set variables

					var o = null ;
					var f1, f2 ;

					// set node

						org.meta.web.dom.Document.select(this.root)
						.parent( ) ;

						f1 = this.DATA.ratio ;
						f2 = org.meta.web.dom.Document.getHeight( ) / org.meta.web.dom.Document.getWidth( ) ;

						/*@Note 1*/
						if(f1 >= 1 && f2 >= f1) { o = this.scaleToHeight(align) ; }
						/*/@Note 1*/
						/*@Note 2*/
						else if(f1 >= 1 && f2 < f1) { o = this.scaleToWidth(align) ; }
						/*/@Note 2*/
						/*@Note 3*/
						else if(f1 < 1 && f2 >= f1) { o =  this.scaleToHeight(align) ; }
						/*/@Note 3*/
						/*@Note 4*/
						else if(f1 < 1 && f2 < f1) { o = this.scaleToWidth(align) ; }
						/*/@Note 4*/
					// return o

					return o ;

				},
				/**
				* Return a style `Object` for the given ``IMG'' `Node` determined by choosing the appropriate mode according to the image 
				* source's aspect ratio and the aspect ratio of the containing `Element`.
				* @param align (String) The align parameter.
				* @return Object
				*/
				scaleToContain: function scaleToContain(align)
				{

					// set variables

					var o = null ;
					var f ;

					// set node

						org.meta.web.dom.Document.select(this.root)
						.parent( ) ;
						
						f1 = this.DATA.ratio ;
						f2 = org.meta.web.dom.Document.getHeight( ) / org.meta.web.dom.Document.getWidth( ) ;

						/*@Note("Image is upright and the container content-area's ratio accomodates the image's ratio.")*/
						if(f1 >= 1 && f2 >= f1) { o = this.scaleToWidth(align) ; }
						/*@Note("Image is upright and the container content-area's ratio does not accomodate the image's ratio.")*/
						else if(f1 >= 1  && f2 < f1) { o = this.scaleToHeight(align) ; }
						/*@Note("Image is not upright and the container content-area's ratio accomodates the image's ratio.")*/
						if(f1 < 1  && f2 <= f1) { o = this.scaleToHeight(align) ; }
						/*@Note("Image is note upright and the container content-area's ratio does not accomodate the image's ratio.")*/
						else if(f1 < 1  && f2 > f1) { o = this.scaleToWidth(align) ; }

					// return o

					return o ;

				}
		}
}  ) 
.define(  {
		/**
		* The default implementation of the `Draggable` interface for a movable, draggable and droppable UI `Component`. This is the default component type for a wrapper element.
		* Parameters:
		* > (Boolean) prevent_drag_and_drop: `Boolean` flag that indicates whether drag and drop behaviour should be enabled or disabled.
		* > (Double) perimeter: `Double` value indicating the extension of the perimeter beyond this `Panel` instance's root `Node`'s
		* bounding rectangle.
		*/
		name: "Panel",
		package: "org.meta.ui",
		prototype: "org.meta.ui.Draggable",
		main: function main(root,parameter)
		{

			// set variables
			
			var o ;
			var i1, i2, i3, i4 ;
			
			// set this
			
				this.listeners = [] ;
				this.root = root ;
				this.parameter = parameter ;
				
				this.properties = { } ;
				
				/*@Note("Add default values.")*/
				
				this.parameter.perimeter = ( parameter.perimeter || org.meta.ui.Draggable.STANDARD_PERIMETER ) ;

				if(!!! this.parameter.prevent_default) {

						org.meta.web.dom.Document.select(root)
						.press(  {
								down: { target: this, action: "pick" },
								up: { target: this, action: "drop" }
						}  ) ;
						
						/*@Note("Gather the bounding coordinates of the containing `Node`.")*/
						
						this.setBounds( ) ;
						
						org.meta.web.dom.Document.select(Meta.DEFAULT_VIEW)
						.resize(  { stop: { target: this, action: "setBounds" } }  ) ;

				}
			
		},
		local: {
				/**
				* Return a `Boolean` value indicating whether the given coordinates are within the perimeter of the bounding rectangle of
				*  this `Draggable` instance's root `Node`. The perimeter added to the spatial extension of the bounding rectangle of
				* this `Draggable` instance's root `Node` is 0.3 and may be modified using the parameter ``perimeter''.
				* @param y (Double) A vertical coordinate value.
				* @param x (Double) A horizontal coordinate value.
				* @param perimeter (Double) A double value indicating the extension of the perimeter beyond the bounds.
				* @return Boolean
				*/
				isWithinPerimeter: function isWithinPerimeter(y,x,perimeter)
				{
				
					// set variables
					
					var b1 = false ;
					var d1, d2 ;
					
					// set b
					
						d1 = (1 - perimeter), d2 = (1 + perimeter) ;
						
						o1 = { } ;
						o2 = this.properties.bounds ;
						
						o1.top = (d1 * o2.top) ;
						o1.right = (d2 * o2.right) ;
						o1.bottom = (d2 * o2.bottom) ;
						o1.left = (d1 * o2.left) ;
						
						b1 = this.isWithinBounds(y,x,o1)

					// return b1

					return b1 ;
				
				},
				/**
				* Return a `Boolean` value indicating whether the given coordinates are within the bounding rectangle of this `Panel`
				* instance's root `Node`. If the ``object'' parameter is specified the coordinates will be considered the top and left
				* global offset values of the given rectangle and the test will then assess whether the given rectangle's edges are within
				* the edges of the containing `Node`'s bounding rectangle.
				* @param y (Double) A vertical coordinate value.
				* @param x (Double) A horizontal coordinate value.
				* @param bounds (Object) An optional container with the properties ``top'', ``right'', ``left'' and ``bottom'' holding
				* positive `Integer`s which give the bounding offset values.
				* @param object (Object) A value container with the properties ``height'' and ``width'' describing a rectangle' spatial
				* extension to take into account.
				* @return Boolean
				*/
				isWithinBounds: function isWithinBounds(y,x,bounds,object)
				{

					// set variables
					
					var b1 = false, b2 ;
					var o ;
					var a1, a2 ;
					
					// set b
					
						b1 = (
						
								(  ( bounds.top <= y )  &&  ( bounds.left <= x )  )   &&
								(  ( y <= bounds.bottom )  &&  ( x <= bounds.right )  )

						) ;

						if(!! object && b1) {

								b2 = (
										( (y + object.height) <= bounds.bottom )  &&
										( (x + object.width) <= bounds.right )
								) ;

								b1 = (b1 && b2) ;
								
						}

					// return b1

					return b1 ;
				
				}
		}
}  )
.define(  {
		name: "Button",
		package: "org.meta.ui",
		prototype: "org.meta.ui.Component",
		main: function main(root)
		{
				this.root = root ;
				this.listeners = [] ;
				this.components = [] ;
				this.style = new Style(root) ;
		},
		global: {
				newInstance: function newInstance(root)
				{
Meta.log("Button::newInstance") ;
					// variables
					
					var b ;
					
					//
					
						b = new this(root) ;
						b.setActive(true) ;
						b.style.addClass("button-press") ;
						b.setState(Component.STATE_READY) ;

					// return
					
					return b ;
				
				}
		},
		local: {
				active: null,
				isActive: function( ) { return !! this.active ; },
				setActive: function(boolean) {
				
					// preconditions
					
					Meta.assert(Meta.isBoolean(boolean), "Invalid type for parameter boolean.") ;
					
					//
					
						this.active = boolean ;
						
					// return
					
					return this ;
						
				},
				onClick: function onClick(listener)
				{
		
					//
					
						DOM.addListener(this.root, "click", listener) ;

					// return

					return this ;

				},
				onPress: function onPress(handler)
				{

					// set variables
					
					var o1 = { }, o2 ;
					
					// set root
					
						if( !! (o2 = handler.down) ) {
						
								o1.down = {
										action: function(handler) { this.queue(handler) ; },
										parameter: o2,
										target: this
								} ;
								
						}

						if( !! (o2 = handler.up) ) {
						
								o1.up = {
										action: function(handler) { this.queue(handler) ; },
										parameter: o2,
										target: this
								} ;
								
						}


						org.meta.web.dom.Document.select(this.root)
						.onPress(o1) ;

					// return this 

					return this ;

				},
				/**
				* Places a click handler on this `Button` instance's root `Node` which performs one of two actions depending on whether
				* the ``active'' property (`this.properties.active`) is set to true or false (default is false, i.e. inactive).
				* @param handler (Object) A handler specification containing two properties ``on'' and ``off'' containing the individual
				* handlers for active and inactive status.
				* @return this
				*/
				onToggle: function onToggle(handler)
				{

					// set root
					
						org.meta.web.dom.Document.select(this.root)
						.onClick(  {
								target: this,
								action: function(handler) {

									var o ;
								
										if(!!this.active) { this.active = false ; o = handler.off ; }
										else { this.active = true ; o = handler.on ; }

this.handle(o) ;
//										this.queue(o) ;
								
								},
								parameter: handler
						}  )
						
					// return this
					
					return this ;
						
				}
		}
}  ) ;

var Button = org.meta.ui.Button ;

Meta.define(  {
		name: "Checkbox",
		package: "org.meta.ui",
		prototype: "org.meta.ui.Button",
		main: function main(root,parameter)
		{
Meta.log("Checkbox#main") ;
			// set variables
			
			var o ;

			// set this

				this.root = root ;

				this.handlers = new org.meta.core.Eventable.Handlers(null) ;
				
				this.active = false ;

				org.meta.web.dom.Document.select(this.root)
				.addClass("button-press") ;
				
				this.unselect( )
				.onToggle(  { on: { target: this, action: "select" }, off: { target: this, action: "unselect" }  }  )

				this.setState(org.meta.ui.Component.STATE_READY) ;

		},
		local: {
				select: function select( )
				{								

					// set variables
				
					var o ;
					var s ;
					
					// set ?
					
						this.active = true ;

						s = this.getProperty("text")
						.on ;
						
						org.meta.web.dom.Document.select(this.root)
						.text(s)
						.style("border-color","rgb(55,205,100)")
						.style("color","rgb(55,205,100)") ;
						
						this.triggerEvent("select") ;
						
					// return this
					
					return this ;

				},
				unselect: function unselect( )
				{

					// set variables
					
					var o ;
					var s ;
					
					// set ?
					
						this.active = false ;

						s = this.getProperty("text")
						.off ;
						
						org.meta.web.dom.Document.select(this.root)
						.text(s)
						.style("border-color","rgb(55,55,55)")
						.style("color","rgb(55,55,55)") ;
						
						this.handlers.triggerEvent("unselect") ;
						
					// return this
					
					return this ;

				},
				onSelect: function onSelect(handler)
				{
					
					// set this
					
						this.handlers.addHandler("select",handler) ;
					
					// return this
					
					return this ;

				},
				onUnselect: function onUnselect(handler)
				{
					
					// set this
					
						this.handlers.addHandler("unselect",handler) ;
					
					// return this
					
					return this ;

				}
		}
}  ) ;

Meta.require("org.meta.ui.Button") ;

var Button = org.meta.ui.Button ;

Meta.define(  {
		name: "Form",
		package: "org.meta.ui",
		prototype: "org.meta.ui.Component",
		require: ["org.meta.ui.Button"],
		main: function main(root)
		{
		
			this.root = root ;
			this.listeners = [] ;
			this.components = [] ;
		
		},
		global: {
				newInstance: function newInstance(root)
				{
Meta.log("Form::newInstance (%1;)",root) ;
					// variables
					
					var f, o ;
					
					//
					
						f = new this(root) ;
					
						Path.newInstance("*[type=%s]", {s:"submit"})
						.evaluate(root)
						.each(  function(index,button) {
Meta.log("button: %1;",button) ;
							var b ;
							
								b = Button.newInstance(button)
								.onClick(  {
								
										action: function(event,form) {
confirm("click") ;
												event.preventDefault( ) ;
												form.submit( ) ;
												
										},
										parameter: f
										
								}   ) ;

								//..
								
								f.add(b) ;
								
						}  ) ;
						
					// return
					
					return f ;
				
				}
		},
		local: {
				submit: function submit( )
				{
Meta.log("Form.submit") ;
					// variables
					
					var o ;

					//
					
						o = { } ;
						
						/*...*/
						
						this.triggerEvent("submit",o) ;
						
					// return
					
					return this ;

				}
		}
		
}  )
.define(  {
		/**
		* A `Gauge` is an extension to `Component` which may be used to provide a graphical representations of a gaugeable value
		* (e.g. a volume setting for a player interface). Setting the level is graphically represented by clipping the
		* content of the first descendant `Element` of the ``meter'' `Element`; the ``meter'' `Element` therefore is expected to
		* provide some sort of background.
		*/
		name: "Gauge",
		package: "org.meta.ui",
		prototype: "org.meta.ui.Component",
		main: function main(root)
		{ Meta.error("Under review.") ;
		
			// set this
			
				this.handlers = new org.meta.core.Eventable.Handlers(null) ;
				
				this.root = root ;

		},
		local: {
				level: function(level)
				{
				
					// set variables
					
					var d ;
					
					// set ?

						org.meta.web.dom.Document.select(this.root)
						.find(this.parameter.meter)
						.find(this.parameter.display) ;
						
						d = org.meta.web.dom.Document.getHeight( ) * ( 1 - level ) ;
				
						org.meta.web.dom.Document.style("clip","rect(" + d + "px auto auto auto)") ;
						
						this.onAdjust(  { level: level }  ) ;

					// return this
					
					return this ;

				},
				adjust: function(handler)
				{ Meta.error("Deprecation") ;
				
						this.addListener("adjust",handler) ;
						
					return this ;
					
				},
				onAdjust: function(event)
				{ 
				
						this.handlers.addHandler("adjust",event) ;
						
					return this ;

				},
				setToggle: function(parameter)
				{
				
					// set variables

					var n ;
					
					// set this
					
						n = org.meta.web.dom.Document.select(this.root)
						.find(parameter.root)
						.getCurrent( ) ;

						this.components.toggle = org.meta.ui.Button(n)
						.toggle(  {
								off: { target: this, action: "level", parameter: 1 },
								on: { target: this, action: "level", parameter: 0 }
						}  ) ;
					
					// return this
					
					return this ;

				},
				setMeter: function(parameter)
				{
			
					// set variables
					
					var o ;
					
					// set ?

						org.meta.web.dom.Document.select(this.root)
						.find(parameter.root)
						.click(  {
								target: this,
								action: function(node,event) {

									var n1, n2, n3, n4 ;
									var d ;
								
										org.meta.web.dom.Document.select(node) ;
										
										n1 = org.meta.web.dom.Document.getHeight( ) ;
										n2 = event.clientY ;
										n3 = org.meta.web.dom.Document.getGlobalOffsetTop( ) ;
										n4 = (n2 - n3) ;
										d = 1 - (n4 / n1) ;

										this.queue(  { target: this, action: "level", parameter: d }  ) ;

								}
						}  ) ;
						
					// return this
					
					return this ;
					
				}
		}
}  )
.define(  {
		name: "Selection",
		package: "org.meta.ui",
		prototype: "org.meta.ui.Component",
		main: function main(root)
		{

			// set this
			
				this.root = root ;
//				this.parameter = ( parameter || { } ) ;

//				this.properties = { } ;
				this.handlers = new org.meta.core.Eventable.Handlers(null) ;
				
				this.inputs = { } ;
				
			// return this
			
			return this ;

		},
		local: {
				inputs: null,		
				addInput: function addInput(input)
				{

					// set variables
					
					var s ;
					
					// set this

						s = input.getId( ) ;

						this.inputs[s] = input ;

						input.onSelect(  {
								target: this,
								action: function(input) { this.selectInput(input) ; },
								parameter: input
						}  ) ;

					// return this
					
					return this ;

				},
				getInputs: function getInputs( ) { return this.inputs ; },
				selectInput: function selectInput(input)
				{

					// set variables
					
					var s ;
					var i1 = 0, i2 ;
					
					// set this
					
						s = input.getId( ) ;
						i2 = ( this.parameter.selection_limit || Number.POSITIVE_INFINITY ) ;

						Meta.each(
								this.inputs,
								function(id,input) {

										if( s !== input.getId( ) ) {

												i1 += ( input.isActive( ) ? 1 : 0 ) ;

												if(i1 >= i2) {  input.unselect( ) ; }

										}
										
								}		
						) ;
					
					// return this
					
					return this ;

				}
		}
}  )
.define(  {
		/**
		* A `Movable` implementation which provides an animated list.
		* Parameters:
		* > orientation: (String) Either ``vertical'' or ``horizontal'' depending on which layout the list wrapped
		* with this type of `Component` has.
		* > entries: (String) The relative path of the list's entries. Each entry will be assigned a click handler
		* which will result in scrolling the list so as to center the given list entry.
		* > prevent_entry_scroll: (Boolean) `Boolean` flag indicating whether the list entries should be
		* assigned click handlers for center scrolling.
		* > animation_duration: (Integer) Duration of transitions in miliseconds.
		*/
		name: "Dial",
		package: "org.meta.ui",
		prototype: "org.meta.ui.Movable",
		main: function main(root,parameter)
		{
		
			// set variables

				this.root = root ;
				this.parameter = ( parameter || { } ) ;
				this.properties = { current: null, last: null } ;
				this.handlers = new org.meta.core.Eventable.Handlers(null) ;

				if(!!! this.parameter.prevent_entry_scroll) { this.setEntries(parameter) ; }
				
				this.setState(org.meta.ui.Component.STATE_READY) ;

			// return this
			
			return this ;

		},
		global: {
				ORIENTATION_VERTICAL: "vertical",
				ORIENTATION_HORIZONTAL: "horizontal"
		},
		local: {
				dialTo: function dialTo(index)
				{

					// set variables
					
					var b ;
					var n1, n2 = 0, n3, n4 ;
					var o ;
					var t ;

					// set root

						b = (this.parameter.orientation === org.meta.ui.Dial.ORIENTATION_VERTICAL) ;
						
						org.meta.web.dom.Document.select(this.root)
						.find(this.parameter.entry) ;
						
						if(b) { n2 = org.meta.web.dom.Document.getCompoundHeight(index) ; }
						else { n2 = org.meta.web.dom.Document.getCompoundWidth(index) ; }

						/*@Note("Get the height of the entry.")*/

						org.meta.web.dom.Document.item(index) ;
						
						n3 = (b) ? org.meta.web.dom.Document.getOffsetHeight( ) : org.meta.web.dom.Document.getOffsetWidth( )
						
						/*@Note("The height of the container.")*/
						
						org.meta.web.dom.Document.select(this.root) ;
						
						n4 = (b) ? org.meta.web.dom.Document.getHeight( ) : org.meta.web.dom.Document.getWidth( ) ;
						
						/*@Note("The target offset value is the offset which centers the first entry minus the aggregate offset
						of the antecedent entries and half the entry's offset height or width.")*/

						n1 = (n4 / 2) - (n2 + n3 / 2) ;

						o = { duration: this.parameter.animation_duration } ;
						
						if(b) { o.vertical = { to: n1 } ; }
						else {  o.horizontal = { to: n1 } ; }

						t = this.move(o) ;
						
						if( !! (o = this.parameter.entry_style) ) {
						
								t.stop(  {
										target: this,
										action: function(node,style) {
											
												org.meta.web.dom.Document.select(this.root)
												.find(this.parameter.entry)
												.find(this.parameter.entry_text)
												.each(  function( ) { this.setStyle(style.off) ; }  )
												.item(index)
												.setStyle(style.on) ;

										},
										parameter: [index,o]
								}  ) ;
								
						}
						
						if(!! t) { this.onDial(  { index: index, transition: t }  ) ; }

					// return this
					
					return this ;						
						
				},
				dialUp: function dialUp( )
				{

					// set variables
					
					var i1, i2, i3 ;
					var t ;
					
					// set root					

						/*@Note("Default to the container's height as the delta value for the move transition.")*/

						org.meta.web.dom.Document.select(this.root) ;
						
						i1 = Meta.parseNumber( org.meta.web.dom.Document.getOffsetHeight( ) ) ;
						i2 = Meta.parseNumber( org.meta.web.dom.Document.getStyle("top") ) ;
						
						i3 = i2 - i1 ;

						/*@ToDo("Set boundaries.")*/						

						t = this.move(  {
								duration: this.parameter.animation_duration,
								vertical: { to: i3 }
						}  ) ;

						if(!! t) { this.onDial(  { transition: t }  ) ; }

					// return this
					
					return this ;
				
				},
				dialDown: function dialDown( )
				{

					// set variables
					
					var i1, i2, i3 ;
					var t ;
					
					// set root

						/*@Note("Default to the container's height as the delta of the move transition.")*/

						org.meta.web.dom.Document.select(this.root) ;
						
						i1 = Meta.parseNumber( org.meta.web.dom.Document.getOffsetHeight( ) ) ;
						i2 = Meta.parseNumber( org.meta.web.dom.Document.getStyle("top") ) ;
						
						i3 = i2 + i1 ;
						
						/*@ToDo("Set boundaries.")*/
						
						t = this.move(  {
								duration: this.parameter.animation_duration,
								vertical: { to: i3 }
						}  ) ;

						if(!! t) { this.onDial(  { transition: t }  ) ; }

					// return this
					
					return this ;

				},
				dialLeft: function dialLeft( )
				{

					// set variables
					
					var i1, i2, i3 ;
					var t ;
					
					// set root					

						/*@Note("Default to the container's width as the delta value for the move transition.")*/

						org.meta.web.dom.Document.select(this.root) ;
						
						i1 = Meta.parseNumber( org.meta.web.dom.Document.getOffsetWidth( ) ) ;
						i2 = Meta.parseNumber( org.meta.web.dom.Document.getStyle("left") ) ;
						
						i3 = i2 - i1 ;

						t = this.move(  {
								duration: this.parameter.animation_duration,
								horizontal: { to: i3 }
						}  ) ;

						if(!! t) { this.onDial(  { transition: t }  ) ; }

					// return this
					
					return this ;
				
				},
				dialRight: function diaRight( )
				{

					// set variables
					
					var i1, i2, i3 ;
					var t ;
					
					// set root					

						/*@Note("Default to the container's width as the delta value for the move transition.")*/

						org.meta.web.dom.Document.select(this.root) ;
						
						i1 = Meta.parseNumber( org.meta.web.dom.Document.getOffsetWidth( ) ) ;
						i2 = Meta.parseNumber( org.meta.web.dom.Document.getStyle("left") ) ;
						
						i3 = i2 + i1 ;

						t = this.move(  {
								duration: this.parameter.animation_duration,
								horizontal: { to: i3 }
						}  ) ;

						if(!! t) { this.onDial(  { transition: t }  ) ; }

					// return this
					
					return this ;
				
				},
				dial: function dial(handler)
				{

						this.addListener("dial",handler) ;

					return this ;

				},
				onDial: function onDial(event)
				{

						this.triggerEvent("dial",event) ;
						
					// return this
					
					return this ;

				},
				setEntries: function setEntries(parameter)
				{
						
					// set ?
						
						org.meta.web.dom.Document.select(this.root)
						.find(parameter.entry) ;
						
						/*@Node("Set entries.")*/
						
						Meta.each(
								org.meta.web.dom.Document.get( ),
								function(index,node) {
								
										org.meta.web.dom.Document.select(node)
										.press(  {
												down: {
														target: this,
														action: function(index,event) { this.dialTo(index) ; },
														parameter: index
												}
										}  ) ;
								
								},
								this
						) ;
						
					// return this
					
					return this ;								

				}
		}
}  )
.define(  {
		name: "Scroll",
		package: "org.meta.ui",
		prototype: "org.meta.ui.Component",
		main: function main(root,parameter)
		{

			// set this
			
				this.root = root ;
				this.parameter = ( parameter || { } ) ;
				this.handlers = new org.meta.core.Eventable.Handlers(null) ;
				
				this.components = { } ;
										
				if(this.parameter.orientation === org.meta.ui.Scroll.ORIENTATION_VERTICAL) {
				
						this.setScrollUp( )
						.setScrollDown( ) ;

				}
				if(this.parameter.orientation === org.meta.ui.Scroll.ORIENTATION_HORIZONTAL) {

						this.setScrollRight( )
						.setScrollLeft( ) ;

				}
				
				this.setDial(  {
						root: parameter.dial_container,
						entry: parameter.dial_entry,
						entry_text: parameter.dial_entry_text,
						entry_style: parameter.dial_entry_style,
						orientation: parameter.orientation,
						animation_duration: parameter.dial_animation_duration,
						prevent_entry_scroll: (parameter.dial_prevent_entry_scroll || false)
				}  )
				.setSlider(  {
						root: parameter.slider_container,
						bar: parameter.slider_bar,
						handle: parameter.slider_handle,
						animation_duration: parameter.slider_animation_duration
				}  ) ;
				
				/*@ToDo("Fix wheel events").*/

				org.meta.ui.UI.mouse(  function(target,event) {
						if(event.type==="wheel") { Meta.log("\t> wheel-event") ; }
				}  ) ;
				
				this.setState(org.meta.ui.Component.STATE_READY) ;
				
			// return this
			
			return this ;
		
		},
		global: {
				ORIENTATION_VERTICAL: "vertical",
				ORIENTATION_HORIZONTAL: "horizontal"
		},
		local: {
				scrollUp: function scrollUp(handler)
				{
				
						this.addListener("scrollUp",handler) ;
					return this ;
				
				},
				scrollDown: function scrollDown(handler)
				{
				
						this.addListener("scrollDown",handler) ;
					return this ;

				},
				scrollLeft: function scrollLeft(handler)
				{
				
						this.addListener("scrollLeft",handler) ;
					return this ;
				
				},
				scrollRight: function scrollRight(handler)
				{
				
						this.addListener("scrollRight",handler) ;
					return this ;

				},
				onScrollUp: function onScrollUp( )
				{

						this.triggerEvent("scrollUp") ;
					return this ;

				},
				onScrollDown: function onScrollUp( )
				{
			
						this.triggerEvent("scrollDown") ;
					return this ;

				},
				onScrollLeft: function onScrollLeft( )
				{

						this.triggerEvent("scrollUp") ;
					return this ;

				},
				onScrollRight: function onScrollRight( )
				{
			
						this.triggerEvent("scrollDown") ;
					return this ;

				},
				setScrollUp: function setScrollUp( )
				{
				
					// set variables
					
					var n ;
					
					// set up
					
						n = org.meta.web.dom.Document.select(this.root)
						.find(this.parameter.up)
						.getCurrent( ) ; 

						this.components.up = org.meta.ui.Button(n)
						.click(  {
								target: this,
								action: function( ) { this.onScrollUp( ) ; }
						}  ) ;
						
					// return this
					
					return this ;

				},
				setScrollDown: function setScrollDown( )
				{
				
					// set variables
					
					var n ;
					
					// set down

						n = org.meta.web.dom.Document.select(this.root)
						.find(this.parameter.down)
						.getCurrent( ) ; 

						this.components.down = org.meta.ui.Button(n)
						.click(  {
								target: this,
								action: function( ) { this.onScrollDown( ) ; }
						
						}  ) ;
						
					// return this
					
					return this ;

				},
				setScrollLeft: function setScrollLeft( )
				{
				
					// set variables
					
					var n ;
					
					// set up

						n = org.meta.web.dom.Document.select(this.root)
						.find(this.parameter.left)
						.getCurrent( ) ; 

						this.components.left = org.meta.ui.Button(n)
						.click(  {
								target: this,
								action: function( ) { this.onScrollLeft( ) ; }
						}  ) ;
						
					// return this
					
					return this ;

				},
				setScrollRight: function setScrollRight( )
				{
				
					// set variables
					
					var n ;
					
					// set up

						n = org.meta.web.dom.Document.select(this.root)
						.find(this.parameter.right)
						.getCurrent( ) ; 

						this.components.right = org.meta.ui.Button(n)
						.click(  {
								target: this,
								action: function( ) { this.onScrollRight( ) ; }
						}  ) ;
						
					// return this
					
					return this ;

				},
				setDial: function setDial(parameter)
				{
				
					// set variables
					
					var n ;
					
					// set components
					
						n = org.meta.web.dom.Document.select(this.root)
						.find(parameter.root)
						.getCurrent( ) ;
					
						this.components.dial = org.meta.ui.Dial(n,parameter) ;

						if(parameter.orientation === org.meta.ui.Dial.ORIENTATION_VERTICAL) {
						
								this.scrollDown(  { action: "dialUp", target: this.components.dial }  )
								.scrollUp(  { action: "dialDown", target: this.components.dial }  ) ;
								
						}
						else {
						
								this.scrollRight(  { action: "dialLeft", target: this.components.dial }  )
								.scrollLeft(  { action: "dialRight", target: this.components.dial }  ) ;

						}
						
					// return this

					return this ;
				
				},
				setSlider: function setSlider(parameter)
				{
				
					// set variables
					
					var n ;
					
					// set components
					
						n = org.meta.web.dom.Document.select(this.root)
						.find(parameter.root)
						.getCurrent( ) ;

						this.components.slider = org.meta.ui.Slider(n,parameter)
						.slide(  {
						}  ) ;
						
					// return this
					
					return this ;

				}
		}
}  ) ;		

}  )( ) ;