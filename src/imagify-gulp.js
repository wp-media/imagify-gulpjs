'use strict'

class ImagifyGulp {

	constructor (settings) {
		this.buffer_size           = settings.buffer_size || 1
		this.lib_url               = settings.lib
		this.default_thumb         = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAIAAACRuyQOAAACy0lEQVRIx+1XS1PTUBTuT/MB1NGF3bhyhys3Pv+Ai8pCF6Bb3bsWq8xAh8441I2TSlKwPIKQJsI40IbSV0pJ6qe3OeZ1b9PaYViQyaJzc+757j3nO985TVx5v3o+b+IS6XyQUgtrj/NqWtJmZf3lavnpl53bC2vjRLqRUV4pxqbZcnrBx3F6G2ZzTjFg879IMwWtanV7g56K1Z2RtBGRpj7IWb0a8HhqOz9O2rjHfrOD34GvWcPEruGQkhmlcFgnF7bjABVJmvA4uj4vY2VJr545/yClw/okBywaadF/m63j1gT/sNO5DbXW8t4sLtJzSQtnAme/ys/BrU9FpdIgY2R3MBLidtQ+ZRt2T9qZvQrtf/N9X5BwbEQKmSVIFGZjEGlWNojB93KbCBolDNl49nVPAIYwUs5QGAOQwCtmuuyGG5ExGhZbtM7s+5+3BGC5nyazhB8RElSAePRwRaX1u9nScadfVYjtncV1HtKDlW0KQMqvID4kCAydHST2fgKhu24B7dTaSY4oYBf2MjN44yK9+FZmRnrdCnuhr3jyB7Vr89G8L9f7oU77VSPhp4POjNarzUgv77Z/ERh+R9oUXbqDXFyktFtJ5ag74cU9cBsCwy3DNoht5Fcf0pO8ysuTt27IFzKH/Hm/Qopi5ekP99zzgkU8goF7VN21ThfM9BKHylHEPbzoQ8wUlSGoG1QVnR3Vhppj66hCtgg/Ayr3tdLXCFQ7al4ABr2gAEBHoCbQFDu+RkCvqPVBx5LCZvq2dEDsgELuDqV7rM/SfvmocfNjkYcEdV8Kdcu4Wh6QLzzoPQKtQ9DQvQL9ZYhOiCYteXougo/9UEIv9YHxKK+iZ9qenouE8QIunCMMMzxHYIIomU2ksBOaI5ZHmCO8OavEnI0K2hjmvTnevPe3bjBlTvKvMsoMi4kVAgO/qBXMGvidGu8Me/lf4yIg/QYbLcmjDg4bKwAAAABJRU5ErkJggg=="
		this.images                = settings.images
		this.images_ids            = Object.keys( settings.images )
		this.total_images          = this.images_ids.length
		this.processed_images      = 0
		this.inprocess_images      = 0
		this._before               = new Function
		this._each                 = new Function
		this._done                 = new Function
		this._error                = new Function
		this.total_original_size   = 0
		this.total_optimized_size  = 0
		this.total_gain            = 0
		this.total_percent         = 0
		this.global_original_size  = 0
		this.global_optimized_size = 0
		this.global_gain           = 0
		this.global_percent        = 0
		this.context               = settings.context || 'wp'
	}

	before (fnc) {
		this._before = fnc
		return this
	}

	each (fnc) {
		this._each = fnc
		return this
	}

	done (fnc) {
		this._done = fnc
		return this
	}

	error (fnc) {
		this._error = fnc
		return this
	}

	humanSize (bytes) {
		if ( 0 === bytes ) return '0\u00A0kB'

		let
			sizes = ['B', 'kB', 'MB']
			, i   = parseInt( Math.floor( Math.log(bytes) / Math.log(1024) ), 10 )

		return ( bytes / Math.pow(1024, i) ).toFixed(2) + '\u00A0' + sizes[i]
	}

	run () {
		let cpt = this.images_ids.length > this.buffer_size ? this.buffer_size : this.images_ids.length

		for ( let i = 0; i < cpt; i++ ) {
			let id = this.images_ids.shift()
			this.process(id)
		}

		return this
	}

	stopProcess () {
		this.total_images = this.total_images - this.images_ids.length;
		this.images_ids   = [];
		return this
	}

