# Tausly

**Tausly** is a sequential programming language and interpreter written in `JavaScript`.



## Features

- **Simplicity** | You just need some basic knowledge of writing code - That's it!
- **Game Loop** | The main reason for the existence of this project is
                  [Ludum Dare](https://ldjam.com/).
- **No dependencies** | Everything is written in Vanilla Javascript.
- **Like BASIC** | Yes, it is a feature.



## Demo
- Visit the
  [Editor](https://steinalt.online/tausly/editor#tetris)
  to see the current version in action.
- There is also a minimalistic
  [index.html](https://steinalt.online/tausly)



## Quick Start

Just intergrate
[tausly.js](https://raw.githubusercontent.com/themelektaus/tausly/master/tausly.js)
in your `head` section of your page:
```html
<script src="tausly.js"></script>
```
After that you can run Tausly by just running following script:
```html
<script>
  const tausly = new Tausly
  tausly.run(`ECHO "Hello, World!"`)
</script>
```
Then you should see the output of `ECHO` in the browser's developer console.

If you want to use a `canvas` try following snippet:
```html
<canvas width="400" height="300"></canvas>
<script>
  const tausly = new Tausly
  tausly.run(`COLOR "green" : FILL`)
</script>
```
You also can specify the destination canvas by using a selector:
```html
<canvas id="my-canvas" width="400" height="300"></canvas>
<script>
  const tausly = new Tausly("#my-canvas")
  tausly.run(`COLOR "purple" : FILL`)
</script>
```



## Development

### Quick Edit
Tausly is a single file called
[tausly.js](https://raw.githubusercontent.com/themelektaus/tausly/master/tausly.js).
Just edit it for your needs. The complete interpreter is mainly divided into classes.
It includes only one section called
[11-extensions.js](https://github.com/themelektaus/tausly/blob/master/classes/11-extensions.js)
which extends some base objects of JavaScript.

### Build
To build your own *tausly.js* just merge all the *.js-files inside of
[/classes](https://github.com/themelektaus/tausly/tree/master/classes)
alphabetically into one file. I my case I am using
[build.php](https://github.com/themelektaus/tausly/blob/master/scripts/build.php)
to generate
[tausly.js](https://raw.githubusercontent.com/themelektaus/tausly/master/tausly.js).




## Windows

You can execute Tausly code via a windows application called **Tausly Player**.
It is a ~7MB executable which registers as a default application for `.tausly`-files.
So you can run Tausly Code without needing your web browser.<br>Give it a try 😉
- Windows (x64) | https://github.com/themelektaus/tausly-player/releases
- GitHub | https://github.com/themelektaus/tausly-player



## Visual Studio Code Extension

There is also a VS Code Extension released for syntax highlighting:
- Marketplace | https://marketplace.visualstudio.com/items?itemName=tausi.tausly-lang
- GitHub | https://github.com/themelektaus/tausly-lang






## Examples

You can find some examples at
[/editor/code](https://github.com/themelektaus/tausly/tree/master/editor/code).

![](https://raw.githubusercontent.com/themelektaus/tausly/master/screenshots/screenshot-001.png)

It's a temporary replacement for the documentation at the moment.



## Limitations

There are of course a few limitations, some of which are intentional:
- `DIM` only can have a maximum of 3 dimensions
- Importing external resources like *Graphics* or *Audio* is not possible.
  You have to code everything by yourself by using
  `SPRITE`, `SONG`, `INSTRUMENT`, and so on...
  But there are some tools like **Image to Tausly**
- `GOSUB` is not able to `RETURN` if `GOTO`
  is called in the meantime.
- No WebGL



## Reference

### `ECHO <value>`
> By default it calls `console.log`. It can be overwritten by defining `onEcho` of a Tausly instance.
```
const tausly = new Tausly
tausly.onEcho = text => { }
```

### `LOG <value>`
> Typically used for debugging. It is like `ECHO` but ignores the `onEcho` override if there is any.

### `SLEEP <milliseconds>`
> Freezes the entier runtime application for a specified amount of **milliseconds**.

### `GOTO <label>`
> Jumps the cursor to the specified `label`.

### `GOSUB <label>`
> Jumps the cursor to the specified `label` and comes back if `RETURN` gets called.

### `RETURN`
> Jumps back to the last call of `GOSUB`.

### `RETURN TO <label>`
> Like `GOTO` but should be used if the cursor came from a `GOSUB` instruction.

### `END`
> Marks the ending of a **Block**.

### `NEXT`
> Skips the current iteration of a **Block**.

### `BREAK`
> Breaks out of the current **Block**.



### `NORMALIZE <dimName>`
> Normalizes a Vector. Here you have to parse the name of an `DIM(2)`. For example:
```
DIM(2) move
move(0) = 1
move(1) = 1
NORMALIZE move
```

### `SMOOTHDAMP <current>, <target>, <vel>, <smoothTime>[, <dt>, <maxSp>]`
> Works exactly like Unity's SmoothDamp Method<br>
- https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Mathf.cs
- https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Vector2.cs



### `SIZE <x>, <y>`
> Changes the size of the `canvas`.



### `CLEAR`
> Clears the canvas and calls `onClear` on the Tausly instance.

### `COLOR <string>`
> Sets the active color that should used for `FILL` and `TEXT`.

### `FILL`
> Fills the entier canvas by the active color.

### `FILL <x>, <y>, <width>, <height>`
> Fills the given area by the active color.



### `TEXT <x>, <y>, <text>`
> Write text inside the canvas at the given position.

### `TEXT <x>, <y>, <text>, <maxWidth>`
> Write text inside the canvas at the given position and takes usage of word wrapping by width.

### `TEXT <x>, <y>, <text>, <maxWidth>, <fullText>`
> Like above but with an additional argument called `fullText`. It behaves the same way, but if the `text` length is lower than `fullText` then the word wrapping is forced to the `fullText`.

### `ALIGN LEFT`
> Aligns text to the left (Default setting).

### `ALIGN CENTER`
> Aligns text to the center.

### `ALIGN RIGHT`
> Aligns text to the right.



### `DRAW <x>, <y>, <spriteName>`
> Draws the first `FRAME` of a `SPRITE`.

### `DRAW <x>, <y>, <spriteName>, <frameIndex>`
> Draws a `FRAME` of a `SPRITE`.

### `DRAW <x>, <y>, <spriteName>, <frameName>`
> Draws a `FRAME` of a `SPRITE`.



### `RESET`
> Resets all active transformations.

### `RESET <dimName>`
> Reset all value of a given `DIM`-name to `0`.



### `TRANSLATE <x>, <y>`
> &nbsp;

### `ROTATE <degrees>`
> &nbsp;

### `SCALE <value>`
> &nbsp;



### `DIM(x)`
> &nbsp;

### `DIM(x,y)`
> &nbsp;

### `DIM(x,y,z)`
> &nbsp;



### `PIXELMAP "??.."`
> &nbsp;

### `COLORMAP "?", "#??????"`
> &nbsp;



### `CURSOR SHOW`
> &nbsp;

### `CURSOR HIDE`
> &nbsp;



### `INIT <varName>`
> &nbsp;

### `INIT <varName> = <value>`
> &nbsp;

### `SET <varName> = <value>`
> &nbsp;

### `<varName> = <value>`
> &nbsp;



### `FUNC <name> RETURNS <value>`
> &nbsp;



### `GAIN <volume>`
> &nbsp;

### `BPM <bpm>`
> &nbsp;

### `TIME SIGNATURE <n>`
> &nbsp;

### `REPEAT <boolean>`
> &nbsp;

### `TYPE <name>`
> &nbsp;

### `REVERB <boolean>`
> &nbsp;

### `SHEET "?? ?? ?? ?? .."`
> &nbsp;

### `PLAY <songName>`
> &nbsp;

### `STOP <songName>`
> &nbsp;

### `ATTACK <milliseconds>`
> &nbsp;

### `RELEASE <milliseconds>`
> &nbsp;

### `SCOPE <name>`
> &nbsp;

### `WRITE <key>, <value>`
> &nbsp;



### `IF [NOT] <condition> AND .. OR .. [THEN]`
> &nbsp;

### `ELSE`
> &nbsp;

### `BEGIN TRANSFORM`
> &nbsp;

### `FOR <i> = <from> TO <to> [THEN]`
> &nbsp;

### `WHILE [NOT] <condition>`
> &nbsp;

### `BEGIN GAMELOOP [<fps>]`
> &nbsp;

### `LOOP`
> &nbsp;

### `SONG <name>`
> &nbsp;

### `INSTRUMENT [<name>]`
> &nbsp;

### `SPRITE <name>`
> &nbsp;

### `FRAME [<name>]`
> &nbsp;

### `BEGIN CLIP <x>, <y>, <width>, <height>`
> &nbsp;



### `<Label>:`
> &nbsp;

### `* <Label>`
> &nbsp;



## Constants
```
VALUE
FRAMETIME
DELTATIME
TIME
TRUE
FALSE
NULL
WIDTH
HEIGHT
FPS
MOUSEX
MOUSEY
```

## Functions
```
ROUND(x)
CEIL(x)
FLOOR(x)
CLAMP(x, min, max)
INPUT(key)
PRESS(key)
RELEASE(key)
INT(x)
MIN(a, b)
MAX(a, b)
RANDOM(min, max)
XRANDOM(minmax)
FPS(deltaTime)
LEN(x)
ABS(x)
SUM(dim)
READ(key)
READ(key, defaultValue)
```