/*
@identifier org.meta.web.dom.Component
@abstract
@extend org.meta.web.dom.event.EventTarget
@require org.meta.web.dom.DOM
@description An object wrapper for a (partial) DOM element tree.
*/
{
		main: function main(root/*, style*/, layout)
		{
				this.root = root ;
//				this.style = style ;
				this.layout = layout ;
			
				this.children = [ ] ;

		},
		global: {
				/**
				* @abstract
				*/
				create: function create( ) { }
		},
		local:
		{
				/**@type Node*/
				root: null,
				/**@type CSSStyle*/
				style: null,
				/**
				* An integer bitmap storing the required layout bits
				*
				* @type Integer
				*/
				layout: null,
				/**@type <? extend Component>*/
				parent: null,
				/**
				* @type <? extend Component>[]
				*/
				children: null,
				/**
				* @todo the queue child component destruction has to be tested
				*/
				destroy: function destroy( )
				{
				
					// variables
					
					var parent_component,
						parent_node,
						tasks = [ ] ;
					
					//

						/*Remove this component's root node from the DOM tree.*/
						if((parent_component = this.parent)) parent_component.remove(this) ; // removal from the parent node's DOM tree is implicit in this operation.
						else if((parent_node = this.root.parent)) DOM.remove(this.root, parent_node) ;

						org.meta.web.dom.Component.super.invoke('destroy', this) ;

				},
				/**
				* Add another component as a child component.
				*/
				add: function add(child)
				{
				
					// preconditions
					
						assert(isInstanceOf(Component, child), 'Invalid Argument: Type for formal parameter "component" must be `org.meta.web.dom.html.Component`.') ;
					
					//
					
						assert(this.children.indexOf(child) === -1, 'Illegal State: Child component has already been added to this component (child-component: %s)', child.id) ;
					
						this.children[this.children.length] = child ;
						this.attach(child) ;
/*@qnd*/
child.parent = this ;

				},
				/**
				* Remove the given component from this component.
				*/
				remove: function remove(child)
				{
				
					// preconditions
					
						assert(isInstanceOf(Component, child), 'Invalid Argument: Type for formal parameter "child" must be instance of `org.meta.web.dom.Component`.') ;
					
					// variables
					
					var i ;
					
					//
					
						i = this.children.indexOf(child) ;
					
						assert(i !== -1, 'Illegal State: Child component was not added to this component (child-component: %s)', child.id) ;
					
						arrayRemove(this.children, i) ;
					
						this.detach(child) ;
// assert(! child.root.parentNode, 'Illegal State: Component root node was not removed from parent node.') ;
/*@qnd*/
child.parent = null ;
					
				},
				/**
				* @contract This operation is ought to contain the logic necessary to append a child component's DOM tree to the DOM tree for this component.
				*/
				attach: function attach(child)
				{
				
					//
					
						assert(! child.root.parentNode, 'Illegal State: Root node of child component may not be attached.') ;
				
					//
					
						DOM.append(child.root, this.root) ;
// assert(DOM.isSame(child.root.parentNode, this.root), 'invalid attachment') ;
				},
				/**
				* @contract This operation is ought to contain the logic necessary to remove a child component's DOM tree from the DOM tree for this component.
				*/
				detach: function detach(child)
				{
// console.log('org.meta.web.dom.Component#detach') ;
					// preconditions
// try {
						assert(child.root.parentNode && DOM.isSame(child.root.parentNode, this.root), 'Illegal State: Root node of child component is not attached to this component\'s root node.') ;
					
					//
					
						DOM.remove(child.root, this.root) ;
// }catch(e) { console.log('!') ; console.log('child-root:') ; console.log(child.root) ; console.log('child-root-parent:') ; console.log(child.root.parent) ; console.log('this-root:') ; console.log(this.root) ; }
				},
				/**
				* @abstract
				*/
				draw: function draw( ) { }, // abstract
				/**
				* @abstract
				*/
				redraw: function redraw( ) { }, // abstract
				/**
				* Set an attribute of this component's root element.
				*/
				setAttribute: function setAttribute(name, value, namespace) { DOM.setAttribute(this.root, name, value, namespace) ; },
				/**
				* Get the value of an attribute of this component's root element.
				*/
				getAttribute: function getAttribute(name, namespace) { return DOM.getAttribute(this.root, name) ; },
				removeAttribute: function removeAttribute(nam) { return DOM.removeAttribute(this.root, name) ; },
				hasAttribute: function hasAttribute(name, namespace) { return DOM.hasAttribute(this.root, name, namespace) ; },
				setText: function setText(text) { DOM.setText(this.root, text) ; }
		}

}