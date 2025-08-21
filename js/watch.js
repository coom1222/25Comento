document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const batteryPercentageSpan = document.getElementById('batteryPercentage');
    const clockDisplay = document.getElementById('clockDisplay');
    const currentDateSpan = document.getElementById('currentDate');
    const currentTimeSpan = document.getElementById('currentTime');
    const alarmHourInput = document.getElementById('alarmHour');
    const alarmMinuteInput = document.getElementById('alarmMinute');
    const alarmSecondInput = document.getElementById('alarmSecond');
    const addAlarmButton = document.getElementById('addAlarmButton');
    const alarmListUl = document.getElementById('alarmList');
    const body = document.body;

    // Battery Logic (FR1, FR2)
    let batteryPercentage = 100;

    const updateBatteryDisplay = () => {
        batteryPercentageSpan.textContent = batteryPercentage;
        if (batteryPercentage <= 0) {
            clockDisplay.classList.add('black-background');
            clearInterval(batteryInterval);
        }
    };

    const batteryInterval = setInterval(() => {
        if (batteryPercentage > 0) {
            batteryPercentage--;
            updateBatteryDisplay();
        }
    }, 1000);

    updateBatteryDisplay(); // Initial display

    // Clock Logic (FR1)
    const updateClock = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        currentDateSpan.textContent = `${year}-${month}-${day}`;
        currentTimeSpan.textContent = `${hours}:${minutes}:${seconds}`;
    };

    setInterval(updateClock, 1000);
    updateClock(); // Initial display

    // Alarm Logic (FR3, FR4, FR5)
    let alarms = []; // Stores { hour, minute, second }

    const updateAlarmList = () => {
        alarmListUl.innerHTML = '';
        if (alarms.length === 0) {
            alarmListUl.innerHTML = '<li>설정된 알람이 없습니다.</li>';
            return;
        }
        alarms.forEach((alarm, index) => {
            const li = document.createElement('li');
            const alarmTime = `${String(alarm.hour).padStart(2, '0')}:${String(alarm.minute).padStart(2, '0')}:${String(alarm.second).padStart(2, '0')}`;
            li.textContent = `알람 ${index + 1}: ${alarmTime}`;
            alarmListUl.appendChild(li);
        });
    };

    const addAlarm = () => {
        if (alarms.length >= 3) {
            alert('최대 3개의 알람만 설정할 수 있습니다.');
            return;
        }

        const hour = parseInt(alarmHourInput.value);
        const minute = parseInt(alarmMinuteInput.value);
        const second = parseInt(alarmSecondInput.value);

        if (isNaN(hour) || isNaN(minute) || isNaN(second) || hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
            alert('유효한 시, 분, 초를 입력해주세요.');
            return;
        }

        alarms.push({ hour, minute, second });
        // Sort alarms by time for consistent display and easier checking
        alarms.sort((a, b) => {
            if (a.hour !== b.hour) return a.hour - b.hour;
            if (a.minute !== b.minute) return a.minute - b.minute;
            return a.second - b.second;
        });

        updateAlarmList();

        // Clear input fields
        alarmHourInput.value = '';
        alarmMinuteInput.value = '';
        alarmSecondInput.value = '';
    };

    addAlarmButton.addEventListener('click', addAlarm);

    let isFlashing = false;

    const checkAlarms = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentSecond = now.getSeconds();

        let alarmTriggered = false;

        for (let i = alarms.length - 1; i >= 0; i--) {
            const alarm = alarms[i];
            const alarmTime = new Date();
            alarmTime.setHours(alarm.hour, alarm.minute, alarm.second, 0);

            const timeDiff = (alarmTime.getTime() - now.getTime()) / 1000; // Difference in seconds

            if (timeDiff > 0 && timeDiff <= 3) {
                // Alarm is within 3 seconds
                if (!isFlashing) {
                    body.classList.add('red-flash');
                    isFlashing = true;
                }
                alarmTriggered = true;
                break; // Only one alarm needs to trigger the flash
            } else if (timeDiff <= 0 && timeDiff > -1) { // Alarm time has just passed (within 1 second)
                // Alarm has just passed, remove it
                alarms.splice(i, 1);
                updateAlarmList();
                // If this was the only alarm triggering the flash, stop it
                if (!alarms.some(a => {
                    const tempAlarmTime = new Date();
                    tempAlarmTime.setHours(a.hour, a.minute, a.second, 0);
                    const tempTimeDiff = (tempAlarmTime.getTime() - now.getTime()) / 1000;
                    return tempTimeDiff > 0 && tempTimeDiff <= 3;
                })) {
                    body.classList.remove('red-flash');
                    isFlashing = false;
                }
            }
        }

        if (!alarmTriggered && isFlashing) {
            body.classList.remove('red-flash');
            isFlashing = false;
        }
    };

    setInterval(checkAlarms, 500); // Check alarms more frequently for better responsiveness
    updateAlarmList(); // Initial display
});
