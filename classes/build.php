<?php
    
    $contents = "";
    
    foreach ([ "", "audio/", "block/", "line/", "sprite/", ] as $folder)
    {
        foreach (glob(__DIR__ . "/{$folder}*.js") as $file)
        {
            $contents .= "//------------------------------------------------------------------------------" . PHP_EOL;
            $contents .= "// * classes" . substr($file, strlen(__DIR__)) . PHP_EOL;
            $contents .= "//------------------------------------------------------------------------------" . PHP_EOL . PHP_EOL;
            $contents .= file_get_contents($file) . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL;
        }
    }
    
    file_put_contents("../staging/tausly.js", trim($contents) . PHP_EOL);
    