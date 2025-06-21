import './time-picker.css';

export class TimePicker {
    constructor(options = {}) {
        if (!options.element) {
            throw new Error('TimePicker: element option is required');
        }

        this.element = options.element;
        this.config = this.parseHTMLConfig();
        this.state = {
            isOpen: false,
            startTime: this.config.selectedStartTime || null,
            endTime: this.config.selectedEndTime || null
        };
        
        this.eventListeners = [];
        this.init();
    }

    parseHTMLConfig() {
        const element = this.element;
        const input = element.querySelector('input');
        
        return {
            disableTime: this.parseArray(element.dataset.disableTime || ''),
            selectedStartTime: element.dataset.selectedStartTime || null,
            selectedEndTime: element.dataset.selectedEndTime || null,
            minTime: element.dataset.minTime || '01:00',
            maxTime: element.dataset.maxTime || '23:00',
            step: parseInt(element.dataset.step) || 60,
            closeOnSelection: element.dataset.closeOnSelection !== 'false',
            placeholder: element.dataset.placeholder || input.placeholder || 'Select time range',
            readonly: element.dataset.readonly !== 'false'
        };
    }

    parseArray(str) {
        if (!str) return [];
        return str.split(',').map(item => item.trim()).filter(item => item);
    }

    init() {
        this.validateElement();
        this.createTimePicker();
        this.bindEvents();
        this.setInitialValue();
    }

    validateElement() {
        const input = this.element.querySelector('input');
        const timeBox = this.element.querySelector('.time-picker-box');
        
        if (!input || !timeBox) {
            throw new Error('Required HTML structure missing');
        }
    }

    createTimePicker() {
        const timeBox = this.element.querySelector('.time-picker-box');
        const input = this.element.querySelector('input');
        
        input.placeholder = this.config.placeholder;
        if (this.config.readonly) {
            input.readOnly = true;
        }
        
        timeBox.innerHTML = '';
        this.populateTimeSlots(timeBox);
    }

    populateTimeSlots(timeBox) {
        const startMinutes = this.timeToMinutes(this.config.minTime);
        const endMinutes = this.timeToMinutes(this.config.maxTime);
        
        for (let minutes = startMinutes; minutes <= endMinutes; minutes += this.config.step) {
            const timeString = this.minutesToTime(minutes);
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot');
            timeSlot.textContent = timeString;
            timeSlot.dataset.time = timeString;
            
            if (this.config.disableTime.includes(timeString)) {
                timeSlot.classList.add('disabled');
            }
            
            timeBox.appendChild(timeSlot);
        }
    }

    bindEvents() {
        const input = this.element.querySelector('input');
        const timeBox = this.element.querySelector('.time-picker-box');
        
        const focusHandler = () => this.openTimePicker();
        input.addEventListener('focus', focusHandler);
        this.eventListeners.push({ element: input, type: 'focus', handler: focusHandler });

        const clickHandler = (e) => this.handleTimeBoxClick(e);
        timeBox.addEventListener('click', clickHandler);
        this.eventListeners.push({ element: timeBox, type: 'click', handler: clickHandler });

        const mouseoverHandler = (e) => this.handleMouseOver(e);
        timeBox.addEventListener('mouseover', mouseoverHandler);
        this.eventListeners.push({ element: timeBox, type: 'mouseover', handler: mouseoverHandler });

        const mouseoutHandler = (e) => this.handleMouseOut(e);
        timeBox.addEventListener('mouseout', mouseoutHandler);
        this.eventListeners.push({ element: timeBox, type: 'mouseout', handler: mouseoutHandler });

        const documentClickHandler = (e) => this.handleDocumentClick(e);
        document.addEventListener('click', documentClickHandler);
        this.eventListeners.push({ element: document, type: 'click', handler: documentClickHandler });

        const keydownHandler = (e) => this.handleKeydown(e);
        input.addEventListener('keydown', keydownHandler);
        this.eventListeners.push({ element: input, type: 'keydown', handler: keydownHandler });
    }

    openTimePicker() {
        const timeBox = this.element.querySelector('.time-picker-box');
        timeBox.classList.remove('hidden');
        this.state.isOpen = true;
        this.updateDisplay();
    }

    closeTimePicker() {
        const timeBox = this.element.querySelector('.time-picker-box');
        timeBox.classList.add('hidden');
        this.state.isOpen = false;
    }

