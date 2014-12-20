/*
@identifier org.meta.web.dom.NodeIterator
@extend org.meta.logic.Iterator
@require org.meta.web.dom.NodeList
*/
{
		global:
		{
				/***
				* @param (org.meta.web.dom.NodeList) nodes A node list.
				*/
				create: function create(nodes)
				{

					// preconditions

						assert(isInstanceOf(NodeList, nodes), 'Illegal Argument: Invalid type for formal parameter `nodes`') ;

					// return
					
					return new this(nodes) ;
					
				}
		}
}
