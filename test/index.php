<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Imagify Gulp Test</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
	<style>
		body{
			padding: 2em;
		}
		#log,
		#list-images{
			border: 1px solid #ddd;
			background-color: #f8f8f8;
			height: 400px;
			overflow-y: auto;
			margin-top: 1em;
		}
		h1{
			margin-bottom: 1em;
		}
		.progress{
			margin-top: 1em;
		}
		em{
			display: inline-block;
			margin-left: 1em;
			text-transform: uppercase;
			font-weight: bold;
			font-size: .6em;
			color: #aaa;
		}
		#list-images{
			list-style-type: none;
			padding: 0;
		}
		#list-images li{
			padding: .5em;
		}
		#list-images li.done{
			background-color: #6CB586;
			color: white;
		}
		#list-images li.done em{
			color: white;
		}
	</style>
</head>
<body>
	
	<h1>Imagify Gulp Test</h1>

	<button class="btn btn-primary" id="btn-launch-test">Launch Test</button>

	<div class="progress">
		<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">0%</div>
	</div>

	<ul id="list-images"></ul>
	
	<script src="../dist/imagify-gulp.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>

	<script>
		$('#btn-launch-test').click( launchTest );

		function launchTest () {

			var
				images_total = 0
				image_count  = 0;
			
			$(this).prop('disabled', true);

			$.get('get_images.php').then( function (response) {

				images_total = Object.keys( response.data ).length;
				
				var Gulp = new ImagifyGulp({
					lib: 'optimize.php',
					images: response.data
				});

				Gulp
					.before( function (data) {
						$('#list-images').append('<li id="img' + data.id + '"><img src="' + data.thumbnail + '" height="33" width="33"> ' + data.image_name + ' <em>Processing...</em></li>');
					})
					.each( function (data) {
						image_count++;

						var percent = Math.floor( (image_count / images_total) * 100 ) + '%';
						$('.progress-bar').width( percent ).text( percent );

						$('#img' + data.image).addClass('done').find('em').html('DONE');
					})
					.done( function (data) {

					})
					.run();

			});

		}
	</script>

</body>
</html>