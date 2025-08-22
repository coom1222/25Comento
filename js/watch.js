// js/watch.js

(function () {
    // ---------- DOM refs ----------
    const clockDisplay = document.getElementById('clockDisplay');
    const currentDateEl = document.getElementById('currentDate');
    const currentTimeEl = document.getElementById('currentTime');
    const batteryEl = document.getElementById('batteryPercentage');

    const alarmHourEl = document.getElementById('alarmHour');
    const alarmMinuteEl = document.getElementById('alarmMinute');
    const alarmSecondEl = document.getElementById('alarmSecond');
    const addAlarmBtn = document.getElementById('addAlarmButton');
    const alarmListEl = document.getElementById('alarmList');

    const containerEl = document.querySelector('.container');

    // ---------- State ----------
    let battery = 100;                 // 시작 100%
    let batteryTimerId = null;
    let clockTimerId = null;

    // 알람은 'HH:MM:SS' 문자열로 관리
    const MAX_ALARMS = 3;
    let alarms = [];

    // ---------- Utilities ----------
    const pad2 = (n) => String(n).padStart(2, '0');

    function formatDateTime(d = new Date()) {
        const yyyy = d.getFullYear();
        const mm = pad2(d.getMonth() + 1);
        const dd = pad2(d.getDate());
        const hh = pad2(d.getHours());
        const mi = pad2(d.getMinutes());
        const ss = pad2(d.getSeconds());
        return {
            date: `${yyyy}-${mm}-${dd}`,
            time: `${hh}:${mi}:${ss}`,
            full: `${yyyy}-${mm}-${dd}   ${hh}:${mi}:${ss}`,
        };
    }

    function getNowHms() {
        const { time } = formatDateTime(new Date());
        return time; // 'HH:MM:SS'
    }

    function renderClock() {
        const { date, time } = formatDateTime(new Date());
        currentDateEl.textContent = date;
        currentTimeEl.textContent = time;
    }

    function renderBattery() {
        batteryEl.textContent = battery;
    }

    function setBlackoutIfNeeded() {
        // 배터리가 0%가 되면, 시간 표시 영역만 검정 배경 + 글자 숨김
        // (CSS: .clock-display.black-background { background:#000; color:#000; })
        if (battery <= 0) {
            clockDisplay.classList.add('black-background');
        }
    }

    function startClock() {
        // 1초마다 현재 시간 업데이트 + 알람 체크
        if (clockTimerId) clearInterval(clockTimerId);
        clockTimerId = setInterval(() => {
            renderClock();
            tickAlarms();
        }, 1000);

        // 즉시 1회 렌더
        renderClock();
    }

    function startBattery() {
        // 1초마다 1% 감소(0%에서 멈춤)
        if (batteryTimerId) clearInterval(batteryTimerId);
        batteryTimerId = setInterval(() => {
            if (battery > 0) {
                battery -= 1;
                renderBattery();
                if (battery <= 0) {
                    battery = 0;
                    renderBattery();
                    setBlackoutIfNeeded();
                    // 배터리 0% 이후에도 시계는 계속 흐르지만
                    // 사용자는 검정 배경으로 시간은 보이지 않음 (요구사항)
                    clearInterval(batteryTimerId);
                }
            }
        }, 1000);

        // 즉시 1회 렌더
        renderBattery();
    }

    // ---------- Alarms ----------
    function normalizeAlarmInput() {
        const h = Number(alarmHourEl.value);
        const m = Number(alarmMinuteEl.value);
        const s = Number(alarmSecondEl.value);

        // 기본 검증
        if (
            Number.isNaN(h) || Number.isNaN(m) || Number.isNaN(s) ||
            h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59
        ) {
            return null;
        }
        return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
    }

    function renderAlarmList() {
        alarmListEl.innerHTML = '';

        if (alarms.length === 0) {
            const li = document.createElement('li');
            li.textContent = '등록된 알람이 없습니다.';
            li.style.color = '#888';
            alarmListEl.appendChild(li);
            return;
        }

        alarms.forEach((t, idx) => {
            const li = document.createElement('li');
            li.textContent = t;

            const delBtn = document.createElement('button');
            delBtn.textContent = '삭제';
            delBtn.style.marginLeft = '8px';
            delBtn.style.cursor = 'pointer';
            delBtn.onclick = () => {
                removeAlarm(idx);
            };

            li.appendChild(delBtn);
            alarmListEl.appendChild(li);
        });

        // 최대치 도달 시 버튼 비활성
        addAlarmBtn.disabled = alarms.length >= MAX_ALARMS;
    }

    function addAlarm() {
        const timeStr = normalizeAlarmInput();
        if (!timeStr) {
            alert('시/분/초를 올바르게 입력하세요.');
            return;
        }
        if (alarms.length >= MAX_ALARMS) {
            alert(`알람은 최대 ${MAX_ALARMS}개까지 가능합니다.`);
            return;
        }
        if (alarms.includes(timeStr)) {
            alert('이미 등록된 알람입니다.');
            return;
        }

        alarms.push(timeStr);
        renderAlarmList();
    }

    function removeAlarm(index) {
        alarms.splice(index, 1);
        renderAlarmList();
    }

    // 알람 체크: 현재 시각과 일치하면 알림 + 깜빡임 효과
    function tickAlarms() {
        if (alarms.length === 0) return;

        const now = getNowHms();
        const matchIndex = alarms.findIndex((t) => t === now);
        if (matchIndex !== -1) {
            // 간단한 알람 동작: 컨테이너 붉게 깜빡임 + alert
            containerEl.classList.add('red-flash');

            // 몇 초간 깜빡인 뒤 해제
            setTimeout(() => {
                containerEl.classList.remove('red-flash');
            }, 3000);

            // 알림창
            try {
                alert(`알람 시간입니다! (${alarms[matchIndex]})`);
            } catch (_) {
                // alert가 차단될 수 있어도 UI 깜빡임은 동작
            }

            // 한 번 울린 알람은 제거
            removeAlarm(matchIndex);
        }
    }

    // ---------- Event bindings ----------
    addAlarmBtn.addEventListener('click', addAlarm);

    // ---------- Init ----------
    function init() {
        renderClock();
        renderBattery();
        renderAlarmList();
        startClock();
        startBattery();
    }

    document.addEventListener('DOMContentLoaded', init);
})();