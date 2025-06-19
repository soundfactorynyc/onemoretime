// KnobController.js - Enhanced robust knob control system
export class KnobController {
    constructor(element, config = {}) {
        this.element = element;
        this.indicator = element.querySelector('.knob-indicator');
        this.valueDisplay = element.querySelector('.knob-value');
        
        // Enhanced configuration with defaults
        this.config = {
            min: parseFloat(element.dataset.min) || 0,
            max: parseFloat(element.dataset.max) || 100,
            value: parseFloat(element.dataset.value) || 50,
            step: parseFloat(element.dataset.step) || 0.1,
            precision: parseInt(element.dataset.precision) || 1,
            sensitivity: config.sensitivity || 0.5,
            inertia: config.inertia || 0.95,
            snapToStep: config.snapToStep !== false,
            onChange: config.onChange || (() => {}),
            onStart: config.onStart || (() => {}),
            onEnd: config.onEnd || (() => {})
        };
        
        // State management
        this.state = {
            isDragging: false,
            isAnimating: false,
            startAngle: 0,
            currentAngle: this.valueToAngle(this.config.value),
            velocity: 0,
            lastAngle: 0,
            touchIdentifier: null
        };
        
        // Performance optimization
        this.rafId = null;
        this.lastUpdate = 0;
        this.updateThrottle = 16; // 60fps
        
        this.init();
    }
    
    init() {
        this.updateDisplay();
        this.setupEventListeners();
        this.startInertiaLoop();
    }
    
    setupEventListeners() {
        // Mouse events
        this.element.addEventListener('mousedown', e => this.handleStart(e));
        document.addEventListener('mousemove', e => this.handleMove(e));
        document.addEventListener('mouseup', e => this.handleEnd(e));
        
        // Touch events with better support
        this.element.addEventListener('touchstart', e => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            this.state.touchIdentifier = touch.identifier;
            this.handleStart(touch);
        });
        
        document.addEventListener('touchmove', e => {
            const touch = Array.from(e.changedTouches).find(
                t => t.identifier === this.state.touchIdentifier
            );
            if (touch) this.handleMove(touch);
        });
        
        document.addEventListener('touchend', e => {
            const touch = Array.from(e.changedTouches).find(
                t => t.identifier === this.state.touchIdentifier
            );
            if (touch) {
                this.state.touchIdentifier = null;
                this.handleEnd(touch);
            }
        });
        
        // Keyboard support
        this.element.setAttribute('tabindex', '0');
        this.element.addEventListener('keydown', e => this.handleKeyboard(e));
        
        // Double click to reset
        this.element.addEventListener('dblclick', () => this.reset());
    }
    
    handleStart(e) {
        this.state.isDragging = true;
        this.element.classList.add('dragging');
        
        const rect = this.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        this.state.startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        this.state.lastAngle = this.state.startAngle;
        this.state.velocity = 0;
        
        this.config.onStart(this.config.value);
    }
    
    handleMove(e) {
        if (!this.state.isDragging || !e) return;
        
        const now = performance.now();
        if (now - this.lastUpdate < this.updateThrottle) return;
        this.lastUpdate = now;
        
        const rect = this.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        
        // Calculate angle delta with proper wrapping
        let deltaAngle = currentAngle - this.state.lastAngle;
        if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
        if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;
        
        // Apply sensitivity
        deltaAngle *= this.config.sensitivity;
        
        // Update velocity for inertia
        this.state.velocity = deltaAngle;
        this.state.lastAngle = currentAngle;
        
        // Update angle with constraints
        this.state.currentAngle += deltaAngle;
        this.state.currentAngle = Math.max(-2.4, Math.min(2.4, this.state.currentAngle));
        
        // Convert to value and apply step snapping
        let newValue = this.angleToValue(this.state.currentAngle);
        if (this.config.snapToStep) {
            newValue = Math.round(newValue / this.config.step) * this.config.step;
        }
        
        // Clamp to bounds
        newValue = Math.max(this.config.min, Math.min(this.config.max, newValue));
        
        if (newValue !== this.config.value) {
            this.config.value = newValue;
            this.updateDisplay();
            this.config.onChange(this.config.value);
        }
    }
    
    handleEnd(e) {
        if (!this.state.isDragging) return;
        
        this.state.isDragging = false;
        this.element.classList.remove('dragging');
        
        this.config.onEnd(this.config.value);
    }
    
    handleKeyboard(e) {
        let delta = 0;
        
        switch(e.key) {
            case 'ArrowUp':
            case 'ArrowRight':
                delta = this.config.step;
                break;
            case 'ArrowDown':
            case 'ArrowLeft':
                delta = -this.config.step;
                break;
            case 'PageUp':
                delta = this.config.step * 10;
                break;
            case 'PageDown':
                delta = -this.config.step * 10;
                break;
            case 'Home':
                this.setValue(this.config.min);
                return;
            case 'End':
                this.setValue(this.config.max);
                return;
            default:
                return;
        }
        
        e.preventDefault();
        this.setValue(this.config.value + delta);
    }
    
    startInertiaLoop() {
        const inertiaStep = () => {
            if (!this.state.isDragging && Math.abs(this.state.velocity) > 0.001) {
                this.state.velocity *= this.config.inertia;
                this.state.currentAngle += this.state.velocity;
                this.state.currentAngle = Math.max(-2.4, Math.min(2.4, this.state.currentAngle));
                
                const newValue = this.angleToValue(this.state.currentAngle);
                if (newValue !== this.config.value) {
                    this.setValue(newValue);
                }
            }
            
            this.rafId = requestAnimationFrame(inertiaStep);
        };
        
        inertiaStep();
    }
    
    setValue(value) {
        value = Math.max(this.config.min, Math.min(this.config.max, value));
        
        if (this.config.snapToStep) {
            value = Math.round(value / this.config.step) * this.config.step;
        }
        
        this.config.value = value;
        this.state.currentAngle = this.valueToAngle(value);
        this.updateDisplay();
        this.config.onChange(value);
    }
    
    reset() {
        const defaultValue = parseFloat(this.element.dataset.value) || 
                           (this.config.min + this.config.max) / 2;
        this.setValue(defaultValue);
        this.state.velocity = 0;
    }
    
    valueToAngle(value) {
        const normalized = (value - this.config.min) / (this.config.max - this.config.min);
        return (normalized - 0.5) * 4.8; // -2.4 to 2.4 radians
    }
    
    angleToValue(angle) {
        const normalized = (angle + 2.4) / 4.8;
        return this.config.min + normalized * (this.config.max - this.config.min);
    }
    
    updateDisplay() {
        const degrees = this.state.currentAngle * (180 / Math.PI);
        this.indicator.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
        
        const displayValue = this.config.max > 10 ? 
            Math.round(this.config.value) : 
            this.config.value.toFixed(this.config.precision);
            
        this.valueDisplay.textContent = displayValue;
        
        // Update aria attributes for accessibility
        this.element.setAttribute('aria-valuenow', this.config.value);
        this.element.setAttribute('aria-valuemin', this.config.min);
        this.element.setAttribute('aria-valuemax', this.config.max);
    }
    
    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        // Remove event listeners
        this.element.removeEventListener('mousedown', this.handleStart);
        this.element.removeEventListener('touchstart', this.handleStart);
        this.element.removeEventListener('keydown', this.handleKeyboard);
        this.element.removeEventListener('dblclick', this.reset);
    }
}
