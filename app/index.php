<!DOCTYPE html>

<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <base href="/">

    <title>Zefenify • Ethiopian. Music.</title>
<?php
$cardAPI = 'https://zefenify.com/api/card';
$opts = [
  'http' => [
    'method' => 'GET',
    'header' => "User-Agent: Zefenify\r\n",
  ],
];

$context = stream_context_create($opts);
$meta = file_get_contents("{$cardAPI}?url={$_SERVER['REQUEST_URI']}", false, $context);
echo $meta;
?>
    <meta name="keywords" content="Ethiopian Music">
    <meta name="description" content="Ethiopian. Music.">
    <meta name="author" content="Utopiaio">
    <meta name="google" content="notranslate">
    <meta name="application-name" content="Zefenify"/>
    <meta name="msapplication-TileColor" content="#FFFFFF" />
    <meta name="msapplication-TileImage" content="static/image/mstile-144x144.png" />
    <meta name="msapplication-square70x70logo" content="static/image/mstile-70x70.png" />
    <meta name="msapplication-square150x150logo" content="static/image/mstile-150x150.png" />
    <meta name="msapplication-wide310x150logo" content="static/image/mstile-310x150.png" />
    <meta name="msapplication-square310x310logo" content="static/image/mstile-310x310.png" />
    <link rel="apple-touch-icon-precomposed" sizes="57x57" href="static/image/apple-touch-icon-57x57.png" />
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="static/image/apple-touch-icon-114x114.png" />
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="static/image/apple-touch-icon-72x72.png" />
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="static/image/apple-touch-icon-144x144.png" />
    <link rel="apple-touch-icon-precomposed" sizes="60x60" href="static/image/apple-touch-icon-60x60.png" />
    <link rel="apple-touch-icon-precomposed" sizes="120x120" href="static/image/apple-touch-icon-120x120.png" />
    <link rel="apple-touch-icon-precomposed" sizes="76x76" href="static/image/apple-touch-icon-76x76.png" />
    <link rel="apple-touch-icon-precomposed" sizes="152x152" href="static/image/apple-touch-icon-152x152.png" />
    <link rel="icon" type="image/png" href="static/image/favicon-196x196.png" sizes="196x196" />
    <link rel="icon" type="image/png" href="static/image/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/png" href="static/image/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="static/image/favicon-16x16.png" sizes="16x16" />
    <link rel="icon" type="image/png" href="static/image/favicon-128.png" sizes="128x128" />

    <style type="text/css">
      /*! normalize.css v7.0.0 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:inherit;font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{display:inline-block;vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details,menu{display:block}summary{display:list-item}canvas{display:inline-block}[hidden],template{display:none}
    </style>
  </head>

  <body>
    <div id="wolf-cola"></div>
  </body>
</html>
