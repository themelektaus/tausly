<?php
    
    $contents = "";
    
    foreach ([ "", "block/", "line/" ] as $folder)
    {
        foreach (glob("{$folder}*.js") as $file)
        {
            $contents .= "//------------------------------------------------------------------------------" . PHP_EOL;
            $contents .= "// * {$file}" . PHP_EOL;
            $contents .= "//------------------------------------------------------------------------------" . PHP_EOL . PHP_EOL;
            $contents .= file_get_contents($file) . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL;
        }
    }
    
    file_put_contents("../tausly.js", trim($contents) . PHP_EOL);
    