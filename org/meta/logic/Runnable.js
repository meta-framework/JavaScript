/*
@identifier org.meta.logic.Runnable
@type abstract
@extend org.meta.logic.Setable
@description An abstract object implementation a simple state machine model.
*/
{
		global:
		{
				STATE_STOPPED: 0,
				STATE_ACTIVE: 1,
				STATE_PAUSED: 2,
				STATE_DONE: 3
		},
		local:
		{
				state: 0,
				destroy: function( )
				{
				
					//
				
						assert(this.isDone( ), 'Illegal State: Runnable must be done before it may be destroyed.') ;
					
						this.setState(Runnable.STATE_DONE) ;
					
						org.meta.logic.Runnable.super.invoke('destroy', this) ;
						
				},
				setState: function setState(state) { this.state = state ; },
				getState: function getState( ) { return this.state ; },
				isStopped: function isStopped( ) { return this.getState( ) === Runnable.STATE_STOPPED ; },
				isActive: function isActive( ) { return this.getState( ) === Runnable.STATE_ACTIVE ; },
				isPaused: function isPaused( ) { return this.getState( ) === Runnable.STATE_PAUSED ; },
				isDone: function isDone( ) { return this.getState( ) === Runnable.STATE_DONE ; },
				start: function start( )
				{
					
					// preconditions
					
						assert(this.isStopped( ) || this.isPaused( ), 'Illegal State: Object must be stopped or paused.') ;
						
					//
					
						this.setState(Runnable.STATE_ACTIVE) ;
						
				},
				stop: function stop( )
				{
				
					// preconditions
					
						assert(this.isActive( ) || this.isPaused( ), 'Illegal State: Object must be active or paused.') ;
						
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
					
						assert(this.isStopped( ), 'Illegal State: Object must be stopped') ;
					
					// variables
					
					var runnable = this,
						job,
						then ;
					
					//
					
						/*Pause this runnable.*/
						this.setState(RUnnable.STATE_PAUSED) ;
					
						/*If either the timeout duration has been exhausted or the runnable was externally unpaused, let the enqueued job finish and set this runnable's state to active (if paused).*/
						then = Date.now( ) ;
						enqueue(
								function( ) { if(runnable.isPaused( )) runnable.start( ) ; },
								{activate: function( ) { return (Date.now( ) - then >= duration) || ! runnable.isPaused( ) ; }}
						) ;
/*
						this.setState(Runnable.STATE_PAUSED) ;
					
						then = Date.now( ) ;
						job = jobCreate( ) ;
						/*Watch for one of two conditions: (1) the timeout has been depleted and the runnable is paused, (2) this runnable instance has been unpaused.*
						job.watch(function( ) {
								if((Date.now( ) - then >= duration) && runnable.isPaused( )) { runnable.start( ) ; return true ; }
								else if(runnable.getState( ) !== Runnable.STATE_PAUSED) return true ;
						}) ;
*/
				},
				finish: function finish( )
				{
				
					// preconditions
					
						assert(this.getState( ) === Runnable.STATE_STOPPED, 'Illegel State: Object must be stopped.') ;
					
					//
					
						this.setState(Runnable.STATE_DONE) ;

				}
		}
}