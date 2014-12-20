/*
@identifier org.meta.web.dom.Component
@abstract
@extend org.meta.web.dom.event.EventTarget
@require org.meta.web.dom.DOM
@description An object wrapper for a (partial) DOM element tree.
*/
{
		main: function main(root)
		{
				this.root = root ;
				this.children = [ ] ;
		},
		global: {
				create: function create( )
				{
						error('Unsupported Operation: Abstract type.') ;
				}
		},
		local:
		{
				/** @type Node*/
				root: null,
				/**@type <? extend Component>*/
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
				/**
				* Add another component as a child component.
				*/
				add: function add(component)
				{
				
					// preconditions
					
						assert(component instanceof Component, 'Invalid Argument: Type for formal parameter "component" must be `org.meta.web.dom.html.Component`.') ;
					
					//
					
						assert(this.children.indexOf(component) === -1, 'Illegal State: Child component has already been added to this component (child-component: %s)', component.id) ;
					
						this.children[this.children.length] = component ;
						DOM.append(component.root, this.root) ;

				},
				/**
				* Remove the given component from this component.
				*/
				remove: function remove(component)
				{
				
					// preconditions
					
						assert(component instanceof Component, 'Invalid Argument: Type for formal parameter "component" must be `org.meta.web.dom.html.Component`.') ;
					
					// variables
					
					var child ;
					
					//
					
						i = this.children.indexOf(component) ;
					
						assert(i !== -1, 'Illegal State: Child component was not added to this component (child-component: %s)', component.id) ;
					
						child = arrayRemove(this.children, i) ;
						DOM.remove(component.root, this.root) ;
					
//						child.detach( ) ;
					
				},
				attach: function attach(parent)
				{
				
					//
					
						this.parent = parent ;
						parent.add(this) ;
				
				},
				detach: function detach( )
				{
				
					//
					
						if(this.parent)
						{
						
								this.parent.remove(this) ;
								this.parent = null ;
							
						}
				
				},
				/**
				* Set an attribute of this component's root element.
				*/
				setAttribute: function setAttribute(name, value, namespace) { DOM.setAttribute(this.root, name, value, namespace) ; },
				/**
				* Get the value of an attribute of this component's root element.
				*/
				getAttribute: function getAttribute(name, namespace) { return DOM.getAttribute(this.root, name) ; },
				removeAttribute: function removeAttribute(nam) { return DOM.removeAttribute(this.root, name) ; },
				hasAttribute: function hasAttribute(name, namespace) { return DOM.hasAttribute(this.root, name, namespace) ; }
		}

}