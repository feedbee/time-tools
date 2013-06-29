<?php

$t = @$_REQUEST['t'];

if (!ctype_digit($t)) {
	die('`t` parameter is not set or not positive decimal integer');
}

$time = round(microtime(true) * 1000);

printf('%d:%d', $time - $t, $t);