/*
@identifier org.meta.standard.Runnable
@type abstract
@extend org.meta.standard.Settable
@description Abstract type specifying the attributes and operations for a runnable object.
*/
{
		global:
		{
				STATE_NONE: 0,
				STATE_IDLE: 1,
				STATE_BUSY: 1 << 1,
				STATE_ASLEEP: 1 << 2
		},
		local:
		{
				destroy: function( )
				{
				
						this.stop( ) ;
						
						if(this.super.destroy) this.super.destroy.call(this) ;
						
				},
				isIdle: function isIdle( ) { return this.getState( ) === Runnable.STATE_IDLE ; },
				isBusy: function isBusy( ) { return this.getState( ) === Runnable.STATE_BUSY ; },
				isAsleep: function isAsleep( ) { return this.getState( ) === Runnable.STATE_ASLEEP ; },
				start: function( )
				{
					
					// preconditions
					
						assert(this.isIdle( ) || this.getState( ) === Runnable.STATE_NONE, 'Illegal State: operation `start` requires an idle object.') ;
						
					//
					
						this.setState(Runnable.STATE_BUSY) ;
						
				},
				stop: function( )
				{
				
					// preconditions
					
						assert(this.isBusy( ), 'Illegal State: operation `stop` requires a busy object.') ;
						
					//
					
						this.setState(Runnable.STATE_IDLE) ;

				},
				sleep: function sleep(duration)
				{
				
					// preconditions
					
						assert(this.isBusy( ), 'Illegal State: operation `sleep` requires a busy object.') ;
						
					//

						this.setState(EventListener.STATE_ASLEEP) ;
						
						if(duration)
						{
						
							var l = this,
								t ;
						
								t = Timeout.create(function( ) { l.wake( ) ; t.destroy( ) ; }, duration) ;
								t.start( ) ;
								
						}
						
				},
				wake: function wake( )
				{
				
					// preconditions
					
						assert(this.isAsleep( ), 'Illegal State: operation `wake` requires a sleeping object.') ;
						
					//
					
						this.setState(EventListener.STATE_IDLE) ;
						
				}
		}
}