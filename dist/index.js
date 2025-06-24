(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TimePicker = {}));
})(this, (function (exports) { 'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
      writable: false
    }), e;
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t, e;
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = true,
        o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = true, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  var TimePicker = /*#__PURE__*/function () {
    function TimePicker() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, TimePicker);
      // Default options
      this.options = _objectSpread2({
        element: null,
        placeholder: 'Select time range',
        disableTime: [],
        selectedTime: {
          startTime: null,
          endTime: null
        },
        onSelected: function onSelected() {},
        onOpen: function onOpen() {},
        onClose: function onClose() {},
        format: 'HH:mm',
        startHour: 1,
        endHour: 23,
        step: 60,
        // minutes
        columns: 5
      }, options);

      // Internal state
      this.startTime = this.options.selectedTime.startTime || null;
      this.endTime = this.options.selectedTime.endTime || null;
      this.isOpen = false;
      this.eventListeners = [];
      this.originalInput = null;
      this.wrapper = null;
      this.displayInput = null;
      this.grid = null;
      this.timeSlots = [];
      this.init();
    }
    return _createClass(TimePicker, [{
      key: "init",
      value: function init() {
        if (!this.options.element) {
          throw new Error('TimePicker: element is required');
        }
        this.originalInput = this.options.element;
        this.createWrapper();
        this.createGrid();
        this.bindEvents();
        this.updateDisplay();
      }
    }, {
      key: "createWrapper",
      value: function createWrapper() {
        // Create wrapper container
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'time-picker-wrapper';
        this.wrapper.style.position = 'relative';
        this.wrapper.style.display = 'inline-block';

        // Create display input (what user sees)
        this.displayInput = document.createElement('input');
        this.displayInput.type = 'text';
        this.displayInput.className = 'time-picker-display';
        this.displayInput.placeholder = this.options.placeholder;
        this.displayInput.readOnly = true;
        this.displayInput.style.cursor = 'pointer';

        // Hide original input
        this.originalInput.style.display = 'none';

        // Insert wrapper before original input
        this.originalInput.parentNode.insertBefore(this.wrapper, this.originalInput);
        this.wrapper.appendChild(this.displayInput);
      }
    }, {
      key: "createGrid",
      value: function createGrid() {
        this.grid = document.createElement('div');
        this.grid.className = 'time-picker-grid';
        this.grid.style.display = 'none';
        this.wrapper.appendChild(this.grid);
        this.populateTimeSlots();
      }
    }, {
      key: "populateTimeSlots",
      value: function populateTimeSlots() {
        var _this = this;
        this.grid.innerHTML = '';
        this.timeSlots = [];
        var startHour = this.options.startHour;
        var endHour = this.options.endHour;
        var step = this.options.step;
        var columns = this.options.columns;
        var row;
        var colCount = 0;
        for (var hour = startHour; hour <= endHour; hour++) {
          var _loop = function _loop() {
            if (colCount % columns === 0) {
              row = document.createElement('div');
              row.className = 'time-picker-row';
              _this.grid.appendChild(row);
            }
            var timeString = "".concat(hour.toString().padStart(2, '0'), ":").concat(minute.toString().padStart(2, '0'));
            var slot = document.createElement('button');
            slot.type = 'button';
            slot.className = 'time-picker-slot';
            slot.textContent = timeString;
            slot.dataset.time = timeString;
            if (_this.options.disableTime.includes(timeString)) {
              slot.classList.add('disabled');
              slot.disabled = true;
            } else {
              slot.addEventListener('click', function () {
                return _this.handleSlotClick(slot);
              });
            }
            row.appendChild(slot);
            _this.timeSlots.push(slot);
            colCount++;
          };
          for (var minute = 0; minute < 60; minute += step) {
            _loop();
          }
        }
      }
    }, {
      key: "bindEvents",
      value: function bindEvents() {
        var _this2 = this;
        // Display input events
        var displayClick = function displayClick() {
          return _this2.toggle();
        };
        this.displayInput.addEventListener('click', displayClick);
        this.eventListeners.push({
          element: this.displayInput,
          type: 'click',
          listener: displayClick
        });

        // Keyboard events
        var keydown = function keydown(e) {
          if (e.key === 'Escape') {
            _this2.close();
          } else if (e.key === 'Enter') {
            e.preventDefault();
            _this2.toggle();
          }
        };
        this.displayInput.addEventListener('keydown', keydown);
        this.eventListeners.push({
          element: this.displayInput,
          type: 'keydown',
          listener: keydown
        });

        // Document click to close dropdown
        var documentClick = function documentClick(e) {
          if (!_this2.wrapper.contains(e.target)) {
            _this2.close();
          }
        };
        document.addEventListener('click', documentClick);
        this.eventListeners.push({
          element: document,
          type: 'click',
          listener: documentClick
        });

        // Sync with original input
        var syncInput = function syncInput() {
          _this2.originalInput.value = _this2.getValue();
        };
        this.displayInput.addEventListener('input', syncInput);
        this.eventListeners.push({
          element: this.displayInput,
          type: 'input',
          listener: syncInput
        });
      }
    }, {
      key: "handleSlotClick",
      value: function handleSlotClick(slot) {
        var selectedTime = slot.dataset.time;
        if (!this.startTime) {
          this.startTime = selectedTime;
          this.endTime = null;
          this.updateGridSelection();
        } else if (!this.endTime) {
          this.endTime = selectedTime;
          if (this.getTimeInMinutes(this.endTime) < this.getTimeInMinutes(this.startTime)) {
            var _ref = [this.endTime, this.startTime];
            this.startTime = _ref[0];
            this.endTime = _ref[1];
          }
          this.updateGridSelection();
          this.updateDisplay();
          this.updateOriginalInput();
          this.options.onSelected(this.startTime, this.endTime);
          this.close();
        } else {
          this.startTime = selectedTime;
          this.endTime = null;
          this.updateGridSelection();
        }
      }
    }, {
      key: "updateGridSelection",
      value: function updateGridSelection() {
        var _this3 = this;
        this.timeSlots.forEach(function (slot) {
          slot.classList.remove('selected', 'start-selected', 'end-selected');
          slot.style.backgroundColor = '';
          slot.style.color = '';
        });
        if (this.startTime && !this.endTime) {
          var slot = this.timeSlots.find(function (s) {
            return s.dataset.time === _this3.startTime;
          });
          if (slot) {
            slot.classList.add('start-selected');
          }
        } else if (this.startTime && this.endTime) {
          var start = this.getTimeInMinutes(this.startTime);
          var end = this.getTimeInMinutes(this.endTime);
          this.timeSlots.forEach(function (slot) {
            var t = _this3.getTimeInMinutes(slot.dataset.time);
            if (t >= start && t <= end) {
              slot.classList.add('selected');
            }
            if (t === start) {
              slot.classList.add('start-selected');
            }
            if (t === end) {
              slot.classList.add('end-selected');
            }
          });
        }
      }
    }, {
      key: "getTimeInMinutes",
      value: function getTimeInMinutes(timeString) {
        var _timeString$split$map = timeString.split(':').map(Number),
          _timeString$split$map2 = _slicedToArray(_timeString$split$map, 2),
          hours = _timeString$split$map2[0],
          minutes = _timeString$split$map2[1];
        return hours * 60 + minutes;
      }
    }, {
      key: "toggle",
      value: function toggle() {
        if (this.isOpen) {
          this.close();
        } else {
          this.open();
        }
      }
    }, {
      key: "open",
      value: function open() {
        if (this.isOpen) return;
        this.grid.style.display = 'block';
        this.isOpen = true;
        this.options.onOpen();

        // Highlight current selection if exists
        if (this.startTime && this.endTime) {
          this.updateGridSelection();
        } else if (this.startTime) {
          this.updateGridSelection();
        }
      }
    }, {
      key: "close",
      value: function close() {
        if (!this.isOpen) return;
        this.grid.style.display = 'none';
        this.isOpen = false;
        this.options.onClose();

        // Clear incomplete selection
        if (this.startTime && !this.endTime) {
          this.startTime = null;
          this.updateGridSelection();
          this.updateDisplay();
        }
      }
    }, {
      key: "updateDisplay",
      value: function updateDisplay() {
        if (this.startTime && this.endTime) {
          this.displayInput.value = "".concat(this.startTime, " - ").concat(this.endTime);
        } else if (this.startTime) {
          this.displayInput.value = this.startTime;
        } else {
          this.displayInput.value = '';
        }
      }
    }, {
      key: "updateOriginalInput",
      value: function updateOriginalInput() {
        this.originalInput.value = this.getValue();
      }
    }, {
      key: "getValue",
      value: function getValue() {
        if (this.startTime && this.endTime) {
          return "".concat(this.startTime, " - ").concat(this.endTime);
        }
        return '';
      }
    }, {
      key: "setValue",
      value: function setValue(startTime, endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.updateDisplay();
        this.updateOriginalInput();
        if (this.isOpen && startTime && endTime) {
          this.updateGridSelection();
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        this.startTime = null;
        this.endTime = null;
        this.updateGridSelection();
        this.updateDisplay();
        this.updateOriginalInput();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        // Remove event listeners
        this.eventListeners.forEach(function (_ref2) {
          var element = _ref2.element,
            type = _ref2.type,
            listener = _ref2.listener;
          element.removeEventListener(type, listener);
        });
        this.eventListeners = [];

        // Restore original input
        if (this.originalInput) {
          this.originalInput.style.display = '';
        }

        // Remove wrapper from DOM
        if (this.wrapper && this.wrapper.parentNode) {
          this.wrapper.parentNode.removeChild(this.wrapper);
        }

        // Reset properties
        this.originalInput = null;
        this.wrapper = null;
        this.displayInput = null;
        this.grid = null;
        this.timeSlots = [];
        this.startTime = null;
        this.endTime = null;
        this.isOpen = false;
      }
    }]);
  }();

  exports.TimePicker = TimePicker;

}));
