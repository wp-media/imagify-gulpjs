<?php

header( 'Content-Type: application/json' );

sleep( rand(1, 5) );

$min_size = 10000;
$max_size = 200000;

$original_size = rand( $min_size, $max_size );
$new_size      = rand( ($min_size / 2), ($min_size / 2) );
$percent       = round( ( $new_size / $original_size ) * 100, 2);
$success       = ( rand( 1, 9 ) % 2 ) == 1 ? true : false;

$response = [
	'success' => $success,
	'data'    => [
		'error'                 => !$success ? 'An error occured' : '',
		'original_size'         => $original_size,
		'new_size'              => $new_size,
		'percent'               => $percent,
		'overall_saving'        => 130926,
		'original_overall_size' => 241223,
		'new_overall_size'      => 110297,
		'thumbnails'            => 6
	]
];

echo json_encode( $response );