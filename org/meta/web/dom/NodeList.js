/*
@identifier org.meta.web.dom.NodeList
@extend org.meta.logic.Iterable
@require org.meta.web.dom.NodeIterator
*/
{
		main: function main(nodes) { this.nodes = nodes ; },
		global:
		{
				create: function create(nodes)
				{

					// preconditions

						assert(isInstanceOf(GLOBAL_OBJECT.NodeList, nodes) || isInstanceOf(GLOBAL_OBJECT.HTMLCollection, nodes), 'Illegal Argument: object for formal parameter `nodes` has invalid type.') ;
						
					// return
					
					return new this(nodes) ;
				
				}
		},
		local:
		{
				get: function get(index) { return this.nodes.item(index) ; },
				length: function length( ) { return this.nodes.length ; },
				iterator: function iterator( ) { return NodeIterator.create(this) ; }
		}
}