/*
@identifier org.meta.util.Interval
@extend org.meta.Object
@description An object wrapper for the `window.setInterval`, `window.clearInterval` operations.
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
				* The interval id of the currently active timeout.
				*/
				id: null,
				duration: null,
				callback: null,
				start: function start( )
				{

					//
					
						this.super.invoke('start', this) ;

						this.id = GLOBAL_OBJECT.setInterval(this.callback, this.duration) ;
						
				},
				stop: function stop( )
				{
					
					//
					
						this.super.invoke('stop', this) ;
						
						GLOBAL_OBJECT.clearInterval(this.id) ;
						
						this.id = null ;
		
				}
		}
}