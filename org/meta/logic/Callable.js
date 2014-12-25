/*
@identifier org.meta.logic.Callable
@type abstract
@extend org.meta.logic.Setable
@description Abstract type specifying the attributes and operations of a callable object.
*/
{
		global:
		{
				EXCECUTE_ONCE: 1,/*
				STATE_NONE: 0,
				STATE_ACTIVE: 1,
				STATE_INACTIVE: 2,*/
				create: function create(callback)
				{
				
					// return
					
						return new this(callback) ;
/*
					// variables
					
					var callable ;
					
					//
					
						callable = new this(callback) ;
						callable.activate( ) ;
						
					// return
					
					return callable ;
*/
				}
		},
		local:
		{
				/**@type Function*/
				callback: null,
/*
				isInactive: function isInactive( ) { return this.getState( ) === Callable.STATE_INACTIVE ; },
				isActive: function isActive( ) { return this.getState( ) === Callable.STATE_ACTIVE ; },
				activate: function activate( )
				{
				
					// preconditions
					
						assert(this.isInactive( ) || this.getState( ) === Callable.STATE_NONE, 'Illegal State: operation `activate` requires inactive object.') ;
						
					//
					
						this.setState(Callable.STATE_ACTIVE) ;

				},
				deactivate: function deactivate( )
				{
				
					// preconditions
					
						assert(this.isActive( ), 'Illegal State: operation `deactivate` requires active object.') ;
						
					//
					
						this.setState(Callable.STATE_INACTIVE) ;
						
				},
*/
				call: function call( )
				{
				
					// preconditions
					
//						assert(this.isActive( ), 'Illegal State: operation `call` requires active object.') ;
						
					//
					
						this.callback.apply(this, arguments) ;
						
				}
		}
}