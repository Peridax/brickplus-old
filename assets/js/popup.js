class Popup {

	constructor() {
		this.options = [{id: "opt_item", default: true}, {id: "opt_unique", default: true}, {id: "opt_sound", default: true}];
		
		if (!localStorage.getItem('enabled_settings')) {
			localStorage.setItem('enabled_settings', true);
			this.assignLocalStorage(this.options);
		}

		this.updateSettings(this.options);
		this.handler();
	}

	handler() {
		$(document).ready(() => {

			// Load Items
			if (JSON.parse(localStorage.getItem('items'))) {
				let temp = JSON.parse(localStorage.getItem('items'));
				
				if (temp.length) {
					$('#items').empty();
					
					for (var i in temp) {
						$('#items').append('<div class="siimple-grid-col siimple-grid-col--12 siimple-image-card siimple--bg-light siimple--rounded" id="' + temp[i].id + '"> <div class="siimple-grid-col siimple-grid-col--4" style="padding-left: 0px"> <img class="siimple-image" src="' + temp[i].img + '" /> </div> <div class="siimple-grid-col siimple-grid-col--7"> <div class="siimple-name siimple--color-primary">' + temp[i].name + '</div> <div class="siimple-credits">' + ((temp[i].credits) ? (temp[i].credits + ' Credits') : '') + '</div> <div class="siimple-bits">' + ((temp[i].bits) ? (temp[i].bits + ' Bits') : '') + '</div> </div> <div class="siimple-grid-col siimple-grid-col--1"> <div class="siimple-close" for="' + temp[i].id + '"></div> </div> </div>');
					}
				}
				
			}

			// Simple Checkbox Event Handler
			for (var i in this.options) {
				$('#' + this.options[i].id).change((e) => {
					
					if ($(e.currentTarget).is(':checked')) {
						localStorage.setItem($(e.currentTarget).attr('id'), true);
					} else {
						localStorage.setItem($(e.currentTarget).attr('id'), false);
					};

					e.preventDefault();
				});
			};

			// Simple Close Event Handler
			$('.siimple-close').on('click', (e) => {
				let temp = JSON.parse(localStorage.getItem('items'));
				temp.splice(temp.find(x => x.id === $(e.currentTarget).attr('for')), 1);
				localStorage.setItem('items', JSON.stringify(temp));
				
				$('#' + $(e.currentTarget).attr('for')).remove();

				if (!$('#items').children().length) {
					$('#items').html('<div class="siimple--text-center siimple-h6">No Recent Items :(</div>');
				}
			});

		});
	}

	assignLocalStorage(arr) {
		for (var i in arr) {
			localStorage.setItem(arr[i].id, arr[i].default);
		}
	}

	updateSettings(arr) {
		for (var i in arr) {
			$('#' + arr[i].id).prop('checked', JSON.parse(localStorage.getItem(arr[i].id)));
		}
	}

}

var popup = new Popup;