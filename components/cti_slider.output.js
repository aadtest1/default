'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

;(function () {
  /**
   * Slider component - uses https://refreshless.com/nouislider/
   * @attribute {boolean} [readOnly] - Question description
   * @attribute {boolean} [historicOnly] - Whether we should only display historic data - i.e. no useable slider.
   * @attribute {string} [sliderID] - id for the slider div to allow multiple per page
   * @attribute {string} [questionText] - text to be displayed above the slider
   * @attribute {number} [rangeMin] - lowest value on the slider
   * @attribute {number} [rangeMax] - highest value on the slider
   * @attribute {boolean} [roundToSteps] - bind function to round slider to closest step
   * @attribute {string} [currentDot] - whether or not a 'current' dot should be rendered
   * @attribute {string} [previousDot] - whether or not a 'previous' dot should be rendered
   * @attribute {string} [storeLocation] - toggle to write slider data back to this location in the cti store
   * @attribute {string} [previousValue] - pass the value entered in a previous dialog+ form to show second bar
   * @attribute {number} [debounceOverride] - change the standard debounce from 500ms
   * @event connected - Emitted when the element has connected
   * @event disconnected - Emitted when the element has disconnected
   * @event sliderValueChanged - throw the new value
   */
  var CtiSlider = function (_HTMLElement) {
    _inherits(CtiSlider, _HTMLElement);

    _createClass(CtiSlider, null, [{
      key: 'observedAttributes',
      get: function get() {
        return ['previousvalue', 'previousdot', 'currentdot', 'readonly', 'historiconly'];
      }
    }]);

    function CtiSlider(self) {
      var _this, _ret;

      _classCallCheck(this, CtiSlider);

      self = (_this = _possibleConstructorReturn(this, (CtiSlider.__proto__ || Object.getPrototypeOf(CtiSlider)).call(this, self)), _this);
      _this._slider = undefined;
      _this._sliderValue = undefined;
      _this._debounceInterval = undefined; //interval id returned from setTimeout()
      _this._debounceWait = 500; //possible gap between clicks before data committed to store, overridden by attribute this is just a default
      _this._debounceQueue = []; //hold a list of all queued functions, see TODO later on regarding changing this

      return _ret = self, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(CtiSlider, [{
      key: 'connectedCallback',
      value: function connectedCallback() {
        var _this2 = this;

        this._render().then(function (resolve) {
          _this2._slider = document.getElementById(_this2.getAttribute('sliderID') || 'slider');

          _this2._initSlider();

          if (window.debug) {
            debugger;
          }

          if (!!_this2.getAttribute('readOnly')) {
            var container = document.querySelector('cti-slider[sliderid=' + _this2.getAttribute('sliderID') + '] #disableSlider');

            if (container) {
              if (_this2.getAttribute('readOnly') === 'true') {
                container.classList.add('avoid-clicks');
              } else {
                container.classList.remove('avoid-clicks');
              }
            }
          }

          setTimeout(function () {
            return _this2._bindChange(_this2._slider, _this2.getAttribute('roundToSteps'));
          }, 250);
        });
      }
    }, {
      key: 'disconnectedCallback',
      value: function disconnectedCallback() {
        if (!this._slider) {
          return;
        }

        this._slider.noUiSlider.off('change');
        this._slider.noUiSlider.destroy();
      }
    }, {
      key: 'attributeChangedCallback',
      value: function attributeChangedCallback(name, oldValue, newValue) {
        // When readonly, the 'live' slider should not be displayed.
        if (name === 'readonly' && newValue === 'true') {
          this._sliderValue = -1;
        }

        this.connectedCallback();
      }
    }, {
      key: '_render',
      value: function _render() {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
          _this3.innerHTML = '\n          <div id=\'disableSlider\'>\n            <label class=\'control-label ng-binding\'>' + (_this3.getAttribute('questionText') || '(none)') + '</label>\n\n            ' + _this3._showCurrentBar() + '\n            \n            ' + _this3._showPrevBar() + '\n\n            <div class=\'belowBarLabels\'>\n              <span>totally dissatisfied</span>\n              <span>in the middle</span>\n              <span>totally satisfied</span>\n            </div>\n          </div>\n        ';
          resolve();
        });
      }

      //#region getters for noUiSlider values

    }, {
      key: '_initSlider',

      //#endregion

      /**
       * bind slider to the page,  set value if already populated in store,  get attribute to override 500ms debounce
       */
      value: function _initSlider() {
        try {
          noUiSlider.create(this._slider, {
            start: [this.rangeMin],
            connect: [true, false],
            range: { min: this.rangeMin, max: this.rangeMax },
            pips: { mode: 'count', values: this.valueCount, density: this.density, stepped: true }
          });
        } catch (e) {}

        if (this.getAttribute('storeLocation')) {
          var val = this.getAttribute('storeLocation');
          this._sliderValue = val;
          this._slider.noUiSlider.set(val);
        }

        if (this.getAttribute('debounceOverride')) {
          this._debounceWait = this.getAttribute('debounceOverride');
        }
      }

      /**
       * bind change event to slider,  change event triggers on click or release of drag.
       * On change will round number to nearest whole int and set slider to this value
       * @param {*} p_slider - the slider element from the DOM
       * @param {*} p_shouldRound - whether or not change events should ensure result rounding.
       */

    }, {
      key: '_bindChange',
      value: function _bindChange(p_slider, p_shouldRound) {
        var _this4 = this;

        if (!p_slider) {
          return;
        }

        p_slider.noUiSlider.on('change', function (values) {
          if (values.length > 0) {
            var newValue = p_shouldRound ? Math.round(values[0]) : values[0];

            _this4._setSliderValue(p_slider, newValue);
            _this4._debounce(_this4._emitChange);
          }
        });
      }

      /**
       * store value of slider in variable and call the noUiSlider.set() method to set the slider
       * to p_value,  slider will 'slide' to this value
       * @param {*} p_slider - the slider element from the DOM
       * @param {*} p_value - the value to set the slider too
       */

    }, {
      key: '_setSliderValue',
      value: function _setSliderValue(p_slider, p_value) {
        console.log('set it!');

        this._sliderValue = p_value;
        p_slider.noUiSlider.set(p_value); //'snap' the slider to this value
      }

      /**
       * Throw an event to be caught in studio to allow easy manipulation of the store
       */

    }, {
      key: '_emitChange',
      value: function _emitChange() {
        console.log('throw it!');

        var sliderID = this.getAttribute('sliderID');
        var value = this._sliderValue;
        // const dataObj = {}
        // dataObj[sliderID] = value

        // this.dispatchEvent(new CustomEvent('sliderValueChanged', { detail: dataObj }))

        // Hack to get this working now.
        if (sliderID) {
          cti.store.pages.DialogFormOne[sliderID] = value;
        }
      }

      /**
       * debounce function,  on clicking/dragging the slider the change event will trigger
       * a call to this function.  The _emitChange() method will be queued and not processed
       * until the _debounceWait has expired.  Susequent clicks before this time has expired
       * will be also queued and the timeout reset.  Once a timeout has been allowed to expire
       * i.e. no interaction with the slider has taken place in '_debounceWait' milliseconds
       * the final click will be processed meaning only the final value will be committed to the
       * store giving a much more performant experience.
       *
       * @param {*} p_function - function to be added to the queue
       */

    }, {
      key: '_debounce',
      value: function _debounce(p_function) {
        var _this5 = this;

        var context = this,
            args = arguments;
        if (!this._debounceInterval) {
          this._debounceQueue.push(this._wrapFunction(p_function, context, args)); //TODO: this could just be a variable holding the latest instead of a queue of all?
          this._debounceInterval = setTimeout(function () {
            _this5._processQueue();
          }, this._debounceWait);
        } else {
          clearTimeout(this._debounceInterval);
          this._debounceInterval = undefined;
          this._debounce(p_function);
        }
      }

      /**
       * When queuing the funcitons to run they need to retain their context and args so wrapping them in another anonymous function to preserve this
       * @param {*} p_function
       * @param {*} p_context
       * @param {*} p_params
       */

    }, {
      key: '_wrapFunction',
      value: function _wrapFunction(p_function, p_context, p_params) {
        return function () {
          p_function.apply(p_context, p_params);
        };
      }
      /**
       * run the last item in the queue and clear everything down.
       */

    }, {
      key: '_processQueue',
      value: function _processQueue() {
        if (this._debounceQueue.length > 0) {
          var lastItemInDebounceQueue = this._debounceQueue[this._debounceQueue.length - 1];
          lastItemInDebounceQueue();
          this._debounceQueue = [];
          this._debounceInterval = undefined;
        }
      }
    }, {
      key: '_showCurrentBar',
      value: function _showCurrentBar() {
        return '<div class=\'currentSliderValue ' + (this.getAttribute('historicOnly') === 'true' ? 'historic' : '') + '\'>\n                <div id=\'' + (this.getAttribute('sliderID') || 'slider') + '\'></div>\n                <div class=\'' + (this.getAttribute('currentDot') === '1' ? 'dot current-dot' : '') + '\'></div>\n              </div>';
      }
    }, {
      key: '_showPrevBar',
      value: function _showPrevBar() {
        if (!!this.getAttribute('previousValue')) {
          return '<div class=\'previousSliderValue ' + (this.getAttribute('historicOnly') === 'true' ? 'historic' : '') + '\'>\n                 <div class=\'barHolder\'>\n                   <div class=\'previousValue\' style=\'flex: 0 0 ' + this.previousValueWidth + '\'></div>\n                 </div>\n                 <div class=\'' + (this.getAttribute('previousDot') === '1' ? 'dot previous-dot' : '') + '\'></div>\n               </div>';
        }
        return '';
      }
    }, {
      key: 'rangeMin',
      get: function get() {
        return Number(this.getAttribute('rangeMin') || 1);
      }
    }, {
      key: 'rangeMax',
      get: function get() {
        return Number(this.getAttribute('rangeMax') || 7);
      }
    }, {
      key: 'valueCount',
      get: function get() {
        return Math.abs(this.rangeMax - (this.rangeMin - 1)); //-1 from min to compensate for the count. e.g. range 1-7 is 7 values sum 7-1 = 6.  (7 - (1-1)) = 0
      }
    }, {
      key: 'density',
      get: function get() {
        return 100 / this.valueCount;
      }
    }, {
      key: 'previousValueWidth',
      get: function get() {
        var count = this.valueCount;
        var prevVal = Number(this.getAttribute('previousValue')) || this.rangeMin || 1;

        // If we're at min, we want to output a nice little dot. This is also very easy to maintain, we just need to update, manually of course, the width output here to match the styling of the bar. Awesome sauce.
        if (prevVal === this.rangeMin) {
          return '14px';
        }

        // We don't want to extend over the boundary...
        if (Number(prevVal) > count) {
          return '0';
        }

        return ((Number(prevVal) - 1) / (Number(count) - 1) * 100).toString() + '%';
      }
    }]);

    return CtiSlider;
  }(HTMLElement);

  customElements.define('cti-slider', CtiSlider);
})();