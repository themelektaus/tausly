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
- Importing external resources like *Graphics* or *Sounds* are not possible.
  You have to code everything by yourself by using
  `SPRITE`, `SONG`, `INSTRUMENT`, and so on...
  But there are some tools like **Image to Tausly**
- `GOSUB` is not able to `RETURN` if `GOTO`
  is called in the meantime.
- No WebGL



# Reference

## Instructions



### Console Output

#### ECHO *value*
```
ECHO "Hello, World!"
```
By default it is just `console.log(value)`.
It can be overwritten by defining `onEcho`.
```
const tausly = new Tausly
tausly.onEcho = text => { }
```

#### LOG *value*
Typically used for debugging. It is like `ECHO` but is ignoring the `onEcho` override.



### Waiting
#### SLEEP *milliseconds*
Freeze the entier runtime application for a specified amount of *milliseconds*.



### Labels
Labels can wrote with a leading `*` or trailing `:` like so:
```
* MyLabel:
 Do some awesome stuff
```
```
MyLabel:
 Do some other stuff
```

#### GOTO *MyLabel*
Jump to the row with the specified Label called *MyLabel*.

#### GOSUB *MyLabel*
Jump to the row with the specified Label called *MyLabel*
and jump back to row where coming from if `RETURN` was called.

#### RETURN
Jump back to the last row where `GOSUB` was called.

#### RETURN TO *MyLabel*
Like `GOTO` but should be used if coming from a `GOSUB` instruction.



### Calculations

#### NORMALIZE *vector*
Normalize a `DIM(2)`.
```
DIM(2) vector
move(0) = 1
move(1) = 1
NORMALIZE vector
```

#### SMOOTHDAMP *current*, *target*, *vel*, *smoothTime*, *dt*, *maxSp*
The arguments *dt* and *maxSp* are optional.<br>
It works exactly like Unity's SmoothDamp Method<br>
- https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Mathf.cs
- https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Vector2.cs



### Canvas

#### SIZE *x*, *y*
Change the size of the canvas.

#### CLEAR
Clear the entier canvas. It also calls the `onClear` callback.

#### BEGIN CLIP *x*, *y*, *width*, *height*
Limit all drawcalls to an area until the `END` keyword.

<!--
`CURSOR SHOW`
`CURSOR HIDE`
-->



### Rendering

#### COLOR *value*
Set the active color. It is used by `FILL` and `TEXT`.
```
COLOR "green"
  or
COLOR "#00FF00"
  or
COLOR "rgba(0, 255, 0, 1.0)"
```
#### FILL
Fill the entier canvas by the active color.

#### FILL *x*, *y*, *width*, *height*
Fill the given area by the active color.



### Text

#### ALIGN LEFT
Align text to the left (default setting).

#### ALIGN CENTER
Align text to the center.

#### ALIGN RIGHT
Align text to the right.

#### TEXT *x*, *y*, *text*
Write *text* on the canvas at the position *x* and *y*.

#### TEXT *x*, *y*, *text*, *maxWidth*
Write *text* on the canvas at the position *x* and *y* and take usage of word wrapping by *maxWidth*.

#### TEXT *x*, *y*, *text*, *maxWidth*, *fullText*
It behaves the same way like above, but the word wrapping is forced to the *fullText*.




### Sprites

Before Sprites can be drawn they have to be defined.
A sprite is a **Block** instruction and must have a name and a nested `SIZE`.
Every `SPRITE` can have multiple frames but it needs to have at least one `FRAME`.
The `FRAME` itself is a **Block** too.
The name of it is optional.
Inside `FRAME` are finally the color and pixel informations.
```
SPRITE "Hero"
  SIZE 12, 12
  FRAME "Front"
    COLORMAP "#", "black"
    COLORMAP ".", "#FC9"
    COLORMAP "-", "#9999CC"
    PIXELMAP "    ####    "
    PIXELMAP "  ##....##  "
    PIXELMAP " #........# "
    PIXELMAP " #........# "
    PIXELMAP " #.##..##.# "
    PIXELMAP " #........# "
    PIXELMAP " #...##...# "
    PIXELMAP "  #......#  "
    PIXELMAP " #-######-# "
    PIXELMAP "#.#------#.#"
    PIXELMAP " ##--##--## "
    PIXELMAP "   ##  ##   "
  END
END
```

#### DRAW *x*, *y*, *spriteName*
Draw the first `FRAME` of a `SPRITE`.
```
DRAW 10, 20, "Hero"
```

#### DRAW *x*, *y*, *spriteName*, *frameIndex*
Draw a `FRAME` by index of a `SPRITE`.
```
DRAW 10, 20, "Hero", 0
```
#### DRAW *x*, *y*, *spriteName*, *frameName*
Draw a `FRAME` by name of a `SPRITE`.
```
DRAW 10, 20, "Hero", "Front"
```


<!--
### Transformation

#### TRANSLATE \<x\>, \<y\>
> &nbsp;

#### ROTATE \<degrees\>
> &nbsp;

#### SCALE \<value\>
> &nbsp;

#### RESET
Resets all active transformations.
-->



<!--
### Variables

#### INIT \<varName\>
> &nbsp;

#### INIT \<varName\> = \<value\>
> &nbsp;

#### SET \<varName\> = \<value\>
> &nbsp;

#### \<varName\> = \<value\>
> &nbsp;



### Dimensions

#### DIM(*x*)
> &nbsp;

#### DIM(*x*,*y*)
> &nbsp;

#### DIM(*x*,*y*,`z`)
> &nbsp;

#### RESET \<dimName\>
Set all value to `0` of a dimension called `dimName`.
-->



<!--
#### FUNC \<name\> RETURNS \<value\>
> &nbsp;
-->



<!--
### Audio

#### SONG \<name\>
> &nbsp;

#### GAIN \<volume\>
> &nbsp;

#### BPM \<bpm\>
> &nbsp;

#### TIME SIGNATURE \<n\>
> &nbsp;

#### REPEAT \<boolean\>
> &nbsp;

#### INSTRUMENT [\<name\>]
> &nbsp;

#### TYPE \<name\>
> &nbsp;

#### REVERB \<boolean\>
> &nbsp;

#### ATTACK \<milliseconds\>
> &nbsp;

#### RELEASE \<milliseconds\>
> &nbsp;

#### SHEET "C0 .. D1 E2 F3 --"
> &nbsp;

#### PLAY \<songName\>
> &nbsp;

#### STOP \<songName\>
> &nbsp;
-->



<!--
#### SCOPE \<name\>
> &nbsp;

#### WRITE \<key\>, \<value\>
> &nbsp;
-->



<!--
#### IF [NOT] \<condition\> AND .. OR .. [THEN]
> &nbsp;

#### ELSE
> &nbsp;

#### BEGIN TRANSFORM
> &nbsp;

#### FOR \<i\> = \<from\> TO \<to\> [THEN]
> &nbsp;

#### WHILE [NOT] \<condition\>
> &nbsp;

#### BEGIN GAMELOOP [\<fps\>]
> &nbsp;

#### LOOP
> &nbsp;
-->



<!--
#### END
Marks the ending of a **Block**.

#### NEXT
Skips the current iteration of a **Block**.

#### BREAK
Breaks out of the current **Block**.
-->



<!--
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
-->

## Stay tuned
The rest of the documentation will follow...