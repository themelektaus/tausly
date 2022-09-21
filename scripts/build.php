<?php
    
    $contents = "";
    
    foreach ([ "", "audio/", "block/", "line/", "sprite/", ] as $folder)
    {
        $path = realpath(__DIR__ . "/../classes");
        
        foreach (glob("{$path}/{$folder}*.js") as $file)
        {
            $contents .= "//------------------------------------------------------------------------------" . PHP_EOL;
            $contents .= "// * " . substr($file, strlen($path) + 1) . PHP_EOL;
            $contents .= "//------------------------------------------------------------------------------" . PHP_EOL . PHP_EOL;
            $contents .= file_get_contents($file) . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL;
        }
    }
    
    file_put_contents("../staging/tausly.js", trim($contents) . PHP_EOL);
    