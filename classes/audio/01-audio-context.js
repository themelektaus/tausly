AudioContext.prototype.createReverb = async function(url)
{
    const reverbNode = this.createConvolver()
    
    if (!AudioContext.reverbNodeBuffer)
        AudioContext.reverbNodeBuffer = { }
    
    if (!AudioContext.reverbNodeBuffer[url])
    {
        await new Promise(resolve =>
        {
            fetch(url).then(x => x.arrayBuffer()).then(data =>
            {
                this.decodeAudioData(data, buffer =>
                {
                    AudioContext.reverbNodeBuffer[url] = buffer
                    resolve()
                })
            })
        })
    }
    reverbNode.buffer = AudioContext.reverbNodeBuffer[url]
    return reverbNode
}