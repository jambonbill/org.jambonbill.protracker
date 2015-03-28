<?php

switch($_POST['do']){

	case 'randmod':
		$mods=glob("mods/*.mod");
		shuffle($mods);
		$js['filename']=$mods[0];
		echo json_encode($js);
		exit;

	case 'list':
		$mods=glob("mods/*.mod");
		foreach($mods as $k=>$mod)
		$mods[$k]=basename($mod);
		echo json_encode($mods);
		exit;

	default:
		die("error");
}

