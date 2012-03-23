/* 
	Turtle skin by Laszlo Molnar
	(C) 2011
*/

var DEBUG = true,
	UNDEF = 'undefined',
	OBJECT = 'object',
	NOLINK = 'javascript:void(0)',
	SHOCKWAVE_FLASH = 'Shockwave Flash',
	SHOCKWAVE_FLASH_AX = 'ShockwaveFlash.ShockwaveFlash',
	FLASH_MIME_TYPE = 'application/x-shockwave-flash';

String.prototype.trim = function() { 
	return this.replace(/^\s+|\s+$/g,''); 
};

String.prototype.startsWith = function( s ) {
	return this.indexOf( s ) === 0;
};

String.prototype.endsWith = function( s ) {
	return this.substring(this.length - s.length) === s;
};

String.prototype.getExt = function() {
	var i = this.lastIndexOf('.');
	return (i <= 0 || i >= this.length - 1)? "" : this.substring(i + 1).toLowerCase();
}

var htmlregex = [
	[ /<br>/gi, '\n' ],
	[ /\&amp;/gi, '&' ],
	[ /\&lt;/gi, '<' ],
	[ /\&gt;/gi, '>' ],
	[ /\&(m|n)dash;/gi , '-' ],
	[ /\&apos;/gi, '\'' ],
	[ /\&quot;/gi, '"' ]
];

String.prototype.cleanupHTML = function() {
	var s = this;
	for ( var i = htmlregex.length - 1; i >= 0; i--) {
		s = s.replace( htmlregex[i][0], htmlregex[i][1] );
	}
	return s; 
};

String.prototype.stripHTML = function() { 
	return this.replace(/<\/?[^>]+>/gi, ''); 
};

