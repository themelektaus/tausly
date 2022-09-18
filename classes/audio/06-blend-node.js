class BlendNode
{
    constructor(ctx)
    {
        this.node1 = ctx.createGain()
        this.node2 = ctx.createGain()
        this.blend = new Blend(this)
    }
    
    connect(node)
    {
        this.node1.connect(node)
        this.node2.connect(node)
    }
    
    disconnect(node)
    {
        this.node1.disconnect(node)
        this.node2.disconnect(node)
    }
}