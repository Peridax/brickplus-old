// Feel free to use the code, it's open source, just give credit!
// ~ Peridax

class Brickplus {
	
	constructor() {

		this.store 		= "https://www.brickplanet.com/store/browse";
		this.ms 		= 5000;

		this.original 	= new Object;
		this.new 		= new Object;

		this.dev 		= false;

		// Event Handler for notification
		chrome.notifications.onClicked.addListener((id) => {
			if (id) {

				chrome.tabs.create({url: 'https://www.brickplanet.com/store/' + id + '/'});
				chrome.notifications.clear(id);
				
				if (brickplus.dev) { console.log('Event handler works') };

			}
		});

	}

	initialize() {

		console.log('Initializing brickplus...');
		this.interval = setInterval(this.bot, this.ms);

	}

	bot() {

		$.get(brickplus.store).then((data) => {

			let currentData				= $('.sbrowse-card', data).first();
			brickplus.new.name			= $(currentData).find('item-name').text();
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
					brickplus.original.credits 		= brickplus.new.credits;
					brickplus.original.bits 		= brickplus.new.bits;
					brickplus.original.unique 		= brickplus.new.unique;

					let currentNotification = {
						type: "list",
						title: (brickplus.original.unique) ? "New Unique Item" : "New Item",
						message: brickplus.original.name,
						iconUrl: brickplus.original.img,
						items: [{title: (brickplus.original.credits !== "") ? "Credits" : "", message: (brickplus.original.credits !== "") ? brickplus.original.credits : ""},
								{title: (brickplus.original.bits !== "") ? "Bits" : "", message: (brickplus.original.bits !== "") ? brickplus.original.bits : ""}]
					};
					
					chrome.notifications.create(brickplus.original.id, currentNotification);
					responsiveVoice.speak((brickplus.original.unique) ? "New Unique Item" : "New Item", "UK English Male");

					if (brickplus.dev) { console.log('New item detected') };

				} else {
					if (brickplus.dev) { console.log('No new item detected') };
				}
			}

		});

	}

}

var brickplus = new Brickplus;
brickplus.initialize();