    handleTimeBoxClick(e) {
        if (e.target.classList.contains('time-slot') && !e.target.classList.contains('disabled')) {
            this.selectTime(e.target.dataset.time);
        }
    }

    handleMouseOver(e) {
        if (e.target.classList.contains('time-slot') && !e.target.classList.contains('disabled')) {
            this.showHoverEffect(e.target.dataset.time);
        }
    }

    handleMouseOut(e) {
        if (e.target.classList.contains('time-slot')) {
            this.clearHoverEffect();
        }
    }

    handleKeydown(e) {
        if (e.key === 'Escape' && this.state.isOpen) {
            this.closeTimePicker();
        }
    }

    handleDocumentClick(e) {
        if (!this.element.contains(e.target)) {
            this.closeTimePicker();
        }
    }

    selectTime(time) {
        if (!this.state.startTime || (this.state.startTime && this.state.endTime)) {
            this.state.startTime = time;
            this.state.endTime = null;
        } else {
            this.state.endTime = time;
            
            if (this.timeToMinutes(this.state.startTime) > this.timeToMinutes(this.state.endTime)) {
                [this.state.startTime, this.state.endTime] = [this.state.endTime, this.state.startTime];
            }
            
            this.triggerSelection();
            
            if (this.config.closeOnSelection) {
                this.closeTimePicker();
            }
        }
        
        this.updateInputValue();
        this.updateDisplay();
    }

    showHoverEffect(hoveredTime) {
        if (this.state.startTime && !this.state.endTime) {
            const timeBox = this.element.querySelector('.time-picker-box');
            const slots = timeBox.querySelectorAll('.time-slot');
            
            slots.forEach(slot => {
                slot.classList.remove('hover-range');
                const time = slot.dataset.time;
                const startMinutes = this.timeToMinutes(this.state.startTime);
                const hoveredMinutes = this.timeToMinutes(hoveredTime);
                const currentMinutes = this.timeToMinutes(time);
                
                const rangeStart = Math.min(startMinutes, hoveredMinutes);
                const rangeEnd = Math.max(startMinutes, hoveredMinutes);
                
                if (currentMinutes >= rangeStart && currentMinutes <= rangeEnd) {
                    slot.classList.add('hover-range');
                }
            });
        }
    }

    clearHoverEffect() {
        const timeBox = this.element.querySelector('.time-picker-box');
        const slots = timeBox.querySelectorAll('.time-slot');
        slots.forEach(slot => slot.classList.remove('hover-range'));
    }

    updateDisplay() {
        const timeBox = this.element.querySelector('.time-picker-box');
        const slots = timeBox.querySelectorAll('.time-slot');
        
        slots.forEach(slot => {
            const time = slot.dataset.time;
            slot.classList.remove('selected', 'start-selected', 'end-selected', 'in-range');
            
            if (this.state.startTime === time) {
                slot.classList.add('selected', 'start-selected');
            }
            
            if (this.state.endTime === time) {
                slot.classList.add('selected', 'end-selected');
            }
            
            if (this.state.startTime && this.state.endTime) {
                const startMinutes = this.timeToMinutes(this.state.startTime);
                const endMinutes = this.timeToMinutes(this.state.endTime);
                const currentMinutes = this.timeToMinutes(time);
                
                if (currentMinutes > startMinutes && currentMinutes < endMinutes) {
                    slot.classList.add('in-range');
                }
            }
        });
    }

    updateInputValue() {
        const input = this.element.querySelector('input');
        
        if (this.state.startTime && this.state.endTime) {
            input.value = `${this.state.startTime} - ${this.state.endTime}`;
        } else if (this.state.startTime) {
            input.value = this.state.startTime;
        } else {
            input.value = '';
        }
    }

    triggerSelection() {
        // Dispatch custom event with selection data
        const event = new CustomEvent('timeSelected', {
            detail: {
                startTime: this.state.startTime,
                endTime: this.state.endTime
            }
        });
        this.element.dispatchEvent(event);
    }

    setInitialValue() {
        if (this.state.startTime && this.state.endTime) {
            this.updateInputValue();
            this.updateDisplay();
        }
    }

    timeToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    destroy() {
        this.eventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        this.eventListeners = [];
        
        const timeBox = this.element.querySelector('.time-picker-box');
        if (timeBox) {
            timeBox.innerHTML = '';
        }
    }
}