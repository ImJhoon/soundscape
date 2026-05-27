/* ============================================================
   Aura Breathing Visualizer — app.js
   BreathingEngine + Timer + AmbientSound
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // ─── DOM References ─────────────────────────────────────
  const playBtn = document.getElementById("play-pause-btn");
  const playIcon = playBtn.querySelector(".material-symbols-outlined");
  const orb = document.getElementById("breathing-orb");
  const breatheText = document.getElementById("breathe-text");
  const phaseLabel = document.getElementById("phase-label");
  const timerDisplay = document.getElementById("timer-display");
  const soundToggle = document.getElementById("sound-toggle");
  const soundIcon = soundToggle.querySelector(".material-symbols-outlined");
  const volumeSliderContainer = document.getElementById(
    "volume-slider-container",
  );
  const volumeSlider = document.getElementById("volume-slider");
  const patternChips = document.querySelectorAll(".pattern-chip");
  const timerOptions = document.querySelectorAll(".timer-option");
  const completeOverlay = document.getElementById("timer-complete-overlay");
  const dismissBtn = document.getElementById("dismiss-complete");
  const resetBtn = document.getElementById("reset-btn");
  const phaseDurationChip = document.getElementById("phase-duration-chip");
  const progressLine = document.getElementById("progress-line");
  const patternDesc = document.getElementById("pattern-desc");

  // ─── Breathing Patterns ─────────────────────────────────
  const PATTERNS = {
    simple: {
      name: "Balance",
      desc: "자율 신경의 균형을 찾기 위해 들숨과 날숨의 길이를 맞춥니다. (4-4)",
      phases: [
        { label: "Breathe In...", phase: "INHALE", duration: 4 },
        { label: "Breathe Out...", phase: "EXHALE", duration: 4 },
      ],
    },
    box: {
      name: "Focus",
      desc: "순간적인 몰입과 집중력을 끌어올리는 네 단계 호흡법입니다. (4-4-4-4)",
      phases: [
        { label: "Breathe In...", phase: "INHALE", duration: 4 },
        { label: "Hold...", phase: "HOLD", duration: 4 },
        { label: "Breathe Out...", phase: "EXHALE", duration: 4 },
        { label: "Hold...", phase: "HOLD", duration: 4 },
      ],
    },
    relaxing: {
      name: "Relax",
      desc: "긴장을 풀고 깊은 휴식과 숙면을 준비하기 위한 호흡법입니다. (4-7-8)",
      phases: [
        { label: "Breathe In...", phase: "INHALE", duration: 4 },
        { label: "Hold...", phase: "HOLD", duration: 7 },
        { label: "Breathe Out...", phase: "EXHALE", duration: 8 },
      ],
    },
  };

  // ─── Themes ──────────────────────────────────────────────
  const THEMES = {
    midnight: {
      id: "midnight",
      name: "Midnight Serenity",
      desc: "Deep sky and stars",
      audioSrc: "sounds/meditation.mp3",
      bgColor: "#0F172A", // Slate 900
      bgClass: "aurora-bg",
      themeClass: "theme-midnight",
      primaryColor: "56, 189, 248", // Sky Blue
      orbColors: {
        INHALE: "56, 189, 248", // Sky Blue
        HOLD: "124, 58, 237", // Brand Purple
        EXHALE: "139, 92, 246", // Bright Lilac
      },
    },
    forest: {
      id: "forest",
      name: "Deep Forest",
      desc: "Rain on roof",
      audioSrc: "sounds/forest.mp3",
      bgColor: "#064E3B", // Emerald 900
      bgClass: "forest-bg",
      themeClass: "theme-forest",
      primaryColor: "16, 185, 129", // Emerald 500
      orbColors: {
        INHALE: "110, 231, 183", // Emerald 300
        HOLD: "16, 185, 129", // Emerald 500
        EXHALE: "52, 211, 153", // Emerald 400
      },
    },
    ocean: {
      id: "ocean",
      name: "Ocean Wave",
      desc: "Waves on beach",
      audioSrc: "sounds/ocean.mp3",
      bgColor: "#1E3A8A", // Blue 900
      bgClass: "ocean-bg",
      themeClass: "theme-ocean",
      primaryColor: "59, 130, 246", // Blue 500
      orbColors: {
        INHALE: "147, 197, 253", // Blue 300
        HOLD: "59, 130, 246", // Blue 500
        EXHALE: "96, 165, 250", // Blue 400
      },
    },
  };
  let currentThemeId = "midnight";

  function getCurrentTheme() {
    return THEMES[currentThemeId];
  }
  // ─── State ──────────────────────────────────────────────
  let currentPattern = "simple";
  let currentPhaseIndex = 0;
  let isPlaying = false;
  let phaseTimeout = null;

  let timerSeconds = 10 * 60; // 기본 10분
  let timerInterval = null;
  let timerRunning = false;

  let soundEnabled = false;

  // ═══════════════════════════════════════════════════════
  //  BreathingEngine
  // ═══════════════════════════════════════════════════════

  function getPattern() {
    return PATTERNS[currentPattern];
  }

  function getTotalCycleDuration() {
    return getPattern().phases.reduce((sum, p) => sum + p.duration, 0);
  }

  // ─── Color Animation Engine ──────────────────────────────
  let colorAnimationId = null;
  let currentColor = [56, 189, 248]; // Default: INHALE (Sky Blue)

  function lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  function parseRGB(rgbString) {
    return rgbString.split(",").map((n) => parseInt(n.trim(), 10));
  }

  function animateOrbColor(targetRGBString, durationMs = 1500) {
    if (colorAnimationId) cancelAnimationFrame(colorAnimationId);

    const startColor = [...currentColor];
    const targetColor = parseRGB(targetRGBString);
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      let progress = elapsed / durationMs;

      if (progress > 1) progress = 1;

      // ease-in-out curve
      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      currentColor[0] = Math.round(
        lerp(startColor[0], targetColor[0], easeProgress),
      );
      currentColor[1] = Math.round(
        lerp(startColor[1], targetColor[1], easeProgress),
      );
      currentColor[2] = Math.round(
        lerp(startColor[2], targetColor[2], easeProgress),
      );

      document.documentElement.style.setProperty(
        "--orb-color",
        `${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}`,
      );

      if (progress < 1) {
        colorAnimationId = requestAnimationFrame(step);
      }
    }
    colorAnimationId = requestAnimationFrame(step);
  }

  function updateOrbColor(phase) {
    const theme = getCurrentTheme();
    const rgb = theme.orbColors[phase] || theme.orbColors.INHALE;
    animateOrbColor(rgb, 1500); // 1.5초 동안 서서히 전환
  }

  function updateBreatheDuration() {
    const total = getTotalCycleDuration();
    document.documentElement.style.setProperty(
      "--breathe-duration",
      total + "s",
    );
  }

  function transitionText(newText) {
    breatheText.classList.add("exiting");

    setTimeout(() => {
      breatheText.textContent = newText;
      breatheText.classList.remove("exiting");
      breatheText.classList.add("entering");

      // 강제 리플로우 후 entering 제거
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          breatheText.classList.remove("entering");
        });
      });
    }, 400);
  }

  function runPhase() {
    if (!isPlaying) return;

    const pattern = getPattern();
    const phase = pattern.phases[currentPhaseIndex];

    // 텍스트 & 레이블 업데이트
    transitionText(phase.label);
    phaseLabel.textContent = phase.phase;
    if (phaseDurationChip) phaseDurationChip.textContent = phase.duration + "s";

    // 프로그레스 라인 애니메이션
    if (progressLine) {
      progressLine.style.transitionDuration = "0s";
      progressLine.style.width = "0%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progressLine.style.transitionDuration = phase.duration + "s";
          progressLine.style.width = "100%";
        });
      });
    }

    // 색상 전환
    updateOrbColor(phase.phase);

    // 다음 페이즈 예약
    phaseTimeout = setTimeout(() => {
      currentPhaseIndex = (currentPhaseIndex + 1) % pattern.phases.length;
      runPhase();
    }, phase.duration * 1000);
  }

  function startBreathing() {
    isPlaying = true;
    currentPhaseIndex = 0;
    updateBreatheDuration();
    orb.style.animationPlayState = "running";
    playIcon.textContent = "pause";
    runPhase();
  }

  function stopBreathing() {
    isPlaying = false;
    clearTimeout(phaseTimeout);
    orb.style.animationPlayState = "paused";
    playIcon.textContent = "play_arrow";
    breatheText.style.opacity = "0.5";
  }

  function resetBreathing() {
    stopBreathing();
    currentPhaseIndex = 0;
    breatheText.textContent = "Breathe In...";
    breatheText.style.opacity = "1";
    phaseLabel.textContent = "INHALE";
    updateOrbColor("INHALE");

    const initialPhase = getPattern().phases[0];
    if (phaseDurationChip)
      phaseDurationChip.textContent = initialPhase.duration + "s";
    if (progressLine) {
      progressLine.style.transitionDuration = "0.3s";
      progressLine.style.width = "0%";
    }
  }

  // ═══════════════════════════════════════════════════════
  //  Timer
  // ═══════════════════════════════════════════════════════

  let selectedMinutes = 10;

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timerSeconds);
  }

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;

    timerInterval = setInterval(() => {
      if (timerSeconds <= 0) {
        completeTimer();
        return;
      }
      timerSeconds--;
      updateTimerDisplay();
    }, 1000);
  }

  function pauseTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
  }

  function resetTimer() {
    pauseTimer();
    timerSeconds = selectedMinutes * 60;
    updateTimerDisplay();
  }

  function completeTimer() {
    pauseTimer();
    stopBreathing();

    // 싱잉볼 사운드 재생
    playSingingBowl();

    // 완료 오버레이 표시
    completeOverlay.classList.add("show");
  }

  function setTimerDuration(minutes) {
    selectedMinutes = minutes;
    timerSeconds = minutes * 60;
    updateTimerDisplay();

    // 모달 내 버튼 스타일 업데이트
    timerOptions.forEach((opt) => {
      const isActive = parseInt(opt.dataset.minutes) === minutes;
      opt.style.background = isActive
        ? "rgba(var(--color-primary), 0.1)"
        : "rgba(255,255,255,0.04)";
      const sub = opt.querySelector("span:last-child");
      if (sub) {
        sub.className = isActive ? "text-primary" : "text-on-surface-variant";
        sub.style.opacity = isActive ? "0.7" : "0.5";
      }
    });
  }

  // ═══════════════════════════════════════════════════════
  //  AmbientSound (Web Audio API - meditation.mp3)
  // ═══════════════════════════════════════════════════════

  let audioCtx = null;
  let ambientAudio = null;
  let trackNode = null;
  let ambientGain = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function initAmbientSound() {
    const ctx = getAudioCtx();

    const theme = getCurrentTheme();
    // HTML Audio element 생성
    ambientAudio = new Audio(theme.audioSrc);
    ambientAudio.loop = true;
    ambientAudio.preload = "auto";

    // Web Audio API 소스 노드 생성
    trackNode = ctx.createMediaElementSource(ambientAudio);

    ambientGain = ctx.createGain();
    ambientGain.gain.value = 0; // 초기 볼륨 0

    trackNode.connect(ambientGain);
    ambientGain.connect(ctx.destination);
  }

  function enableSound() {
    soundEnabled = true;
    soundIcon.textContent = "volume_up";
    soundToggle.classList.add("active");

    // 볼륨 슬라이더는 항상 표시되므로 가로 확장 로직 제거

    const ctx = getAudioCtx();
    if (ctx.state === "suspended") ctx.resume();

    if (!ambientAudio) {
      initAmbientSound();
    }

    // 오디오 재생 시작
    ambientAudio.play().catch((err) => {
      console.error("Audio play failed:", err);
    });

    // 페이드 인 (1.5초, 사용자 설정 볼륨)
    const targetVolume = parseFloat(volumeSlider.value);
    ambientGain.gain.cancelScheduledValues(ctx.currentTime);
    ambientGain.gain.setValueAtTime(ambientGain.gain.value, ctx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(
      targetVolume,
      ctx.currentTime + 1.5,
    );
  }

  function disableSound() {
    soundEnabled = false;
    soundIcon.textContent = "volume_off";
    soundToggle.classList.remove("active");

    // 볼륨 슬라이더는 항상 표시되므로 가로 축소 로직 제거

    if (ambientGain && ambientAudio) {
      const ctx = getAudioCtx();

      // 페이드 아웃 (1.5초)
      ambientGain.gain.cancelScheduledValues(ctx.currentTime);
      ambientGain.gain.setValueAtTime(ambientGain.gain.value, ctx.currentTime);
      ambientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);

      // 완전히 페이드 아웃 된 후 일시 정지
      setTimeout(() => {
        if (!soundEnabled && ambientAudio) {
          ambientAudio.pause();
        }
      }, 1500);
    }
  }

  function playSingingBowl() {
    const ctx = getAudioCtx();
    if (ctx.state === "suspended") ctx.resume();

    // 528Hz 사인파 (힐링 주파수)
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 528;

    // 두 번째 하모닉 (미세하게 겹침)
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 396;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.15, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(ctx.destination);
    gain2.connect(ctx.destination);

    osc.start();
    osc2.start();
    osc.stop(ctx.currentTime + 4);
    osc2.stop(ctx.currentTime + 5);
  }

  // ═══════════════════════════════════════════════════════
  //  Event Listeners
  // ═══════════════════════════════════════════════════════

  // Play / Pause
  playBtn.addEventListener("click", () => {
    if (isPlaying) {
      stopBreathing();
      pauseTimer();
    } else {
      breatheText.style.opacity = "1";
      startBreathing();
      startTimer();
    }
  });

  // Breathing Pattern Chips
  patternChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      patternChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentPattern = chip.dataset.pattern;

      updatePatternDescription();

      // 재생 중이면 재시작
      if (isPlaying) {
        clearTimeout(phaseTimeout);
        currentPhaseIndex = 0;
        updateBreatheDuration();
        runPhase();
      } else {
        updateBreatheDuration();
      }
    });
  });

  // Timer Duration Selection (Modal)
  timerOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
      setTimerDuration(parseInt(opt.dataset.minutes));

      // 모달 닫기
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("timerModal"),
      );
      if (modal) modal.hide();
    });
  });

  // Reset Button
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resetBreathing();
      resetTimer();
    });
  }

  // Sound Toggle
  soundToggle.addEventListener("click", () => {
    if (soundEnabled) {
      disableSound();
    } else {
      enableSound();
    }
  });

  // Volume Slider Input
  volumeSlider.addEventListener("input", (e) => {
    const value = parseFloat(e.target.value);

    // 사운드가 꺼져있는데 볼륨을 올리면 자동 재생 시작
    if (!soundEnabled && value > 0) {
      soundEnabled = true;
      soundToggle.classList.add("active");
      
      const ctx = getAudioCtx();
      if (ctx.state === "suspended") ctx.resume();
      if (!ambientAudio) {
        initAmbientSound();
      }
      ambientAudio.play().catch((err) => console.error("Audio play failed:", err));
    }
    
    // 볼륨을 0으로 내리면 일시정지 (음소거 상태로 전환)
    if (soundEnabled && value === 0) {
      soundEnabled = false;
      soundToggle.classList.remove("active");
      if (ambientAudio) {
        ambientAudio.pause();
      }
    }

    // 아이콘 동적 변경
    if (value === 0) {
      soundIcon.textContent = "volume_off";
    } else if (value < 0.4) {
      soundIcon.textContent = "volume_down";
    } else {
      soundIcon.textContent = "volume_up";
    }

    // Web Audio API 게인 노드 실시간 반영
    if (ambientGain) {
      const ctx = getAudioCtx();
      ambientGain.gain.cancelScheduledValues(ctx.currentTime); // 기존 페이드 효과 취소
      ambientGain.gain.setValueAtTime(value, ctx.currentTime);
    }
  });

  // Dismiss Timer Complete Overlay
  dismissBtn.addEventListener("click", () => {
    completeOverlay.classList.remove("show");
    resetTimer();
    resetBreathing();
  });

  // ═══════════════════════════════════════════════════════
  //  Theme Switcher
  // ═══════════════════════════════════════════════════════

  function changeTheme(themeId) {
    if (!THEMES[themeId]) return;
    currentThemeId = themeId;
    const theme = THEMES[themeId];

    // 1. 배경색 및 파티클 특수 효과 변경
    document.documentElement.style.setProperty(
      "--theme-bg-color",
      theme.bgColor,
    );
    document.documentElement.style.setProperty(
      "--color-primary",
      theme.primaryColor,
    );

    document.body.className = document.body.className.replace(
      /\btheme-\S+/g,
      "",
    );
    document.body.classList.add(theme.themeClass);

    const ambientBg = document.getElementById("ambient-bg");
    if (ambientBg) {
      ambientBg.className = `ambient-layer ${theme.bgClass}`;
    }

    // 2. Orb 색상 갱신
    if (isPlaying) {
      const pattern = getPattern();
      const phaseName = pattern.phases[currentPhaseIndex].phase;
      updateOrbColor(phaseName);
    } else {
      updateOrbColor("INHALE");
    }

    // 3. 오디오 교체 (크로스페이드)
    if (ambientAudio) {
      const wasPlaying = !ambientAudio.paused;
      const ctx = getAudioCtx();

      if (ambientGain) {
        ambientGain.gain.cancelScheduledValues(ctx.currentTime);
        ambientGain.gain.setValueAtTime(
          ambientGain.gain.value,
          ctx.currentTime,
        );
        ambientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0);
      }

      setTimeout(() => {
        ambientAudio.src = theme.audioSrc;
        ambientAudio.load();
        if (wasPlaying && soundEnabled) {
          ambientAudio
            .play()
            .then(() => {
              const targetVolume = parseFloat(volumeSlider.value);
              ambientGain.gain.cancelScheduledValues(ctx.currentTime);
              ambientGain.gain.setValueAtTime(0, ctx.currentTime);
              ambientGain.gain.linearRampToValueAtTime(
                targetVolume,
                ctx.currentTime + 1.5,
              );
            })
            .catch((err) => console.error("Audio resume error:", err));
        }
      }, 1000);
    }

    // 4. 모달 UI 렌더링 갱신
    renderThemeList();
  }

  function renderThemeList() {
    const listContainer = document.getElementById("theme-list");
    if (!listContainer) return;

    listContainer.innerHTML = "";
    Object.values(THEMES).forEach((theme) => {
      const isActive = theme.id === currentThemeId;
      const btn = document.createElement("button");
      btn.className = `timer-option btn btn-press text-start rounded-3 px-4 py-3 text-on-surface font-label-md d-flex justify-content-between align-items-center ${isActive ? "active" : ""}`;
      btn.style.background = isActive
        ? "rgba(var(--color-primary), 0.1)"
        : "rgba(255, 255, 255, 0.04)";
      btn.style.fontSize = "14px";

      btn.innerHTML = `
        <span>${theme.name}</span>
        <span class="${isActive ? "text-primary" : "text-on-surface-variant"}" style="font-size: 12px; opacity: ${isActive ? "0.7" : "0.5"}">${theme.desc}</span>
      `;

      btn.addEventListener("click", () => {
        changeTheme(theme.id);
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("themeModal"),
        );
        if (modal) modal.hide();
      });

      listContainer.appendChild(btn);
    });
  }

  function updatePatternDescription() {
    if (!patternDesc) return;
    const pattern = getPattern();
    patternDesc.style.opacity = "0";
    setTimeout(() => {
      patternDesc.textContent = pattern.desc;
      patternDesc.style.opacity = "0.6";
    }, 300);
  }

  // ═══════════════════════════════════════════════════════
  //  Initialization
  // ═══════════════════════════════════════════════════════

  document.documentElement.style.setProperty(
    "--theme-bg-color",
    THEMES[currentThemeId].bgColor,
  );
  document.documentElement.style.setProperty(
    "--color-primary",
    THEMES[currentThemeId].primaryColor,
  );
  document.body.classList.add(THEMES[currentThemeId].themeClass);
  const ambientBgInit = document.getElementById("ambient-bg");
  if (ambientBgInit) {
    ambientBgInit.className = `ambient-layer ${THEMES[currentThemeId].bgClass}`;
  }

  renderThemeList();
  updatePatternDescription();
  updateTimerDisplay();
  updateBreatheDuration();
  updateOrbColor("INHALE");
});
