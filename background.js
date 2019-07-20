// Feel free to use the code, it's open source, just give credit!
// ~ Peridax

class Brickplus {
	
	constructor() {

		this.store		= "https://www.brickplanet.com/web-api/store/get-recent-items";
		this.ms			= {item: [28000, 30000], message: [30000, 45000], trade: [40000, 50000]};
		this.measure	= [0, 0, 0];

		this.original	= new Object;
		this.new		= new Object;

		this.active		= true;
		this.dev		= true;

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
			localStorage.setItem('update message', "0.3");
		} else {
			if (!localStorage.getItem('update message')) {
				localStorage.setItem('update message', "0.3");
				chrome.notifications.create("update 0.3", {type: "basic", title: "Fixed brickplus", message: "Brickplus has been fixed, notifies new and updated items every single time", iconUrl: "assets/img/icon128.png"});
			}
		}

	}

	initialize() {

		console.log('Initializing brickplus...');
		setTimeout(brickplus.notifier, 1000);

	}

	notifier() {

		$.get(brickplus.store).then((data) => {
			
			let current					= data[0];
			brickplus.new.name			= current.Name;
			brickplus.new.id			= current.ID;
			brickplus.new.img			= "https://cdn.brickplanet.com/" + current.Image;
			brickplus.new.credits		= current.PriceCredits;
			brickplus.new.bits			= current.PriceBits;
			brickplus.new.unique		= current.IsUnique;

			if (!Object.keys(brickplus.original).length) {

				brickplus.assign();
				if (brickplus.dev) { console.log('Retrieved initial data') };

			} else {

				if (brickplus.new.id > brickplus.original.id) {

					brickplus.assign();
					let state = "New";

					brickplus.original.state = state;
					brickplus.notify();

				} else if (brickplus.new.id < brickplus.original.id) {

					brickplus.assign();
					let state = "Updated";

					brickplus.original.state = state;
					brickplus.notify();

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

		brickplus.active ? setTimeout(brickplus.notifier, brickplus.time(brickplus.ms.item)) : console.log('Item Notifier Disabled');
		
	}

	assign() {
		brickplus.original.name 		= brickplus.new.name;
		brickplus.original.id			= brickplus.new.id;
		brickplus.original.img			= brickplus.new.img;
		brickplus.original.credits 		= brickplus.new.credits;
		brickplus.original.bits 		= brickplus.new.bits;
		brickplus.original.unique 		= brickplus.new.unique;
	}

	time(arr) {
		return Math.floor(Math.random() * (arr[1] - arr[0] + 1) + arr[0]);
	}

	notify() {

		if ( (brickplus.original.unique && JSON.parse(localStorage.getItem('opt_unique'))) || (!brickplus.original.unique && JSON.parse(localStorage.getItem('opt_item'))) || !localStorage.getItem('enabled_settings') ) {
			let currentNotification = {
				type: "basic",
				title: "Item",
				message: brickplus.original.name,
				iconUrl: brickplus.original.img
			};

			if (brickplus.original.credits || brickplus.original.bits) {
				let tempArr = [];
				(brickplus.original.credits) ? tempArr.push({title: "Credits", message: brickplus.original.credits.toString()}): null;
				(brickplus.original.bits) ? tempArr.push({title: "Bits", message: brickplus.original.bits.toString()}) : null;

				currentNotification["type"]		= "list";
				currentNotification["items"]	= tempArr;
			}

			if (brickplus.original.state == "New") {
				currentNotification.title = (brickplus.original.unique) ? "New Unique Item" : "New Item";
			} else if (brickplus.original.state == "Updated") {
				currentNotification.title = (brickplus.original.unique) ? "Updated Unique Item" : "Updated Item";
			}

			console.log(currentNotification);

			chrome.notifications.create(brickplus.original.id.toString(), currentNotification);
			
			if (JSON.parse(localStorage.getItem('opt_sound')) || !localStorage.getItem('enabled_settings')) {
				responsiveVoice.speak(currentNotification.title, "UK English Male");
			}

			let temp = JSON.parse(localStorage.getItem('items'));
			temp.push({id: brickplus.original.id, name: brickplus.original.name, img: brickplus.original.img, bits: brickplus.original.bits, credits: brickplus.original.credits});
			localStorage.setItem('items', JSON.stringify(temp));
		}

	}

}

var brickplus = new Brickplus;
brickplus.initialize();