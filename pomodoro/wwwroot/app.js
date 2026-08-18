class DualPomodoroTimer {
    constructor() {
        // Toggle button elements
        this.toggleConfigBtn = document.getElementById('toggleConfigBtn');
        this.settingsPanel = document.getElementById('settingsPanel');
        
        // DOM Elements - Work Timer
        this.workHours = document.getElementById('workHours');
        this.workMinutes = document.getElementById('workMinutes');
        this.workSeconds = document.getElementById('workSeconds');
        
        // DOM Elements - Break Timer
        this.breakHours = document.getElementById('breakHours');
        this.breakMinutes = document.getElementById('breakMinutes');
        this.breakSeconds = document.getElementById('breakSeconds');
        
        // Buttons
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.restartBtn = document.getElementById('restartBtn');
        
        this.workDisplay = document.getElementById('workDisplay');
        this.breakDisplay = document.getElementById('breakDisplay');
        this.workStatus = document.getElementById('workStatus');
        this.breakStatus = document.getElementById('breakStatus');
        
        this.workCard = document.getElementById('workTimer');
        this.breakCard = document.getElementById('breakTimer');

        // Labels for syncing
        this.workLabel = document.getElementById('workLabel');
        this.breakLabel = document.getElementById('breakLabel');
        this.workConfigLabel = document.getElementById('workConfigLabel');
        this.breakConfigLabel = document.getElementById('breakConfigLabel');

        // State
        this.isRunning = false;
        this.currentTimer = 'work'; // 'work' or 'break'
        this.workTotalSeconds = this.getWorkTotalSeconds();
        this.breakTotalSeconds = this.getBreakTotalSeconds();
        this.workTimeLeft = this.workTotalSeconds;
        this.breakTimeLeft = this.breakTotalSeconds;
        
        this.intervalId = null;

        // Event Listeners
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.restartBtn.addEventListener('click', () => this.restart());
        this.toggleConfigBtn.addEventListener('click', () => this.toggleConfiguration());
        
        this.workHours.addEventListener('change', () => this.updateWorkTime());
        this.workMinutes.addEventListener('change', () => this.updateWorkTime());
        this.workSeconds.addEventListener('change', () => this.updateWorkTime());
        
        this.breakHours.addEventListener('change', () => this.updateBreakTime());
        this.breakMinutes.addEventListener('change', () => this.updateBreakTime());
        this.breakSeconds.addEventListener('change', () => this.updateBreakTime());

        // Sync label changes
        this.workLabel.addEventListener('input', () => this.syncWorkLabel());
        this.breakLabel.addEventListener('input', () => this.syncBreakLabel());
        this.workConfigLabel.addEventListener('input', () => this.syncWorkConfigLabel());
        this.breakConfigLabel.addEventListener('input', () => this.syncBreakConfigLabel());

        // Initial display
        this.updateDisplay();
    }

    getWorkTotalSeconds() {
        const h = parseInt(this.workHours.value) || 0;
        const m = parseInt(this.workMinutes.value) || 0;
        const s = parseInt(this.workSeconds.value) || 0;
        return h * 3600 + m * 60 + s;
    }

    getBreakTotalSeconds() {
        const h = parseInt(this.breakHours.value) || 0;
        const m = parseInt(this.breakMinutes.value) || 0;
        const s = parseInt(this.breakSeconds.value) || 0;
        return h * 3600 + m * 60 + s;
    }

    start() {
        if (this.isRunning) return;

        // Update times from inputs
        this.workTotalSeconds = this.getWorkTotalSeconds();
        this.breakTotalSeconds = this.getBreakTotalSeconds();

        // Check if time is set
        if (this.workTotalSeconds === 0 || this.breakTotalSeconds === 0) {
            alert('Please set time for both Work and Workout timers');
            return;
        }

        // If both are 0, reset them
        if (this.workTimeLeft === 0) this.workTimeLeft = this.workTotalSeconds;
        if (this.breakTimeLeft === 0) this.breakTimeLeft = this.breakTotalSeconds;

        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.restartBtn.disabled = false;
        
        // Disable all inputs
        this.workHours.disabled = true;
        this.workMinutes.disabled = true;
        this.workSeconds.disabled = true;
        this.breakHours.disabled = true;
        this.breakMinutes.disabled = true;
        this.breakSeconds.disabled = true;

        // Start interval
        this.intervalId = setInterval(() => this.tick(), 1000);

        this.updateDisplay();
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.intervalId = null;

        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        // Enable all inputs
        this.workHours.disabled = false;
        this.workMinutes.disabled = false;
        this.workSeconds.disabled = false;
        this.breakHours.disabled = false;
        this.breakMinutes.disabled = false;
        this.breakSeconds.disabled = false;

        this.workStatus.textContent = '';
        this.breakStatus.textContent = '';
        this.workStatus.classList.remove('active');
        this.breakStatus.classList.remove('active');
        
        this.workCard.classList.remove('active');
        this.breakCard.classList.remove('active');

        this.updateDisplay();
    }

    restart() {
        // Stop the current timer
        this.pause();
        
        // Reset to initial state
        this.currentTimer = 'work';
        this.workTotalSeconds = this.getWorkTotalSeconds();
        this.breakTotalSeconds = this.getBreakTotalSeconds();
        this.workTimeLeft = this.workTotalSeconds;
        this.breakTimeLeft = this.breakTotalSeconds;
        
        // Disable restart button after restart
        this.restartBtn.disabled = true;

        this.updateDisplay();
    }

    tick() {
        if (this.currentTimer === 'work') {
            this.workTimeLeft--;
            if (this.workTimeLeft <= 0) {
                // Stop the interval during alarm
                clearInterval(this.intervalId);
                this.playSound();
                // Switch timer and resume after 3 seconds
                setTimeout(() => {
                    this.switchTimer();
                    this.updateDisplay();
                    // Resume the interval
                    this.intervalId = setInterval(() => this.tick(), 1000);
                }, 3000);
                return;
            }
        } else {
            this.breakTimeLeft--;
            if (this.breakTimeLeft <= 0) {
                // Stop the interval during alarm
                clearInterval(this.intervalId);
                this.playSound();
                // Switch timer and resume after 3 seconds
                setTimeout(() => {
                    this.switchTimer();
                    this.updateDisplay();
                    // Resume the interval
                    this.intervalId = setInterval(() => this.tick(), 1000);
                }, 3000);
                return;
            }
        }

        this.updateDisplay();
    }

    switchTimer() {
        if (this.currentTimer === 'work') {
            this.currentTimer = 'break';
            this.breakTimeLeft = this.breakTotalSeconds;
        } else {
            this.currentTimer = 'work';
            this.workTimeLeft = this.workTotalSeconds;
        }
    }

    updateDisplay() {
        this.workDisplay.textContent = this.formatTime(this.workTimeLeft);
        this.breakDisplay.textContent = this.formatTime(this.breakTimeLeft);

        // Update status and active state
        if (this.isRunning) {
            if (this.currentTimer === 'work') {
                this.workStatus.textContent = '► RUNNING';
                this.workStatus.classList.add('active');
                this.breakStatus.textContent = 'WAITING';
                this.breakStatus.classList.remove('active');
                
                this.workCard.classList.add('active');
                this.breakCard.classList.remove('active');
            } else {
                this.breakStatus.textContent = '► RUNNING';
                this.breakStatus.classList.add('active');
                this.workStatus.textContent = 'WAITING';
                this.workStatus.classList.remove('active');
                
                this.breakCard.classList.add('active');
                this.workCard.classList.remove('active');
            }
        }
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        } else {
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    }

    updateWorkTime() {
        if (!this.isRunning) {
            this.workTotalSeconds = this.getWorkTotalSeconds();
            this.workTimeLeft = this.workTotalSeconds;
            this.updateDisplay();
        }
    }

    updateBreakTime() {
        if (!this.isRunning) {
            this.breakTotalSeconds = this.getBreakTotalSeconds();
            this.breakTimeLeft = this.breakTotalSeconds;
            this.updateDisplay();
        }
    }

    playSound() {
        // Create beep-beep pattern for 3 seconds
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const beepDuration = 0.3; // Each beep lasts 300ms
        const pauseDuration = 0.2; // Pause between beeps
        const startTime = audioContext.currentTime;
        
        // Create beep pattern that repeats for 3 seconds
        for (let time = startTime; time < startTime + 3; time += beepDuration + pauseDuration) {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.frequency.value = 1000; // Hz
            oscillator.type = 'sine';

            // Fade in and out for smooth beep
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.4, time + 0.05);
            gain.gain.linearRampToValueAtTime(0.4, time + beepDuration - 0.05);
            gain.gain.linearRampToValueAtTime(0, time + beepDuration);

            oscillator.start(time);
            oscillator.stop(time + beepDuration);
        }
    }

    syncWorkLabel() {
        // Sync timer label with config label
        this.workConfigLabel.textContent = this.workLabel.textContent;
    }

    syncBreakLabel() {
        // Sync timer label with config label
        this.breakConfigLabel.textContent = this.breakLabel.textContent;
    }

    syncWorkConfigLabel() {
        // Sync config label with timer label
        this.workLabel.textContent = this.workConfigLabel.textContent;
    }

    syncBreakConfigLabel() {
        // Sync config label with timer label
        this.breakLabel.textContent = this.breakConfigLabel.textContent;
    }

    toggleConfiguration() {
        // Toggle the collapsed class on settings panel
        this.settingsPanel.classList.toggle('collapsed');
        // Toggle the collapsed class on button to rotate arrow
        this.toggleConfigBtn.classList.toggle('collapsed');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DualPomodoroTimer();
});
