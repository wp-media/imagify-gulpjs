<?php

header( 'Content-Type: application/json' );

sleep( rand(1, 5) );

$response = [
	'success' => true,
	'data'    => [
		'success'               => true,
		'original_size'         => 88092,
		'new_size'              => 41093,
		'percent'               => 53.35,
		'overall_saving'        => 130926,
		'original_overall_size' => 241223,
		'new_overall_size'      => 110297,
		'thumbnails'            => 6
	]
];

echo json_encode( $response );