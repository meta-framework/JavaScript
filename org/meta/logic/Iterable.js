/*
@identifier org.meta.logic.Iterable
@type abstract
@extend org.meta.Object
@description Abstract object containing standard implementations of an iterable element.
*/
{
		main: function main(elements)
		{
		
			//
			
				this.elements = elements ;

		},
		local:
		{
				get: function get(index) { return this.elements[index] ; },
				length: function length( ) { return this.elements.length ; },
				iterator: function iterator( ) { }
		}
}