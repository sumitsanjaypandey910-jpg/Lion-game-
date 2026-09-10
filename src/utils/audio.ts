// Simple Web Audio API sound synthesizer for kid-friendly arcade feedback

class SoundEffects {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Baby lion friendly roar / purr sound
  public playRoar() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    // Cute cub roar: starts mid-pitch, drops and has vibrato
    osc1.frequency.setValueAtTime(260, now);
    osc1.frequency.exponentialRampToValueAtTime(140, now + 0.35);

    osc2.frequency.setValueAtTime(320, now);
    osc2.frequency.exponentialRampToValueAtTime(180, now + 0.35);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  }

  // Walking paw step sound
  public playStep(isLeft: boolean = true) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    const freq = isLeft ? 130 : 150;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Jump spring sound
  public playJump() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(550, now + 0.22);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Collect coin / paw / star chime
  public playCollect() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.15, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.22);
    });
  }

  // Color splash / paint bucket pop
  public playColorPop() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Correct match ding
  public playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C major arpeggio
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      gain.gain.setValueAtTime(0.18, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.38);
    });
  }

  // Gentle retry sound
  public playRetry() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Button tap click
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Adorable baby cub giggle / laughter (joyful chuckles with baby vowel formants)
  public playBabyGiggle() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // A sequence of 5 playful, rhythmic baby chuckles: "he-he-he-ha-ha!"
    const chuckles = [
      { start: 0.0, basePitch: 520, formant: 1800, dur: 0.08, vol: 0.18 },
      { start: 0.11, basePitch: 580, formant: 2000, dur: 0.08, vol: 0.22 },
      { start: 0.22, basePitch: 640, formant: 2150, dur: 0.09, vol: 0.25 },
      { start: 0.35, basePitch: 560, formant: 1750, dur: 0.11, vol: 0.24 },
      { start: 0.49, basePitch: 620, formant: 1900, dur: 0.14, vol: 0.22 },
      { start: 0.66, basePitch: 480, formant: 1600, dur: 0.18, vol: 0.18 },
    ];

    chuckles.forEach((c) => {
      const startTime = now + c.start;

      // Base pitch oscillator
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();

      osc1.type = 'sine';
      // Pitch inflection: rising inflection characteristic of baby giggle
      osc1.frequency.setValueAtTime(c.basePitch * 0.92, startTime);
      osc1.frequency.linearRampToValueAtTime(c.basePitch * 1.08, startTime + c.dur * 0.4);
      osc1.frequency.exponentialRampToValueAtTime(c.basePitch * 0.85, startTime + c.dur);

      gain1.gain.setValueAtTime(0.001, startTime);
      gain1.gain.linearRampToValueAtTime(c.vol, startTime + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, startTime + c.dur);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(startTime);
      osc1.stop(startTime + c.dur + 0.02);

      // Formant oscillator for cute baby voice timbre
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(c.formant, startTime);
      osc2.frequency.exponentialRampToValueAtTime(c.formant * 0.9, startTime + c.dur);

      gain2.gain.setValueAtTime(0.001, startTime);
      gain2.gain.linearRampToValueAtTime(c.vol * 0.35, startTime + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, startTime + c.dur);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(startTime);
      osc2.stop(startTime + c.dur + 0.02);
    });
  }

  // Joyful excited baby cheer ("Yaaay!" + happy squeals)
  public playBabyYay() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Gliding "Yaaay!" tone
    const osc = ctx.createOscillator();
    const formant = ctx.createOscillator();
    const gain = ctx.createGain();
    const fGain = ctx.createGain();

    osc.type = 'sine';
    formant.type = 'triangle';

    // Pitch sweeps enthusiastically upwards from 420Hz to 880Hz then gentle settle
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.22);
    osc.frequency.linearRampToValueAtTime(760, now + 0.45);

    formant.frequency.setValueAtTime(1400, now);
    formant.frequency.exponentialRampToValueAtTime(2200, now + 0.22);
    formant.frequency.linearRampToValueAtTime(1900, now + 0.45);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.05);
    gain.gain.setValueAtTime(0.2, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    fGain.gain.setValueAtTime(0.001, now);
    fGain.gain.linearRampToValueAtTime(0.07, now + 0.05);
    fGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    formant.connect(fGain);
    gain.connect(ctx.destination);
    fGain.connect(ctx.destination);

    osc.start(now);
    formant.start(now);
    osc.stop(now + 0.52);
    formant.stop(now + 0.52);

    // Followed by sweet little baby giggle
    setTimeout(() => {
      this.playBabyGiggle();
    }, 480);
  }

  // Soft happy baby cub coo / purr (friendly petting response)
  public playBabyCoo() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.3);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Grand celebration with fanfare AND joyful baby sound
  public playCelebrationWithBabySound(isCoin: boolean = false) {
    if (isCoin) {
      this.playCoinMilestoneCelebration();
    } else {
      this.playMilestoneFanfare();
    }
    // Baby cheer & joyful laughter chime in during the celebration
    setTimeout(() => {
      this.playBabyYay();
    }, 450);
  }

  // Soft hover pop sound with throttle
  private lastHoverTime: number = 0;
  public playHover() {
    const nowMs = Date.now();
    if (nowMs - this.lastHoverTime < 75) return; // Throttle to prevent audio clutter on rapid mouse movement
    this.lastHoverTime = nowMs;

    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle high woodblock/pop
    osc.frequency.setValueAtTime(820, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.04);

    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);
  }

  // Grand celebratory milestone fanfare (triumphant brass-like chords & arpeggios)
  public playMilestoneFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Chords sequence: C Major -> F Major -> G Major -> High C Major with triumph
    const sequence = [
      { notes: [261.63, 329.63, 392.0], time: 0.0, dur: 0.22 },       // C4, E4, G4
      { notes: [349.23, 440.0, 523.25], time: 0.24, dur: 0.22 },      // F4, A4, C5
      { notes: [392.0, 493.88, 587.33], time: 0.48, dur: 0.28 },      // G4, B4, D5
      { notes: [523.25, 659.25, 783.99, 1046.5], time: 0.78, dur: 0.8 }, // C5, E5, G5, C6 (Sustained)
    ];

    sequence.forEach((chord) => {
      chord.notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + chord.time);

        const startTime = now + chord.time;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + chord.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + chord.dur + 0.05);
      });
    });
  }

  // Sparkling golden coin celebration cascade (rich cascading coin jingles)
  public playCoinMilestoneCelebration() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Rapid joyful pentatonic coin cascade
    const coinPitches = [784, 988, 1175, 1318, 1568, 1976, 2349, 2637];
    coinPitches.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      const hitTime = now + idx * 0.06;
      gain.gain.setValueAtTime(0.14, hitTime);
      gain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(hitTime);
      osc.stop(hitTime + 0.3);
    });
  }

  // Badge unlock fanfare
  public playBadgeUnlock() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [440, 554.37, 659.25, 880]; // A major
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.45);
    });
  }
}

export const sounds = new SoundEffects();
