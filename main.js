
// The main function that runs when the window has loaded
window.onload = function () {
	// Get the canvas element and its 2D rendering context
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		// Set the canvas size to match the window size
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight;

	// Arrays to store points, sticks, forms, and images
	var points = [],
		sticks = [],
		forms = [],
		images = [],
		// Simulation parameters
		bounce = 0.9,
		gravity = 0.5,
		friction = 0.999;

	// Add initial points with random positions and colors
	points.push({
		x: 100,
		y: 100,
		oldx: 100 + Math.random() * 50 - 25,
		oldy: 100 + Math.random() * 50 - 25,
		color: "blue"  // Assigning blue color to point 0
	});
	points.push({
		x: 200,
		y: 100,
		oldx: 200,
		oldy: 100,
		color: "yellow"  // Assigning yellow color to point 1
	});
	points.push({
		x: 200,
		y: 200,
		oldx: 200,
		oldy: 200,
		color: "blue"  // Assigning blue color to point 2
	});
	points.push({
		x: 100,
		y: 200,
		oldx: 100,
		oldy: 200,
		color: "purple"  // Assigning purple color to point 3
	});

	// Initialize sticks connecting the points
	sticks.push({
		p0: points[0],
		p1: points[1],
		length: distance(points[0], points[1]),
		color: "red",
		width: 5
	});
	sticks.push({
		p0: points[1],
		p1: points[2],
		length: distance(points[1], points[2]),
		color: "blue",
		width: 8
	});
	sticks.push({
		p0: points[2],
		p1: points[3],
		length: distance(points[2], points[3]),
		color: "purple",
		width: 10
	});
	sticks.push({
		p0: points[3],
		p1: points[0],
		length: distance(points[3], points[0]),
		color: "yellow",
		width: 15
	});
	sticks.push({
		p0: points[0],
		p1: points[2],
		length: distance(points[0], points[2]),
		hidden: true
	});

	// Modify the forms to use the assigned colors
	forms.push({
		path: [
			points[0],
			points[1],
			points[2],
			points[3]
		],
		color: "green"  // The color of the form (polygon)
	});


	// Load an image and associate it with a set of points
	images.push({
		path: [
			points[0],
			points[1],
			points[2],
			points[3]
		],
		img: loadImage("cat.jpg")
	});

	// Function to load an image from a given URL
	function loadImage(url) {
		var img = document.createElement("img");
		img.src = url;
		return img;
	}

	// Function to calculate distance between two points
	function distance(p0, p1) {
		var dx = p1.x - p0.x,
			dy = p1.y - p0.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	// Start the animation loop
	update();

	// Main update function
	function update() {
		updatePoints();
		for (var i = 0; i < 5; i++) {
			updateSticks();
			constrainPoints();
		}
		// Clear the canvas
		context.clearRect(0, 0, width, height);
		// Render points, sticks, forms, and images
		renderPoints();
		renderSticks();
		renderForms();
		renderImages();
		// Request the next animation frame
		requestAnimationFrame(update);
	}

	// Update the positions of points based on their velocities and gravity
	function updatePoints() {
		for (var i = 0; i < points.length; i++) {
			var p = points[i],
				vx = (p.x - p.oldx) * friction,
				vy = (p.y - p.oldy) * friction;

			p.oldx = p.x;
			p.oldy = p.y;
			p.x += vx;
			p.y += vy;
			p.y += gravity;
		}
	}

	// Constrain points to the canvas boundaries
	function constrainPoints() {
		for (var i = 0; i < points.length; i++) {
			var p = points[i],
				vx = (p.x - p.oldx) * friction,
				vy = (p.y - p.oldy) * friction;

			if (p.x > width) {
				p.x = width;
				p.oldx = p.x + vx * bounce;
			} else if (p.x < 0) {
				p.x = 0;
				p.oldx = p.x + vx * bounce;
			}
			if (p.y > height) {
				p.y = height;
				p.oldy = p.y + vy * bounce;
			} else if (p.y < 0) {
				p.y = 0;
				p.oldy = p.y + vy * bounce;
			}
		}
	}

	// Update the positions of sticks based on their lengths and connected points
	function updateSticks() {
		for (var i = 0; i < sticks.length; i++) {
			var s = sticks[i],
				dx = s.p1.x - s.p0.x,
				dy = s.p1.y - s.p0.y,
				distance = Math.sqrt(dx * dx + dy * dy),
				difference = s.length - distance,
				percent = difference / distance / 2,
				offsetX = dx * percent,
				offsetY = dy * percent;

			s.p0.x -= offsetX;
			s.p0.y -= offsetY;
			s.p1.x += offsetX;
			s.p1.y += offsetY;
		}
	}

	// Render points as circles on the canvas
	function renderPoints() {
		for (var i = 0; i < points.length; i++) {
			var p = points[i];
			context.beginPath();
			context.arc(p.x, p.y, 5, 0, Math.PI * 2);
			context.fill();
		}
	}

	// Render sticks as lines on the canvas
	function renderSticks() {
		for (var i = 0; i < sticks.length; i++) {
			var s = sticks[i];
			if (!s.hidden) {
				context.beginPath();
				context.strokeStyle = s.color ? s.color : "black";
				context.lineWidth = s.width ? s.width : 1;
				context.moveTo(s.p0.x, s.p0.y);
				context.lineTo(s.p1.x, s.p1.y);
				context.stroke();
			}
		}
	}

	// Render forms as filled polygons on the canvas
	function renderForms() {
		for (var i = 0; i < forms.length; i++) {
			var f = forms[i];
			context.beginPath();
			context.fillStyle = f.color;
			context.moveTo(f.path[0].x, f.path[0].y);
			for (var j = 1; j < f.path.length; j++) {
				context.lineTo(f.path[j].x, f.path[j].y);
			}
			context.fill();
		}
	}

	// Render images on the canvas
	function renderImages() {
		for (var i = 0; i < images.length; i++) {
			var image = images[i],
				w = distance(image.path[0], image.path[1]),
				h = distance(image.path[0], image.path[3]),
				dx = image.path[1].x - image.path[0].x,
				dy = image.path[1].y - image.path[0].y,
				angle = Math.atan2(dy, dx);

			context.save();
			context.translate(image.path[0].x, image.path[0].y);
			context.rotate(angle);
			context.drawImage(image.img, 0, 0, w, h);
			context.restore();
		}
	}
};