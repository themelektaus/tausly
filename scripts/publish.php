<?php
    
    header("Content-Type: text/plain");
    
    $root = __DIR__ . "/..";
    
    $editor_folder = "{$root}/editor";
    $staging_folder = "{$root}/staging";
    
    foreach ([ "", "code/" ] as $folder)
    {
        $editor_path = "{$editor_folder}/{$folder}";
        $staging_path = "{$staging_folder}/{$folder}";
        
        foreach (scandir($editor_path) as $file)
        {
            if ($file == "." or $file == "..")
                continue;
            
            $filename = "{$editor_path}{$file}";
            if (is_dir($filename))
                continue;
            
            echo "Unlink " . $filename . PHP_EOL;
            unlink($filename);
        }
        
        foreach (scandir($staging_path) as $file)
        {
            if ($file == "." or $file == "..")
                continue;
            
            if ($file == "index.php")
                continue;
            
            $filename = "{$staging_path}{$file}";
            if (is_dir($filename))
                continue;
            
            echo "Copy " . $filename . PHP_EOL;
            copy($filename, "{$editor_path}{$file}");
        }
    }
    
    ob_start();
    include __DIR__ . "/editor.php";
    $editor_html = ob_get_clean();
    
    file_put_contents("{$editor_folder}/index.html", $editor_html);
    
    copy("{$staging_folder}/favicon.ico", "{$root}/favicon.ico");
    copy("{$staging_folder}/reverb-impulse-response.m4a", "{$root}/reverb-impulse-response.m4a");
    copy("{$staging_folder}/tausly.js", "{$root}/tausly.js");
    