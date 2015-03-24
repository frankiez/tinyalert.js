(function(window, document) {

    'use strict';

    function isDOMElement(obj) {
      return obj && typeof window !== 'undefined' && (obj === window || obj.nodeType);
    }

    function extend (object /*, objectN ... */) {
      if(arguments.length <= 0) {
        throw new Error('Missing arguments in extend function');
      }

      var result = object || {},
          key,
          i;

      for (i = 1; i < arguments.length; i++) {
        var replacement = arguments[i] || {};

        for (key in replacement) {
          // Recurse into object except if the object is a DOM element
          if(typeof result[key] === 'object' && ! isDOMElement(result[key])) {
            result[key] = extend(result[key], replacement[key]);
          }
          else {
            result[key] = result[key] || replacement[key];
          }
        }
      }

      return result;
    }

    function Tinyalert (wrapper, options) {
        options = extend(options, Tinyalert.options);

        this.wrapper    = wrapper;
        this.isTop         = options.isTop;
        this.type           = options.type;
        this.text            = options.text;
        this.autoClose  = options.autoClose;
        this.duration    = options.duration;
    }

    Tinyalert.prototype = {
        constructor: Tinyalert,

        showAlert: function() {
            var that = this;
            var alertBox = document.createElement('div');
            alertBox.innerHTML = this.text;
            if (this.isTop) {
                alertBox.style.position = 'fixed';
                alertBox.style.left = '0';
                alertBox.style.right = '0';
                alertBox.style.top = '0';
            }
            else {
                alertBox.style.position = 'relative';
            }
            var bg = '#7f8c8d';
            switch (this.type) {
                case 'success':
                    bg = '#2ecc71';
                    break;
                case 'warning':
                    bg = '#f39c12';
                    break;
                case 'error':
                    bg = '#e74c3c';
                    break;
            }

            alertBox.style.visibility = 'hidden';
            alertBox.style.boxSizing = 'border-box';
            alertBox.style.background = bg;
            alertBox.style.color = '#FFF';
            alertBox.style.textShadow = '0 1px 1px rgba(0,0,0,0.2)';
            alertBox.style.fontSize = '20px';
            alertBox.style.lineHeight = 2;
            alertBox.style.fontWeight = 'bold';
            alertBox.style.textAlign = 'center';
            alertBox.style.overflow = 'hidden';
            alertBox.style.opacity = 0.9;
            alertBox.style.zIndex = 999;

            this.wrapper.insertBefore(alertBox, this.wrapper.childNodes[0]);
            var actHeight = (alertBox.currentStyle? alertBox.currentStyle : window.getComputedStyle(alertBox, null)).height;
            alertBox.style.height = '0';
            alertBox.style.visibility = 'visible';
            alertBox.style['-webkit-transition'] = 'height 0.5s ease-in-out';
            alertBox.style.transition = 'height 0.5s ease-in-out';
            var removeMe = function(){
                var curHeight = (alertBox.currentStyle? alertBox.currentStyle : window.getComputedStyle(alertBox, null)).height.split('px')[0];
                if(curHeight > 0) return;
                that.wrapper.removeChild(alertBox);
                alertBox.removeEventListener('webkitTransitionEnd', removeMe, false);
                alertBox.removeEventListener('transitionEnd', removeMe, false);
                alertBox = null;
            };
            setTimeout(function() {
                alertBox.style.height = actHeight;
                alertBox.addEventListener('webkitTransitionEnd', removeMe, false);
                alertBox.addEventListener('transitionEnd', removeMe, false);
                if(that.autoClose) {
                    setTimeout(function() {
                        alertBox.style.height = '0';
                    }, that.duration);
                }
            }, 0);
        }
    };

    Tinyalert.options = {
        isTop: false,
        type: 'default',
        text: 'Tinyalert',
        autoClose: true,
        duration: 2000
    };

    window.Tinyalert = Tinyalert;

}(window, document));