class Blend
{
    constructor(blendNode)
    {
        this.blendNode = blendNode
        this.value = 0
    }
    
    get value()
    {
        return this.blendNode.node2.gain.value
    }
    
    set value(val)
    {
        this.blendNode.node1.gain.value = 1 - val
        this.blendNode.node2.gain.value = val
    }
}