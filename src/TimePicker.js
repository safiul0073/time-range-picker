import './time-picker.css';

export class TimePicker {
    constructor(options = {}) {
        // Default options
        this.options = {
            element: null,
            placeholder: 'Select time range',
            disableTime: [],
            selectedTime: {
                startTime: null,
                endTime: null,
            },
            onSelected: () => {},
            onOpen: () => {},
            onClose: () => {},
            format: 'HH:mm',
            startHour: 1,
            endHour: 23,
            step: 60, // minutes
            columns: 5, // Number of columns in the grid
            ...options
        };

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

    init() {
        if (!this.options.element) {
            throw new Error('TimePicker: element is required');
        }

        this.originalInput = this.options.element;
        this.createWrapper();
        this.createGrid();
        this.bindEvents();
        this.updateDisplay();
    }

    createWrapper() {
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

    createGrid() {
        this.grid = document.createElement('div');
        this.grid.className = 'time-picker-grid';
        this.grid.style.display = 'none';
        this.wrapper.appendChild(this.grid);
        this.populateTimeSlots();
    }

    populateTimeSlots() {
        this.grid.innerHTML = '';
        this.timeSlots = [];
        const startHour = this.options.startHour;
        const endHour = this.options.endHour;
        const step = this.options.step;
        const columns = this.options.columns;
        let row;
        let colCount = 0;
        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minute = 0; minute < 60; minute += step) {
                if (colCount % columns === 0) {
                    row = document.createElement('div');
                    row.className = 'time-picker-row';
                    this.grid.appendChild(row);
                }
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const slot = document.createElement('button');
                slot.type = 'button';
                slot.className = 'time-picker-slot';
                slot.textContent = timeString;
                slot.dataset.time = timeString;
                if (this.options.disableTime.includes(timeString)) {
                    slot.classList.add('disabled');
                    slot.disabled = true;
                } else {
                    slot.addEventListener('click', () => this.handleSlotClick(slot));
                }
                row.appendChild(slot);
                this.timeSlots.push(slot);
                colCount++;
            }
        }
    }

    bindEvents() {
        // Display input events
        const displayClick = () => this.toggle();
        this.displayInput.addEventListener('click', displayClick);
        this.eventListeners.push({ element: this.displayInput, type: 'click', listener: displayClick });

        // Keyboard events
        const keydown = (e) => {
            if (e.key === 'Escape') {
                this.close();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.toggle();
            }
        };
        this.displayInput.addEventListener('keydown', keydown);
        this.eventListeners.push({ element: this.displayInput, type: 'keydown', listener: keydown });

        // Document click to close dropdown
        const documentClick = (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.close();
            }
        };
        document.addEventListener('click', documentClick);
        this.eventListeners.push({ element: document, type: 'click', listener: documentClick });

        // Sync with original input
        const syncInput = () => {
            this.originalInput.value = this.getValue();
        };
        this.displayInput.addEventListener('input', syncInput);
        this.eventListeners.push({ element: this.displayInput, type: 'input', listener: syncInput });
    }

    handleSlotClick(slot) {
        const selectedTime = slot.dataset.time;
        if (!this.startTime) {
            this.startTime = selectedTime;
            this.endTime = null;
            this.updateGridSelection();
        } else if (!this.endTime) {
            this.endTime = selectedTime;
            if (this.getTimeInMinutes(this.endTime) < this.getTimeInMinutes(this.startTime)) {
                [this.startTime, this.endTime] = [this.endTime, this.startTime];
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

    updateGridSelection() {
        this.timeSlots.forEach(slot => {
            slot.classList.remove('selected', 'start-selected', 'end-selected');
            slot.style.backgroundColor = '';
            slot.style.color = '';
        });
        if (this.startTime && !this.endTime) {
            const slot = this.timeSlots.find(s => s.dataset.time === this.startTime);
            if (slot) {
                slot.classList.add('start-selected');
            }
        } else if (this.startTime && this.endTime) {
            const start = this.getTimeInMinutes(this.startTime);
            const end = this.getTimeInMinutes(this.endTime);
            this.timeSlots.forEach(slot => {
                const t = this.getTimeInMinutes(slot.dataset.time);
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

    getTimeInMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
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

    close() {
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

    updateDisplay() {
        if (this.startTime && this.endTime) {
            this.displayInput.value = `${this.startTime} - ${this.endTime}`;
        } else if (this.startTime) {
            this.displayInput.value = this.startTime;
        } else {
            this.displayInput.value = '';
        }
    }

    updateOriginalInput() {
        this.originalInput.value = this.getValue();
    }

    getValue() {
        if (this.startTime && this.endTime) {
            return `${this.startTime} - ${this.endTime}`;
        }
        return '';
    }

    setValue(startTime, endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.updateDisplay();
        this.updateOriginalInput();
        
        if (this.isOpen && startTime && endTime) {
            this.updateGridSelection();
        }
    }

    clear() {
        this.startTime = null;
        this.endTime = null;
        this.updateGridSelection();
        this.updateDisplay();
        this.updateOriginalInput();
    }

    destroy() {
        // Remove event listeners
        this.eventListeners.forEach(({ element, type, listener }) => {
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
}
