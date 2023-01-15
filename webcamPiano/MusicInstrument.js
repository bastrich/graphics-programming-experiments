class MusicInstrument {

  constructor(minFreq, maxFreq) {
    this.monoSynth = new p5.MonoSynth();
  }

  play(freq, amp) {
    this.monoSynth.play(freq, amp, 0, 1/6);
  }
}
