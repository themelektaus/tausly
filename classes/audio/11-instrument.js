class Instrument extends BlendNode
{
    constructor(song)
    {
        super(song.ctx)
        this.song = song
        this.sheet = ""
        this.index = -1
        this.notes = []
        this.gain = 1
        this.type = "sine"
        this.attack = 1
        this.release = 20
    }
    
    clone(song)
    {
        const clone = new Instrument(song)
        clone.blend.value = this.blend.value
        clone.sheet = this.sheet
        clone.index = this.index
        clone.notes = this.notes
        clone.gain = this.gain
        clone.type = this.type
        clone.attack = this.attack
        clone.release = this.release
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
        
        if (!this.reverbNode)
        {
            this.reverbNode = await ctx.createReverb("reverb-impulse-response.m4a")
            this.reverbNode.connect(this.node2)
        }
        
        this.connect(song)
        
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
        
        if (!this.stopped)
            await Promise.delay(3000)
        
        this.disconnect(song)
    }
    
    stop()
    {
        this.stopped = true
    }
}