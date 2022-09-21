class ImageToTausly
{
    static async loadFile(blob)
    {
        return await new Promise(resolve =>
        {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        })
    }
    
    static async loadImage(src)
    {
        return await new Promise(resolve =>
        {
            const img = new Image
            img.onload = () => resolve(img)
            img.src = src
        })
    }
    
    async generateCode(fileElement)
    {
        const src = await ImageToTausly.loadFile(fileElement)
        const img = await ImageToTausly.loadImage(src)
        
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext("2d")
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(img, 0, 0)
        
        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imgData.data
        
        const colorChars = [
            { chars: "#$&890WM", index: 0 },
            { chars: "DEHOPSXZ", index: 0 },
            { chars: ".-_+*:^~", index: 0 }
        ]
        const alternativeChar = { chars: "abcdefghijlkmnopqrstuvwxyz1234567ABCDFGIJKLNQRTUVY", index: 0 }
        
        const colorMap = { }
        
        const pixelMap = []
        for (let i = 0; i < img.height; i++)
            pixelMap.push([])
        
        for (let i = 0; i < data.length; i += 4)
        {
            let rgba = Array.from(data.slice(i, i + 4))
            
            let index = Math.max(0, Math.ceil(rgba.getLuminance() * colorChars.length) - 1)
            let colorChar = colorChars[index]
            if (colorChar.index >= colorChar.chars.length)
            {
                colorChar = alternativeChar
                if (colorChar.index >= colorChar.chars.length)
                    return null
            }
            
            rgba[3] = (rgba[3] / 255).toFixed(3)
            rgba = `rgba(${rgba.join(", ")})`
            
            if (colorMap[rgba] === undefined)
                colorMap[rgba] = colorChar.chars.charAt(colorChar.index++)
            
            index = Math.floor(i / 4 / img.width)
            pixelMap[index] += colorMap[rgba]
        }
        
        let result = ""
        result += `SPRITE "Untitled"\n`
        result += `  SIZE ${img.width}, ${img.height}\n`
        result += `  FRAME\n`
        
        const keys = Object.keys(colorMap)
        for (const key of keys)
            result += `    COLORMAP "${colorMap[key]}", "${key}"\n`
        
        for (const line of pixelMap)
            result += `    PIXELMAP "${line}"\n`
        
        result += `  END\n`
        result += `END\n`
        
        result += `\n`
        result += `COLOR "#445"\n`
        result += `FILL\n`
        result += `SCALE 10\n`
        result += `DRAW WIDTH / 2, HEIGHT / 2, "Untitled"\n`
        
        return result
    }
}