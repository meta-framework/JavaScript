/** 
* Set-up script for the Meta Core library.
* @author Friedrich Alexander Kurz, 2013, f.a.kurz@googlemail.com
* available under MIT-License
*/

( function( ) {

Meta.define(  {
		/**An Object intended as common super type for all other Objects providing e.g. a generic `toString` function.*/
		name: "Object",
		package: "org.meta.core",
		local: {
				toString: function toString( ) { return "[object " + this.reflect.name + "]" ; }
		}
}  )
.define(  {
		/**An abstract type providing an attribute bit map and related utility functions.*/
		name: "Settable",
		package: "org.meta.core",
		type: Meta.STRING_OBJECT_TYPE_ABSTRACT,
		prototype: "org.meta.core.Object",
		local: {
				attributes: 0,
				setAttribute: function setAttribute(attribute)
				{

					//
					
						this.attributes |= attribute ;

					// return
					
					return this ;

				},
				getAttributes: function getAttributes( )
				{
					return this.attributes ;
				},
				hasAttribute: function hasAttribute(attribute)
				{
					return ((this.attributes & attribute) !== 0) ;
				},
				/*@ToDo(Test)*/
				removeAttribute: function removeAttribute(attribute)
				{
					
					//
					
						this.attributes &= ~(~this.attributes | attribute) ;
								
					// return
					
					return this ;

				}
		}
}  )
.define(  {
		/**An Object wrapper for a callback function.*/
		name: "Callback",
		package: "org.meta.core",
		prototype: "org.meta.core.Object",
		/**
		* Create a Callback. 
		* @param specification (Function, Object)
		* @param owner (Object) [optional] Indicates whether the context for the callback of this Callback should point to the owning Object or itself (if omitted).
		*/
		main: function main(specification, owner)
		{
		
			// preconditions
			
			Meta.assert(Meta.isFunction(specification) || Meta.isObject(specification), "Invalid type for parameter task.") ;
			
			// variables
			
			var o ;

			//

				if(Meta.isFunction(specification))
				{
				
						this.callback = specification ;
						this.target = owner || this ;
						
				}
				else if(Meta.isObject(specification))
				{

						this.callback = specification.callback ;
						this.target = owner || this ;
						
						o = specification.parameter ;
						
						this.parameter = !! o ? Meta.isArray(o) ? o : [o] : null ;
				
				}

		},
		local: {
				owner: null,
				callback: null,
				parameter: null,
				execute: function execute( )
				{

					//

						if(!! this.parameter) { this.callback.apply(this.target, this.parameter) ; }
						else { this.callback.call(this.target) ; }

					// return
					
					return this ;

				}
		}
}  )
.define(  {
		/*@ToDo(Make Listener extend Callback. Implement `sleep` and `wake`).*/
		/**A listener implementation for use in Eventable instances.*/
		name: "Listener",
		prototype: "org.meta.core.Object",
		package: "org.meta.core",
		/**Create a `Listener`. 
		*
		* The third parameter `owner` is optional and indicates whether the context for the callback of this Listener should point to the owning Object or the Listener itself (if omitted). If the owning object is specified, the callback is is bound to the owning object (i.e. `this` points to the owning object rather than this Listener instance); this is especially warranted in cases where the callback performs an operation on the owning object and a direct reference to the owning object makes sense; in all other cases---e.g. when the callback performs an operation involving another object---it may be omitted.
		*/
		main: function main(name, callback, owner)
		{
		
			// preconditions
			
				Meta.assert(Meta.isFunction(callback) || Meta.isObject(callback), "Invalid type for parameter listener.") ;
			
			// variables
			
			var o ;
			
			//
			
				this.name = name ;
				
				if( Meta.isFunction(callback) )
				{
				
						this.callback = callback ;
						this.target = owner || this ;
						this.singleton = false ;
						
				}
				else if( Meta.isObject(callback) )
				{
				
						this.callback = callback.callback ;
						this.target = owner || this ;
						
						o = callback.parameter ;

						this.parameter = !! o ? Meta.isArray(o) ? o : [o] : null ;
						this.singleton = callback.singleton || false ;
						
				}
		
		},
		local: {
				name: null,
				singleton: null,
				handle: function handle(event)
				{

					// variables
					
					var a = null ;
					
					//

						if(!! this.parameter)
						{
						
								a = this.parameter ;
								a[a.length] = event ;
						
						}
						else { a = [event] ; }

						this.callback.apply(this.target, a) ;
				
					// return
					
					return this ;
				
				}
		}
}  )
.define(  {
		/**Abstract Object providing the basic implementation of an Object that raises events and provides event listener registration.*/
		name: "Eventable",
		package: "org.meta.core",
		prototype: "org.meta.core.Settable",
		type: Meta.STRING_OBJECT_TYPE_ABSTRACT,
		require: ["org.meta.core.Listener"],
		local: {
				listeners: null,
				/*Add a `Listener` to the listener map. By means of convention, specialized listener registration functions should create `Listener`s from `Function` or `Object` parameters. */
				addListener: function addListener(listener)
				{

					// preconditions
					
					Meta.assert(Meta.instanceOf(org.meta.core.Listener,listener), "Invalid type for parameter listener.") ;
					
					// variables
					
					var a ;

					//
					
						if( !!! ( a = this.listeners[listener.name] ) ) { this.listeners[listener.name] = a = [] ; }
						
						a[a.length] = listener ;
					
					// return
					
					return this ;

				},
				removeListener: function removeListener(listener)
				{
				
					// preconditions
					
					Meta.assert( Meta.instanceOf(org.meta.core.Listener,listener), "Invalid type.") ;
					
					// variables
					
					var a ;
					
					//
					
						if( !!! ( a = this.listeners[listener.name] ) ) { this.listeners[listener.name] = a = [] ; }
						
						for( i = a.length ; --i >= 0 ; ) {

								if( listener.instanceId( ) === a[i].instanceId( ) ) {
								
										a.splice(i,1) ;
										break ;
										
								}

						}
					
					// return
					
					return this ;

				},
				triggerEvent: function triggerEvent(name, event)
				{
				
					// variables
					
					var a, i = -1, l ;
					
					//
					
						if(  !!  ( a = this.listeners[name] )  ) {

								while(  !!  ( l = a[++i] )  ) {
								
										/*@Note("Singleton handlers must be removed from the `listeners` container for the given event name before being called.)*/
										
										if(l.singleton) { a.splice(i,1) ; i-- ; }
										
										l.handle(event) ;
								
								}

						}
						
					// return
					
					return this ;					
					
				}
		}
}  )
.define(  {
		/**
		*The abstract super type of Task and Schedule providing the base functionality of a callback chain. 
		*
		*A Runnable instance is supposed to pass through the following stages during a life-cycle: (1) "idle" directly after construction or after calling `reset`; (2) "busy", while executing the callback list; (3) "stopped", after completion or if forced to stop. The functions which control the `Runnable`'s state are state-specific, i.e. they require the `Runnable` to conform to a state-requirement: e.g (1) `start` requires the `Runnable` to be idle; (2) `stop` requires the `Runnable` to be busy; (3)  `resume` and `reset` require the `Runnable` to be stopped. In addition the listener registration methods and the `add` functions require the `Runnable` to be idle.
		*/
		name: "Runnable",
		package: "org.meta.core",
		prototype: "org.meta.core.Eventable",
		type: Meta.STRING_OBJECT_TYPE_ABSTRACT,
		require: ["org.meta.core.Eventable", "org.meta.core.Callback"],
		global: {
				ATTRIBUTE_REPEATABLE: 2,
				STATE_IDLE: 0,
				STATE_BUSY: 1,
				STATE_STOPPED: 2,
				STATE_DEFUNCT: 3,
				EVENT_STATECHANGE: "stateChange",
				EVENT_COMPLETE: "complete"
		},
		local: {
				state: null,
				callbacks: null,
				position: null,
				/**
				* Return the size of the callback list of this Runnable instance.
				* @return Integer
				*/
				size: function size( ) { return this.callbacks.length ; },
				isIdle: function isIdle( ) { return this.state === org.meta.core.Runnable.STATE_IDLE ; },
				isReady: function isReady( ) { return this.state === org.meta.core.Runnable.STATE_READY ; },
				isBusy: function isBusy( ) { return this.state === org.meta.core.Runnable.STATE_BUSY ; },
				/**
				* Return a Boolean value indicating whether this Runnable instance is stopped or not.
				* @return Boolean
				*/
				isStopped: function isStopped( ) { return this.state === org.meta.core.Runnable.STATE_STOPPED ; },
				setState: function setState(state)
				{

					// variables
					
					var o ;
					
					//
					
						o = {old_state: this.state, new_state: state} ;
					
						this.state = state ;
						this.triggerEvent("stateChange",o) ;
						
					// return
						
					return this ;

				},
				getState: function getState( ) { return this.state ; },
				/**
				*Add a callback to the callback list.
				*@param callback (Function, Object, Callback) A Function, Object or Task instance specifying the callback. A callback Object must have a property `callback` which must be a function. The task may be given parameters by adding a property `parameter` which may be any Object or an Array of Objects; the parameter or parameter Array will be passed to the action for this task as its arguments.
				*@return this
				*/
				add: function add(callback)
				{

					// preconditions

					Meta.assert(this.isIdle( ), "Invalid state (state=%1;)", this.state) ;
					Meta.assert(Meta.instanceOf(org.meta.core.Callback, callback) || Meta.isObject(callback) || Meta.isFunction(callback), "Invalid type." ) ;
					
					// variables
					
					var c ;
					
					//
						
						if( Meta.isFunction(callback) || Meta.isObject(callback) ) { c = new org.meta.core.Callback(callback, this) ; }
						else if( Meta.instanceOf(org.meta.core.Task,task) ) { c = callback ; }

						this.callbacks[this.callbacks.length] = c ;
					
					// return
					
					return this ;

				},
				/**
				*Call the next handler in this `Thread`'s task list.
				*@return this
				*/
				next: function next( )
				{

					// preconditions
					
					Meta.assert(! this.isStopped( ), "Runnable is stopped.") ;
					
					// variables

					var i, c  ;

					//

						/*@Note("While there is a task execute it; otherwise, call the handlers associated with the ``complete'' event.")*/

						if((i = ++this.position) < this.callbacks.length) {

								c = this.callbacks[i] ;
								c.execute( ) ;

								/*@Note(A task may call `stop` in order to prevent or delay execution of the subsequent tasks.)*/
								
								if(! this.isStopped( )) { this.next( ) ; }
								
						}
						else
						{
						
								this.stop( )
								.triggerEvent(org.meta.core.Runnable.EVENT_COMPLETE) ;
								
								/*Make this Runnable defunct if it is not repeatable.*/
						
								if(! this.hasAttribute(org.meta.core.Runnable.ATTRIBUTE_REPEATABLE))
								{
								
										this.callbacks = null ;
										this.setState(org.meta.core.Runnable.STATE_DEFUNCT) ;
										
								}
								
						}
						
					// return
					
					return this ;

				},
				/**
				*Start this `Runnable` instance, i.e. execute the first task in the task list.
				*@return this
				*/
				start: function start( )
				{

					// preconditions
					
						Meta.assert(this.isIdle( ), "Invalid state (state=%1;).", this.state) ;
					
					//

						this.position = -1 ;

						this.setState(org.meta.core.Runnable.STATE_BUSY)
						.next( ) ;
						
					// return
					
					return this ;

				},
				resume: function resume( )
				{
				
					// preconditions
					
						Meta.assert(this.isStopped( ), "Invalid state (state=%1;)", this.state) ;
					
					//
					
						this.setState(org.meta.core.Runnable.STATE_BUSY) ;
						this.next( ) ;
						
					// return
					
					return this ;

				},
				/**
				Stop this `Thread` instance.
				@return this
				*/
				stop: function stop( )
				{

					// preconditions
					
						Meta.assert(this.isBusy( ), "Invalid state (state=%1;)", this.state) ;

					//
					
						this.setState(org.meta.core.Runnable.STATE_STOPPED) ;
						
					// return

					return this ;

				},
				reset: function reset( )
				{
				
					// preconditions
					
					Meta.assert(this.isStopped( ), "Invalid state (state=%1;)", this.state) ;
					
					//
					
						this.position = -1 ;
						this.setState(org.meta.core.Runnable.STATE_IDLE) ;
						
					// return
					
					return this ;
				
				},
				onStateChange: function onStateChange(listener)
				{
				
					// preconditions
				
					Meta.assert(this.isIdle( ), "Invalid state (state=%1;)", this.state) ;

					// variables
					
					var l ;
					
					//
					
						if( ! Meta.instanceOf(org.meta.core.Listener,listener) ) { l = new org.meta.core.Listener(org.meta.core.Runnable.EVENT_STATECHANGE,listener,this) ; }
						else { l = listener ; }

						this.addListener(l) ;
						
					// return

					return this ;

				},
				/**
				Add a handler for the ``complete'' event.
				@return this
				*/
				onComplete: function onComplete(listener)
				{

					// preconditions
					
					Meta.assert(this.isIdle( ), "Invalid state (state=%1;)", this.state) ;

					// variables
					
					var l = null ;
					
					//
					
						if( ! Meta.instanceOf(org.meta.core.Listener,listener) ) { l = new org.meta.core.Listener(org.meta.core.Runnable.EVENT_COMPLETE,listener,this) ; }
						else { l = listener ; }

						this.addListener(l) ;
						
					// return

					return this ;

				}
		}
		
}  )
.define(  {
		/**Standard implementation of a sequential callback chain.*/
		name: "Task",
		package: "org.meta.core",
		prototype: "org.meta.core.Runnable",
		require: ["org.meta.core.Runnable"],
		/**
		* Initialize this Task instance.
		* @param repeatable (Boolean) Boolean flag that indicates whether this Task instance is repeatable.
		* @return this
		*/
		main: function main(repeatable)
		{

			//

				this.attributes = 0 ;
				this.position = -1 ;
				this.listeners = { } ;
				this.callbacks = [ ] ;

				if(repeatable === true) this.setAttribute(org.meta.core.Runnable.ATTRIBUTE_REPEATABLE) ;
				
				this.setState(org.meta.core.Runnable.STATE_IDLE) ;

		}
})
.define(  {
		/**Standard implementation of a timed sequential callback chain.*/
		name: "Schedule",
		package: "org.meta.core",
		prototype: "org.meta.core.Runnable",
		require: ["org.meta.core.Runnable"],
		/**
		*Initialize this Schedule instance.
		* @param repeatable (Boolean) Boolean flag that indicates whether this Task instance is repeatable.
		*@param interval (Integer) The timeout interval to be put in between task executions in miliseconds.
		*@return this
		*/
		main: function main(interval, repeatable)
		{

			// preconditions
			
				Meta.assert(Meta.isInteger(interval), "Invalid type for parameter interval.") ;

			//
			
				this.attributes = 0 ;

				this.listeners = { } ;
				this.callbacks = [ ] ;

				this.position = -1 ;
				this.interval = interval ;
				
				/*@Note(A callback function whose context is fixed to this `Schedule` which is used together with a timeout in order to provide periodic execution of the tasks.).*/

				this.callback = Meta.bind(
						function( ) { this.next( ) ; },
						this
				) ;

				if(repeatable === true) this.setAttribute(org.meta.core.Runnable.ATTRIBUTE_REPEATABLE) ;

				this.setState(org.meta.core.Runnable.STATE_IDLE) ;

			// return
			
			return this ;

		},
		local: {
				interval: null,
				callback: null,
				timer: null,
				/**
				Call the next task in this `Schedule` instance's task list.
				@Note A minimum delay in the range of 4ms to 10ms is enforced by most browsers according to the MDN source. Since `Schedule` instances rely on the `setTimeout` `Function` property of the `DefaultView` `Object`, its utility for all browser contexts rests on the condition that the given interval may be greater than or equal to 10ms.
				@Link https://developer.mozilla.org/en-US/docs/DOM/window.setTimeout#Minimum_delay_and_timeout_nesting
				*/
				next: function next( )
				{

					// preconditions
					
						Meta.assert(! this.isStopped( ), "Runnable is stopped.") ;

					// variables

					var i ;

					//

						if((i = ++this.position) < this.callbacks.length)
						{

								this.callbacks[i]
								.execute( ) ;

								this.timer = Meta.DEFAULT_VIEW.setTimeout(this.callback, this.interval) ;
								
						}
						else
						{

								this.stop( )
								.triggerEvent(org.meta.core.Runnable.EVENT_COMPLETE) ;
								
								/*Make this Runnable defunct if it is not repeatable.*/
						
								if(! this.hasAttribute(org.meta.core.Runnable.ATTRIBUTE_REPEATABLE))
								{

										this.callbacks = null ;
										this.setState(org.meta.core.Runnable.STATE_DEFUNCT) ;
										
								}

						}

					// return
					
					return this ;

				},
				/**
				*Start this `Thread` instance, i.e. execute the first task in the task list after the specified interval has passed.
				*@return this
				*/
				start: function start( )
				{

					// preconditions
					
					Meta.assert(this.isIdle( ), "Invalid state (state=%1;).", this.state) ;

					//

						this.position = -1 ;

						this.setState(org.meta.core.Runnable.STATE_BUSY)
						
						this.timer = Meta.DEFAULT_VIEW.setTimeout(this.callback, this.interval) ;
						
					// return
					
					return this ;

				},
				stop: function stop( )
				{
				

					// preconditions
					
					Meta.assert(this.isBusy( ), "Invalid state (state=%1;).", this.state) ;

					//

						Meta.DEFAULT_VIEW.clearTimeout(this.timer) ;

						this.setState(org.meta.core.Runnable.STATE_STOPPED) ;
						
					// return

					return this ;

				}
		}
}  )
.define(  {
		/**An Object wrapper for the RegExp core object.*/
		name: "Matcher",
		package: "org.meta.core",
		prototype: "org.meta.core.Object",
		main: function(pattern)
		{

			// preconditions
			
				Meta.assert(Meta.isString(pattern), "Invalid type for parameter pattern.") ;
			
			//
			
				this.expression = new RegExp(pattern,"g") ;
				this.range = [0,0] ;

		},
		local: {
				expression: null,
				match: null,
				string: null,
				pattern: function pattern( ) { return this.expression.source ; },
				reset: function reset(string)
				{

						this.string = string ;
						this.index = 0 ;
						
					// return
					
					return this ;
				
				},
				from: function from(index)
				{
				
					//

						this.index = index ;
						
					// return
						
					return this ;
						
				},
				find: function find( )
				{

					// variables
					
					var o ;
					
					//
					
						this.expression.lastIndex = this.index ;

						if(  !!  ( o = this.expression.exec(this.string) )  &&  o.length !== 0  ) {

								this.match = o ;
								this.index = this.last( ) ;

								return true ;

						}

					// return
					
					return false ;

				},
				lookingAt: function lookingAt( )
				{

					// variables
					
					var o, i ;

					//

						i = this.expression.lastIndex = this.index ;

						/*@Note(The `Object` returned by `RegExp` is an augmented `Array` which contains the `input` and `index` properties; we are using the `index` property---i.e. the first index of the match---to evaluate whether the match begins at the specified start index for this matching operation. This nets a `lookingAt` operation without using an expression with a start-of-line ('^') token.*/

						if(  !!  ( o = this.expression.exec(this.string) )  &&  o.length !== 0  ) {

								if(o.index === i) {

										this.match = o ;
										this.index = this.last( ) ;

										return true ;
										
								}

						}
						
					// return
					
					return false ;
				
				},
				matches: function matches( )
				{
				
						this.expression.lastIndex = 0 ;
						
					return this.expression.test(this.string) ;
						
				},
				first: function first( ) { return !! this.match ? this.match.index : 0 ; },
				last: function last( ) { return this.expression.lastIndex ; },
				group: function group(index) { return !! this.match ? this.match[index] || null : null ; },
				/**Return the start index of the group for the given index.*/
				start: function start(index)
				{

					// variables
					
					var i1 = i2 = -1, s;
					
					//

						if(!! this.match && index <= this.match.length) {
						
								i1 = this.first( ) ;
								
								for( ; ++i2 < index ; ) { i1 += !! ( s = this.match[i2] ) ? s.length : 0 ; }
						
						}
						
					// return
					
					return i1 ;
				
				},
				end: function end(index)
				{
				
					// variables
					
					var i = -1, s ;
					
					//
					
						if(  ( i = this.start(index) )  !==  -1  ) { i += !! ( s = this.match[index] ) ? s.length  : 0 ; }
					
					// return
					
					return i ;
				
				}
		}
}  ) ;

})( ) ;