	process (id) {
		this.inprocess_images++

		let data = {
			id: id,
			image_id: parseInt( id.toString().substr(1), 10 ),
			image_src: this.images[id],
			filename: this.images[id].split('/').pop(),
			thumbnail: this.default_thumb,
			error: ''
		}

		this.createThumb(data)
	}

	createThumb (data) {
		let
			self    = this
			, image = new Image

		image.onerror = function () {
			let data_before = data
			data_before.id  = data.image_id

			self._before(data_before)
			self.send(data)
		}

		image.onload = function () {
			let
				maxWidth      = 33
				, maxHeight   = 33
				, imageWidth  = image.width
				, imageHeight = image.height
				, ratio       = 1
				, newHeight   = 0
				, newWidth    = 0
				, canvas      = null
				, ctx         = null

			if ( imageWidth < imageHeight ) {
				ratio     = maxWidth / imageWidth
				newWidth  = maxWidth
				newHeight = imageHeight * ratio
			} else {
				ratio     = maxHeight / imageHeight
				newHeight = maxHeight
				newWidth  = imageWidth * ratio
			}

			canvas = document.createElement('canvas')

			canvas.width  = newWidth;
			canvas.height = newHeight;
			image.width   = newWidth;
			image.height  = newHeight;

			ctx = canvas.getContext('2d')
			ctx.drawImage( this, 0, 0, newWidth, newHeight )

			try {
				data.thumbnail = canvas.toDataURL('image/jpeg')
			} catch (e) {
				data.thumbnail = self.default_thumb
			}

			let before_data = data
			before_data.id  = data.image_id

			self._before(before_data)

			self.send(data)

			canvas = null
		}

		image.src = data.image_src
	}

	send (data) {

		let
			self        = this
			, transport = new XMLHttpRequest
			, err       = false
			, json      = {}
			, response  = {
				filename: data.filename,
				image: data.image_id,
				error: ''
			}

		transport.onreadystatechange = function () {
			if ( 4 === this.readyState ) {

				self.processed_images++

				try {
					json = JSON.parse( this.responseText )
					err = false
				} catch (e) {

					response.success = false
					response.error   = 'Unknown error occured'

					err = true

				}

				response.progress = Math.floor( ( self.processed_images / self.total_images ) * 100 )

				if ( ! err ) {
					let json_data = json.data

					response.success = json.success

					if ( true === json.success ) {

						self.total_original_size   += json_data.original_size
						self.total_optimized_size  += json_data.new_size
						self.total_gain            += ( json_data.original_size - json_data.new_size )
						self.total_percent          = ( (self.total_optimized_size / self.total_original_size) * 100 ).toFixed(2)
						self.global_original_size  += json_data.original_overall_size
						self.global_optimized_size += json_data.new_overall_size
						self.global_gain           += json_data.overall_saving
						self.global_percent         = (100 - ((self.global_optimized_size / self.global_optimized_size) * 100)).toFixed(2)

						response.original_size       = json_data.original_size
						response.original_size_human = self.humanSize(json_data.original_size)

						response.new_size       = json_data.new_size
						response.new_size_human = self.humanSize(json_data.new_size)

						response.percent    = json_data.percent
						response.thumbnails = json_data.thumbnails

						response.overall_saving       = json_data.overall_saving
						response.overall_saving_human = self.humanSize(json_data.overall_saving)

						response.original_overall_size       = json_data.original_overall_size
						response.original_overall_size_human = self.humanSize(json_data.original_overall_size)

					} else {
						response.error = json_data.error
					}
				}

				self._each(response)

				if ( self.inprocess_images < self.total_images ) {
					self.process( self.images_ids.shift() )
				}

				if ( self.processed_images === self.total_images ) {

					let tmp_global_percent = 0

					if ( 0 !== self.global_original_size ) {
						tmp_global_percent = ( ( 100 - ( 100 * ( self.global_optimized_size / self.global_original_size ) ) ).toFixed(2) )
					}

					self._done({
						global_original_size_human : self.humanSize( self.global_original_size ),
						global_gain_human          : self.humanSize( self.global_gain ),
						global_percent             : tmp_global_percent
					})

				}
			}
		}

		transport.open( 'POST', this.lib_url, true )
		transport.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' )
		transport.send( 'image=' + data.image_id + '&context=' + this.context )
	}
}
