/*
@abstract
@identifier org.meta.data.collections.Stack
@description The public interface of a Stack type.
*/
{
		local:
		{
				/**
				* Return the value of the first element on the stack without removing it.
				* @abstract
				* @return (<?>) The value of the first element on the stack or null
				*/
				top: function top( ) { },
				/**
				* Push an element for the given value on to the stack.
				* @abstract
				* @param (<?>) value The value to push on to the stack
				* @return (Void)
				*/
				push: function pop(value) { },
				/**
				* @abstract
				* Returns the value of the element on top of the stack.
				* @return (<?>) The value of the first element on the stack or null (if empty).
				*/
				pop: function pop( ) { }
		}
}