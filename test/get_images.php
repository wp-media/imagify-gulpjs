<?php

header( 'Content-Type: application/json' );

$response = [
	'success' => true,
	'data'    => []
];

for ( $i=1; $i < 30; $i++ ) { 
	$response['data']['_'.$i] = 'http://www.domain.tld/images/' . $i . '.jpg';
}

echo json_encode( $response );

?>