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
  [Editor](https://steinalt.online/tausly/editor)
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



## Documentation

As expected, there is no documentation... what a suprise.



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