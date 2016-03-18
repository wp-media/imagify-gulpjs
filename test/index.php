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
	</style>
</head>
<body>
	
	<h1>Imagify Gulp Test</h1>

	<button class="btn btn-primary" id="btn-launch-test">Launch Test</button>

	<div class="row">
		<div class="col-md-8">
			<ul id="list-images"></ul>
		</div>

		<div class="col-md-4">
			<div id="log"></div>
		</div>
	</div>
	
	<script src="../src/imagify-gulp.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>

	<script>
		$('#btn-launch-test').click( launchTest );

		function launchTest () {
			
			$(this).prop('disabled', true);

			$.get('get_images.php').then( function (response) {
				
				var Gulp = new ImagifyGulp({
					lib: 'optimize.php',
					images: response.data
				});

				console.log(Gulp);

				Gulp
					.before( function (data) {
						console.log(data)
					})
					.each( function (data) {
						console.log(data)
					})
					.done( function (data) {

					})
					.run();

			});

		}
	</script>

</body>
</html>