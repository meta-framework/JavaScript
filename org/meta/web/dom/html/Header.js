/*
@identifier org.meta.web.dom.html.Header
@extend org.meta.web.dom.html.Container
@require org.meta.web.css.CSSStyleDeclaration, org.meta.web.dom.html.HTML, org.meta.web.dom.html.Component, org.meta.web.dom.html.Container, org.meta.web.dom.html.Text
*/
{
		global:
		{
				create: function create(document, layout)
				{
				
					// variables
					
					var header,
						element,
						text ;
					
					//
					
						header = Container.create.apply(this, [document, Container.LAYOUT_COVER | Container.LAYOUT_COVER_WIDTH]) ;

						element = HTML.createElement(document, 'h1') ;
						text = new Text(element, new CSSStyleDeclaration(element.style), 0) ;
						text.setAttribute('id', Component.createComponentID(text)) ;
						text.setAttribute('class', Component.createComponentClass(text)) ;
//						text.setAttribute('class', 'text') ;
						Container.invoke('add', header, text) ; // use Container#add since Header prevents addition using Header#add

					// return

						return header ;

				}
		},
		local:
		{
				add: function add( ) { error('Unsupported Operation') ; }, // prevent naive addition of child components
//				attach: function attach( ) { error('Unsupported Operation') ; }, // prevent naive attachment of DOM elements
				draw: function draw(sheet)
				{
				
					//
					
						this.style.addRules(
								Component.createComponentClassSelector(this),
								{
										'-moz-user-select': 'none', // non selectable text
										'cursor': 'default'/*,
										'display': 'inline',
										'position': 'relative'*/
								}
						) ;
					
						org.meta.web.dom.html.Header.super.invoke('draw', this, sheet) ;

				},
				setFontStyle: function setFontStyle(properties)
				{
						if(this.hasChildren( )) Text.invoke('setFontStyle', this.children[0], properties) ; // relegate the call to the text element
				},
				setTextStyle: function setTextStyle(properties)
				{
						if(this.hasChildren( )) Text.invoke('setTextStyle', this.children[0], properties) ; // relegate the call to the text element
				},
				/**
				* @depreacted using a component instance now
				*/
				_setText: function setText(text)
				{
					
					//
					
						HTML.setText(HTML.findFirst(this.target, '.text'), text) ;

				},
				setText: function setText(text)
				{
						if(this.hasChildren( )) Text.invoke('setText', this.children[0], text) ; // relegate the call to the text element
				},
				getText: function getText( )
				{
				
					//

						if(this.hasChildren( )) return Text.invoke('getText', this.children[0]) ; // relegate the call to the text element
					
					// return
					
						return null ;

				},
				setFormattedText: function setFormattedText(text)
				{
						if(this.hasChildren( )) Text.invoke('setFormattedText', this.children[0], text) ; // relegate the call to the text element
				},
				/**
				* @depreacted using a component instance now
				*/
				_getText: function getText( )
				{
				
					//
				
						HTML.getText(HTML.findFirst(this.target, '.text')) ;

				},
				/**
				* @depreacted using a component instance now
				*/
				_setFontStyle: function setFont(properties)
				{
						this.style.setRules(
								Component.createComponentIDSelector(this) + ' .text',
								{
										'font-size': properties.size || '1em',
										color: properties.color || 'black',
										family: properties.family || 'serif'/*,
										...
										*/
								}

						) ;
				},
				_setFontSize: function setFontSize( )
				{
						this.style.setRule('#' + this.getID( ) + ' .text', 'font-size', value) ;
				},
				_setFontFamily: function setFontFamily( )
				{
						this.style.setRule('#' + this.getID( ) + ' .text', 'font-family', value) ;
				},
				_setFontColor: function setFontColor( )
				{
						this.style.setRule('#' + this.getID( ) + ' .text', 'color', value) ;
				},
				/**
				* @depreacted using a component instance now
				*/
				_setFormattedText: function setFormattedText(text)
				{
/*@qnd*/
HTML.findFirst(this.target, '.text')
.innerHTML = text ;
				}
		}
}