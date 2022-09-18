class Instrument
{
    constructor(song)
    {
        this.song = song
        this.sheet = ""
        this.index = -1
        this.notes = []
        this.gain = 1
        this.type = "sine"
        this.attack = 2
        this.release = 20
        this.reverb = 0
    }
    
    clone(song)
    {
        const clone = new Instrument(song)
        clone.sheet = this.sheet
        clone.index = this.index
        clone.notes = this.notes
        clone.gain = this.gain
        clone.type = this.type
        clone.attack = this.attack
        clone.release = this.release
        clone.reverb = this.reverb
        return clone
    }
    
    build()
    {
        this.notes.splice(0, this.notes.length)
        
        const sheetNotes = this.sheet.trim()
            .replaceAll("\r", " ")
            .replaceAll("\n", " ")
            .replaceAll("\t", " ")
            .split(" ")
        
        for (const sheetNote of sheetNotes)
        {
            if (!sheetNote)
                continue
            
            if (sheetNote == "--")
            {
                const previousNote = this.notes[this.notes.length - 1]
                if (previousNote && previousNote.note == "--")
                {
                    previousNote.length++
                    continue
                }
                
                const note = new Note
                note.instrument = this
                this.notes.push(note)
                continue
            }
            
            if (sheetNote == "..")
            {
                const previousNote = this.notes[this.notes.length - 1]
                previousNote.length++
                continue
            }
            
            const note = new Note(sheetNote)
            note.instrument = this
            this.notes.push(note)
        }
    }
    
    async play()
    {
        this.build()
        
        const song = this.song
        const ctx = song.ctx
        
        this.dryNode = ctx.createGain()
        this.dryNode.gain.value = (1 - this.reverb) * this.gain
        this.dryNode.connect(song)
        
        if (ctx.reverbNode)
        {
            this.wetNode = ctx.createGain()
            this.wetNode.gain.value = this.reverb * this.gain
            this.wetNode.connect(ctx.reverbNode)
        }
        
        let index = 0
        this.stopped = false
        
        while (!this.stopped)
        {
            await this.notes[index++].play()
            if (index == this.notes.length)
            {
                if (song.repeat)
                {
                    index = 0
                    continue
                }
                break
            }
        }
        
        await Promise.delay(5000)
        
        this.dryNode.disconnect()
        
        if (this.wetNode)
            this.wetNode.disconnect()
    }
    
    stop()
    {
        this.stopped = true
    }
}