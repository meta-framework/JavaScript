/*
@identifier org.meta.web.dom.Component
@type abstract
@extend org.meta.standard.Object
@require org.meta.web.dom.DOM, org.meta.web.dom.Component
@description An object wrapper for a (partial) DOM element tree.
*/
{
		main: function main(root)
		{
				this.root = root ;
				this.children = [ ] ;
		},
		global: {
				create: function create(root)
				{
				
					// preconditions
					
						assert(isNode(root), 'Illegal Argument: invalid type for formal parameter `root`.') ;
						assert(DOM.isElement(root), 'Illegal Argument: invalid node type for formal parameter `root`.') ;
						
					// return
					
						return new this(root) ;

				}
		},
		local:
		{
				/** @type Node*/
				root: null,
				/**@type Component*/
				parent: null,
				/**
				* @type Component[]
				*/
				children: null,
				destroy: function destroy( )
				{
				
						this.children.forEach(function(component) { component.destroy( ) ; }) ;
						this.root.destroy( ) ;

						if(this.super.destroy) this.super.destroy.call(this) ;

				},
				isDetached: function isDetached( ) { return this.parent === null && ! this.root.parentNode ; },
				isAttached: function isAttached( )
				{
						return this.parent !== null && this.parent.hasChild(this) && DOM.contains(this.parent.root, this.root) ;
				},
				
				hasChild: function hasChild(component)
				{
						return this.children.indexOf(component) !== -1 ;
				},
				
				migrate: function migrate(document, deep)
				{

					// variables
					
					var e ;
					
					//
					
						if((e = document.adoptNode(this.root, deep))) this.root = e ;
						else error('Unable to migrate to target document.') ;
				
				},
				
				/**
				* Attach this component to the given parent component.
				*
				* This function delegates the execution of the required DOM manipulation to the parent component in order to accountt for complex DOM structures with differing insertion logics. The `.parent` property is set to the given component.
				*/
				attach: function attach(parent)
				{

					// preconditions
				
						if(! (parent instanceof Component)) error('Illegal type for argument `parent`') ;
						if(this.parent !== null) error('Illegal state: component is attached.') ;
						
					//

						parent.append(this) ;
						this.parent = parent ;
						
				},
				/**
				* Remove this component from its parent component.
				*
				* This function delegates the execution of the required DOM manipulation to the parent component in order to account for complex DOM structures with differing insertion logics. The `.parent` property is set to null.
				*/
				detach: function detach( )
				{
				
					// preconditions
					
						assert(this.parent !== null, 'Illegal state: node is detached.')
					
					//
				
						this.parent.remove(this) ;
						this.parent = null ;

				},
				/**
				* Append another DOM component.
				*
				* This function has the responsibility to implement the DOM manipulation logic required for appending the root elements of other components to this component. It must be overriden in case `.root` is _not_ the element to append child component's root elements to.
				* This operation will detect and automatically adopt the root element of the component in case that the owning documents differ.
				*
				* @param (Component) component Another component.
				*/
				append: function append(component)
				{

					// preconditions

						assert(isInstanceOf(Component, component), 'Illegal Argument: invalid type for formal parameter `component`.') ;
						assert(component !== this, 'Illegal Argument: cannot append component to itself') ;
						
					// variables
					
					var d ;
					
					//
					
						d = DOM.ownerOf(this.root) ;

						/*Adopt the node tree (if necessary)*/
						
						if(! DOM.isSame(d, DOM.ownerOf(component.root)))
						{

								if(component.isAttached( )) component.detach( ) ;
								
								component.migrate(d, true) ;

						}
						
						
						/*Add the component's root element to the root element of this component.*/
						
						DOM.append(component.root, this.root) ;
						
						this.addChild(component) ;
						
					// postcondition
					
						assert(DOM.isDescendant(this.root, component.root), 'Illegal state: root element of component is not a descendant of this component\'s root element.') ;

				},
				/**
				* Remove a child component from this component.
				*
				* This function has the responsibility to implement the DOM manipulation logic required for removing the root element of other component from to this component. It must be overriden in case `.root` is _not_ the element to append child component's root elements to.
				*/
				remove: function remove(component)
				{
				
					// preconditions
					
						assert(isInstanceOf(Component, component), 'Invalid type for argument `component`.') ;
						assert(component !== this, 'Illegal Argument: cannot remove component from itself') ;
						
					// variables
					
					var i ;
					
					//							
						
						/*Remove the component's root element from the root element of this component.*/

						DOM.remove(component.root, this.root) ;
						
						this.removeChild(component) ;
				
				},						
				addChild: function addChild(component)
				{
				
					// preconditions
					
						assert(this.children.indexOf(component) === -1, 'Illegal State: duplicate child component.') ;

					//
					
						this.children[this.children.length] = component ;

				},
				
				removeChild: function removeChild(component)
				{
				
					//
				
						if((i = this.children.indexOf(component))) this.children.splice(i, 1) ;
						else error('Illegal State: component to be removed is not contained within its parents child collection.') ;
				
				},
				/**
				* Set an attribute of this component's root element.
				*/
				setAttribute: function setAttribute(name, value, namespace) { DOM.setAttribute(name, value, this.root, namespace) ; },
				/**
				* Get the value of an attribute of this component's root element.
				*/
				getAttribute: function getAttribute(name, namespace) { return DOM.getAttribute(name, this.root, namespace) ; },
				hasAttribute: function hasAttribute(name, namespace) { return DOM.hasAttribute(name, this.root, namespace) ; }
		}

}