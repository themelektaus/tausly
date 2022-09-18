class Sprite
{
    constructor()
    {
        this.frames = []
        this.width = 0
        this.height = 0
    }
    
    add(value)
    {
        if (value instanceof Frame)
        {
            value.index = this.frames.length
            this.frames.push(value)
        }
    }
    
    setSize(width, height)
    {
        this.width = width
        this.height = height
    }
}