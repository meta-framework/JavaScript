Pulse.declare("pulse.web.social")
.define(  {
		name: "Soundcloud",
		package: "pulse.web.social",
		prototype: "pulse.logic.Eventable",
		type: Pulse.STRING_OBJECT_TYPE_SINGLETON,
		global: {
				SC_SDK_URL: "http://connect.soundcloud.com/sdk.js",
				SC_SWF_PLAYER_URL: "http://player.soundcloud.com/player.swf",
				SC_JS_PLAYER_URL: "/js/library/soundcloud/player/player.js",
//				SC_O_EMBED_URL: "http://soundcloud.com/oembed",
				SC_STATE_NOT_READY: 0,
				SC_STATE_READY: 1
		},
		public: {
				ready: function ready(handler)
				{

					// set this

						this.addHandler("ready",handler) ;

						if(this.properties.state === pulse.web.social.Soundcloud.SC_STATE_READY) { this.callHandler("ready") ; }
						
					// return this
					
					return this ;

				},
				onReady: function onReady( ) { return this.callHandler("ready") ; },
				playerReady: function playerReady(handler) { return this.addHandler("playerReady",handler) ; },
				onPlayerReady: function onReady(event) { return this.callHandler("playerReady",event) ; },
				/**
				* @link http://developers.soundcloud.com/docs/widget
				* @link http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/external/ExternalInterface.html
				*/
				newPlayerWidget: function newPlayer(parameter)
				{
				
					// set variables
					
					var s ;
					var f ;
					var n ;
					
					// set ?
					
						/*@toDo("Fork between HTML5 (iFrame) and Flash players according to ``flash'' parameter.")*/

						/*@note("Test the id parameter for invalid characters.") */
						
						if( !! (s = parameter.id) && s.search(/[.\-+*/]/) !== -1 ) {
								Pulse.error("Player id contains invalid character(s) (`.-+*/`).") ;
						}
						else if( !!! s) { Pulse.error("Missing required parameter.\n\t> name: ``id''") ; }

						/*@note("Create a dummy `Node` for swfobject to replace with an ``OBJECT'' `Node`.") */

						pulse.dom.Document.select( pulse.dom.DOM.createElement("p") )
						.attribute("id",parameter.id)
						.appendTo(parameter.container) ;

						swfobject.embedSWF(
								pulse.web.social.Soundcloud.SC_SWF_PLAYER_URL,
								parameter.id,
								"100%",
								"100%",
								"10",
								false,
								{enable_api: true, object_id: parameter.id, url: parameter.url},
								{allowfullscreen: "true", allowscriptaccess: "always"},
								{id:parameter.id},
								function(event) { Pulse.log("\t> success: %1",event.success) ; }
						) ;

					// return this
					
					return this ;
				
				}
		},
		local: {
				/**
				* @link http://developers.soundcloud.com/docs/widget#widget-events
				*/
				main: function main(node,parameter)
				{

					// set variables
					
					var t ;
					
					// set ?
					
						this.properties = {state: pulse.web.social.Soundcloud.SC_STATE_NOT_READY} ;
						this.handlers = { } ;

						this.importScripts( ) ;
						
						//..
/**/
						this.ready(  {
								target: this,
								action: function( ) {
								
										soundcloud.addEventListener(
												"onPlayerReady",
												function(player,data) {
														pulse.web.social.Soundcloud.onPlayerReady(  {
																player: player,
																data: data
														}  ) ;
												}
										) ;

								},
								singleton: true
						}  ) ;
/**/
						
					// return this
					
					return this ;	
				
				},
				importScripts: function importScripts( )
				{
				
					// set variables
					
					var t ;
					
					// set ?

						t = pulse.logic.Thread( )
						.complete(  {
								target: this,
								action: function( ) {
										this.properties.state = pulse.web.social.Soundcloud.SC_STATE_READY ;
										this.onReady( ) ;
								}
						}  ) ;
						
						if(!!! Pulse.DEFAULT_VIEW.SC) {
						
								t.add(  {
										target: pulse.data.Data,
										action: "requestJS",
										parameter: [
												pulse.web.social.Soundcloud.SC_SDK_URL,
												function(thread) { thread.next( ) ; },
												t
										],
										async: true
								}  ) ;
								
						}
						if(!!! Pulse.DEFAULT_VIEW.soundcloud) {
						
						
								t.add(  {
										target: pulse.data.Data,
										action: "requestJS",
										parameter: [
												pulse.web.social.Soundcloud.SC_JS_PLAYER_URL,
												function(thread) { thread.next( ) ; },
												t
										],
										async: true
								}  ) ;
								
						}
						
						t.run( ) ;
						
					// return this
					
					return this ;

				}
		}
}  )
.define(  {
		/**
		* An Object wrapper for the Soundcloud JavaScript player.
		* @link http://developers.soundcloud.com/docs/widget
		*/
		name: "SoundcloudPlayer",
		package: "pulse.web.social",
		prototype: "pulse.media.Player",
		type: Pulse.STRING_OBJECT_TYPE_CONSTRUCTABLE,
		local: {
				main: function main(root,parameter)
				{
Pulse.log("--- SoundcloudPlayer#init")
.log("\t> id: %1",parameter.id) ;
					// set variables
					
					var t ;

					// set this

						this.root = root ;
						this.parameter = ( parameter || { } ) ;
						
						this.properties = {
								player: {
										methods: {
												"play": "api_play",
												"pause": "api_pause",
												"stop": "api_stop",
												"load": "api_load",
												"jump": "api_seekTo",
												"volume": "api_setVolume",
												"duration": "api_getTrackDuration",
												"time": "api_getTrackPosition"
										}
								}
						} ;
						this.handlers = { } ;
						
						this.components = { } ;
						
						this.setEventListeners( )
						.setPlayer(  {
								id: parameter.id,
								url: parameter.url,
								flash: (!! parameter.flash)
						}  ) ;
						
					// return this
					
					return this ;
				
				},
				setPlayer: function setPlayer(parameter)
				{
					
					// set ?

						pulse.web.social.Soundcloud.ready(  {
								target: "pulse.web.social.Soundcloud",
								action: "newPlayerWidget",
								parameter: {
										container: this.root,
										id: parameter.id,
										url: parameter.url,
										flash: parameter.flash
								},
								singleton: true
						}  ) ;
						
					// return this
					
					return this ;

				},
				/**
				* @link http://developers.soundcloud.com/docs/widget#widget-events
				*/
				setEventListeners: function setEventListeners( )
				{

					// set variables
					
					var o ;
					
					// set this
					
						/*@note("Bind the event listener registration to the Soundcloud ready event in order to wait for the set-up
						of the soundcloud `Object` on the default view.")*/
						
						pulse.web.social.Soundcloud.playerReady(  {
								target: this,
								action: function(event) {	this.properties.player.object = event.player ; },
								singleton: true
						}  ) ;

					// return this
					
					return this ;

				}
		}
}  ) ;