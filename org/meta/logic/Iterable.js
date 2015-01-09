/*
@identifier org.meta.logic.Iterable
@type abstract
@extend org.meta.Object
@description Abstract object containing standard implementations of an iterable element.
*/
{
		local:
		{
				length: function length( ) { }, // abstract
				get: function get(index) { }, // abstract
				iterator: function iterator( ) { }
		}
}