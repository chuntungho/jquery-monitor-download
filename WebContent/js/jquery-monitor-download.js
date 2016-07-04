/**
 * Monitor file download, only support for link or form
 * 
 * Note that server should return cookie with token name and value
 * 
 * @author tonyhe
 */
(function($) {
	'use strict';

	var _debug = function(message) {
		if (window.console) {
			console.log(message);
		}
	};

	var _getCookie = function(key) {
		var parts = document.cookie.split(key + '=');
		if (parts.length == 2) {
			var value = parts.pop().split(';').shift();
			return value;
		}
	};

	var _addToken = function(elem, tokenName, tokenValue) {
		if (_isForm(elem)) {
			// add token for form
			var $form = $(elem);
			var $token = $form.find('input[name=' + tokenName + ']');
			if ($token.size() == 0) {
				// append field if no existing
				$token = $('<input type="hidden"/>').attr('name', tokenName)
						.appendTo($form);
			}
			$token.val(tokenValue);
		} else {
			// add token for link
			var $a = $(elem);
			var href = $a.attr('href');
			if (href.indexOf(tokenName) > -1) {
				// remove token if existing
				href = href.substr(0, href.indexOf(tokenName) - 1);
			}

			// append token to the end
			var delimiter = href.indexOf('?') > -1 ? '&' : '?';
			href += delimiter + encodeURIComponent(tokenName) + '='
					+ tokenValue;
			$a.attr('href', href);
		}
	};

	var _isForm = function(elem) {
		return ('FORM' == elem.tagName);
	};

	var _isCompleted = function(tokenName, tokenValue) {
		return tokenValue == _getCookie(tokenName);
	};

	var _init = function(elem, options) {
		var eventName = 'click.download';
		if (_isForm(elem)) {
			eventName = 'submit.download';
		}

		$(elem).off(eventName).on(eventName, function() {
			var tokenName = options.tokenName;
			var tokenValue = new Date().getTime();

			// add token
			_addToken(elem, tokenName, tokenValue);

			// invoke before callback
			if (options.before) {
				options.before.call(elem);
			}

			// monitor download completion per 0.5 s
			var timeout = options.timeout * 2;
			var timer = window.setInterval(function() {
				// check if completed or timeout
				if (_isCompleted(tokenName, tokenValue) || timeout <= 0) {
					// clear timer
					window.clearInterval(timer);

					// invoke after callback
					options.after.call(elem, (timeout <= 0));
				}

				timeout--;
			}, 500);
		});
	};

	// register prototype function
	$.fn.monitorDownload = function(options) {
		var $this = this;
		var _options = $.extend({}, $.fn.monitorDownload.defaults, options);

		// initialize component
		$this.each(function(i, e) {
			if ($.inArray(e.tagName, [ 'A', 'FORM' ]) < 0) {
				throw 'Not support tag ' + e.tagName;
			}

			_init(e, _options);
		});

		return this;
	};

	$.fn.monitorDownload.defaults = {
		timeout : 30, // seconds
		tokenName : 'download-token', // the cookie name

		// callback
		before : function() {
			_debug('call before');
			this.style.cursor = 'wait';
		},
		after : function(isTimeout) { // timeout or completed
			_debug('call after');
			this.style.cursor = 'auto';
		}
	};
}(jQuery));