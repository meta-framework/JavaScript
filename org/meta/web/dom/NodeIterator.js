/*
@identifier org.meta.web.dom.NodeIterator
@extend org.meta.logic.Iterator
@require org.meta.web.dom.NodeList
*/
{
		main: function main(list, order, mask)
		{

				this.iterable = list ;
			
				/*Set initial values for index and current element.*/
				this.index = 0 ;
				this.current = ringAdd(null, {value: list.get(0)}) ;
			
				this.order = order ;
				this.mask = mask ;

		},
		global:
		{
				/**
				* Bit flag for default traversal order.
				*
				* The nodes in the underlying NodeList instance are iterated sequentially. Descendants are not being visited.
				*
				* @type Integer
				*/
				ORDER_DEFAULT: 1,
				/**
				* Bit flag for depth first traversal order.
				*
				* The nodes in the underlying NodeList instance and their descendants are traversed. Descendants are visited before siblings---if they exist.
				*
				* @type Integer
				*/
				ORDER_DEPTH_FIRST: 1 << 1,
				/**
				* Bit flag for breadth first traversal order.
				*
				* The nodes in the underlying NodeList instance and their descendants are traversed. Siblings are visited before descendants---if they exist.
				*
				* @type Integer
				*/
				ORDER_BREADTH_FIRST: 1 << 2,
				/***
				* @param (org.meta.web.dom.NodeList) nodes A node list.
				* @param (Integer) order The traversal order
				* @param (Integer) mask Bitmask specifying the node types to visit.
				*/
				create: function create(list, order, mask)
				{

					// preconditions

						assert(isInstanceOf(NodeList, list), 'Illegal Argument: Invalid type for formal parameter "nodes"') ;

					// return
					
					return new this(list, order || NodeList.ORDER_DEFAULT, mask || 1 << Node.ELEMENT_NODE) ;
					
				}
		},
		local:
		{
				next: function next( )
				{
					
					// variables
					
					var node,
						current, next,
						children,
						i1 = -1, i2 ;
					
					//
					
						current = next = this.current ;
						node = current.value ; // may be null but will then fail horribly leik OMG
					
						/*Set the next element to visit.*/
						switch(this.order)
						{

								case NodeIterator.ORDER_BREADTH_FIRST:
								
										if((children = node.childNodes) && (i2 = children.length) > 0)
												for( ; ++i1 < i2 ; ) ringAdd(current, {value: children[i1]}) ; // append child nodes
								
										next = current.next ; // set the reference to the next element; may be `current` if this is the last node in the tree

								break ;
								case NodeIterator.ORDER_DEPTH_FIRST:
								
										if((children = node.childNodes) && (i2 = children.length) > 0)
												while(--i2 >= 0)  // prepend child nodes
												{
												
														ringAdd(next, {value: children[i2]}) ;
														next = next.previous ; // cycle the reference to the next element

												}

								break ;
								
						}
					
						if(next === current) // only one element left: always true in default traversal and for the last element in a tree traversal
						{
						
								if((i1 = this.index + 1) < this.iterable.length( )) // there is another element in the node list
								{

										ringAdd(current, {value: this.iterable.get(i1)}) ;
									
										next = current.next ; // the element added right before
									
										this.index = i1 ;

								}
								else next = null ; // now `#hasNext( )` will return false
						
						}
				
						this.current = next ; // set the next element to visit
					
						ringPop(current) ; // remove the current element


					// return
					
						return node ;

				},
				each: function each(callback, context)
				{
				
					// variables
					
					var a = [,,this],
						context = context || this ;
					
					//
					
						while(this.hasNext( ))
						{
						
								a[0] = this.next( ) ;
								a[1] = this.index ;
							
								if(callback.apply(context, a) === false) return ; // break early on a `false` return value

						}

				}
		}
}
