class Note
{
    static Map = {
        "C": 1,
        "C#": 2, "Db": 2,
        "D": 3,
        "D#": 4, "Eb": 4,
        "E": 5,
        "F": 6,
        "F#": 7, "Gb": 7,
        "G": 8,
        "G#": 9, "Ab": 9,
        "A": 10,
        "A#": 11, "Bb": 11,
        "B": 12
    }
    
    constructor(note)
    {
        this.note = note
        this.length = 1
    }
    
    getFrequency()
    {
        const x = Note.Map[this.note.slice(0, -1)]
        const y = this.note.charAt(this.note.length - 1)
        const distance = x - 1 + (y * 12)
        return 440 * Math.pow(2, (distance - 57) / 12)
    }
    
    async play()
    {
        const instrument = this.instrument
        const song = instrument.song
        
        const length = this.length / song.timeSignature * (120 / song.bpm)
        
        let oscillator
        let gainNode
        
        if (this.note)
        {
            const ctx = song.ctx
            const time = ctx.currentTime
            const gain = instrument.gain
            
            const attack = Math.min(length / 2, instrument.attack / 1000)
            const release = Math.min(length / 2, instrument.release / 1000)
            
            gainNode = ctx.createGain()
            
            gainNode.gain.setValueAtTime(0, time)
            gainNode.gain.linearRampToValueAtTime(gain, time + attack)
            
            gainNode.gain.setValueAtTime(gain, time + length - release)
            gainNode.gain.linearRampToValueAtTime(0, time + length)
            
            gainNode.connect(instrument.dryNode)
            gainNode.connect(instrument.wetNode)
        
            oscillator = ctx.createOscillator()
            oscillator.type = instrument.type;
            oscillator.frequency.value = this.getFrequency()
            oscillator.connect(gainNode)
            oscillator.start()
        }
        
        await Promise.timeout(resolve =>
        {
            if (oscillator)
            {
                oscillator.stop()
                oscillator.disconnect()
                oscillator = undefined
            }
            if (gainNode)
            {
                gainNode.disconnect(instrument.dryNode)
                gainNode = undefined
            }
            resolve()
        }, length * 1100)
    }
}