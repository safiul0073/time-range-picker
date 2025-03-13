import './time-picker.css';
export class TimePicker {
    constructor({
        element,
        disableTime = [],
        selectedTime = {
            startTime: null,
            endTime: null,
        },
        onSelected = () => {},
    }) {
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

    init() {
        this.createTimePicker(this.element);
    }

    formatTime(time) {
        return time;
    }
    createTimePicker(element) {
        const input = element.querySelector("input");
        const timeBox = element.querySelector(".time-picker-box");

        // Clear existing time slots if any (to avoid duplicates)
        timeBox.innerHTML = "";
        this.populateTimeSlots(timeBox);

        // Store and add event listeners
        const focusListener = () => timeBox.classList.remove("hidden");
        input.addEventListener("focus", focusListener);
        this.eventListeners.push({ element: input, type: "focus", listener: focusListener });

        const keyupListener = (e) => {
            this.resetSelection(timeBox);
            const value = e.target.value.trim();
            if (value) {
                if (value.endsWith(":00") || value.endsWith(":00-")) {
                    this.highlightFirstSlot(timeBox, value);
                }
                const [start, end] = value.split("-");
                if (start && end && end.endsWith(":00")) {
                    this.startTime = start.trim();
                    this.endTime = end.trim();
                    this.highlightRange(timeBox, this.startTime, this.endTime);
                    this.onSelected(this.startTime, this.endTime);
                } else {
                    this.highlightFirstSlot(timeBox, start);
                }
            }
        };
        input.addEventListener("keyup", keyupListener);
        this.eventListeners.push({ element: input, type: "keyup", listener: keyupListener });

        const clickListener = (e) => {
            if (e.target.classList.contains("time-slot")) {
                this.handleTimeSelection(e.target, timeBox, input);
            }
        };
        timeBox.addEventListener("click", clickListener);
        this.eventListeners.push({ element: timeBox, type: "click", listener: clickListener });

        // Add listeners to time slots dynamically
        timeBox.querySelectorAll(".time-slot").forEach((slot) => {
            const mouseenterListener = (e) => this.handleMouseOnHoverSelection(e.target, timeBox);
            const mouseleaveListener = (e) => this.resetOnHoverSelectedTimeSlot(e.target, timeBox);
            slot.addEventListener("mouseenter", mouseenterListener);
            slot.addEventListener("mouseleave", mouseleaveListener);
            this.eventListeners.push({ element: slot, type: "mouseenter", listener: mouseenterListener });
            this.eventListeners.push({ element: slot, type: "mouseleave", listener: mouseleaveListener });
        });

        const timeBoxMouseLeaveListener = () => {
            if (this.startTime && !this.endTime) {
                this.resetSelection(timeBox);
                this.startTime = null;
            }
        };
        timeBox.addEventListener("mouseleave", timeBoxMouseLeaveListener);
        this.eventListeners.push({ element: timeBox, type: "mouseleave", listener: timeBoxMouseLeaveListener });

        const documentClickListener = (e) => {
            if (!element.contains(e.target)) {
                timeBox.classList.add("hidden");
                const value = input.value.trim();
                if (!value) {
                    this.resetSelection(timeBox);
                }
                if (value) {
                    [this.startTime, this.endTime] = value.split("-");
                    if (!this.startTime || !this.endTime) {
                        input.value = "";
                    }
                }
            }
        };
        document.addEventListener("click", documentClickListener);
        this.eventListeners.push({ element: document, type: "click", listener: documentClickListener });

        // Initial value if selected
        if (this.startTime && this.endTime) {
            this.highlightRange(timeBox, this.startTime, this.endTime);
            input.value = `${this.startTime} - ${this.endTime}`;
        }
    }

    populateTimeSlots(timeBox) {
        const startHour = 1;
        const endHour = 23;

        for (let hour = startHour; hour <= endHour; hour++) {
            const timeSlot = document.createElement("div");
            timeSlot.classList.add("time-slot");
            const hourString = hour.toString().padStart(2, "0") + ":00";

            if (Array.isArray(this.disableTime) && this.disableTime.includes(hourString)) {
                timeSlot?.classList.add("disabled");
            } else {
                timeSlot?.classList.remove("disabled");
            }

            timeSlot.textContent = hourString;
            timeBox.appendChild(timeSlot);
        }
    }

    getTimeInNumber(timeString) {
        return parseInt(timeString.split(":")[0]);
    }

    handleMouseOnHoverSelection(target, timeBox) {
        const selectedTime = target.textContent.trim();
        if (this.startTime && !this.endTime) {
            const startTime = this.getTimeInNumber(this.startTime);
            const selectedTimeNumber = this.getTimeInNumber(selectedTime);
            if (selectedTimeNumber > startTime) {
                this.highlightRange(timeBox, this.startTime, selectedTime);
            } else if (selectedTimeNumber == startTime) {
                this.resetAllSelectedTimeSlotWithoutStartTime(timeBox, selectedTime);
            } else {
                this.highlightRange(timeBox, selectedTime, this.startTime);
            }
        }
    }

    resetAllSelectedTimeSlotWithoutStartTime(timeBox, startTime) {
        if (this.startTime && this.endTime) {
            return;
        }
        const timeSlots = timeBox.querySelectorAll(".time-slot");
        timeSlots.forEach((slot) => {
            if (slot.textContent.trim() !== this.getTimeFromString(startTime)) {
                slot.classList.remove("selected", "start-selected", "end-selected");
            }
        });
    }

    /**
     * Resets the time selection on hover when the end time is not yet set.
     * @param {HTMLElement} target - The time slot element that is being hovered.
     * @param {HTMLElement} timeBox - The container element of the time slots.
     */
    resetOnHoverSelectedTimeSlot(target, timeBox) {
        const selectedTime = target.textContent.trim();
        if (this.startTime && !this.endTime) {
            this.unSelectSelectedTime(timeBox, selectedTime);
        }
    }

    handleTimeSelection(target, timeBox, input) {
        const selectedTime = target.textContent.trim();
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
                [this.startTime, this.endTime] = [this.endTime, this.startTime];
            }
            this.resetSelection(timeBox);
            this.highlightRange(timeBox, this.startTime, this.endTime);
            input.value = `${this.startTime}-${this.endTime}`;
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

    highlightFirstSlot(container, startTime) {
        const slots = container.querySelectorAll(".time-slot");
        slots.forEach((slot) => {
            const time = slot.textContent.trim();
            if (time === this.getTimeFromString(startTime)) {
                slot.classList.add("selected", "start-selected");
            }
        });
    }

    highlightRange(container, start, end) {
        const slots = container.querySelectorAll(".time-slot");
        let inRange = false;

        slots.forEach((slot) => {
            const time = slot.textContent;
            if (time === this.getTimeFromString(start)) {
                inRange = true;
                if (this.startTime && this.getTimeFromString(this.startTime) === this.getTimeFromString(start)) {
                    slot.classList.add("start-selected");
                }
            }

            if (inRange) slot.classList.add("selected");

            if (time === this.getTimeFromString(end)) {
                inRange = false;
                if (this.endTime && this.getTimeFromString(this.endTime) === this.getTimeFromString(end)) {
                    slot.classList.add("end-selected");
                }
            }
        });
    }

    resetSelection(container) {
        const slots = container.querySelectorAll(".time-slot");
        slots.forEach((slot) => slot.classList.remove("selected", "start-selected", "end-selected"));
    }

    unSelectSelectedTime(container, time) {
        const slots = container.querySelectorAll(".time-slot");
        slots.forEach((slot) => {
            const slotTime = slot.textContent.trim();
            if (slotTime === time) {
                slot.classList.remove("selected", "start-selected", "end-selected");
            }
        });
    }

    getTimeFromString(timeString) {
        return timeString.toString().length === 4 ? "0" + timeString : timeString;
    }

    destroy() {
        // Remove all event listeners
        this.eventListeners.forEach(({ element, type, listener }) => {
            element.removeEventListener(type, listener);
        });
        this.eventListeners = [];

        // Remove DOM elements
        if (this.element) {
            const timeBox = this.element.querySelector(".time-picker-box");
            if (timeBox) {
                timeBox.innerHTML = ""; // Clear time slots
            }
        }

        // Reset properties
        this.element = null;
        this.startTime = null;
        this.endTime = null;
        this.disableTime = null;
        this.onSelected = () => {};
    }
}
