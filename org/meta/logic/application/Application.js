/*
@identifier org.meta.logic.application.Application
@extend org.meta.logic.event.EventTarget
@type abstract
@description Abstract type specifying basic operations and attributes of an application.
*/
{
		global: {
				/**
				* Create the application.
				*
				* A template method which calls the global implementation specific function `createApplication`.
				*/
				create: function create( )
				{
						return this.createApplication( ) ;
				}
		},
		local:
		{
				/**
				* The currently active Module.
				* @type org.meta.logic.application.Module
				*/
				active: null,
				/**
				* Transition to the module for the given url.
				*
				* Abstract operation.
				*/
				transition: function transition(url) { }
		}
}