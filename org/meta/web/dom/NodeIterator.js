/*
@identifier org.meta.web.dom.NodeIterator
@extend org.meta.standard.Iterator
@require org.meta.web.dom.NodeList
*/
{
		global:
		{
				create: function create(nodes)
				{

					// preconditions

						assert(isInstanceOf(NodeList, nodes), 'Illegal Argument: invalid type for formal parameter `nodes`') ;

					// return
					
					return new this(nodes) ;
					
				}
		}
}
