/*
@abstract
@identifier org.meta.data.collections.Queue
@description The public interface of a Queue type.
*/
{
		local:
		{
				/**
				* Return the value of the first element on the stack without removing it.
				* @abstract
				* @return (<?>) The value of the first element on the stack or null
				*/
				first: function first( ) { },
				/**
				* Add the given value to the end of the queue.
				* @abstract
				* @param (<?>) value The value to add to the end of the queue
				* @return (Void).
				*/
				enqueue: function enqueue(value) { },
				/**
				* Remove the last element from the queue and return its value (if not empty).
				* @abstract
				* @return (<?>) The value of the last element or null (if empty).
				*/
				dequeue: function dequeue( ) { }
		}
}