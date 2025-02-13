class TimePicker {
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
        this.disableTime = disableTime.length > 0 ? disableTime.map((time) => time.toString().padStart(2, "0") + ":00") : "";
        this.startTime = selectedTime.startTime || null; // Track the start of the range
        this.endTime = selectedTime.endTime || null; // Track the end of the range
        this.onSelected = onSelected;
        this.init();

        if (selectedTime.startTime && selectedTime.endTime) {
            this.startTime = this.formatTime(selectedTime.startTime);
            this.endTime = this.formatTime(selectedTime.endTime);
        }
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

        this.populateTimeSlots(timeBox);

        input.addEventListener("focus", () => {
            timeBox.classList.remove("hidden");
        });

        input.addEventListener("keyup", (e) => {
            this.resetSelection(timeBox);
            const value = e.target.value.trim();
            if (value) {
                if (value.endsWith(":00") || value.endsWith(":00-")) {
                    this.highlightFirstSlot(timeBox, value);
                }
                const [start, end] = value.split("-");

                if (start && end && end.endsWith(":00")) {
                    this.highlightRange(timeBox, start, end);
                    this.onSelected(start, end);
                } else {
                    this.highlightFirstSlot(timeBox, start);
                }
            }
        });

        timeBox.addEventListener("click", (e) => {
            if (e.target.classList.contains("time-slot")) {
                this.handleTimeSelection(e.target, timeBox, input);
            }
        });

        document.addEventListener("click", (e) => {
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
        });

        // initial value if selected
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

            if (this.disableTime.includes(hourString)) {
                timeSlot.classList.add("disabled");
            }

            timeSlot.textContent = hourString;
            timeBox.appendChild(timeSlot);
        }
    }

    handleTimeSelection(target, timeBox, input) {
        const selectedTime = target.textContent.trim();
        if (this.disableTime && this.disableTime.length > 0 && this.disableTime.includes(selectedTime)) {
            return;
        }

        if (!this.startTime) {
            this.startTime = selectedTime;
            target.classList.add("selected");
            input.value = this.startTime;
        } else if (!this.endTime) {
            this.endTime = selectedTime;

            if (parseInt(this.endTime) <= parseInt(this.startTime)) {
                [this.startTime, this.endTime] = [this.endTime, this.startTime];
            }

            this.highlightRange(timeBox, this.startTime, this.endTime);
            input.value = `${this.startTime}-${this.endTime}`;
            // selected value

            this.onSelected(this.startTime, this.endTime);

            timeBox.classList.add("hidden");
        } else {
            this.resetSelection(timeBox);
            this.startTime = selectedTime;
            this.endTime = null;
            target.classList.add("selected");
            input.value = this.startTime;
        }
    }

    highlightFirstSlot(container, startTime) {
        const slots = container.querySelectorAll(".time-slot");
        slots.forEach((slot) => {
            const time = slot.textContent.trim();
            if (time === this.getTimeFromString(startTime)) {
                slot.classList.add("selected");
            }
        });
    }

    highlightRange(container, start, end) {
        const slots = container.querySelectorAll(".time-slot");
        let inRange = false;

        slots.forEach((slot) => {
            const time = slot.textContent;
            if (time === this.getTimeFromString(start)) inRange = true;

            if (inRange) slot.classList.add("selected");

            if (time === this.getTimeFromString(end)) inRange = false;
        });
    }

    resetSelection(container) {
        const slots = container.querySelectorAll(".time-slot");
        slots.forEach((slot) => slot.classList.remove("selected"));
    }

    getTimeFromString(timeString) {
        return timeString.toString().length === 4 ? "0" + timeString : timeString;
    }

    destroy() {
        // destroy the instance
        this.element = null;
        this.startTime = null;
        this.endTime = null;
        this.disableTime = null;
        this.selectedTime = {
            startTime: "",
            endTime: "",
        };
    }
}

export default TimePicker;