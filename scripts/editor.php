<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" type="image/x-icon" href="favicon.ico">
        
        <title>Tausly</title>
        
        <link rel="stylesheet" href="dejavu-sans.css">
        <link rel="stylesheet" href="style.css">
        
        <script src="tausly.js"></script>
        
        <script src="ace.js" defer></script>
        <script src="mode-tausly.js" defer></script>
        
        <script src="script.js"></script>
    </head>
    
    <body>
        
        <div id="wrapper">
            
            <div id="top-background"></div>
            
            <div id="side" class="visible" animate>
                <div class="select-wrapper">
                    <select>
                        <option value="_"></option>
                        <option value="" selected="selected">- Select File -</option>
                        <option value="_"></option>
                        <?php
                            $path = realpath(__DIR__ . "/../staging/code");
                            $files = glob("{$path}/*.tausly");
                            foreach ($files as $file):
                                $value = basename($file);
                        ?><option value="<?= $value ?>"><?= $value ?></option>
                        <?php
                            endforeach;
                        ?><option value="_"></option>
                    </select>
                </div>
                <div id="code"></div>
            </div>
            
            <div id="top" animate>
                <button id="play-button">Play</button>
                <button id="pause-button" disabled>Pause</button>
                <button id="stop-button" disabled>Stop</button>
                <button id="clear-button" disabled>Clear</button>
            </div>
            
            <div id="view" animate>
                <div id="empty" draggable="true">Press [F5] to run the application</div>
                <canvas></canvas>
            </div>
            
            <div id="log" animate></div>
            
            <div id="top-right">
                <button id="tools-button">Tools</button>
            </div>
            
            <div id="tools-background"></div>
            <div id="tools">
                <div class="tabs">
                    <div class="tabs__bar">
                        <div data-index="0" class="active">Image to Tausly</div>
                        <div data-index="1"></div>
                    </div>
                    <div class="tabs__content">
                        <div data-index="0" id="tool-image-to-tausly">
                            <label class="file-upload">
                                <input type="file">
                            </label>
                            <textarea readonly></textarea>
                        </div>
                        <div data-index="1" style="display: none; ">
                            
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        
    </body>
    
</html>