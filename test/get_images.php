<?php

header( 'Content-Type: application/json' );

$response = [
	'success' => true,
	'data'    => []
];

$image_name = 0;

for ( $i=1; $i < 30; $i++ ) { 
	$image_name++;

	if ($image_name > 4) $image_name = 1;

	$response['data']['_'.$i] = 'images/' . $image_name . '.jpg';
}

echo json_encode( $response );