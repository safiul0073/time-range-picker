# Time Range Picker Lite

A lightweight JavaScript library for selecting time ranges. Simply provide a single input field, and the package handles all the complex HTML and functionality behind the scenes.

## Features

- **Time range selection**: Select start and end times with visual range highlighting
- **Customizable time slots**: Configure hours range, intervals, and disabled times
- **Keyboard navigation**: Full keyboard support with Enter, Escape, and arrow keys
- **Responsive design**: Works on desktop and mobile devices
- **No dependencies**: Lightweight with no external dependencies
- **Modern UI**: Clean, modern interface with smooth animations
- **Accessibility**: Built with accessibility in mind

## Installation

Install the package via npm:

```bash
npm install time-range-picker-lite
```

## Quick Start

### Basic Usage

Just provide a single input field and the package will handle the rest:

```html
<input type="text" id="time-picker" placeholder="Select time range" />
```

```javascript
import { TimePicker } from "time-range-picker-lite";

const picker = new TimePicker({
  element: document.getElementById("time-picker"),
  onSelected: (start, end) => {
    console.log(`Selected: ${start} - ${end}`);
  },
});
```

### CDN Usage

```html
<script src="https://unpkg.com/time-range-picker-lite/dist/index.js"></script>
<link rel="stylesheet" href="https://unpkg.com/time-range-picker-lite/dist/time-picker.css" />

<input type="text" id="time-picker" placeholder="Select time range" />

<script>
  const { TimePicker } = window.TimePicker;
  new TimePicker({
    element: document.getElementById("time-picker"),
    onSelected: (start, end) => console.log(`Selected: ${start} - ${end}`),
  });
</script>
```

## Configuration Options

The TimePicker constructor accepts an options object with the following properties:

| Option         | Type        | Default                              | Description                                                   |
| -------------- | ----------- | ------------------------------------ | ------------------------------------------------------------- |
| `element`      | HTMLElement | **required**                         | The input element to transform into a time picker             |
| `placeholder`  | string      | `'Select time range'`                | Placeholder text for the input                                |
| `disableTime`  | string[]    | `[]`                                 | Array of time strings to disable (e.g., `['08:00', '12:00']`) |
| `selectedTime` | object      | `{ startTime: null, endTime: null }` | Pre-selected time range                                       |
| `onSelected`   | function    | `() => {}`                           | Callback when a time range is selected                        |
| `onOpen`       | function    | `() => {}`                           | Callback when dropdown opens                                  |
| `onClose`      | function    | `() => {}`                           | Callback when dropdown closes                                 |
| `startHour`    | number      | `1`                                  | Start hour for time slots (1-23)                              |
| `endHour`      | number      | `23`                                 | End hour for time slots (1-23)                                |
| `step`         | number      | `60`                                 | Time interval in minutes (30, 60, etc.)                       |

## Examples

### Basic Time Picker

```javascript
new TimePicker({
  element: document.getElementById("time-picker"),
  onSelected: (start, end) => {
    console.log(`Selected: ${start} - ${end}`);
  },
});
```

### With Disabled Times

```javascript
new TimePicker({
  element: document.getElementById("time-picker"),
  disableTime: ["08:00", "12:00", "18:00"],
  onSelected: (start, end) => {
    console.log(`Selected: ${start} - ${end}`);
  },
});
```

### Custom Hours Range (9 AM to 6 PM)

```javascript
new TimePicker({
  element: document.getElementById("time-picker"),
  startHour: 9,
  endHour: 18,
  onSelected: (start, end) => {
    console.log(`Selected: ${start} - ${end}`);
  },
});
```

### 30-Minute Intervals

```javascript
new TimePicker({
  element: document.getElementById("time-picker"),
  step: 30,
  onSelected: (start, end) => {
    console.log(`Selected: ${start} - ${end}`);
  },
});
```

### Pre-selected Values

```javascript
new TimePicker({
  element: document.getElementById("time-picker"),
  selectedTime: { startTime: "09:00", endTime: "17:00" },
  onSelected: (start, end) => {
    console.log(`Selected: ${start} - ${end}`);
  },
});
```

## API Methods

### Instance Methods

#### `getValue()`

Returns the currently selected time range as a string.

```javascript
const value = picker.getValue(); // Returns "09:00 - 17:00" or empty string
```

#### `setValue(startTime, endTime)`

Programmatically set a time range.

```javascript
picker.setValue("10:00", "15:00");
```

#### `clear()`

Clear the current selection.

```javascript
picker.clear();
```

#### `open()`

Open the dropdown.

```javascript
picker.open();
```

#### `close()`

Close the dropdown.

```javascript
picker.close();
```

#### `toggle()`

Toggle the dropdown open/closed.

```javascript
picker.toggle();
```

#### `destroy()`

Destroy the picker instance and restore the original input.

```javascript
picker.destroy();
```

## Events

### Callback Functions

You can provide callback functions in the options:

```javascript
new TimePicker({
  element: document.getElementById("time-picker"),
  onSelected: (start, end) => {
    // Called when a time range is selected
    console.log(`Selected: ${start} - ${end}`);
  },
  onOpen: () => {
    // Called when dropdown opens
    console.log("Dropdown opened");
  },
  onClose: () => {
    // Called when dropdown closes
    console.log("Dropdown closed");
  },
});
```

## Keyboard Navigation

- **Enter**: Toggle dropdown
- **Escape**: Close dropdown
- **Click**: Open/close dropdown and select time slots

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - feel free to use in your projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
