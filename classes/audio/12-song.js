class Song extends GainNode
{
    constructor(ctx)
    {
        super(ctx)
        this.ctx = ctx
        this.bpm = 120
        this.timeSignature = 4
        this.repeat = false
        this.instruments = []
    }
    
    clone()
    {
        const clone = new Song(this.ctx)
        clone.gain.value = this.gain.value
        clone.bpm = this.bpm
        clone.timeSignature = this.timeSignature
        clone.repeat = this.repeat
        for (const instrument of this.instruments)
            clone.instruments.push(instrument.clone(clone))
        return clone
    }
    
    add(value)
    {
        if (value instanceof Instrument)
        {
            value.index = this.instruments.length
            this.instruments.push(value)
        }
    }
    
    async play()
    {
        const promises = []
        
        for (const instrument of this.instruments)
            promises.push(instrument.play())
        
        await Promise.all(promises)
    }
    
    stop()
    {
        for (const instrument of this.instruments)
            instrument.stop()
    }
}