AudioContext.prototype.getReverbNode = async function()
{
    if (AudioContext.reverbNode === undefined)
    {
        AudioContext.reverbNode = null
        try
        {
            const buffer = await fetch("reverb-impulse-response.m4a")
                .then(x => x.arrayBuffer())
                .then(audioData => this.decodeAudioData(audioData))
            
            AudioContext.reverbNode = this.createConvolver()
            AudioContext.reverbNode.buffer = buffer
        }
        catch
        {
            
        }
    }
    return AudioContext.reverbNode
}