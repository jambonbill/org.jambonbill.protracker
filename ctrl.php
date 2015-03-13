<?php

$mods=glob("mods/*.mod");
//print_r($mods);
shuffle($mods);
echo $mods[0];