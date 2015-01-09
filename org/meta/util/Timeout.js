/*
@identifier org.meta.util.Timeout
@extend org.meta.Object
@description An object wrapper for the `window.setTimeout`, `window.clearTimeout` operations.
@todo needs rework
@deprecated
*/
{
		main: function main(callback, duration)
		{
				this.callback = callback ;
				this.duration = duration ;
		},
		global:
		{
				create: function create(callback, duration) { return new this(callback, duration) ; }
		},
		local:
		{
				/**
				* The timeout id of the currently active timeout.
				*/
				id: null,
				duration: null,
				callback: null,
				start: function start( )
				{

					//
					
						/*Perform the start logic for a runnable.*/
						this.super.invoke('start', this) ;

						this.id = GLOBAL_OBJECT.setTimeout(this.callback, this.duration) ;
						
				},
				stop: function stop( )
				{
					
					//

						/*Perform the stop logic for a runnable.*/					
						this.super.invoke('stop', this) ;
						
						GLOBAL_OBJECT.clearTimeout(this.id) ;
						
						this.id = null ;
		
				}
		}
}