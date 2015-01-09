/*
@identifier org.meta.web.dom.Component
@abstract
@extend org.meta.web.dom.event.EventTarget
@require org.meta.web.dom.DOM, org.meta.web.dom.event.EventListener
@description An object wrapper for a (partial) DOM element tree.
*/
{
		main: function main(root, layout)
		{

				this.target = root ;
				this.layout = layout || 0 ;
			
//				this.children = [ ] ;

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
				* @type Stack<Job>
				*/
				jobs: null,
				/**
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
						else if((parent_node = this.target.parentNode)) DOM.remove(this.target, parent_node) ;

						org.meta.web.dom.Component.super.invoke('destroy', this) ;

				},
				/**
				* @param (String) type The event type to register the given listener for.
				* @param (EventListener) listener An event listener instance.
				*/
				addListener: function addListener(type, listener)
				{
					
					//
					
						assert(! listener.hasAttribute(EventListener.PROPAGATE_EVENT), 'Invalid Argument: Listener may not propagate event.') ;

					//

						Component.super.invoke('addListener', this, type, listener)
				
				},
				/**
				* Add another component as a child component.
				*/
				add: function add(child)
				{
				
					// preconditions
					
						assert(isInstanceOf(Component, child), 'Invalid Argument: Type for formal parameter "component" must be `org.meta.web.dom.html.Component`.') ;
					
					// variables
					
					var a ;
					
					//
					
						if(! (a = this.children)) a = this.children = [ ] ;
						else assert(this.children.indexOf(child) === -1, 'Illegal State: Child component has already been added to this component (child-component: %s)', child.id) ;
					
						a[a.length] = child ;
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
					
					var a = this.children,
						i ;
					
					//
					
						assert(a !== null, 'Null Pointer: Child component collection is null.') ;
					
						i = a.indexOf(child) ;
					
						assert(i !== -1, 'Illegal State: Given child component is not a child component of this component.') ;
					
						arrayRemove(a, i) ;
					
						this.detach(child) ;
					
						if(i === 0) this.children = null ;
/*@qnd*/
child.parent = null ;
					
				},
				/**
				* @contract This operation is ought to contain the logic necessary to append a child component's DOM tree to the DOM tree for this component.
				*/
				attach: function attach(child)
				{
				
					//
					
						assert(! child.target.parentNode, 'Illegal State: Root node of child component may not be attached.') ;
				
					//
					
						DOM.append(child.target, this.target) ;
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
						assert(child.target.parentNode && DOM.isSame(child.target.parentNode, this.target), 'Illegal State: Root node of child component is not attached to this component\'s root node.') ;
					
					//
					
						DOM.remove(child.target, this.target) ;
// }catch(e) { console.log('!') ; console.log('child-root:') ; console.log(child.root) ; console.log('child-root-parent:') ; console.log(child.root.parent) ; console.log('this-root:') ; console.log(this.root) ; }
				},
				/**
				* Set an attribute of this component's root element.
				*/
				setAttribute: function setAttribute(name, value, namespace) { DOM.setAttribute(this.target, name, value, namespace) ; },
				/**
				* Get the value of an attribute of this component's root element.
				*/
				getAttribute: function getAttribute(name, namespace) { return DOM.getAttribute(this.target, name) ; },
				removeAttribute: function removeAttribute(nam) { return DOM.removeAttribute(this.target, name) ; },
				hasAttribute: function hasAttribute(name, namespace) { return DOM.hasAttribute(this.target, name, namespace) ; },
				setText: function setText(text) { DOM.setText(this.target, text) ; },
				getText: function getText(text) { return DOM.getText(this.target, text) ; },
				hasText: function hasText(text)
				{
				
					// variables
					
						var text ;
					
					//
					
						text = DOM.getText(this.target) ;
					
					// return
					
						return text && text !== '' ;

				},
				/**
				* @todo implement
				*/
				setChild: function setChild(index)
				{
error('not implemented.') ;
				},
				getChild: function getChild(index)
				{
				
					// preconditions
					
						assert(this.hasChildren( ) && index >= 0 && index < this.children.length, 'Index Out Of Bounds: Argument for formal parameter "index" exceeds child collection bounds.') ;
					
					//
					
						return this.children[index] ;
					
				},
				hasChildren: function hasChildren( ) { return this.children && this.children.length > 0 ; },
				/**
				* @abstract
				*/
				draw: function draw( ) { },
				/**
				* @abstract
				*/
				redraw: function redraw( ) { },
				/**
				* @contract Enable this module.
				*/
				activate: function activate( ) { },
				/**
				* @contract Disable this module.
				*/
				deactivate: function deactivate( ) { }
		}

}