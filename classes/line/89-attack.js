class AttackLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("ATTACK", 1)
        if (matches)
        {
            const line = new AttackLine(options)
            line.value = +matches[1]
            return line
        }
        
        return null
    }
    
    * step()
    {
        const instrument = this.root.getHistory("INSTRUMENT")
        instrument[0].instrument.attack = this.value
    }
}