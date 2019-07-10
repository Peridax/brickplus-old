// Feel free to use the code, it's open source, just give credit!
// ~ Peridax

class Brickplus {
	
	constructor() {

		this.store 		= "https://www.brickplanet.com/store/browse";
		this.ms			= {item: [8000, 16000], message: [30000, 45000], trade: [40000, 50000]}; // Message and trade notifier coming soon
		this.measure	= [0, 0, 0];

		this.original 	= new Object;
		this.new 		= new Object;

		this.storage	= chrome.storage.sync;
		this.active		= true;
		this.dev 		= false;

		// Event Handler for notification
		chrome.notifications.onClicked.addListener((id) => {
			if (id) {

				chrome.tabs.create({url: 'https://www.brickplanet.com/store/' + id + '/'});
				chrome.notifications.clear(id);
				
				if (brickplus.dev) { console.log('Event handler works') };

			}
		});

		// Item List
		if (!localStorage.getItem('items')) {
			localStorage.setItem('items', '[]');
		}

	}

	initialize() {

		console.log('Initializing brickplus...');
		setTimeout(brickplus.bot, 1000);

	}

	bot() {

		$.get(brickplus.store).then((data) => {

			let currentData				= $('.sbrowse-card', data).first();
			brickplus.new.name			= $(currentData).find('.item-name').text();
			brickplus.new.id			= $(currentData).find('a').first().attr('href').split('/')[2];
			brickplus.new.img			= $(currentData).find('img').attr('src');
			brickplus.new.credits		= $(currentData).find('.item-price .price-credits').text().split(" ")[0];
			brickplus.new.bits			= $(currentData).find('.item-price .price-bits').text().split(" ")[0];
			brickplus.new.unique		= $(currentData).find('.ribbon-unique').length;

			if (!Object.keys(brickplus.original).length) {
				brickplus.original.name 		= brickplus.new.name;
				brickplus.original.id			= brickplus.new.id;
				brickplus.original.img			= brickplus.new.img;
				brickplus.original.credits 		= brickplus.new.credits;
				brickplus.original.bits 		= brickplus.new.bits;
				brickplus.original.unique 		= brickplus.new.unique;

				if (brickplus.dev) { console.log('Retrieved initial data') };
			} else {
				if (parseInt(brickplus.new.id) > parseInt(brickplus.original.id)) {

					brickplus.original.name 		= brickplus.new.name;
					brickplus.original.id			= brickplus.new.id;
					brickplus.original.img			= brickplus.new.img;
					brickplus.original.credits 		= brickplus.new.credits;
					brickplus.original.bits 		= brickplus.new.bits;
					brickplus.original.unique 		= brickplus.new.unique;

					if ( (brickplus.original.unique && JSON.parse(localStorage.getItem('opt_unique'))) || (!brickplus.original.unique && JSON.parse(localStorage.getItem('opt_item'))) || !localStorage.getItem('enabled_settings') ) {
						let tempArr = [];
						(brickplus.original.credits !== "") ? tempArr.push({title: "Credits", message: brickplus.original.credits}): null;
						(brickplus.original.bits !== "") ? tempArr.push({title: "Bits", message: brickplus.original.bits}) : null;
						
						let currentNotification = {
							type: "list",
							title: (brickplus.original.unique) ? "New Unique Item" : "New Item",
							message: brickplus.original.name,
							iconUrl: brickplus.original.img,
							items: tempArr
						};

						chrome.notifications.create(brickplus.original.id, currentNotification);
						
						if (JSON.parse(localStorage.getItem('opt_sound')) || !localStorage.getItem('enabled_settings')) {
							responsiveVoice.speak((brickplus.original.unique) ? "New Unique Item" : "New Item", "UK English Male");
						}

						let temp = JSON.parse(localStorage.getItem('items'));
						temp.push({id: brickplus.original.id, name: brickplus.original.name, img: brickplus.original.img, bits: brickplus.original.bits, credits: brickplus.original.credits});
						localStorage.setItem('items', JSON.stringify(temp));
					}

					if (brickplus.dev) { console.log('New item detected') };

				} else {
					if (brickplus.dev) { console.log('No new item detected') };
				}
			}

		});

		if (brickplus.dev) {
			if (brickplus.measure[0] === 0) {
				brickplus.measure[0] = Date.now();
			} else {
				console.log('Time difference for item notifier: ' + (Date.now() - brickplus.measure[0]));
				brickplus.measure[0] = Date.now();
			};
		};

		brickplus.active ? setTimeout(brickplus.bot, brickplus.time(brickplus.ms.item)) : console.log('Item Notifier Disabled');

	}

	time(arr) {
		return Math.floor(Math.random() * (arr[1] - arr[0] + 1) + arr[0]);
	}

}

var brickplus = new Brickplus;
brickplus.initialize();