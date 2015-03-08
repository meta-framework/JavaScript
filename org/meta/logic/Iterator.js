/*
@abstract
@identifier org.meta.logic.Iterator
@extend org.meta.Object
@description Abstract object implementing the standard operations of an iterator pattern
*/
{
		local:
		{
				/**
				* @type <? extend Iterable>
				*/
				iterable: null,
				index: null,
				current: null,
				/**
				*/
				hasNext: function hasNext( ) { return !! this.current ; },
				/**
				* @abstract
				*/
				next: function next( ) { },
				/**
				* @abstract
				* @contract Iterate over the elements in the iterable object passing the iterator state and supplying the context. Iteration may be interrupted.
				* @implementation The callback is ought to be called with the given context or `null` passing---in this order---the current element, the current index and a reference to this iterator instance on the given context or no context. If the callback explicitely returns `false` the operation should return thus discontinuing iteration.
				*/
				each: function each(callback, context) { }
		}
}