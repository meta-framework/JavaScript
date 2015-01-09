/*
@identifier org.meta.logic.event.Runnable
@type abstract
@extend org.meta.logic.event.EventTarget
@description An abstract object implementation a simple state machine model.
*/
{
		main: function main(argv)
		{
				this.listeners = { } ;
				this.state = Runnable.STATE_STOPPED ; // initialize with a stopped state
		},
		global:
		{
				STATE_STOPPED: 0,
				STATE_ACTIVE: 1,
				STATE_PAUSED: 2,
				STATE_DONE: 3,
				EVENT_STATE_CHANGE: 'state-change'
		},
		local:
		{
				state: null,
				destroy: function( )
				{
				
					//
					
						if(! this.isDone( )) { this.stop( ) ; this.finish( ) ; }
					
						org.meta.logic.event.Runnable.super.invoke('destroy', this) ;
						
				},
				setState: function setState(state)
				{
				
					// variables
					
					var old = this.state ;
					
					//
					
						this.state = state ;
						this.triggerEvent(Runnable.EVENT_STATE_CHANGE, {old_state: old, new_state: state}) ;

				},
				getState: function getState( ) { return this.state ; },
				isStopped: function isStopped( ) { return this.getState( ) === Runnable.STATE_STOPPED ; },
				isActive: function isActive( ) { return this.getState( ) === Runnable.STATE_ACTIVE ; },
				isPaused: function isPaused( ) { return this.getState( ) === Runnable.STATE_PAUSED ; },
				isDone: function isDone( ) { return this.getState( ) === Runnable.STATE_DONE ; },
				start: function start( )
				{
					
					// preconditions
					
						assert(this.isActive( ) || this.isPaused( ) || this.isStopped( ), 'Illegal State: Object must be active, stopped or paused.') ;
						
					//
					
						this.setState(Runnable.STATE_ACTIVE) ;
						
				},
				stop: function stop( )
				{
				
					// preconditions
					
						assert(this.isActive( ) || this.isPaused( ) || this.isStopped( ), 'Illegal State: Object must be active, stopped or paused.') ;
						
					//
					
						this.setState(Runnable.STATE_STOPPED) ;

				},
				/**
				* @contract This operation---as opposed to `Runnable.stop`---must put the `Runnable` instance into a state of busy waiting.
				* @param (Integer) duration A timeout length after which this runnable automatically returns to the active state.
				*/
				pause: function pause(duration)
				{
				
					// preconditions
					
						assert(this.isPaused( ) || this.isStopped( ), 'Illegal State: Object must be stopped') ;
					
					// variables
					
					var runnable = this,
						job,
						then ;
					
					//
					
						/*Pause this runnable.*/
						this.setState(Runnable.STATE_PAUSED) ;
					
						/*If either the timeout duration has been exhausted or the runnable was externally unpaused, let the enqueued job finish and set this runnable's state to active (if paused).*/
						then = Date.now( ) ;
						enqueue(
								function( ) { if(runnable.isPaused( )) runnable.start( ) ; },
								{activate: function( ) { return Date.now( ) - then >= duration) && runnable.isPaused( ) ? 0 : -1 ; }} // loop the activated state while the duration has not passed and the runnable instance is still paused
						) ;

				},
				finish: function finish( )
				{
				
					// preconditions
					
						assert(this.isStopped( ) || this.isDone( ), 'Illegel State: Object must be stopped or done.') ;
					
					//
					
						this.setState(Runnable.STATE_DONE) ;

				},
				onStateChange: function onStateChange(listener)
				{
						Runnable.super.invoke('addListener', Runnable.EVENT_STATE_CHANGE, listener) ;
				}
		}
}