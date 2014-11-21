/*
@identifier org.meta.standard.Timeout
@extend org.meta.standard.Runnable
@description An object wrapper for the `window.setTimeout`, `window.clearTimeout` operations.
*/
{
		main: function main(duration, callback)
		{
				this.duration = duration ;
				this.callback = callback ;
		},
		global:
		{
				create: function create(duration, callback) { return new this(duration, callback) ; }
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
					
						this.super.start.call(this) ;

						this.id = constant('GLOBAL_OBJECT').setTimeout(callback, duration) ;
						
				},
				stop: function stop( )
				{
					
					//
					
						this.super.stop.call(this) ;
						
						constant('GLOBAL_OBJECT').clearTimeout(this.id) ;
						
						this.id = null ;
		
				}
		}
}