String.prototype.stripQuote = function() {
	return this.replace(/\"/gi, '&quot;');
};

String.prototype.appendSep = function(s, sep) { 
	return (this.length? (this + (sep || ' &middot; ')) : '') + s; 
};

String.prototype.rgb2hex = function() {
	if (this.charAt(0) === '#') {
		return this;
	}
	var n, r = this.match(/\d+/g), h = '';
	for ( var i = 0; i < r.length && i < 3; i++ ) {
		n = parseInt( r[i] ).toString(16);
		h += ((n.length < 2)? '0' : '') + n;
	}
	return '#' + h;
};

String.prototype.template = function( t ) {
	if ( !t ) {
		return this;
	}
	var s = this;
	for ( var i = 0; i < t.length; i++ ) {
		s = s.replace( new RegExp('\\{' + i + '\\}', 'gi'), t[i] );
	}
	return s;
};

Math.minMax = function(a, b, c) {
	return ($.isNumeric(b))? ((b < a)? a : ((b > c)? c : b)) : a; 
};

var _logel, _logover = false, _lastlog, _lastcnt = 1;
log = function(c) {
	if ( !DEBUG || _logover ) return;
	if ( !_logel ) {
		_logel = $('<div id="log" style="position:fixed;left:0;top:0;width:200px;bottom:0;overflow:auto;padding:10px;background-color:rgba(0,0,0,0.5);color:#fff;font-size:15px;z-index:99999"></div>').hover(function(){
			_logover = true;
		},function(){
			_logover = false;
		}).appendTo('body');
	}
	if (c === _lastlog) {
		_logel.children(':first').empty().html(_lastlog + ' (' + (++_lastcnt) + ')');
	} else {
		$('<div style="height:2em;overflow:hidden;">' + c + '</div>').prependTo(_logel);
		_lastlog = c;
		_lastcnt = 1;
	}
};

// checkFlash: Flash plugin detection from SWFObject.js
checkFlash = function( rv ) {
	var n = navigator, v = [ 1, 0, 0 ], d;
	rv = rv? rv.split('.') : [ 0, 0, 0 ];
	if (typeof n.plugins != UNDEF && typeof n.plugins[SHOCKWAVE_FLASH] == OBJECT) {
		d = n.plugins[SHOCKWAVE_FLASH].description;
		if (d && !(typeof n.mimeTypes != UNDEF && n.mimeTypes[FLASH_MIME_TYPE] && !n.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { 
			d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
			v[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
			v[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
			v[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
		}
	}
	else if (typeof window.ActiveXObject != UNDEF) {
		try {
			var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
			if (a && typeof a.GetVariable != UNDEF) {
				d = a.GetVariable("$version");
				if ( d ) {
					d = d.split(" ")[1].split(",");
					v[0] = parseInt(d[0], 10);
					v[1] = parseInt(d[1], 10);
					v[2] = parseInt(d[2], 10);
				}
			}
		}
		catch(e) {}
	}
	return (v[0] > rv[0]) || 
		(v[0] == rv[0] && v[1] > rv[1]) || 
		(v[0] == rv[0] && v[1] == rv[1] && v[2] >= rv[2]);
};

// Search :: searching throughout all the album pages

if ( typeof Search !== UNDEF ) {
	Search.start = function( form ) {
		var t = $(form).find('input[type=search]').val().trim(), 
			el = $('<div>', { 'class': 'searchresults' }),
			found = 0,
			i, j, a, p, r, s;
	
		if ( !Search.data || !$.isArray(Search.data) || !Search.data.length || !t || t.length < 2 )
			return;
			
		el.append($('<h4>', { html: Search.text.title + ' &quot;<b>' + t + '</b>&quot;' }));
		t = t.toLowerCase();
		
		for ( i = 0; i < Search.data.length; i++ ) {
			for ( j = 0; j <  Search.data[i][1].length; j++ ) {
				if ( Search.data[i][1][j].toLowerCase().indexOf(t) != -1 ) {
					s = Search.data[i][1][j].split(Search.sep);
					r = (Search.rootPath && Search.rootPath !== '.')? (Search.rootPath + '/') : ''; 
					p = r + (Search.data[i][0]? (Search.data[i][0] + '/') : '');
					a = $('<a>', { 
							href: p + (s[0].startsWith('#')? Search.indexName : '') + s[0] // s[0].replace(/%/g,'%25') 
					}).appendTo(el);
					a.append($('<aside>').append($('<img>', { 
						src: s[0].startsWith('#')? 
							(s[0].toLowerCase().match(/.+\.(jpg|png)$/)? (p + 'thumbs/' + s[0].substr(1)) : (r + 'res/unknown.png')) : 
							(p + Search.folderThumb) 
					})));
					a.append($('<h5>', { 
						text: s[1] 
					}));
					a.append($('<p>', { 
						text: s[2] 
					}));
					found++;
				}
			}
		}
		
		$(form).parents('.hint:first').fadeOut(100, function() {
			$(this).remove();
		});
		
		if ( !found ) {
			el.append($('<p>', { 
				text: Search.text.notFound 
			}));
		} else {
			setTimeout(function() {
				el.find('a:first').focus();
			}, 250);
		}
		
		el.alertBox([ { 
			t: Search.text.close 
		} ], {
			width: 400
		});
		
		return false;
	};
}

(function($) {

	// logEvents :: debugging events
	
	$.fn.logEvents = function( e ) {
		var events = e || 'mousedown mouseup mouseover mouseout mousewheel dragstart click blur focus, load unload reset submit change abort cut copy paste selection drag drop orientationchange touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend';

		return this.each(function() {
			$(this).on(events, function(e) {
				if (e.target.id !== 'log') 
					log(e.type + ' <span style="padding:0 4px;font-size:0.8em;background-color:#000;border-radius:4px;"><b>' + e.target.nodeName.toLowerCase() + '</b>' + (e.target.id? (':'+e.target.id) : '') + '</span>' + 
					(e.relatedTarget? (' <span style="padding:0 4px;font-size:0.8em;background-color:#800;border-radius:4px;"><b>' + e.relatedTarget.nodeName.toLowerCase() + '</b>' + (e.relatedTarget.id? (':'+e.relatedTarget.id) : '') + '</span>') : ''));
				return true;
			});
		});
	};
	
	// trackCss :: tracks css values until the element is live
	
	$.fn.trackCss = function( p, dur, step ) {
		step = step || 20;
		var t0 = new Date();
		var max = (dur || 3000) / step; 
		return this.each(function() {
			var el = $(this);
			var n = 0;
			var show = function( nm ) {
				var t = new Date() - t0;
				log(t + '&nbsp;::&nbsp;' + nm + ' = ' + el.css(nm));
				if (t > dur) {
					clearInterval(iv);
				}
			};
			var iv = setInterval(function() {
				if ( $.isArray(p) ) {
					for (var i = 0; i < p.length; i++) {
						show(p[i]);
					}
				}
				else {
					show(p);
				}
			}, step);
		});
	};
	
	// Reading keys: k="name1,name2,... from attr="data-k" into m
	
	$.fn.readData = function(m, k) {
		if ( m == null || k == null ) {
			return this;
		}
		k = k.split(',');
		var i, l = k.length, v;
		return this.each(function() {
			for (i = 0; i < l; i++) {
				if ((v = $(this).data(k[i])) != null) {
					m[k[i]] = v;
				}
			}
		});
	};
	
	// Extending $.support jQuery variable
	
	$.extend( $.support, {
		orientation: "orientation" in window,
		touch: "ontouchend" in document,
		cssTransitions: "WebKitTransitionEvent" in window,
		cssTable: (!$.browser.msie || $.browser.version >= 8),
		cssFilter: ($.browser.msie && $.browser.version <= 8),
		flash: checkFlash('9.0.0')
	});
	
	// Easing functions for animations by George Smith
	
	$.extend( jQuery.easing, {
		easeOutBack: function (x,t,b,c,d,s) { 
			if (s == null) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;
		},
		easeOutCubic: function (x,t,b,c,d) {
			return c*((t=t/d-1)*t*t+1)+b;
		}
	});
	
	// showin :: shows elements, like show() but display:inline-block;
	
	$.fn.showin = function() {
		return this.each(function() { 
			$(this).css('display', 'inline-block'); 
		});
	};
	
	// getDim :: get dimensions of hidden layers
	
	$.fn.getDim = function() {
		var el = $(this).eq(0);
		var dim = { 
			width: el.width(), 
			height: el.height() 
		};
		
		if ( (dim.width === 0 || dim.height === 0) && el.css('display') === 'none' ) {
			var bp = el.css('position');
			var bl = el.css('left');
			el.css({position: 'absolute', left: '-10000px', display: 'block'});
			dim.width = el.width();
			dim.height = el.height();
			el.css({display: 'none', position: bp, left: bl});
		}
		return dim;
	};
	
	// Mousewheel: Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
	
	var mousewheelTypes = ['DOMMouseScroll', 'mousewheel'];

	if ($.event.fixHooks) {
		for ( var i = mousewheelTypes.length; i; ) {
			$.event.fixHooks[ mousewheelTypes[--i] ] = $.event.mouseHooks;
		}
	}
	
	$.event.special.mousewheel = {
		
		setup: function(){
			if ( this.addEventListener ) {
				for ( var i = mousewheelTypes.length; i; ) {
					this.addEventListener( mousewheelTypes[--i], mousewheelHandler, false );
				}
			} else { 
				this.onmousewheel = mousewheelHandler;
			}
		},
		
		teardown: function() {
			if ( this.removeEventListener ) {
				for ( var i = mousewheelTypes.length; i; ) {
					this.removeEventListener( mousewheelTypes[--i], mousewheelHandler, false );
				}
			} else { 
				this.onmousewheel = null;
			}
		}
	};

	$.fn.extend({
			
		mousewheel: function( fn ){
			return fn? this.bind( 'mousewheel', fn ) : this.trigger('mousewheel');
		},
		
		unmousewheel: function( fn ){
			return this.unbind( 'mousewheel', fn );
		}
	});
	
	var mousewheelHandler = function( event ) {
		var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
		event = $.event.fix( orgEvent );
		event.type = 'mousewheel';
		
		// old school
		if ( orgEvent.wheelDelta ) { 
			delta = orgEvent.wheelDelta / 120; 
		} else if ( orgEvent.detail ) { 
			delta = -orgEvent.detail / 3; 
		}
		
		// new school (touchpad)
		deltaY = delta;
		
		// Gecko
		if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
			deltaY = 0;
			deltaX = -1 * delta;
		}
		
		// Webkit
		if ( orgEvent.wheelDeltaY !== undefined ) { 
			deltaY = orgEvent.wheelDeltaY / 120; 
		}
		if ( orgEvent.wheelDeltaX !== undefined ) { 
			deltaX = -1 * orgEvent.wheelDeltaX / 120; 
		}
		args.unshift( event, delta, deltaX, deltaY );
		
		return ($.event.dispatch || $.event.handle).apply( this, args );
	};
	
	// cookie :: Cookie handling :: expire in hours 
	
	var cookie = function( key, value, expire ) {
		if ( arguments.length > 1 && /^(string|number|boolean)$/.test( typeof value ) ) {
			var d = new Date();
			d.setTime(d.getTime() + (((typeof expire !== 'number')? 1 : expire) * 3600000));
			document.cookie = encodeURIComponent( key ) + "=" + String( value ) + '; expires=' + d.toGMTString() + "; path=/";
			return value;
		} else if ( key ) { 
			key += '=';
			var c = document.cookie.split(';');
			var v;
			for ( var i = 0; i < c.length; i++ ) {
				v = c[i].trim();
				if ( v.indexOf(key) === 0 ) {
					v = v.substring( key.length );
					return /^(true|yes)$/.test(v)? true : ( /^(false|no)$/.test(v)? false : ( /^([\d.]+)$/.test(v)? parseFloat(v) : v ) );
				}
			}
		}
		
		return null;
	};
	
	// history plugin :: The MIT License / Copyright (c) 2006-2009 Taku Sano (Mikage Sawatari) / Copyright (c) 2010 Takayuki Miwa
	
	(function(){
		var locationWrapper = {
			put: function(hash, win) {
				(win || window).location.hash = this.encoder(hash);
			},
			get: function(win) {
				var hash = ((win || window).location.hash).replace(/^#/, '');
				try {
					return $.browser.mozilla ? hash : decodeURIComponent(hash);
				}
				catch (error) {
					return hash;
				}
			},
			encoder: encodeURIComponent
		};
	
		var iframeWrapper = {
			id: "__jQuery_history",
			init: function() {
				var html = '<iframe id="'+ this.id +'" style="display:none" src="javascript:false;" />';
				$("body").prepend(html);
				return this;
			},
			_document: function() {
				return $("#"+ this.id)[0].contentWindow.document;
			},
			put: function(hash) {
				var doc = this._document();
				doc.open();
				doc.close();
				locationWrapper.put(hash, doc);
			},
			get: function() {
				return locationWrapper.get(this._document());
			}
		};
	
		function initObjects(options) {
			options = $.extend({
					unescape: false
				}, options || {});
	
			locationWrapper.encoder = encoder(options.unescape);
	
			function encoder(unescape_) {
				if(unescape_ === true) {
					return function(hash){ return hash; };
				}
				if(typeof unescape_ == "string" &&
				   (unescape_ = partialDecoder(unescape_.split("")))
				   || typeof unescape_ == "function") {
					return function(hash) { return unescape_(encodeURIComponent(hash)); };
				}
				return encodeURIComponent;
			}
	
			function partialDecoder(chars) {
				var re = new RegExp($.map(chars, encodeURIComponent).join("|"), "ig");
				return function(enc) { return enc.replace(re, decodeURIComponent); };
			}
		}
	
		var implementations = {};
	
		implementations.base = {
			callback: undefined,
			type: undefined,
			check: function() {},
			load:  function(hash) {},
			init:  function(callback, options) {
				initObjects(options);
				self.callback = callback;
				self._options = options;
				self._init();
			},
	
			_init: function() {},
			_options: {}
		};
	
		implementations.timer = {
			_appState: undefined,
			_init: function() {
				var current_hash = locationWrapper.get();
				self._appState = current_hash;
				self.callback(current_hash);
				setInterval(self.check, 100);
			},
			check: function() {
				var current_hash = locationWrapper.get();
				if(current_hash != self._appState) {
					self._appState = current_hash;
					self.callback(current_hash);
				}
			},
			load: function(hash) {
				if(hash != self._appState) {
					locationWrapper.put(hash);
					self._appState = hash;
					self.callback(hash);
				}
			}
		};
	
		implementations.iframeTimer = {
			_appState: undefined,
			_init: function() {
				var current_hash = locationWrapper.get();
				self._appState = current_hash;
				iframeWrapper.init().put(current_hash);
				self.callback(current_hash);
				setInterval(self.check, 100);
			},
			check: function() {
				var iframe_hash = iframeWrapper.get(),
					location_hash = locationWrapper.get();
	
				if (location_hash != iframe_hash) {
					if (location_hash == self._appState) {	  // user used Back or Forward button
						self._appState = iframe_hash;
						locationWrapper.put(iframe_hash);
						self.callback(iframe_hash); 
					} else {							  // user loaded new bookmark
						self._appState = location_hash;	 
						iframeWrapper.put(location_hash);
						self.callback(location_hash);
					}
				}
			},
			load: function(hash) {
				if(hash != self._appState) {
					locationWrapper.put(hash);
					iframeWrapper.put(hash);
					self._appState = hash;
					self.callback(hash);
				}
			}
		};
	
		implementations.hashchangeEvent = {
			_init: function() {
				self.callback(locationWrapper.get());
				$(window).on('hashchange', self.check);
			},
			check: function() {
				self.callback(locationWrapper.get());
			},
			load: function(hash) {
				locationWrapper.put(hash);
			}
		};
	
		var self = $.extend({}, implementations.base);
	
		if($.browser.msie && ($.browser.version < 8 || document.documentMode < 8)) {
			self.type = 'iframeTimer';
		} else if("onhashchange" in window) {
			self.type = 'hashchangeEvent';
		} else {
			self.type = 'timer';
		}
	
		$.extend(self, implementations[self.type]);
		$.history = self;
	})();
	
	// addScroll :: adding custom vertical scrollbar to layer
	
	$.fn.addScroll = function( settings ) {
		
		settings = $.extend( {}, $.fn.addScroll.defaults, settings );
		
		return this.each(function() {
			var to, cont = $(this), wrap = $(this).parent(),
				sup, sdn, sbar, shan, ctrls, cheight, wheight, scroll,
				ey = 0, y0, tY, ltT, tY1, speed, dist, min, max;
			
			cont.css({
				position: 'absolute', 
				width: wrap.width - 20
			});
			wrap.css({
				overflow: 'hidden'
			});
			
			if ( wrap.css('position') !== 'absolute' ) {
				wrap.css({ position: 'relative' });
			}
			
			sup = $('<div>', { 'class': settings.upbtn }).appendTo(wrap);
			sdn = $('<div>', { 'class': settings.dnbtn }).appendTo(wrap);
			sbar = $('<div>', { 'class': settings.scbar }).appendTo(wrap);
			shan = $('<div>').appendTo(sbar);
			ctrls = sup.add(sdn).add(sbar);
			ctrls.hide();
			
			var getHeights = function() {
				cheight = cont.height();
				wheight = wrap.height();
			};
			
			var getTop = function() { 
				return cont.position().top; 
			};
			
			var getSt = function(t) { 
				return Math.round( (sbar.height() - 6) * (-((t == null)? getTop() : t)) / cheight ) + 3; 
			};
			
			var getSh = function() { 
				return Math.max( Math.round( (sbar.height() - 6) * wheight / cheight ), settings.dragMinSize ); 
			};
			
			var setCtrl = function(t) {
				if ( t == null ) {
					t = getTop();
				}
				sup.css({opacity: (t? 1 : settings.disabledOpacity)});
				sdn.css({opacity: (t === wheight - cheight)? settings.disabledOpacity : 1});
			};
			
			var noSelect = function() {
				return false;
			};
			
			var matchScr = function() {
				getHeights(); 
				if ( cheight <= wheight ) { 
					cont.css({top: 0}).off('selectstart', noSelect); 
					ctrls.hide();
					return;
				}
				if ( cont.position().top < (wheight - cheight) ) {
					cont.css({top: wheight - cheight});
				}
				shan.css({top: getSt(), height: getSh()});
				cont.on('selectstart', noSelect);
				ctrls.show();
				setCtrl();			
			};
			
			var matchCnt = function() { 
				cont.css({top: Math.minMax(wheight - cheight, -Math.round((shan.position().top - 3) * cheight / (sbar.height() - 6)), 0)}); 
				setCtrl(); 
			};
			
			var animateTo = function(t) {
				clearInterval(scroll);
				if ( wheight >= cheight ) {
					return;
				}
				t = Math.minMax(wheight - cheight, t, 0);
				shan.stop(true,true).animate({top: getSt(t)}, settings.speed, settings.effect);
				cont.stop(true,true).animate({top: t}, settings.speed, settings.effect, function() {
					setCtrl(t);
				});
			};
			
			sup.click(function() { 
				animateTo(getTop() + wheight); 
				return false; 
			});
			
			sdn.click(function() { 
				animateTo(getTop() - wheight); 
				return false; 
			});
			
			sbar.click(function(e) {
				if (e.pageY < shan.offset().top) {
					animateTo(getTop() + wheight);
				} else if (e.pageY > (shan.offset().top + shan.height())) {
					animateTo(getTop() - wheight);
				}
				return false;
			});
			
			if ( settings.enableMouseWheel ) {
				cont.mousewheel(function(e, d) {
					if (d) {
						animateTo(getTop() + settings.wheelIncr * ((d < 0)? -1 : 1));
					}
					return false;
				});
			}
			
			var dragSh = function(e) {
				shan.css({top: Math.minMax(2, Math.round(e.pageY - shan.data('my')), sbar.height() - shan.height() - 2)}); 
				matchCnt();
				return false;
			};
			
			var dragShStop = function(e) {
				$(document).off('mousemove', dragSh).off('mouseup', dragShStop);
				return false;
			};
			
			shan.on('mousedown', function(e) { 
				$(this).data('my', Math.round(e.pageY) - $(this).position().top);
				$(document).on({
					'mousemove': dragSh,
					'mouseup': dragShStop
				});
				return false;
			});
			
			var getY = function(e) {
				return ey = ( e.touches && e.touches.length > 0 )? e.touches[0].clientY : ( e.clientY ? e.clientY : ey );
			};
			
			var dragExtra = function() {
				dist += Math.round(speed / 20);
				var nY = tY1 + dist;
				if (nY > 0 || nY < min) {
					clearInterval(scroll);
					return;
				}
				cont.css({top: nY});
				shan.css({top:getSt(), height:getSh()});
				speed *= .8;
				if (Math.abs(speed) < 10) {
					speed = 0;
					clearInterval(scroll);
				}
			};
			
			var dragMove = function(e) {
				if ( tY ) {
					var dY = getY(e) - tY;
					if ( dY ) {
						cont.data('dragOn', true);
						cont.css({top: Math.minMax(min, y0 + dY, 0)});
						shan.css({top: getSt(), height: getSh()});
					}
				} else {
					tY = getY(e);
				}
				return false;
			};
			
			var dragStop = function(e) {
				tY1 = getTop();
				var dY = getY(e) - tY;
				var dT = new Date().getTime() - tT;
				speed = 1000 * dY / dT;
				scroll = setInterval(dragExtra, 50);
				if ($.support.touch) {
					this.ontouchmove = null;
					this.ontouchend = null;
				} else {
					$(document).off({
						mousemove: dragMove,
						mouseup: dragStop
					});
				}
				setTimeout(function() {
					cont.data('dragOn', false);
				}, 20 );
				return (Math.abs(dY) < 4) && (dT < 300);
			};
			
			var dragStart = function(e) { // idea from quirsksmode.org
				if ( wheight >= cheight ||
					((e.type === 'touchstart' || e.type === 'touchmove') && 
					(!e.touches || e.touches.length > 1 || cont.is(':animated'))) ) {
					return true;
				}
				clearInterval(scroll);
				te = e;
				y0 = getTop();
				tY = getY(e);
				tT = new Date().getTime();
				dist = 0;
				min = wheight - cheight;
				if ($.support.touch) {
					$(e.target).closest('a').focus();
					this.ontouchmove = dragMove;
					this.ontouchend = dragStop;
					return true;
				} else {
					$(document).on({
						'mousemove': dragMove,
						'mouseup': dragStop
					});
					return false;
				}
			};
			
			if ( $.support.touch ) {
				cont[0].ontouchstart = dragStart;
			} else {
				cont.on('mousedown', dragStart);
			}
						
			$(window).resize(function() { 
				clearTimeout(to); 
				to = setTimeout(matchScr, 50);
			});
			
			to = setTimeout(matchScr, 10);
			
			cont.attr('role', 'scroll').data('dragOn', false).on('adjust', matchScr);
			
			ctrls.on('selectstart', noSelect); 
			
			if ( $.isFunction(settings.enableKeyboard) || settings.enableKeyboard ) {
				$(document).keydown(function(e) {
					if (document.activeElement && document.activeElement.nodeName === 'INPUT' || 
						( $.isFunction(settings.enableKeyboard) && !settings.enableKeyboard() ) ) {
						return true;
					}
					var k = e? e.keyCode : window.event.keyCode;
					switch(k) {
						case 33: 
							animateTo( getTop() + wheight ); 
							return false;
						case 34: 
							animateTo( getTop() - wheight ); 
							return false;
					}
					return true;
				});
			}
		});
	};
	
	$.fn.addScroll.defaults = {
		upbtn: 'scrup',
		dnbtn: 'scrdn',
		scbar: 'scrbar',
		dragMinSize: 10,
		speed: 250,
		effect: 'easeOutBack',
		disabledOpacity: 0.3,
		wheelIncr: 50,
		enableKeyboard: true,
		enableMouseWheel: true
	};
	
	// thumbScroll :: horizontal scrollbar to layer
	
	$.fn.scrollThumbs = function(settings) {
		
		settings = $.extend( {}, $.fn.scrollThumbs.defaults, settings );
		
		return this.each(function() {
			var co = $(this), wr = $(this).parent();
			var ex = 0, x0, tX, tT, tX1, speed, dist, min, scroll;
			var scleft = $('<div>', { 'class': settings.scleft }).insertAfter(wr);
			var scright = $('<div>', { 'class': settings.scright }).insertAfter(wr);
			
			var setCtrl = function( x ) {
				x = (x == null)? co.position().left : x;
				scleft.css( { opacity: (x < 0)? 1 : settings.disabledOpacity } );
				scright.css( { opacity: (wr.width() < (x + co.width()))? 1 : settings.disabledOpacity } );
			};
			
			var animateTo = function( x ) {
				var w = wr.width(), c = co.width();
				if ( !w || !c || w >= c || !$.isNumeric(x) ) {
					return;
				} else if ( x > 0 ) {
					x = 0;
				} else if ( x < w - c ) {
					x = w - c;
				}
				setCtrl(x);
				co.stop(true, false).animate( { left: x }, settings.speed, settings.effect );
			};	
			
			scleft.click(function() { 
				animateTo(co.position().left + wr.width()); 
				return false; 
			});
			
			scright.click(function() { 
				animateTo(co.position().left - wr.width()); 
				return false; 
			});
			
			co.find('a').on('setactive', function() {
				var e = ($(this).parent() === co)? $(this) : $(this).parent(),
					el = e.position().left, 
					ew = e.outerWidth(true),
					hr = Math.round(ew * settings.headRoom),
					cl = co.position().left,
					ww = wr.width();
				
				co.find('a.active').removeClass('active');
				$(this).addClass('active');
				
				if ( ww > co.width() ) {
					return;
				} else if (el > (ww - ew - hr - cl)) {
					cl = Math.max(ww - ew - hr - el, ww - co.width());
				} else if (el < -cl + hr) {
					cl = -el + hr;
				} else { 
					return;
				}
				
				animateTo(cl);
			});
			
			if ( settings.enableMouseWheel ) {
				co.mousewheel(function(e, d) {
					if ( d ) {
						animateTo(co.position().left + wr.width() * ((d < 0)? -1 : 1));
					}
					return false;
				});
			}
			
			setCtrl();
			
			var noClick = function(e) {
				e.stopPropagation();
				e.preventDefault();
				return false;
			};
			
			var getX = function( e ) {
				return ex = ( e.touches && e.touches.length > 0 )? e.touches[0].clientX : ( e.clientX ? e.clientX : ex );
			};
			
			var dragExtra = function() {
				dist += Math.round(speed / 20);
				var nX = tX1 + dist;
				if (nX > 0 || nX < min) {
					clearInterval(scroll);
					return;
				}
				co.css({left: nX});
				speed *= .8;
				if (Math.abs(speed) < 10) {
					speed = 0;
					clearInterval(scroll);
				}
			};
			
			var dragMove = function(e) {
				if ( tX ) {
					var dX = getX(e) - tX;
					if ( dX ) {
						co.data('dragOn', true);
						co.css({left: Math.minMax(min, x0 + dX, 0)});
					}
				} else {
					tX = getX(e);
				}
				return false;
			};
			
			var dragStop = function( e ) {
				tX1 = co.position().left;
				var dX = getX(e) - tX;
				var dT = new Date().getTime() - tT;
				speed = 1000 * dX / dT;
				scroll = setInterval(dragExtra, 50);
				if ($.support.touch) {
					this.ontouchmove = null;
					this.ontouchend = null;
				} else {
					$(document).off({
						mousemove: dragMove,
						mouseup: dragStop
					});
				}
				setTimeout(function(){
					co.data('dragOn', false);
				}, 20 );
				return (Math.abs(dX) < 4) && (dT < 300);
			};
			
			var dragStart = function(e) {
				if ((e.type === 'touchstart' || e.type === 'touchmove') && 
					(!e.touches || e.touches.length > 1 || co.is(':animated'))) {
					return true;
				}
				clearInterval(scroll);
				te = e;
				x0 = co.position().left;
				tX = getX(e);
				tT = new Date().getTime();
				dist = 0;
				min = wr.width() - co.width();
				if ($.support.touch) {
					$(e.target).closest('a').focus();
					this.ontouchmove = dragMove;
					this.ontouchend = dragStop;
					return true;
				} else {
					$(document).on({
						'mousemove': dragMove,
						'mouseup': dragStop
					});
					return false;
				}
			};
			
			if ( $.support.touch ) {
				co[0].ontouchstart = dragStart;
			} else {
				co.on('mousedown', dragStart);
			}
			
			co.attr('role', 'scroll').data('dragOn', false);
			
			co.add(scleft).add(scright).on('selectstart', function(e){ 
				e.preventDefault(); 
				return false; 
			});
		});
	};
	
	$.fn.scrollThumbs.defaults = {
		scleft: 'scleft',
		scright: 'scright',
		speed: 1500,
		incr: 100,
		effect: 'easeOutBack',
		headRoom: 0.67,
		disabledOpacity: 0.3,
		enableMouseWheel: true
	};
	
	// Swipe gesture support
	
	$.fn.addSwipe = function( leftFn, rightFn ) {
		
		return this.each(function() {
			
			var t = $(this);
			var dist, ex = 0, tx = 0, tx1 = 0, x0, tt, speed;
			
			t.attr('draggable', 'true');
			
			var getX = function(e) {
				return ex = ( e.touches && e.touches.length > 0 )? e.touches[0].clientX : ( e.clientX ? e.clientX : ex );
			};
			
			var setPos = function(e) {
				tx = getX(e);
			};
			
			var dragMove = function(e) {
				if ( tx ) {
					t.css({
						left: (getX(e) - tx + x0)
					});
				} else { // Wrong dragstart event coordinate :: starting now
					tx = getX(e);
				}
				return false;
			};
			
			var noAction = function(e) {
				return false;
			};
						
			var dragStop = function(e) {
				tx1 = t.position().left;
				var dx = getX(e) - tx;
				
				if ( $.support.touch ) {
					this.ontouchmove = null;
					this.ontouchend = null;
				} else {
					$(document).off('mousemove', dragMove).off('mouseup click', dragStop);
				}
				
				if ( Math.abs(dx) > 40 ) {
					speed = 1000 * dx / (new Date().getTime() - tt);
					t.animate({left: tx1 + Math.round(speed / 2)}, 500, 'easeOutCubic');
					
					if (dx < 0) { 
						if ( $.isFunction(leftFn) ) {
							leftFn.call(); 
						}
					} else if ( $.isFunction(rightFn) ) {
						rightFn.call();
					}
					
				} else {
					t.animate({left: x0}, 200);
					t.trigger('click');
				}
				
				return false;
			};
			
			var touchStart = function(e) {
				if ((e.type === 'touchstart' || e.type === 'touchmove') && (!e.touches || e.touches.length > 1 || t.is(':animated'))) {
					// >= 2 finger flick
					return true;
				}
				setPos(e);
				dragStart(e);
			};
			
			var dragStart = function(e) {
				
				t.stop(true, false);
				x0 = t.position().left;
				tt = new Date().getTime();
				dist = 0;
				
				if ( $.support.touch ) {
					this.ontouchmove = dragMove;
					this.ontouchend = dragStop;
					return true;
				} else {
					t.off('click');
					t.click(noAction);
					$(document).on({
						'mousemove': dragMove,
						'mouseup': dragStop
					});
					e.cancelBubble = true;
					return false;
				}
			};
			
			if ($.support.touch) {
				this.ontouchstart = touchStart;
			} else {
				t.on({
					'dragstart': dragStart,
					'mousedown': setPos
				});
			}
			
			t.on('dragcancel', function() {
				t.stop(true, false).animate({
					left: x0
				}, 200);
				return false;
			});
			
			t.on('unswipe', function() {
				if ( $.support.touch ) {
					this.ontouchmove = null;
					this.ontouchend = null;
					this.ontouchstart = null;
				} else {
					if ( $.isFunction(t.noAction) ) {
						t.off(noAction);
					}
					if ( $.isFunction(t.dragStart) ) {
						t.off(dragStart);
					}
					$(document).off('mousemove', dragMove).off('mouseup', dragStop);
				}
			});
			
			t.on('selectstart', noAction); 

		});
	};
	
	// alignTo :: align a layer to another

	var ALIGN_LEFT = ALIGN_TOP = 0,
		ALIGN_CENTER = ALIGN_MIDDLE = 1,
		ALIGN_RIGHT = ALIGN_BOTTOM = 2;
	
	$.fn.alignTo = function( el, settings ) {
		
		settings = $.extend( {}, $.fn.alignTo.defaults, settings );
		
		if (typeof el === 'string') {
			el = $(el);
		}
		if (!(el instanceof $ && el.length)) {
			return;
		}
		
		var to = el.offset(),
			tw = el.outerWidth(),
			th = el.outerHeight();
		
		return $(this).each( function() {
			var w = $(this).outerWidth(),
				h = $(this).outerHeight(),
				rx = Math.round(to.left + settings.toX * tw / 2 + 
					(settings.toX - 1) * settings.gap);
				ry = Math.round(to.top + settings.toY * th / 2 + 
					(settings.toY - 1) * settings.gap);
				l = Math.round(rx - settings.posX * w / 2),
				t = Math.round(ry - settings.posY * h / 2);
			
			if ( t < 0 ) {
				if ( settings.toX !== ALIGN_CENTER ) {
					t = 0;
				} else if ( settings.toY !== ALIGN_BOTTOM  ) {
					t = to.top + el.outerHeight() + settings.gap;
				}
			} else if ( (t + h) > $(window).height() ) {
				if ( settings.toX !== ALIGN_CENTER ) {
					t = $(window).height() - h;
				} else if ( settings.toY !== ALIGN_TOP ) {
					t = to.top - h - settings.gap;
				}
			}
			
			if ( l < 0 ) {
				if ( settings.toY !== ALIGN_MIDDLE ) {
					l = 0;
				} else if ( settings.toX != ALIGN_RIGHT ) {
					l = to.left + el.outerWidth() + settings.gap;
				}
			} else if ( (l + w) > $(window).width() ) {
				if ( settings.toY !== ALIGN_MIDDLE ) {
					l = $(window).width() - w;
				} else if ( settings.toX != ALIGN_LEFT ) {
					l = to.left - w - settings.gap;
				}
			}
			
			$(this).css({
				position: 'absolute',
				left: l, 
				top: t 
			});
		});
	};

	$.fn.alignTo.defaults = {
		gap: 5,
		posX: ALIGN_CENTER,
		posY: ALIGN_BOTTOM,
		toX: ALIGN_CENTER,
		toY: ALIGN_TOP
	};
	
	// addHint :: little Popup displaying 'title' text, or passed text (can be HTML)
	
	$.fn.addHint = function(txt, settings) {
		
		if ( txt && typeof txt !== 'string' && !txt.jquery ) {
			settings = txt;
			txt = null;
		}
		settings = $.extend( {}, $.fn.addHint.defaults, settings );
		
		var getPop = function() {
			var c = $('#' + settings.id);
			if ( !c.length ) {
				c = $('<div>', { 'class': settings.id, id: settings.id }).hide().appendTo('body');
			}
			return c;
		};
		
		return this.each(function() {
			var t = $(this), 
				tx = txt || t.attr('title'), 
				to, 
				over = false,
				focus = false,
				dyn = !(tx && tx.jquery), 
				pop;
			
			if ( !tx || !tx.length ) {
				return;
			}
			
			var enter = function(e) {
				// Inserting dynamic content
				if ( dyn ) {
					pop = getPop();
					pop.empty().html( tx );
				} else {
					pop = tx.show();
				}
				
				pop.off('mouseover', getFocus);
				pop.off('mouseout', lostFocus);
				
				// getFocus, lostFocus
				var getFocus =  function() {
					to = clearTimeout(to);
					over = true;
					pop.stop(true, true).css({opacity: 1}).show();
				};
				var lostFocus = function() {
					if ( focus ) {
						return;
					}
					to = clearTimeout(to);
					over = false;
					fade();
				};
				
				// Keep the popup live while the mouse is over, or an input box has focus
				pop.on('mouseover', getFocus);
				pop.on('mouseout', lostFocus);
				pop.find('input').focus(function() {
					focus = true;
					getFocus();
				}).blur(function() {
					focus = false;
				});
				
				// Aligning and fading in
				pop.stop(true, true).alignTo(t, { 
					posX: settings.posX,
					posY: settings.posY,
					toX: settings.toX,
					toY: settings.toY 
				});
				pop.css({opacity: 0}).show().animate({ opacity: 1 }, 200);
				
				// Remove hint automatically on touch devices, because there's no explicit mouse leave event is triggered
				if ( $.support.touch ) {
					to = setTimeout(fade, settings.stay);
				} else {
					over = true;
				}
			};
			
			// Leaving the trigger element
			var leave = function(e) {
				over = false;
				to = clearTimeout(to);
				fade();
			};
			
			// Fading the popup
			var fade = function() {
				if ( !over && pop && pop.length ) {
					pop.stop(true, false).animate({opacity: 0}, 200, function() { 
						$(this).hide(); 
					});
				}
			};
			
			if ( tx.jquery ) {
				tx.addClass( settings.id );
			} else {
				t.removeAttr('title');
			}
			
			t.on($.support.touch? {
				'touchstart': enter
			} : {
				'focus mouseenter': enter,
				'blur mouseleave': leave
			});
		});
	};
	
	$.fn.addHint.defaults = {
		id: 'hint',
		stay: 3000,
		posX: ALIGN_CENTER,
		posY: ALIGN_BOTTOM,
		toX: ALIGN_CENTER,
		toY: ALIGN_TOP
	};
	
	// $('Message to display in HTML').popupBox( settings )
	
	$.fn.popupBox = function( settings ) { 
		
		settings = $.extend( {}, $.fn.popupBox.defaults, settings );
		
		$('#' + settings.id).remove();
		
		var to;
		var el = $('<div>', { id: settings.id }).appendTo('body');
		var pn = $('<div>', { 'class': 'panel' }).appendTo(el);
		pn.css({ width: settings.width }).append(this);

		var close = function() { 
			el.fadeOut(250, function(){ 
				$(this).remove(); 
			}); 
		};

		el.fadeIn(250, function() {
			to = setTimeout(close, settings.length);	
		});
		
		pn.css({
			marginTop: Math.max(Math.round(($(window).height() - pn.outerHeight()) * 0.4), 0)
		}).hover(function() {
			to = clearTimeout(to);
			$(this).stop(true, false).css('opacity', 1);
		}, function() {
			to = setTimeout(close, settings.length);
		});
		
		return this;
	};
	
	$.fn.popupBox.defaults = {
		id: 'modal',
		width: 200,
		length: 500
	};
	
	// $('Message to display in HTML').alertBox([{ t:'button1', h:function(){ handler; } },...], {options});
	
	$.fn.alertBox = function( buttons, settings ) { 
		
		if ( !$.isArray(buttons) ) { 
			settings = buttons; 
			buttons = null;
		}
		
		settings = $.extend( {}, $.fn.alertBox.defaults, settings );
		
		$('#' + settings.id).remove();
		
		var el = $('<div>', { id: settings.id }).appendTo('body'),
			pn = $('<div>', { 'class': 'panel' }).appendTo(el),
			btn, btns;
		pn.append(this);
		pn.append( $('<a>', { 'class': 'close', href: NOLINK, text: ' ' }).click( function() {
			close();
			return false;
		}) );
		
		if ( buttons ) {
			btn = $('<div>', { 'class': 'buttons' }).appendTo( pn );	
		}
		
		pn.css({ width: settings.width });
		
		var keyhandler = function(e) {
			if ( document.activeElement && document.activeElement.nodeName === 'input' || 
				( $.isFunction(settings.enableKeyboard) && !settings.enableKeyboard()) ) {
				return true;
			}
			var k = e? e.keyCode : window.event.keyCode;
			if ( e === 27 ) {
				close(); 
			} else if ( btn ) {
				var a = btn.find('a.active'), i = btns.index(a);
				switch (k) {
					case 13: case 10: 
						if ( $.isFunction(a[0].handler) ) {
							a[0].handler.call();
							close();
							return false;
						}
					case 39: 
						select( (i + 1) % btns.length ); 
						return false;
					case 37: 
						select( i? (i - 1) : (btns.length - 1) ); 
						return false;
				}
			}
			return true;
		};
		
		var close = function() { 
			$(document).off('keydown', keyhandler);
			el.fadeOut(250, function(){ 
				$(this).remove(); 
			}); 
		};
		
		var select = function(n) { 
			btns.each(function(i) { 
				$(this).toggleClass('active', i === n); 
			}); 
		};
	
		if ( buttons && buttons.length ) {
			var a;
			for ( var i = 0; i < buttons.length; i++ ) {
				if ( i ) {
					btn.append(' ');
				}
				a = $('<a>', { href: NOLINK }).appendTo(btn);
				a.html(buttons[i].t)
				if ( $.isFunction(buttons[i].h) ) {
					a[0].handler = buttons[i].h;
				}
				a.click(function() { 
					if ( this.handler != null ) {
						this.handler.call();
					}
					close();
					return false;
				});
			}
			var btns = btn.children('a');
			btns.last().addClass('active');
		}
		
		if ( $.isFunction(settings.enableKeyboard) || settings.enableKeyboard ) {
			$(document).keydown(keyhandler);
		}
		
		el.fadeIn(250);
		
		pn.css({
			marginTop: Math.max(Math.round(($(window).height() - pn.outerHeight()) * 0.4), 0)
		});
		
		return this;
	};
	
	$.fn.alertBox.defaults = {
		id: 'modal',
		width: 420,
		enableKeyboard: true
	};
	
	// equalHeight :: adjust elements in the same row to equal height 
	
	$.fn.equalHeight = function() {			
		var t, el, y = 0, h = 0, n;
		
		if ( (n = $(this).length) < 2 ) {
			return this;
		}
		
		return this.each(function(i) {
			t = $(this);
			if ( t.offset().top === y ) {
				el = el? el.add(t) : t;
				h = Math.max(h, t.height());
				if ( i === n - 1 && h ) {
						el.height( h );
				}
			} else {
				if ( el && h ) {
					el.height( h );
				}
				el = t; 
				h = t.height();
				y = t.offset().top;
			}
		});
	};
	
	//	shareIt :: adds a popup box to the div to share the current page over various sharing sites
	
	var tumblr_photo_source = "";
	var tumblr_photo_caption = "";
	var tumblr_photo_click_thru = "";
	
	$.fn.shareIt = function( settings ) {
		
		settings = $.extend( {}, $.fn.shareIt.defaults, settings );
		
		var u = encodeURIComponent( settings.useHash? window.location.href : window.location.href.split('\#')[0] );
		var ti = encodeURIComponent( $('meta[name=title]').attr('content') || $('title').text() );
		var tx = encodeURIComponent( settings.callTxt );
		var im = encodeURIComponent( $('link[rel=img_src]').attr('href') );
		
		return this.each(function() {
			var a = $(this);
			
			if ( this.nodeName === 'a' ) {
				a.attr('href', NOLINK);
			}
			
			var e = $('<div>', { 'class': settings.id }).hide();
			
			if ( location.protocol.startsWith('file:') && !DEBUG ) {
				e.html(settings.localWarning);
			} else {
				if ( settings.facebookLike ) {
					e.append('<div class="likebtn"><iframe src="http://www.facebook.com/plugins/like.php?href=' + u + '&amp;layout=button_count&amp;show_faces=false&amp;width=110&amp;action=like&amp;font=arial&amp;colorscheme=' + settings.likeBtnTheme + '&amp;height=20" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:110px; height:20px;" allowTransparency="true"></iframe></div>');
				}
				if ( settings.twitterTweet ) {
					e.append('<div class="likebtn"><iframe allowtransparency="true" frameborder="0" scrolling="no" src="http://platform.twitter.com/widgets/tweet_button.html?url=' + u + '&text=' + ti + '" style="width:55px; height:20px;"></iframe></div>');
				}
				if ( settings.googlePlus && gapi && !settings.useHash ) {
					var po = $('<div class="g-plusone likebtn" data-size="medium" data-annotation="inline" data-href="' + u + '" data-width="110"></div>').appendTo(e);
					gapi.plusone.render(po[0]);
				}
				if ( settings.tumblrBtn ) {
					e.append('<div class="likebtn" id="tumblr"><a href="http://www.tumblr.com/share/photo?source=' + u + '&caption=' + ti + '" title="Share on Tumblr" style="display:inline-block; text-indent:-9999px; overflow:hidden; width:81px; height:20px; background:url(http://platform.tumblr.com/v1/share_1.png) top left no-repeat transparent;">Tumblr</div>');
				}
				if ( settings.facebook ) {
					e.append('<a href="http://www.facebook.com/sharer.php?u=' + u + '&t=' + ti + '" class="facebook">Facebook</a>');
				}
				if ( settings.twitter ) {
					e.append('<a href="http://twitter.com/home?status=' + tx + ': ' + u + '" class="twitter">Twitter</a>');
				}
				if ( settings.digg ) {
					e.append('<a href="http://digg.com/submit?url=' + u + '" class="digg">Digg</a>');
				}
				if ( settings.delicious ) {
					e.append('<a href="http://delicious.com/save?url=' + u + '&title=' + ti + '&v=5" class="delicious">Delicious</a>');
				}
				if ( settings.myspace ) {
					e.append('<a href="http://www.myspace.com/index.cfm?fuseaction=postto&t=' + ti + '&u=' + u + '&l=3" class="myspace">MySpace</a>');
				}
				if ( settings.stumbleupon ) {
					e.append('<a href="http://www.stumbleupon.com/submit?url=' + u + '&title=' + ti + '" class="stumbleupon">StumbleUpon</a>');
				}
				if ( settings.reddit ) {
					e.append('<a href="http://www.reddit.com/submit?url=' + u + '" class="reddit">Reddit</a>');
				}
				e.children('a').attr('target', '_blank');
				
				if ( settings.email ) {
					e.append('<a href="mailto:?subject=' + tx + '&body=' + ti + '%0D%0A' + u + '" class="email">Email</a>');
				}
			}
			a.addHint( e.appendTo('body'), settings.pos ).on('destroy', function() {
				e.remove();
			});
		});
	};
	
	$.fn.shareIt.defaults = {
		id: 'shares',
		useHash: true,
		likeBtnTheme: 'light',
		facebookLike: true,
		twitterTweet: true,
		googlePlus: true,
		tumblrBtn: true,
		facebook: true,
		twitter: true,
		digg: true,
		delicious: true,
		myspace: true,
		stumbleupon: true,
		reddit: true,
		email: true,
		callTxt: 'Found this page',
		pos: { 
			posX: 1,
			posY: 2,
			toX: 1,
			toY: 0
		},
		localWarning: 'Can\'t share local albums. Please upload your album first!'
	};
	
	// Adding Video player, using HTML5 Video as fallback
	
	$.fn.addPlayer = function( settings ) {
		
		settings = $.extend( {}, $.fn.addPlayer.defaults, settings );
		
		var types = { 
			flashVideo: '.flv.3gp.3g2',
			video: '.mp4.mov.f4v',
			html5Video: '.ogv.webm',
			qtVideo: '.qt.mpg.mpeg.mpe',
			wmVideo: '.avi.wmv.asf.asx.wvx.mkv',
			audio: '.mp3.aac.m4a',
			html5audio: '.ogg.wav.ram.rm'
		};
		
		var num = 0;
		var res = settings.resPath? (settings.resPath + '/') : '';
		
		var getType = function( f ) {
			var x = f.getExt();
			if ( !x.length ) {
				return null;
			}
			for ( var t in types ) {
				if ( types[t].indexOf(x) >= 0 ) {
					return t;
				}
			}
			return null;
		}
		
		var addParam = function( p ) {
			var s = '', o;
			for ( o in p ) {
				s += '<param name="' + o + '" value="' +  p[o] + '">';
			}
			return s;
		};
		
		var removePlayerIE = function( o ) {
			if ( !o ) {
				return;
			}
			for (var i in o) {
				if (typeof o[i] === "function") {
					o[i] = null;
				}
			}
			o.remove();
		};
		
		var removePlayer = function( e ) {
			var o = $(e.target);
			if ( !o ) {
				return;
			}
			if ( $.browser.msie ) {
				o.hide();
				(function(){
					if (o.readyState == 4) {
						removePlayerIE( o );
					}
					else {
						setTimeout(arguments.callee, 10);
					}
				})();
			}
			else {
				o.remove();
			}
		};
		
		var embedFlash = function(t, f, w, h, p, fo) {
			var i = 'media' + (num++), ch = (settings.swf === $.fn.addPlayer.defaults.swf)? 24 : 0;
			t.addClass('flplayer').css({
				width: w,
				height: h + ch
			});
			var fv = 
				'netstreambasepath=' + encodeURIComponent(window.location.href.split('\#')[0]) + 
				'&id=' + i + 
				'&file=' + encodeURIComponent(f) + 
				'&image=' + encodeURIComponent(p) + 
				((fo && fo.length)? ('&folder=' + encodeURIComponent(fo)) : '') + 
				'&autostart=' + settings.auto + 
				'&loop=' + settings.loop +
				'&screencolor=' + encodeURIComponent(settings.bgcolor) + 
				'&controlbar.position=bottom';
				
			var html = '<object id="' + i + '" name="' + i + '" width="100%" height="100%" bgcolor="' + settings.bgcolor + '" tabindex="0" ';
			
			if ( $.browser.msie ) {
				html += 'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">';
				html += addParam({ 
					movie: res + settings.swf 
				});
			} else {
				html += 'type="application/x-shockwave-flash" data="' + res + settings.swf + '">';
			}
			html += addParam({
				allowfullscreen: true, 
				allowscriptaccess: 'always',
				seamlesstabbing: true,
				wmode: 'opaque',
				flashvars: fv
			});
			var el = $(html).appendTo(t);
			return el;
		};
		
		var embed = function(t, f, w, h) {
			var i = 'em' + (num++);
			t.addClass('emplayer');
			return $('<embed class="otherplayer" id="' + i + 
				'" src="' + f + 
				'" autostart="' + settings.auto +
				'" loop="' + settings.loop +
				'" width="' + w +
				'" height="' + h + '">').appendTo(t);
		};
		
		var embedHtml5 = function(t, f, w, h, p, a) {
			a = a !== UNDEF && a;
			if ( (a  && !Modernizr.audio) || (!a && !Modernizr.video) ) {
				return embed(t, f, w, h);
			}
			t.addClass('h5player').css({			
				width: w,
				height: h + ch
			});
			var i = 'ht' + (num++), ch = 30, el;
			el = $( (a? '<audio>' : '<video>'), {
				id: i,
				src: f,
				width: w,
				height: h,
				controls: true, 
				preload: 'auto',
				poster: p,
				autoplay: settings.auto,
				loop: settings.loop
			}).appendTo(t);
			if ( $.isFunction(settings.complete) ) {
				el.on('ended', settings.complete);
			}
			return el;
		};
		
		var embedQt = function(t, f, w, h) {
			var i = 'qt' + (num++), ch = 16, el;
			t.addClass('qtplayer').css({
				width: w,
				height: h + ch
			});
			var html = '<object id="' + i + '" width="' + w + '" height="' + (h + ch) + '" ' +
				($.browser.msie?
					'classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0">'
					:
					'type="video/quicktime" data="' + f + '">');
			html += addParam({
				src: f,
				autoplay: settings.auto,
				scale: settings.fit? 'tofit':'1',
				enablejavascript: true,
				postdomevents: true
			});
			el = $(html).appendTo(t);
			if ( $.isFunction(settings.complete) ) {
				el.on('qt_ended', settings.complete);
			}
			return el;
		};
		
		var embedWm = function(t, f, w, h) {
			var i = 'wm' + (num++), ch = 64;
			t.addClass('wmplayer').css({ 
				width: w,
				height: h + ch
			});
			var html = '<object id="' + i + '" width="' + w + '" height="' + (h + ch) + '" ' +
				($.browser.msie? 
					'classid="CLSID:6BF52A52-394A-11D3-B153-00C04F79FAA6">'
					:
					'type="application/x-ms-wmp" data="' + f + '">');
			html += addParam({
				URL: f,
				SendPlayStateChangeEvents: true,
				AutoStart: settings.auto,
				StretchToFit: settings.fit
			});
			if ( !$.browser.msie ) {
				html += '<a></a>';
			}
			el = $(html).appendTo(t);
			if ( $.isFunction(settings.complete) ) {
				el.on('playStateChange', function(e) {
					settings.complete.call(this);
				});
			}
			return el;
		};
			
		return this.each(function() {
			var t = $(this), e = null;
			t.readData(settings, 'file,folder,width,height,poster');
			if ( !settings.file ) {
				return;
			}
			switch ( getType(settings.file) ) {
				case 'flashVideo':
					if ( !$.support.flash ) {
						t.append(settings.flashInstall);
						break;
					}
				case 'video':
					if ( $.support.flash ) {
						e = embedFlash( t, settings.file, settings.width, settings.height, settings.poster );
						break;
					}
				case 'html5Video':
					e = embedHtml5( t, settings.file, settings.width, settings.height, settings.poster );
					break;
				case 'qtVideo':
					e = embedQt( t, settings.file, settings.width, settings.height );
					break;
				case 'wmVideo':
					e = embedWm( t, settings.file, settings.width, settings.height );
					break;
				case 'audio':
					if ( $.support.flash ) {
						e = embedFlash( t, settings.file, settings.width, settings.height, settings.poster, settings.folder );
						break;
					}
				case 'html5audio':
					e = embedHtml5( t, settings.file, settings.width, settings.height, settings.poster, true );
					break;
				default:
					e = embed( t, settings.file, settings.width, settings.height );
			}
			e.on('destroy', removePlayer);					
		});
	};
	
	$.fn.addPlayer.defaults = {
		complete: null, // function(e) { log('complete event on '+e.target.nodeName+'['+e.target.id+']'); },
		swf: 'player.swf',
		width: 640,
		height: 480,
		bgcolor: '#000000',
		auto: false,
		loop: false,
		fit: true,
		poster: '',
		folder: '',
		flashInstall: '<a href="http://get.adobe.com/flashplayer/">Get Adobe Flash Player!</a>'
	};

	// centerThis :: centers an image and fits optionally into its containing element 
	
	$.fn.centerThis = function( settings ) {
		
		settings = $.extend({}, $.fn.centerThis.defaults, settings);
				
		return this.each(function() {
						
			var c = $(this),
				el = c.find(settings.selector);
				
			if ( !el.length ) {
				return;
			}
			
			var	cw, ch, tw, th, tl, tt, ow, oh,
				ml = settings.marginLeft + settings.padding,
				mr = settings.marginRight + settings.padding,
				mt = settings.marginTop + settings.padding,
				mb = settings.marginBottom + settings.padding;
			
			// original dimensions
			ow = el.data('ow');
			oh = el.data('oh');
			if ( !ow || !oh ) {
				ow = el.width();
				oh = el.height();
			}

			// border width
			bw = el.data('bw');
			if ( !bw ) {
				el.data( 'bw', bw = parseInt(el.css('border-top-width')) || 0 );
			}
			
			// target boundaries
			cw = (c.width() || $('body').width()) - 2 * bw - ml - mr;
			ch = (c.height() || $('body').height()) - 2 * bw - mt - mb;
			
			// target dimensions
			if ( el[0].nodeName === 'IMG' && settings.fit && (ow > cw || oh > ch || settings.enlarge) ) {
				var r = Math.min(cw / ow, ch / oh);
				tw = Math.round(ow * r),
				th = Math.round(oh * r);
			} else {
				tw = ow;
				th = oh;
			}
			tl = Math.round((cw - tw) / 2) + ml;
			tt = Math.round((ch - th) / 2) + mt;
			
			if ( !settings.animate ) {
				
				// simply set the position and size
				el.css({
					left: tl,
					top: tt,
					width: tw,
					height: th
				});
				
				if ( $.isFunction(settings.complete) ) { 
					settings.complete.call(this);
				}
				
			} else {
				
				el.stop(true, false);
				
				// set prescale dimensions
				if ( settings.preScale && settings.preScale !== 1.0 ) {
					var sw = tw * settings.preScale,
						sh = th * settings.preScale;
					el.css({
						left: Math.round((cw - sw) / 2) + ml,
						top: Math.round((ch - sh) / 2) + mt,
						width: Math.round(sw),
						height: Math.round(sh)
					});
				} else if ( settings.init ) {
					el.css({
						left: tl,
						top: tt
					});
				}
				
				// animating attributes
				el.animate({
					left: tl,
					top: tt,
					width: tw,
					height: th
				}, { 
					duration: settings.speed, 
					easing: settings.effect, 
					complete: settings.complete 
				});
			}
		});
	};
	
	$.fn.centerThis.defaults = {
		selector: '.main',
		speed: 500,
		fit: true,
		enlarge: true,
		marginTop: 0,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		padding: 0,
		init: false,
		animate: false,
		effect: 'swing',
		complete: null
		// complete: function() { log('final: left='+$(this).css('left')+' top='+$(this).css('top')); }
	};
	
	// setupShop :: setting up the shopping cart
	
	$.fn.setupShop = function(settings) {

		settings = $.extend( {}, $.fn.setupShop.defaults, settings );
		var i, f, k, s;
		
		$.fn.addInput = function( n, v, t, a ) {
			var i;
			if ( !v || !n ) {
				return this;
			}
			
			return this.each(function() {
				i = $('<input>', { type: (t || 'text') }).appendTo($(this));
				if ( n ) { 
					i.attr('name', n); 
					i.addClass(n); 
				}
				if ( v ) {
					i.val(v);
				}
				if ( a ) {
					i.prop(a, a);
				}
			});
		};
		
		$.fn.addSelect = function( o, currency, changeFn ) {
			
			if ( !o.length ) {
				return this;
			}
			
			return this.each(function() {
				var t = $(this);
				var e = $('<select>').appendTo(t);
				
				for ( i = 0; i < o.length; i++ ) {
					e.append($('<option>', {
						val: o[i].val,
						text: o[i].key + ' (' + currency + ' ' + o[i].val + ')'
					}));
				}
				
				if ( $.isFunction( changeFn ) ) {
					e.change( changeFn );
				}
			});
		};
		
		var readOptions = function(s) {
			var v = s.split('::'), k;
			var o = new Array();
			
			for ( i = 0; i < v.length; i++ ) {
				k = v[i].split('=');
				if ( k.length > 1 ) {
					o.push( { key: k[0], val: k[1] } );
				}
			}
			
			return o;
		};
		
		return this.each(function() {
			var t = $(this), f, fs, fv;
			
			t.readData(settings, 'gateway,id,currency,handling,options,file');
			
			if ( settings.id == null || settings.options == null || settings.file == null ) {
				return;
			}
			
			id = ( settings.gateway == 'paypal' )? {
				'form': 	'paypal',
				'seller': 	'business',
				'currency':	'currency_code',
				'title': 	'item_name',
				'select': 	'item_number',
				'price': 	'amount',
				'copies': 	'add',
				'shipprice':'shipping',
				'handling':	'handling_cart',
				'shopUrl':	'shopping_url'
			} : {
				'form':		'google_checkout',
				'currency':	'item_currency_1',
				'title':	'item_name_1',
				'select':	'item_description_1',
				'price':	'item_price_1',
				'copies':	'item_quantity_1',
				'shipmethod': 	'ship_method_name_1',
				'shipprice':	'ship_method_price_1',
				'shipcurrency': 'ship_method_currency_1'
			};
			
			var o = readOptions( settings.options );
			settings.id = settings.id.replace('|','@');
			
			var changed = function( e ) {
				var s = f.length? f.children('select').eq(0) : false ;
				if ( s && s.length ) {
					var el, a = s.val().split('+');
					q = f.children('[name=copies]').val() || 1;
					if ( el = f.children('[name=total]') ) {
						el.val( (a[0] * q).toFixed(2) );
					}
					if ( el = fs.children('[name='+id.price+']') ) {
						el.val( a[0] );
					}
					if ( el = fs.children('[name='+id.copies+']') ) {
						el.val( q );
					}
					if ( el = fs.children('[name='+id.shipprice+']') ) {
						el.val( (a.length > 1)? a[1] : 0 );
					}
					if ( el = fs.children('[name='+id.select+']') ) {
						el.val( f.find('option:selected').text() );
					}
				}
			};
			
			f = $('<form>', {
					name: 'shopping',
					method: 'post'
				}).appendTo(t);
			
			f.addSelect(o, settings.currency, changed);
			f.append('x').addInput('copies', 1);
			f.append('=').addInput('total', o[0].val.split('+')[0], 'text', 'readonly');
			f.children('[name=copies]').css({ width: '3em' }).change(changed);
			f.children('[name=total]').css({ width: '5em' });
			f.append(settings.currency);
			
			if ( settings.gateway === 'paypal' ) {
				
				var a = o[0].val.split('+');
				fs = $('<form>', {
					name: id.form,
					target: settings.target,
					action: 'https://www.paypal.com/cgi-bin/webscr/',
					method: 'post'
				}).appendTo(t);
				
				fs.addInput('cmd', '_cart', 'hidden');
				fs.addInput(id.copies, 1, 'hidden');
				fs.addInput(id.seller, settings.id, 'hidden');
				fs.addInput(id.price, a[0], 'hidden');
				fs.addInput(id.currency, settings.currency, 'hidden');
				fs.addInput(id.shipprice, (a[1] && $.isNumeric(a[1]))? a[1] : 0, 'hidden');
				if ( settings.handling != null && $.isNumeric(settings.handling) ) {
					fs.addInput(id.handling, settings.handling, 'hidden');
				}
				fs.addInput(id.title, settings.file, 'hidden');
				fs.addInput(id.select, o[0].key, 'hidden');
				fs.addInput(id.shopUrl, window.location.href, 'hidden');
				fs.addInput('charset', 'utf-8', 'hidden');
				fs.addInput('lc', settings.locale, 'hidden');
				
				fs.append($('<input>', {
					id: 'shopAdd',
					type: 'image',
					name: 'submit',
					src: 'https://www.paypal.com/en_US/i/btn/btn_cart_SM.gif',
					alt: 'Add to Cart'
				}));
			
				fv = $('<form>', {
					'class': 'view',
					name: 'paypalview',
					target: settings.target,
					action: 'https://www.paypal.com/cgi-bin/webscr/',
					method: 'post'
				}).appendTo(t);
				fv.addInput('cmd', '_cart', 'hidden');
				fv.addInput('display', 1, 'hidden');
				fv.addInput(id.seller, settings.id, 'hidden');
				fv.addInput('lc', settings.locale, 'hidden');
				fv.append($('<input>', {
					id: 'shopView',
					type: 'image',
					name: 'submit',
					src: 'https://www.paypal.com/en_US/i/btn/btn_viewcart_SM.gif',
					alt: 'View Cart'
				}));
				
			} else if ( settings.gateway === 'google' ) {
				var merchant = settings.id.match(/(\d+)/)[0];
				fs = $('<form>', {
					name: id.form,
					target: settings.target,
					action: 'https://checkout.google.com/cws/v2/Merchant/' + merchant + '/checkoutForm',
					//action: 'https://sandbox.google.com/checkout/cws/v2/Merchant/' + merchant + '/checkoutForm', // sandbox
					method: 'post',
					'accept-charset': 'utf-8'
				}).appendTo(t);
				
				fs.addInput(id.title, settings.file, 'hidden');
				fs.addInput(id.select, o[0].key, 'hidden');
				fs.addInput(id.copies, 1, 'hidden');
				fs.addInput(id.price, o[0].val.split('+')[0], 'hidden');
				fs.addInput(id.currency, settings.currency, 'hidden');
				if ( settings.shipping != null && $.isNumeric(settings.shipping) ) {
					fs.addInput(id.shipmethod, 'normal', 'hidden');
					fs.addInput(id.shipprice, settings.shipping, 'hidden');
					fs.addInput(id.shipcurrency, settings.currency, 'hidden');
				}
				fs.addInput('_charset_', '', 'hidden');

				fs.append($('<input>', {
					id: 'shopAdd',
					type: 'image',
					name: 'Google Checkout',
					alt: 'Fast checkout through Google',
					src: 'http://checkout.google.com/buttons/checkout.gif?merchant_id=' + merchant + '&w=160&h=43&style=trans&variant=text&loc=en_US',
					//src:'http://sandbox.google.com/checkout/buttons/checkout.gif?merchant_id=' + merchant + '&w=160&h=43&style=trans&variant=text&loc=en_US', // sandbox
					height: 43,
					width: 160
				}));
			}
			
			fs.add(fv).find('input[name=submit]').on( 'submit', function() {
				window.open('', settings.target, 'width=960,height=600,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,directories=no,status=no,copyhistory=no');
				return true;
			});
				
		});
	};
	
	$.fn.setupShop.defaults = {
		target: 'ShoppingCart',
		currency: 'EUR',
		gateway: 'paypal',
		locale: 'US'
	};

	// getLatLng :: returns google.maps position from formatted string "lat,lon" or Array(lat, lon)
	
	var getLatLng = function( p ) { 
		if ( p == null ) 
			return null;
		if ( typeof p === 'string' ) {
			p = /^(-?[\d.]+),\s?(-?[\d.]+)$/.exec(p);
			return new google.maps.LatLng(p[1], p[2]);
		}
		return new google.maps.LatLng(p[0], p[1]);
	};
	
	// setupMap :: preprocessing Google Maps map
	
	$.fn.setupMap = function( settings ) {
		
		if ( !(google && google.maps) ) 
			return this;
		
		settings = $.extend( {}, $.fn.setupMap.defaults, settings );
				
		var markerCurr = (settings.markerPath == null) ? {} : {
			icon: 	new google.maps.MarkerImage(settings.markerPath, new google.maps.Size(17,24), new google.maps.Point(0,0), new google.maps.Point(8,24)),
			shadow:	new google.maps.MarkerImage(settings.markerPath, new google.maps.Size(28,24), new google.maps.Point(17,0), new google.maps.Point(8,24)),
			zIndex:	9999
		};
		var markerEtc = (settings.markerPath == null) ? {} : {
			icon: 	new google.maps.MarkerImage(settings.markerPath, new google.maps.Size(17,21), new google.maps.Point(45,3), new google.maps.Point(8,24)),
			shadow:	new google.maps.MarkerImage(settings.markerPath, new google.maps.Size(28,21), new google.maps.Point(62,3), new google.maps.Point(8,24))
		};
		
		return this.each(function() {
			var t = $(this), ll, label, map, tmp, to;
			
			t.readData( settings, "type,zoom,map,label,resPath,markers" );
			
			var adjust = function() {
				if ( t.is(':visible') && t.width() && t.height() && t.data('fresh') ) { 
					t.width(t.parents('.cont').width() - 30);
					google.maps.event.trigger( map, 'resize' );
					map.setCenter( ll );
					t.data('fresh', false);
				}
			};
			
			if ( tmp && tmp.length ) {
				tmp.remove();
			}
			tmp = $('<div>').css({ 
				position: 'absolute', 
				top: '-9000px', 
				width: t.width(), 
				height: t.height() 
			}).appendTo('body');
			
			t.data('fresh', true).on({
				adjust: adjust,
				destroy: function() {
					// No remove function with Google Maps?
					map.getParentNode().removeChild(map);
					$(window).unbind('resize', adjust);
				}
			});
			
			if ( settings.markers && settings.markers.length && settings.curr != null ) {
				ll = settings.markers[settings.curr].map;
			} else if ( settings.map ) {
				ll = getLatLng(settings.map);
				label = settings.label;
			} else { 
				return;
			}
			
			// Leaving 20ms to get the DOM ready before adding the Map
			
			setTimeout( function() {
				
				var m0 = new google.maps.Map(
					tmp[0], 
					{
						zoom: settings.zoom, 
						center: ll, 
						mapTypeId: settings.type.toLowerCase() 
					}
				);				
				
				google.maps.event.addListener(m0, 'maptypeid_changed', function() { 
					$.fn.setupMap.defaults.type = m0.getMapTypeId(); 
				});
				
				google.maps.event.addListener(m0, 'zoom_changed', function() { 
					$.fn.setupMap.defaults.zoom = m0.getZoom(); 
				});
				
				if ( settings.markers && settings.markers.length > 1 ) {
					var m, mo, mk, mx = Math.min(settings.curr + settings.range, settings.markers.length);
					
					for (var i = Math.max(settings.curr - settings.range, 0); i < mx; i++) {
						mk = settings.markers[i];
						mo = { 
							position: mk.map, 
							map: m0, 
							title: mk.label,
							zIndex: i
						};
			
						if (i == settings.curr) {
							m = new google.maps.Marker( $.extend(mo, markerCurr) );
						} else {
							m = new google.maps.Marker( $.extend(mo, markerEtc) );
							if ( jQuery.isFunction(settings.click) && mk.link ) {
								m.link = mk.link;
								google.maps.event.addListener(m, 'click', function() { 
									settings.click.call(this); 
								});
							}
						}
					}
				} else {
					var m = new google.maps.Marker( $.extend({
							position: ll, 
							map: m0, 
							title: label
						}, markerCurr ) 
					);
				}
				
				tmp.css({ top: 0 }).appendTo(t);
				
				map = m0;
				
			}, 20 ); 
			
			$(window).resize(function() {
				clearTimeout(to); 
				t.data('fresh', true);
				to = setTimeout(adjust, 100);
			});
		});
	};
	
	$.fn.setupMap.defaults = {
		type: 'roadmap',		// 'roadmap', 'Satellite', 'Hybrid', 'Terrain'
		zoom: 16,				// 0 .. 20
		range: 30				// restricting the number of markers :: 30 means display markers from curr - 30 to curr + 30
		// markerPath: :: path to custom marker graphics folder
		// markers :: array of markers to display
		// curr :: current marker (center map here)
		// click :: function to be called upon marker click
	};
	
	// markNewFolders :: marking the folders containing new pictures
	
	$.fn.markFoldersNew = function( settings ) {
		
		settings = $.extend( {}, $.fn.markFoldersNew.defaults, settings );
		
		if ( !settings.markNewDays )
			return;
		
		var today = Math.round((new Date()).getTime() / 86400000);
		
		return this.each(function() {
			if ( (today - parseInt($(this).data('modified') || 0)) <= settings.markNewDays ) {
				$(this).after( settings.newLabel );
			}
		});
	};
			
	$.fn.markFoldersNew.defaults = {
		markNewDays: 7,		// day count :: 0 = no mark
		newLabel: 'NEW'
	};

	
	// turtleHelp :: sets up help for button and keyboard's F1 key
	
	$.fn.turtleHelp = function( settings, text ) {
		
		settings = $.extend( {}, $.fn.turtleHelp.defaults, settings );
		text = $.extend( {}, $.fn.turtleHelp.texts, text );
		
		var helpWindow = $(settings.templ.template(text.help));
		
		var showHelp = function() {
			helpWindow.alertBox({
				width: 680
			});
		};
		
		if ( settings.useF1 && !$.support.touch ) {
			$(document).keydown(function(e) {
				if ( document.activeElement && document.activeElement.nodeName === 'INPUT' || 
					( $.isFunction(settings.enableKeyboard) && !settings.enableKeyboard()) || 
					$('#modal:visible').length ) 
					return true;
				var k = e? e.keyCode : window.event.keyCode;
				if ( k === 112 ) {
					showHelp();
					return false;
				}
				return true;
			});
		}
		
		return this.each(function() {
			$(this).click(function() {
				showHelp();
				return false;
			});			
		});	
	};
	
	$.fn.turtleHelp.defaults = {
		useF1: true
	};
	
	$.fn.turtleHelp.texts = {
		help: [
			'Using Turtle gallery',
			'Top <b>navigation</b> bar with <b>Home</b> button',
			'<b>Up</b> one level <em>Up arrow</em>',
			'Author or company <b>information</b>',
			'<b>Share</b> and <b>Like</b> buttons for social networking',
			'<b>Search</b> button',
			'Start slideshow <em>Numpad *</em>',
			'Previous image <em>Left arrow</em>', 
			'Back to index page <em>Esc</em>', 
			'Toggle zoom (fit/1:1) <em>Numpad +</em>',
			'Toggle info window <em>Numpad -</em>',
			'Toggle thumbnail scoller',
			'Start / Stop slideshow <em>Numpad *</em>', 
			'Next image <em>Right arrow</em>',
			'Swipe for previous / next image'
		]
	};
	
	
	/* *******************************************************
	*
	*	             Turtle gallery main
	*
	******************************************************** */
	
	$.fn.turtleGallery = function( settings, text, id ) {
		
		settings = $.extend( {}, $.fn.turtleGallery.defaults, settings );
		text = $.extend( {}, $.fn.turtleGallery.texts, text );
		id = $.extend( {}, $.fn.turtleGallery.ids, id );
		
		if ( !settings.licensee && location.protocol.startsWith('http') && !cookie('ls') ) {
			var logo = settings.resPath + '/logo.png';
			setTimeout(function() {
				img = $(new Image());
				img.load(function() {
					var p = $('<div>').css({ background: 'url(' + logo + ') 10px top no-repeat', textAlign: 'left', minHeight: '60px', paddingLeft: '90px' });
					p.html('<h3>Turtle skin<h3></h3><p>Unlicensed</p>');
					p.popupBox();
					cookie('ls', true);
				}).attr('src', logo);
			}, 1000); 
		}
		
		// Settings to retain between sessions
		var sn = [ 'thumbsOn', 'infoOn', 'metaOn', 'mapOn', 'shopOn', 'shareOn', 'printOn', 'fitImage' ];
		
		// Saving one key into the settings object and as cookie
		var saveSetting = function( n, s ) {
			if ( !location.protocol.startsWith('file') ) {
				cookie(n, s);
			}
			settings[n] = s;
		};
		
		// Loading one key
		var loadSetting = function( n ) {
			var c = cookie(n);
			return (c)? (c === 'true') : settings[n];
		};
		
		// Loading all the settings to retain from cookies
		for ( var c, i = 0; i < sn.length; i++) { 
			if ( c = cookie(sn[i]) ) {
				settings[sn[i]] = c;
			}
		}
				
		if ( $.support.touch ) {
			settings.preScale = false;
		}
		
		// Setting up default view for the map
		$.fn.setupMap.defaults.zoom = settings.mapZoom;
		$.fn.setupMap.defaults.type = settings.mapType;
		$.fn.setupMap.defaults.markerPath = settings.markerPath;
		
		// Setting up addShop defaults
		$.fn.setupShop.defaults.gateway = settings.shopGateway;
		$.fn.setupShop.defaults.id = settings.shopId;
		$.fn.setupShop.defaults.currency = settings.shopCurrency;
		$.fn.setupShop.defaults.handling = settings.shopHandling;
		$.fn.setupShop.defaults.locale = settings.shopLocale;
		
		// Setting up addPlayer defaults
		$.fn.addPlayer.defaults.bgcolor = $('body').css('background-color').rgb2hex(),
		$.fn.addPlayer.defaults.fit = settings.videoFit,
		$.fn.addPlayer.defaults.auto = settings.videoAuto,
		
		// Setting up image fitting and centering options
		$.fn.centerThis.defaults.fit = settings.fitImage;
		$.fn.centerThis.defaults.animate = settings.transitions;
		$.fn.centerThis.defaults.padding = settings.fitPadding;
		$.fn.centerThis.defaults.enlarge = !settings.fitShrinkonly;
		$.fn.centerThis.defaults.selector = '.' + id.main;
		
		// Setting up share options
		for ( var i in settings.shares ) {
			$.fn.shareIt.defaults[i] = settings.shares[i];
		}
		$.fn.shareIt.defaults.callTxt = text.checkOutThis;
		
		var getLabel = function( el ) {
			var l = el.data(id.caption);
			if ( l ) {
				return l.stripHTML();
			} else {
				el = el.closest('a');
				return el? el.attr('href').replace(new RegExp('^' + settings.slides + '\\/'), '') : '';
			}
		};
		
		var newLabel = '<span class="' + id.newItem + '">' + text.newItem + '</span>';
		var today = Math.round((new Date()).getTime() / 86400000);
		
		return this.each( function() {
			var images = $(this).find('li > a'); 						// all the images as passed to turtleGallery
			var gallery, wait, navigation, controls, bottom;		// Structural elements
			var ctrl = {};											// Controls
			var scrollbox, scrollthmb, thumbs;						// Thumbnail scroller box
			var smo, cmo, cto;										// Scroll and Control layer over state and timeout
			var cimg = null, pimg = null; 							// Current and Previous image layer
			var curr = 0; 											// current image
			var to, rto; 											// timeout for slideshow and window resize
			var rlw = $(window).width(), rlh = $(window).height(); 	// last window sizes
			var markers = new Array();								// all GPS markers
			
			// Keyboard handler
			
			var keyhandler = function(e) {
				if ( document.activeElement && document.activeElement.nodeName === 'INPUT' || 
					( $.isFunction(settings.enableKeyboard) && !settings.enableKeyboard()) || 
					$('#modal:visible').length ) 
					return true;
				var k = e? e.keyCode : window.event.keyCode;
				if ( gallery.is(':visible') ) {
					switch( k ) {
						case 106: case 179: if (to) stopAuto(); else startAuto(); break;
						case 109: togglePanels(); break;
						case 107: zoomToggle(); break;
						case 27: backToIndex(); break; 
						case 103: case 36: showImg(0); break;
						case 37: previousImg(); break;
						case 39: nextImg(); break;
						case 97: case 35: showImg(images.length - 1); break;
						default: return true;
					}
				} else {
					switch(k) {
						case 13: case 10: showImg(); break;
						case 103: case 36: curr = 0; setActive(); break;
						case 37: curr = (curr? curr : images.length) - 1; setActive(); break;
						case 39: curr = (curr + 1) % images.length; setActive();  break;
						case 97: case 35: curr = images.length - 1; setActive(); break;
						default: return true;
					}
				}
				return false;
			};
			
			// Going up one level
			
			var goUp = function() {
				window.location.href = settings.uplink || '../';
			};
			
			// Hiding gallery
			
			var backToIndex = function() {
				var i = $('[role=main]');
				if ( gallery.is(':visible') ) {
					stopAuto();
					if ( settings.skipIndex ) {
						goUp();
					} else {
						if ( i.length && i.is(':hidden') ) {
							i.children().andSelf().css( { 
								visibility: 'visible', 
								display: 'block' 
							} );
							i.find('.folders>ul>li').equalHeight();
							if ( i.find('.thumbs>ul>li p').length ) {
								i.find('.thumbs>ul>li').equalHeight();
							}
							i.find('[role=scroll]').trigger('adjust');
						}
						
						if ( settings.transitions ) {
							gallery.fadeOut(settings.speed);
						} else {
							gallery.hide();
						}
						
						if ( settings.hash !== 'no' ) {
							$.history.load('');
						}
					}
				}
				i.find('[role=scroll]').data('dragOn', false);
			};
						
			// Getting an image number based on its name or a jQuery element
			
			var getImg = function( n ) {
				var i;
				if ( n == null ) {
					i = curr;
				} else if ( typeof n === 'number' ) {
					i = Math.minMax(0, n, images.length);
				} else if ( (i = images.index(n)) < 0 ) {
					i = thumbs.index(n);
				}
				return i;
			};
			
			// Find image by number
			
			var findImg = function( n ) {
				var i, s;
				for ( i = 0; i < images.length; i++ ) {
					s = images.eq( i ).attr('href');
					if ( s && s.substring(s.lastIndexOf('/') + 1) === n ) {
						return( i );
					}
				}
				return -1;
			};
			
			// Get the current filename
			
			var getCurrFile = function() {
				var p = images.eq(curr).attr('href');
				return p && p.substr(p.lastIndexOf('/') + 1);
			}
			
			// Setting active image on both the thumb scroller and the source 
			
			var setActive = function() {
				images.filter('.' + id.active).removeClass(id.active);
				images.eq(curr).addClass(id.active);
				thumbs.eq(curr).trigger('setactive');
			};
			
			// Previous image
			
			var previousImg = function() {
				stopAuto();
				if ( curr ) {
					showImg(curr - 1);
				}
				else if ( settings.afterLast === 'startover' ) {
					showImg(images.length - 1);
				}
				else {
					cimg.find('img.' + id.main).trigger('dragcancel');
				}
			};
			
			// Next image
			
			var nextImg = function() {
				if ( curr < images.length - 1 ) {
					reLoop();
					showImg(curr + 1);
					return;
				} else {
					if ( settings.afterLast === 'startover' || to && settings.slideshowLoop ) {
						reLoop();
						showImg(0);
						return;
					} else if ( settings.afterLast === 'onelevelup' ) {
						if ( settings.uplink ) {
							goUp();
							return;
						}
					} else if ( settings.afterLast === 'backtoindex' ) {
						if ( !settings.skipIndex ) {
							backToIndex();
							return;
						}
					} else if ( settings.afterLast === 'ask' ) {
						stopAuto();
						var buttons = new Array({ 	// Start over 
								t: text.startOver,
								h: function() { 
									showImg(0); 
								}
							}
						);
						if ( settings.uplink ) {
							buttons.push({	// Up one level
								t: (settings.level > 0)? text.upOneLevel : text.backToHome, 
								h: function() { 
									goUp(); 
								}
							});
						}
						if ( !settings.skipIndex ) {
							buttons.push( {	// Back to thumbnails
								t: text.backToIndex, 
								h: function() { 
									backToIndex(); 
								}
							});
						}
						$('<h4>' + text.atLastPage + '</h4><p>' + text.atLastPageQuestion + '</p>').alertBox(buttons);
					}
					cimg.find('img.' + id.main).trigger('dragcancel');
				}
			};

			// Restarts counting down for the next image in slideshow mode
			
			var reLoop = function() {
				if ( to ) {
					clearInterval(to);
					to = setInterval(nextImg, settings.slideshowDelay);
				}
			};
			
			// Starts slideshow mode
			
			var startAuto = function() {
				ctrl.play.hide();
				ctrl.pause.showin();
				to = setInterval(nextImg, settings.slideshowDelay);
			};
			
			// Stops slideshow mode
			
			var stopAuto = function() {
				ctrl.pause.hide();
				ctrl.play.showin();
				to = clearInterval(to);
			};
			
			// Showing controls
			
			var showCtrl = function() {
				if ( cmo ) {
					return;
				}
				
				controls.stop(true,false).css({opacity: 0.7}).fadeIn(500, function() {
					if ( $.support.cssFilter ) {
						controls.css('filter', '');
					}
				});
				cto = setTimeout(function(){ 
					fadeCtrl();
				}, 3000);
			};
			
			// Fading controls
			
			var fadeCtrl = function() {
				if ( cmo ) { 
					cto = setTimeout(function(){ 
						fadeCtrl();
					}, 1000);
				} else {
					cto = clearTimeout(cto);
					controls.fadeOut(1000);
				}
			};
			
			// Hiding bottom panel (info)
			
			var hideCaption = function() {
				
				if ( !settings.infoOn ) {
					return;
				}
				
				ctrl.hideInfo.hide();
				ctrl.showInfo.showin();
				
				if ( settings.transitions ) {
					bottom.animate({bottom: -bottom.outerHeight()}, 500, function() { 
						bottom.hide(); 
					});
				} else {
					bottom.css({bottom: -bottom.outerHeight()}).hide();
				}
				saveSetting('infoOn', false);
			};
			
			// Showing bottom panel
			
			var showCaption = function() {

				if ( settings.infoOn ) {
					return;
				}
				
				ctrl.showInfo.hide();
				ctrl.hideInfo.showin();
				
				if ( bottom.is(':hidden') ) {
					bottom.show().css({ bottom: -bottom.outerHeight() });
				}
				
				var ma = function() {
					bottom.children('.' + id.map).trigger('adjust');
				};
				if ( settings.transitions ) {
					bottom.animate({bottom: 0}, 500, ma);
				} else {
					bottom.show().css({bottom: 0});
					ma();
				}
				
				saveSetting('infoOn', true);
			};
			
			// Hiding scroll box
			
			var hideScrollbox = function() {
				
				if ( !settings.thumbsOn ) {
					return;
				}
				
				ctrl.hideThumbs.hide();
				ctrl.showThumbs.showin();
				
				if ( settings.transitions ) {
					navigation.animate({top: -scrollbox.outerHeight() - 10}, 500);
				} else {
					navigation.css({top: -scrollbox.outerHeight() - 10});
				}
				
				if ( cimg && settings.fitFreespace ) { 
					cimg.centerThis( {
						fit: settings.fitImage,
						marginTop: 0
					});
				}
				
				saveSetting('thumbsOn', false);
			};
			
			// Showing scroll box
			
			var showScrollbox = function() {
				
				if ( settings.thumbsOn ) {
					return;
				}
				
				ctrl.showThumbs.hide();
				ctrl.hideThumbs.showin();
				
				if ( settings.transitions ) {
					navigation.animate({top: 0}, 500);
				} else {
					navigation.css({top: 0});
				}
				
				if (cimg && settings.fitFreespace) { 
					cimg.centerThis( { 
						fit: settings.fitImage,
						marginTop: scrollbox.outerHeight()
					});
				}
				
				saveSetting('thumbsOn', true);
			};
			
			// Toggling panels
			
			var togglePanels = function() {
				if ( settings.infoOn || settings.thumbsOn ) {
					hideCaption();
					hideScrollbox();
				} else {
					showCaption();
					showScrollbox();
				}
			};
			
			// Scroll box height to calculate the free space for fitting the main image
			
			var scrollboxHeight = function() {
				return (settings.fitFreespace && navigation.position().top >= 0)? (scrollbox.outerHeight() || 0) : 0;
			};
			
			// Realigning the main picture to fit and center the free space
			
			var recenter = function() {
				if (cimg) { 
					cimg.centerThis( { 
						fit: settings.fitImage,
						marginTop: scrollboxHeight()
					});
				}
			};
			
			// Handling zoom
			
			var zoomToggle = function() {
				if ( settings.fitImage ) {
					zoomReset();
				} else {
					zoomFit();
				}
			};
			
			var zoomReset = function() {
				ctrl.noresize.hide();
				ctrl.resize.showin();
				cimg.centerThis( {
					fit: false, 
					marginTop: scrollboxHeight()
				});
				
				saveSetting('fitImage', false);
			};
			
			var zoomFit = function() {
				ctrl.resize.hide();
				ctrl.noresize.showin();
				cimg.centerThis( { 
					fit: true, 
					marginTop: scrollboxHeight()
				});

				saveSetting('fitImage', true);
			};
			
			// Preloading the next picture
			
			var preload = function( n ) {
				if ( n < 0 || n >= images.length) {
					return;
				}
				var i = images.eq(n).children('img').eq(0);
				if ( !i.data(id.isvideo) && !i.data(id.isother) && !i.data('cached') && (s = i.data(id.src)) ) {
					$('<img>').load(function() {
						i.data('cached', true);
					}).attr({src: s});
				}
			};
			
			var cleanupImg = function( el ) {
				el.trigger('destroy');
				el.find('.' + id.share + '-' + id.icon).trigger('destroy');
				el.find('.' + id.map).trigger('destroy');
			};
			
			var showImg = function( n ) {	
				
				if ( gallery.is(':hidden') ) {
					if ( settings.transitions ) {
						gallery.fadeIn(settings.speed);
					} else {
						gallery.show();
					}
				}
				
				n = getImg( n );
				
				if ( n === curr && cimg ) {
					return;
				}
				
				var e, im = images.eq( n ), src, img;
				im = im.children('img').eq(0);
				
				if ( !im.length ) {
					return;
				}
				
				if ( cimg ) {
					if ( pimg && pimg.length ) {
						pimg.stop();
						cleanupImg(pimg);
						pimg.remove();
					}
					pimg = cimg;
					pimg.css( {zIndex: 0} );
					pimg.find('.' + id.main).trigger('unswipe').off('touchstart');
					pimg.unmousewheel();
				}
				
				if ( (e = gallery.children('.' + id.img).not(cimg)).length ) {
					e.stop().remove();
				}
				
				var w, h;
				
				cimg = $('<div>', { 
					'class': id.img 
				}).css({
					zIndex: 1, 
					display: 'none'
				}).appendTo(gallery);

				wait.css({
					opacity: 0, 
					display: 'block'
				}).animate({
					opacity: 1
				});

				curr = n; 
				setActive();
				
				if ( im.data(id.isother) || !(src = im.data(id.src)) ) {
					img = im.clone();
					var op = $('<div>', { 
						'class': id.main + ' ' + id.other 
					});
					op.append( $('<a>', { href: im.data(id.link), target: '_blank' }) );
					op.append( $('<p>', { text: text.clickToOpen }) );
					op.children('a:first').append(img);
					imgReady( op );
					
				} else if ( im.data(id.isvideo) || im.data(id.isaudio) ) {
					var sus = to;
					
					if ( sus ) {
						stopAuto();
					}
						
					if ( im.data(id.isvideo) ) {
						var gw = gallery.width() - 40, gh = gallery.height() - 40;
						w = im.data(id.width);
						h = im.data(id.height);
						if ( w > gw || h > gh ) {
							var r = Math.min(gw / w, gh / h);
							w *= r;
							h *= r;
						}
					} else {
						w = Math.max(280, im.attr('width') || 0);
						h = Math.max(128, im.attr('height') || 0);
					}
					
					var nm = 'media' + curr;
					var mp = $('<div>', { 
						'class': id.main + ' ' + id.other
					}).css({
						width: w,
						height: h
					});
					
					var onComplete = function() {
						if ( sus ) {
							nextImg();
							startAuto();
						}
					};
					
					el = mp.addPlayer({
						complete: onComplete,
						file: im.data(id.link),
						resPath: settings.resPath,
						poster: im.attr('src'),
						auto: settings.videoAuto,
						fit: settings.videoFit,
						width: w,
						height: h
					});
					
					mp.data( 'media', el );
					imgReady( mp );
					
				} else {
					img = $(new Image());
					w = im.data(id.width), 
					h = im.data(id.height);
					img.addClass(id.main).load(function() { 
						im.data('cached', true);
						imgReady( img );
					}).attr({ 
						src: src, 
						width: w || 'auto', 
						height: h || 'auto' 
					}).data({ 
						ow: w, 
						oh: h 
					});
				}
				
				createInfo(im, n);
			};
			
			// Image is ready, attaching event listeners, and placing it
			
			var imgReady = function( o ) {
				
				if ( settings.transitions ) {
					wait.stop(true, false).animate({
						opacity: 0
					}, {
						duration: 100,
						complete: function() { 
							$(this).hide(); 
						}
					});
					
					// Stopping previous image
					
					if ( pimg ) {
						var p = pimg;
						pimg.stop(true, false).animate({ 
							opacity: 0	
						}, {
							duration: settings.speed / 2, 
							complete: function() { 
								cleanupImg(p);
								p.remove();
							}
						});
						pimg = null;
					}
				} else {
					wait.hide();
					if ( pimg ) {
						pimg.stop();
						cleanupImg(pimg);
						pimg.remove();
					}
				}
				
				var isimg = o[0] && o[0].nodeName === 'IMG';
				
				cimg.children().not('.' + id.bottom).remove();
				cimg.append(o);
				
				// Avoid right click
				
				if ( settings.rightClickProtect ) {
					o.on('contextmenu', function(e) {
						e.preventDefault();
						return false;
					});
				}
				
				// Mouse wheel -> prev / next image
				
				if ( settings.enableMouseWheel ) {
					cimg.mousewheel(function(e, d) {
						if (d > 0) { 
							previousImg(); 
						}
						else { 
							nextImg(); 
						}
						return false;
					});
				}
				
				// Actions attached to images, delayed by half transition speed
				
				setTimeout(function() {
						
					if ( $.support.touch ) {
						
						// Touch image -> control box show
						o.on('touchstart', function() { 
							showCtrl(); 
						});
					} else {
						
						// Click -> next image
						if ( isimg ) {
							o.click(function() { 
								nextImg(); 
							});
						}
					}
					
					// Swipe -> prev / next image
					o.addSwipe(function() {
						$(this).trigger('unswipe');
						nextImg();
					}, function() {
						$(this).trigger('unswipe');
						previousImg();
					});
					
				}, settings.speed / 2);
				
				if ( settings.transitions ) {
					cimg.css({ 
						opacity: 0, 
						display: 'block' 
					}).animate({ 
						opacity: 1
					}, {
						duration: settings.speed,
						complete: $.browser.cssFilter? function() { 
							cimg.css({ filter: '' });
						} : null
					}).centerThis({
						init: true,
						speed: Math.round(settings.speed * 0.75),
						marginTop: scrollboxHeight(),
						preScale: isimg && settings.preScale,
						animate: isimg && settings.preScale && settings.preScale != 1.0,
						fit: isimg && settings.fitImage
					});
				} else {
					cimg.show().centerThis({
						init: true,
						marginTop: scrollboxHeight(),
						fit: isimg && settings.fitImage
					});
				}
				
				//cimg.trackCss([ 'opacity', 'display', 'visibility' ], settings.speed + 300);
				
				preload( curr + 1 );
				preload( curr - 1 );
				
				if ( settings.hash === 'number' ) {
					$.history.load(curr + 1);
				} else if ( settings.hash === 'fileName' ) {
					var h = getCurrFile();
					if ( h ) {
						$.history.load( h );
					}
				}
			};
			
			// Creating bottom info panel
			
			var createInfo = function(im, n) {
				bottom = $('<div>', { 'class': id.bottom });
				
				// Appending to current image layer
				cimg.append( bottom );
				
				var c = $('<div>', { 'class': id.cont }).appendTo(bottom),
					m = $('<nav>').appendTo(c),
					d, h, tw = Math.round(cimg.width() * 0.8) - 30;
				
				if ( c.width() > tw ) {
					c.width( tw );
				}
				
				if ( settings.showImageNumbers ) {
					c.append('<div class="nr"><strong>' + (n + 1) + '</strong> / ' + images.length + '</div>');
				}
				
				// Adding caption
				if ( d = im.data(id.caption) ) {
					c.append(d);
				}
				
				// Creating panels
				var a, e, t, panel = [ id.meta, id.map, id.shop, id.share, id.print, id.comment ];

				for ( var i = 0; i < panel.length; i++ ) {
					t = panel[i];
					
					if ( im.data(t) != null ) {
						e = $('<div>', { 'class': id.panel + ' ' + id[t] }).data('rel', t).appendTo(c);
						e.append( $('<div>', { 'class': id.icon }) );
						a = $('<a>', { href: NOLINK, 'class': t + '-' + id.icon, text: ' ' }).appendTo(m);
						a.data('rel', t).addHint( text[t + 'Btn'] || t );
						a.click( function() {
							var t = $(this).data('rel'),
								e = c.children('.' + t); 
								o = e.is(':hidden');
							
							$(this).toggleClass( id.active, o );
							
							if ( t === id.map ) {
								var ma = function() {
									if ( o ) {
										e.children('.' + id.mapcont).trigger('adjust'); 
									}
								};
								if ( settings.transitions ) {
									e.slideToggle('fast', ma);
								} else {
									e.toggle();
									setTimeout(ma, 50);
								}
							} else {
								if ( settings.transitions ) {
									e.slideToggle('fast');
								} else {
									e.toggle();
								}
							}
							
							saveSetting(t + 'On', o);
						});
					}
				}
				
				// Adding 'original' button
				if ( d = im.data(id.link) ) {
					a = $('<a>', { href: d, 'class': id.link + '-' + id.icon, target: '_blank', text: ' ' }).appendTo(m);
					a.addHint( (im.data(id.isoriginal)? text.original : text.hiRes) + '<p><small>' + text.saveTip + '</small></p>' );
				}
				
				// Adding 'share' button
				if ( settings.shareOn ) {
					var sha =  $('<a>', { href: NOLINK, 'class': id.share + '-' + id.icon, text: ' ' }).appendTo(m);
					h = ( settings.hash === 'number' )? (curr + 1) : getCurrFile();
					setTimeout( function() {
						sha.shareIt( { hash: h } );
					}, settings.speed );
				}
				
				// Adding content
				c.children( '.' + id.panel ).each(function() {
					e = $(this);
					t = e.data('rel');
					if ( t && (d = im.data(t)) != null ) {
						if ( t === id.map ) {
							var mc = $('<div>', { 'class': id.mapcont }).appendTo(e);
							mc.width(c.width() - 30);
							if ( settings.mapAll ) {
								mc.setupMap({
									click: function() { showImg( this.link ); },
									markers: markers,
									curr: parseInt(im.data(id.mapid))
								});
							} else {
								mc.setupMap({
									map: d,
									label: getLabel(im)
								});
							}
						} else if ( t === id.shop ) {
							e.addClass('clearfix').setupShop({
								file: im.attr('src').replace('thumbs/', ''),
								options: d
							});
						} else {
							e.append(d);
						}
						
						// Setting up visibility
						if ( !settings[t + 'On'] ) {
							e.hide();
						} else {
							m.children('a.' + t + '-icon').addClass(id.active);
						}
					}
				});
								
				// No buttons added? > Remove menu.
				if ( !m.html().length ) {
					m.remove();
				}
				
				// Hide the whole panel
				if ( !settings.infoOn ) {
					bottom.hide();
				}
				
			};
			
			// Setting up the header on the original page
			
			var setupHeader = function() {
				
				if ( settings.header == null ) {
					return;
				}
				
				var e = $(settings.header);
				
				if ( !e.length ) {
					return;
				}
				
				var b = $('<div>', { 'class': id.startBtn, text: ' ' }).appendTo(e);
				var tx = $('<div>', { 'class': id.startTxt, text: text.startSlideshow }).appendTo(e);
				
				b.mouseenter(function() { 
					tx.stop(true, false).css({opacity: 1}).hide().fadeIn(250); 
				}).mouseleave(function() {
					tx.stop(true, false).fadeOut(500);
				}).click(function() { 
					showImg();
					startAuto(); 
					return false;
				});
				
				b = e.find('.' + id.parent + '>a');
				
				if ( b.length ) {
					settings.uplink = b.attr('href');
				}
				
			};
			
			// Creating the control strip
			
			var setupControls = function( t ) {
				
				var e = $('<nav>', { 'class': 'controls clearfix'}).appendTo(t);
				
				ctrl.prev = $('<a>', { 'class': id.prev, title: text.previousPicture }).appendTo(e);
				ctrl.prev.click(function() { 
					stopAuto(); 
					previousImg(); 
					return false; 
				});
				
				ctrl.up = $('<a>', { 'class': id.up, title: settings.skipIndex? text.upOneLevel : text.backToIndex }).appendTo(e);
				ctrl.up.click(function() { 
					stopAuto();
					backToIndex(); 
					return false; 
				});
				
				ctrl.noresize = $('<a>', { 'class': id.noresize, title: text.oneToOneSize }).appendTo(e);
				ctrl.noresize.click(function() { 
					zoomReset(); 
					return false; 
				});
				ctrl.resize = $('<a>', { 'class': id.resize, title: text.fitToScreen }).appendTo(e);
				ctrl.resize.click(function() { 
					zoomFit(); 
					return false; 
				});
				if ( settings.fitImage ) { 
					ctrl.resize.hide(); 
					ctrl.noresize.showin(); 
				} else { 
					ctrl.noresize.hide();
					ctrl.resize.showin(); 
				}
				
				ctrl.hideInfo = $('<a>', { 'class': id.hideInfo, title: text.hideInfo }).appendTo(e);
				ctrl.hideInfo.click(function() { 
					hideCaption(); 
					return false; 
				});
				ctrl.showInfo = $('<a>', { 'class': id.showInfo, title: text.showInfo }).appendTo(e);
				ctrl.showInfo.click(function() { 
					showCaption(); 
					return false; 
				});
				if ( settings.infoOn ) { 
					ctrl.showInfo.hide(); 
					ctrl.hideInfo.showin(); 
				} else { 
					ctrl.hideInfo.hide(); 
					ctrl.showInfo.showin(); 
				}
				
				ctrl.hideThumbs = $('<a>', { 'class': id.hideThumbs, title: text.hideThumbs }).appendTo(e);
				ctrl.hideThumbs.click(function() { 
					hideScrollbox(); 
					return false; 
				});
				ctrl.showThumbs = $('<a>', { 'class': id.showThumbs, title: text.showThumbs }).appendTo(e);
				ctrl.showThumbs.click(function() { 
					showScrollbox(); 
					return false; 
				});
				if ( settings.thumbsOn ) { 
					ctrl.showThumbs.hide(); 
					ctrl.hideThumbs.showin(); 
				} else { 
					ctrl.hideThumbs.hide(); 
					ctrl.showThumbs.showin(); 
				}
				
				ctrl.play = $('<a>', { 'class': id.play, title: text.startAutoplay }).appendTo(e);
				ctrl.play.click(function() {
					fadeCtrl();
					startAuto(); 
					return false; 
				});
				ctrl.pause = $('<a>', { 'class': id.pause, title: text.stopAutoplay }).appendTo(e);
				ctrl.pause.click(function() { 
					stopAuto(); 
					return false; 
				});
				if ( settings.slideshowAuto ) { 
					ctrl.play.hide(); 
					ctrl.pause.showin(); 
				} else { 
					ctrl.pause.hide(); 
					ctrl.play.showin(); 
				}
				
				ctrl.next = $('<a>', { 'class': id.next, title: text.nextPicture }).appendTo(e);
				ctrl.next.click(function() { 
					reLoop(); 
					nextImg(); 
					return false; 
				});
				
				var w = 0;
				e.children().each(function() { 
					if ( $(this).css('display') !== 'none' ) {
						w += $(this).outerWidth();
					}
				});
				e.width(w);
				
				e.children('a').addHint();
				
				return e;
			};
			
			// Setting up thumbnails
			
			var setupThumbs = function( t ) {
				var t, h, a, i, im, l, w = 0;
					e = $('<div>', { 'class': id.scrollbox }).appendTo(t),
					tc = $('<div>', { 'class': 'wrap' }).appendTo(e),
					re = new RegExp('^' + settings.slides + '\\/');
				
				tc = $('<ul>', { 'class': id.cont }).appendTo(tc),
				images.each( function(n) {
					
					t = $(this);
					
					// current image
					im = t.find('img').eq(0);
					
					// link to hi res
					l = t.attr('href'); 
					
					if ( !im.length || !l ) {
						return;
					}
					
					// creating the thumbnail scroller pair
					a = $('<a>', { href: NOLINK }).appendTo( $('<li>').appendTo(tc) );
					i = $('<img>').appendTo(a);
					
					// saving the original link
					im.data(id.src, l);
					
					// Loadng the image, handling preload
					if ( im.attr('src').endsWith('/' + settings.loadImg) ) {
						im.add(i).attr('src', settings.thumbs + '/' + l.replace(re, ''));
					}
					else {
						i.attr('src', im.attr('src'));
					}

					// Adding mouse over hint
					h = t.attr('title');
					if ( h && h.length ) {
						t.add(a).addHint( h );
					} else {
						h = t.next();
						if ( h.length ) {
							a.addHint( h.html() );
						}
					}
					
					if ( settings.markNewDays && (today - parseInt(im.data(id.modified) || 0)) <= settings.markNewDays ) {
						t.add(a).append( newLabel );
					}
					
					// Setting click handlers
					t.click( function(e) {
						if ( $(this).parents('[role=scroll]').data('dragOn') === true ) {
							return false;
						}
						if ( !$(this).hasClass(id.active) ) {
							if ( cimg && cimg.length ) {
								cimg.stop();
								cleanupImg(cimg);
								cimg.remove();
							}
						}
						showImg( images.eq(n) ); 
						return false; 
					});
					
					a.click( function(e) {
						if ( $(this).parents('[role=scroll]').data('dragOn') === true ) {
							return false;
						}
						if ( !$(this).hasClass(id.active) ) {
							showImg( images.eq(n) );
						}
						$(this).trigger('active');
						return false;
					});
					
					w += a.outerWidth(true);
				});
								
				tc.width(w).scrollThumbs({
					enableMouseWheel: settings.enableMouseWheel
				});
				
				return e;
			};

			if ( !images.length ) {
				return;
			}
			
			setupHeader();
			
			gallery = $('<div>', { 'class': id.gallery }).appendTo('body');
			wait = $('<div>', { 'class': id.wait }).appendTo(gallery);
			navigation = $('<div>', { 'class': id.navigation }).appendTo(gallery);
			scrollbox = setupThumbs(navigation);
			thumbs = scrollbox.find('.cont a');
			controls = setupControls(navigation);
			
			if ( !settings.thumbsOn ) {
				navigation.css('top', -scrollbox.outerHeight() - 10);
			}
			
			// Show / hide the control strip on mouse move
			
			scrollbox.mouseenter(function() { 
				fadeCtrl(); 
				smo = true; 
			}).mouseleave(function() { 
				smo = false; 
			});
			
			controls.mouseenter(function() { 
				cmo = true; 
				$(this).stop(true, false).fadeTo(200, 1.0);
			}).mouseleave(function() { 
				cmo = false;  
				$(this).stop(true, false).fadeTo(200, 0.7);
			});
			
			var mly = 0, mlx = 0;
			if ( !$.support.touch ) {
				gallery.mousemove(function(e) {
					if (!smo && ((mly - e.clientY) || (mlx - e.clientX))) {
						showCtrl(); 
						mlx = e.clientX;
						mly = e.clientY; 
					}
				});
			}
			
			// Collect all coordinates for the map
			
			if ( settings.mapAll ) {
				var c, i, m, t;
				images.each(function(i) {
					c = $(this).find('img:first');
					if ( c.length && (m = c.data('map')) && (m = getLatLng(m)) ) {
						t = getLabel(c);
						markers.push({ 
							map: m, 
							label: (i + 1) + (t? (': ' + t.stripHTML()) : ''), 
							link: $(this) 
						});
					}
				});
			}
			
			// Installing keyboard listener
			
			if ( !$.support.touch && ($.isFunction(settings.enableKeyboard) || settings.enableKeyboard) ) {
				$(document).keydown(keyhandler);
			}
			
			// Jumping to the hash image
			
			if ( settings.hash && settings.hash !== 'no' ) {
				$.history.init(function(hash) {
					if ( hash && hash.length ) {
						var n = (settings.hash === 'number')? ((parseInt( hash ) || 1) - 1) : findImg( hash );
						showImg( n );
						settings.slideshowAuto = false;
					} else {
						backToIndex();
						if ( $.browser.msie ) { 
							setTimeout(function() {
								$('[role=main]').show();
								$('.folders>ul>li').equalHeight();
								$('[role=scroll]').trigger('adjust');
							}, 10 );
						}
					}
				});
			}
			
			setActive( curr );
			
			// Starting slideshow
			
			if ( settings.slideshowAuto ) {
				showImg( curr );
				startAuto();
			} else if ( settings.skipIndex ) {
				showImg( curr );
			}
						
			$(window).resize(function() {
				clearTimeout(rto);
				rto = setTimeout(function() {
					var rw = $(window).width(), rh = $(window).height();
					if (rw !== rlw || rh !== rlh) {
						recenter();
						rlw = rw;
						rlh = rh;
					}
				}, 100);
			});
		});
	};
	
	$.fn.turtleGallery.defaults = {
		hash: 'fileName',			// Hash type: 'no' || 'number' || 'fileName'
		resPath: '',				// relative path to '/res' folder
		relPath: '',				// relative path from '/res' back to current folder
		level: 0,					// gallery level (0 = top level)
		skipIndex: false,			// skip the index (thumbnail) page and goes straight to gallery
		speed: 600,					// picture transition speed
		transitions: true,			// Use transitions?
		preScale: 0.95,				// size of the image before the transitions starts
		slideshowDelay: 3000, 		// slideshow delay 3 s
		slideshowLoop: false, 		// automatically starts over
		slideshowAuto: false,		// automatically starts with the first image
		markNewDays: 30,			// : days passed by considered a picture is 'new'
		afterLast: 'ask',			// Deafult action after the last frame ( ask|backtoindex|onelevelup|startover )
		infoOn: true,				// Show the captions by default?
		showImageNumbers: true,		// Show the actual image number on the info panel?
		thumbsOn: false,			// Show the thumbnail scroller by default?
		fitImage: true,				// Fit the images to window size by default or use 1:1?
		fitShrinkonly: true,		// Fit only by shrinking (no enlarging)
		fitFreespace: true,			// Fit only the space below the thumbnail scroller
		fitPadding: 15,				// Distance from the window border
		borderWidth: 10,			// Image border width
		rightClickProtect: false,	// No right-click menu on main images
		metaOn: false,				// Show Metadatas by default?
		mapOn: false,				// : Map?
		shopOn: false,				// : Shopping panel?
		shareOn: false,				// : Sharing panel?
		printOn: false,				// : Printing panel?
		enableKeyboard: true,		// Enable keyboard controls?
		enableMouseWheel: true,		// Enable mouse wheel?
		numberLinks: false,			// Use #1 or #IMG_0001.JPG as internal links?
		videoAuto: true,			// Automatic play of videos
		videoFit: true,				// Stretch to player size
		videoWidth: 640,			// Video player size
		videoHeight: 480,
		controlbarHeight: 24
	};
	
	$.fn.turtleGallery.texts = {
		startSlideshow: 'Start slideshow',
		close: 'Close',
		atLastPage: 'At last page', 
		atLastPageQuestion: 'Where to go next?', 
		startOver: 'Start over', 
		backToHome: 'Back to home',
		stop: 'Stop', 
		upOneLevel: 'Up one level',
		backToIndex: 'Back to index page',
		previousPicture: 'Previous picture',
		nextPicture: 'Next picture',
		oneToOneSize: '1:1 size',
		fitToScreen: 'Fit to screen',
		showInfo: 'Show caption / info',
		hideInfo: 'Hide caption / info',
		showThumbs: 'Show thumbnails',
		hideThumbs: 'Hide thumbnails',
		startAutoplay: 'Start autoplay',
		stopAutoplay: 'Stop autoplay',
		closeWindow: 'Close window',
		clickToOpen: 'Click to open this document with the associated viewer',
		download: 'Download', 
		original: 'Original', 
		hiRes: 'Hi res.',
		saveTip: 'Use Right click -> Save link as... to download',
		metaBtn: 'Photo data', 
		metaLabel: 'Display photograpic (Exif/Iptc) data', 
		mapBtn: 'Map',
		mapLabel: 'Show the photo location on map',
		shopBtn: 'Buy',
		shopLabel: 'Show options to buy this item',
		shareBtn: 'Share',
		shareLabel: 'Share this photo over social sites'
	};
	
	$.fn.turtleGallery.ids = {		// Class names and data- id's
		gallery: 'gallery',			// The container for gallery
		navigation: 'navigation',	// Navigation at top
		scrollbox: 'scrollbox',		// Thumbnail scroller box
		active: 'active',			// active state
		parent: 'parent',			// up link
		bottom: 'bottom',			// bottom section
		img: 'img',					// one image
		main: 'main',				// the main image class
		video: 'video',				// video class
		audio: 'audio',				// audio class
		other: 'other',				// other file panel class 
		wait: 'wait',				// wait animation
		cont: 'cont',				// inside containers generated by the script
		panel: 'panel',				// general panel on the bottom
		icon: 'icon',				// icon container
		caption: 'caption',			// caption markup
		meta: 'meta',				// metadata container / also the name of data attr
		map: 'map',					// map container class
		mapcont: 'mapcont',			// map inside wrapper
		mapid: 'mapid',				// map marker unique id
		shop: 'shop',				// shop container class
		share: 'share',				// share container class
		print: 'print',				// print container class
		comment: 'comment',			// commenting container class 
		link: 'link',				// link to original / hi res.
		isoriginal: 'isoriginal',	// link points to original or hi res.?
		width: 'width',				// width attribute
		height: 'height',			// herght attribute
		src: 'src',					// source link
		isvideo: 'isvideo',			// is video attr
		isaudio: 'isaudio',			// is audio attr
		isother: 'isother',			// is other attr
		modified: 'modified',		// modified x days ago attr
		startBtn: 'startbtn',		// Start button class
		startTxt: 'starttxt',		// Start text class
		prev: 'prev',				// control strip classes
		next: 'next',
		up: 'up',
		noresize: 'noresize',
		resize: 'resize',
		hideInfo: 'hideinfo',
		showInfo: 'showinfo',
		hideThumbs: 'hidethumbs',
		showThumbs: 'showthumbs',
		play: 'play',
		pause: 'pause',
		newItem: 'newlabel',
		showHint: 'showhint'
	};


})(jQuery);		

