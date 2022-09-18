class Frame
{
    constructor(sprite)
    {
        this.sprite = sprite
        this.index = -1
        
        this.canvas = document.createElement("canvas")
        this.canvas.width = sprite.width
        this.canvas.height = sprite.height
        
        this.ctx = this.canvas.getContext("2d")
        this.ctx.refresh()
    }
    
    burn()
    {
        this.image = new Image
        this.image.src = this.canvas.toDataURL()
        
        delete this.ctx
        delete this.canvas
    }
}