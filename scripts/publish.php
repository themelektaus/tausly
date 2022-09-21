<?php
    
    $root = __DIR__ . "/..";
    
    $editor_folder = "{$root}/editor";
    $staging_folder = "{$root}/staging";
    
    foreach (scandir($editor_folder) as $file)
    {
        if ($file == "." or $file == "..")
            continue;
        
        unlink("{$editor_folder}/{$file}");
    }
    
    foreach (scandir($staging_folder) as $file)
    {
        if ($file == "." or $file == "..")
            continue;
        
        if ($file == "index.php")
            continue;
        
        copy("{$staging_folder}/{$file}", "{$editor_folder}/{$file}");
    }
    
    copy(__DIR__ . "/editor.html", "{$editor_folder}/index.html");
    
    copy("{$staging_folder}/favicon.ico", "{$root}/favicon.ico");
    copy("{$staging_folder}/reverb-impulse-response.m4a", "{$root}/reverb-impulse-response.m4a");
    copy("{$staging_folder}/tausly.js", "{$root}/tausly.js");
    