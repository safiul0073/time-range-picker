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
    function TimePicker(_ref) {
      var element = _ref.element,
        _ref$disableTime = _ref.disableTime,
        disableTime = _ref$disableTime === void 0 ? [] : _ref$disableTime,
        _ref$selectedTime = _ref.selectedTime,
        selectedTime = _ref$selectedTime === void 0 ? {
          startTime: null,
          endTime: null
        } : _ref$selectedTime,
        _ref$onSelected = _ref.onSelected,
        onSelected = _ref$onSelected === void 0 ? function () {} : _ref$onSelected;
      _classCallCheck(this, TimePicker);
      this.element = element;
      this.disableTime = disableTime;
      this.startTime = selectedTime.startTime || null; // Track the start of the range
      this.endTime = selectedTime.endTime || null; // Track the end of the range
      this.onSelected = onSelected;
      this.eventListeners = [];
      this.init();
      if (selectedTime.startTime && selectedTime.endTime) {
        this.startTime = this.formatTime(selectedTime.startTime);
        this.endTime = this.formatTime(selectedTime.endTime);
      }
      this.eventsListener = {};
    }
    return _createClass(TimePicker, [{
      key: "init",
      value: function init() {
        this.createTimePicker(this.element);
      }
    }, {
      key: "formatTime",
      value: function formatTime(time) {
        return time;
      }
    }, {
      key: "createTimePicker",
      value: function createTimePicker(element) {
        var _this = this;
        var input = element.querySelector("input");
        var timeBox = element.querySelector(".time-picker-box");

        // Clear existing time slots if any (to avoid duplicates)
        timeBox.innerHTML = "";
        this.populateTimeSlots(timeBox);

        // Store and add event listeners
        var focusListener = function focusListener() {
          return timeBox.classList.remove("hidden");
        };
        input.addEventListener("focus", focusListener);
        this.eventListeners.push({
          element: input,
          type: "focus",
          listener: focusListener
        });
        var keyupListener = function keyupListener(e) {
          _this.resetSelection(timeBox);
          var value = e.target.value.trim();
          if (value) {
            if (value.endsWith(":00") || value.endsWith(":00-")) {
              _this.highlightFirstSlot(timeBox, value);
            }
            var _value$split = value.split("-"),
              _value$split2 = _slicedToArray(_value$split, 2),
              start = _value$split2[0],
              end = _value$split2[1];
            if (start && end && end.endsWith(":00")) {
              _this.startTime = start.trim();
              _this.endTime = end.trim();
              _this.highlightRange(timeBox, _this.startTime, _this.endTime);
              _this.onSelected(_this.startTime, _this.endTime);
            } else {
              _this.highlightFirstSlot(timeBox, start);
            }
          }
        };
        input.addEventListener("keyup", keyupListener);
        this.eventListeners.push({
          element: input,
          type: "keyup",
          listener: keyupListener
        });
        var clickListener = function clickListener(e) {
          if (e.target.classList.contains("time-slot")) {
            _this.handleTimeSelection(e.target, timeBox, input);
          }
        };
        timeBox.addEventListener("click", clickListener);
        this.eventListeners.push({
          element: timeBox,
          type: "click",
          listener: clickListener
        });

        // Add listeners to time slots dynamically
        timeBox.querySelectorAll(".time-slot").forEach(function (slot) {
          var mouseenterListener = function mouseenterListener(e) {
            return _this.handleMouseOnHoverSelection(e.target, timeBox);
          };
          var mouseleaveListener = function mouseleaveListener(e) {
            return _this.resetOnHoverSelectedTimeSlot(e.target, timeBox);
          };
          slot.addEventListener("mouseenter", mouseenterListener);
          slot.addEventListener("mouseleave", mouseleaveListener);
          _this.eventListeners.push({
            element: slot,
            type: "mouseenter",
            listener: mouseenterListener
          });
          _this.eventListeners.push({
            element: slot,
            type: "mouseleave",
            listener: mouseleaveListener
          });
        });
        var timeBoxMouseLeaveListener = function timeBoxMouseLeaveListener() {
          if (_this.startTime && !_this.endTime) {
            _this.resetSelection(timeBox);
            _this.startTime = null;
          }
        };
        timeBox.addEventListener("mouseleave", timeBoxMouseLeaveListener);
        this.eventListeners.push({
          element: timeBox,
          type: "mouseleave",
          listener: timeBoxMouseLeaveListener
        });
        var documentClickListener = function documentClickListener(e) {
          if (!element.contains(e.target)) {
            timeBox.classList.add("hidden");
            var value = input.value.trim();
            if (!value) {
              _this.resetSelection(timeBox);
            }
            if (value) {
              var _value$split3 = value.split("-");
              var _value$split4 = _slicedToArray(_value$split3, 2);
              _this.startTime = _value$split4[0];
              _this.endTime = _value$split4[1];
              if (!_this.startTime || !_this.endTime) {
                input.value = "";
              }
            }
          }
        };
        document.addEventListener("click", documentClickListener);
        this.eventListeners.push({
          element: document,
          type: "click",
          listener: documentClickListener
        });

        // Initial value if selected
        if (this.startTime && this.endTime) {
          this.highlightRange(timeBox, this.startTime, this.endTime);
          input.value = "".concat(this.startTime, " - ").concat(this.endTime);
        }
      }
    }, {
      key: "populateTimeSlots",
      value: function populateTimeSlots(timeBox) {
        var startHour = 1;
        var endHour = 23;
        for (var hour = startHour; hour <= endHour; hour++) {
          var timeSlot = document.createElement("div");
          timeSlot.classList.add("time-slot");
          var hourString = hour.toString().padStart(2, "0") + ":00";
          if (Array.isArray(this.disableTime) && this.disableTime.includes(hourString)) {
            timeSlot === null || timeSlot === void 0 || timeSlot.classList.add("disabled");
          } else {
            timeSlot === null || timeSlot === void 0 || timeSlot.classList.remove("disabled");
          }
          timeSlot.textContent = hourString;
          timeBox.appendChild(timeSlot);
        }
      }
    }, {
      key: "getTimeInNumber",
      value: function getTimeInNumber(timeString) {
        return parseInt(timeString.split(":")[0]);
      }
    }, {
      key: "handleMouseOnHoverSelection",
      value: function handleMouseOnHoverSelection(target, timeBox) {
        var selectedTime = target.textContent.trim();
        if (this.startTime && !this.endTime) {
          var startTime = this.getTimeInNumber(this.startTime);
          var selectedTimeNumber = this.getTimeInNumber(selectedTime);
          if (selectedTimeNumber > startTime) {
            this.highlightRange(timeBox, this.startTime, selectedTime);
          } else if (selectedTimeNumber == startTime) {
            this.resetAllSelectedTimeSlotWithoutStartTime(timeBox, selectedTime);
          } else {
            this.highlightRange(timeBox, selectedTime, this.startTime);
          }
        }
      }
    }, {
      key: "resetAllSelectedTimeSlotWithoutStartTime",
      value: function resetAllSelectedTimeSlotWithoutStartTime(timeBox, startTime) {
        var _this2 = this;
        if (this.startTime && this.endTime) {
          return;
        }
        var timeSlots = timeBox.querySelectorAll(".time-slot");
        timeSlots.forEach(function (slot) {
          if (slot.textContent.trim() !== _this2.getTimeFromString(startTime)) {
            slot.classList.remove("selected", "start-selected", "end-selected");
          }
        });
      }

      /**
       * Resets the time selection on hover when the end time is not yet set.
       * @param {HTMLElement} target - The time slot element that is being hovered.
       * @param {HTMLElement} timeBox - The container element of the time slots.
       */
    }, {
      key: "resetOnHoverSelectedTimeSlot",
      value: function resetOnHoverSelectedTimeSlot(target, timeBox) {
        var selectedTime = target.textContent.trim();
        if (this.startTime && !this.endTime) {
          this.unSelectSelectedTime(timeBox, selectedTime);
        }
      }
    }, {
      key: "handleTimeSelection",
      value: function handleTimeSelection(target, timeBox, input) {
        var selectedTime = target.textContent.trim();
        if (this.disableTime && this.disableTime.length > 0 && this.disableTime.includes(selectedTime)) {
          return;
        }
        if (!this.startTime) {
          this.startTime = selectedTime;
          target.classList.add("selected", "start-selected");
          input.value = this.startTime;
        } else if (!this.endTime) {
          this.endTime = selectedTime;
          if (parseInt(this.endTime) <= parseInt(this.startTime)) {
            var _ref2 = [this.endTime, this.startTime];
            this.startTime = _ref2[0];
            this.endTime = _ref2[1];
          }
          this.resetSelection(timeBox);
          this.highlightRange(timeBox, this.startTime, this.endTime);
          input.value = "".concat(this.startTime, "-").concat(this.endTime);
          // selected value

          this.onSelected(this.startTime, this.endTime);
          timeBox.classList.add("hidden");
        } else {
          this.resetSelection(timeBox);
          this.startTime = selectedTime;
          this.endTime = null;
          target.classList.add("selected", "start-selected");
          input.value = this.startTime;
        }
      }
    }, {
      key: "highlightFirstSlot",
      value: function highlightFirstSlot(container, startTime) {
        var _this3 = this;
        var slots = container.querySelectorAll(".time-slot");
        slots.forEach(function (slot) {
          var time = slot.textContent.trim();
          if (time === _this3.getTimeFromString(startTime)) {
            slot.classList.add("selected", "start-selected");
          }
        });
      }
    }, {
      key: "highlightRange",
      value: function highlightRange(container, start, end) {
        var _this4 = this;
        var slots = container.querySelectorAll(".time-slot");
        var inRange = false;
        slots.forEach(function (slot) {
          var time = slot.textContent;
          if (time === _this4.getTimeFromString(start)) {
            inRange = true;
            if (_this4.startTime && _this4.getTimeFromString(_this4.startTime) === _this4.getTimeFromString(start)) {
              slot.classList.add("start-selected");
            }
          }
          if (inRange) slot.classList.add("selected");
          if (time === _this4.getTimeFromString(end)) {
            inRange = false;
            if (_this4.endTime && _this4.getTimeFromString(_this4.endTime) === _this4.getTimeFromString(end)) {
              slot.classList.add("end-selected");
            }
          }
        });
      }
    }, {
      key: "resetSelection",
      value: function resetSelection(container) {
        var slots = container.querySelectorAll(".time-slot");
        slots.forEach(function (slot) {
          return slot.classList.remove("selected", "start-selected", "end-selected");
        });
      }
    }, {
      key: "unSelectSelectedTime",
      value: function unSelectSelectedTime(container, time) {
        var slots = container.querySelectorAll(".time-slot");
        slots.forEach(function (slot) {
          var slotTime = slot.textContent.trim();
          if (slotTime === time) {
            slot.classList.remove("selected", "start-selected", "end-selected");
          }
        });
      }
    }, {
      key: "getTimeFromString",
      value: function getTimeFromString(timeString) {
        return timeString.toString().length === 4 ? "0" + timeString : timeString;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        // Remove all event listeners
        this.eventListeners.forEach(function (_ref3) {
          var element = _ref3.element,
            type = _ref3.type,
            listener = _ref3.listener;
          element.removeEventListener(type, listener);
        });
        this.eventListeners = [];

        // Remove DOM elements
        if (this.element) {
          var timeBox = this.element.querySelector(".time-picker-box");
          if (timeBox) {
            timeBox.innerHTML = ""; // Clear time slots
          }
        }

        // Reset properties
        this.element = null;
        this.startTime = null;
        this.endTime = null;
        this.disableTime = null;
        this.onSelected = function () {};
      }
    }]);
  }();

  exports.TimePicker = TimePicker;

}));
