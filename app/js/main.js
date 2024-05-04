"use strict";

const cursor = $(".cursor");

$(document).on("mousemove scroll", (e) => {
	cursor.css("left", e.pageX + 4 + "px");
	cursor.css("top", e.pageY + 4 + "px");
});

$(document).on("mouseenter", "button, a", function () {
	cursor.addClass("cursor_hovered");
});
$(document).on("mouseleave", "button, a", function () {
	cursor.removeClass("cursor_hovered");
});

window.addEventListener("load", function () {
	$("#preloader").animate({ opacity: "0" }, "slow", function () {
		$(this).remove();
		$(".menu").addClass("menu_visible");
	});
});

const observer = lozad(".lozad", {
	rootMargin: "10px 0px", // syntax similar to that of CSS Margin
	threshold: 0.1, // ratio of element convergence
	enableAutoReload: true, // it will reload the new image when validating attributes changes
});
observer.observe();

$(document).ready(function () {
	$("#burger").on("click", function () {
		const burgerBtn = $(this);
		const menu = burgerBtn.closest(".menu");
		const topMenu = menu.find(".menu__top");
		const menuWrapper = $(".menu__wrapper");
		menu.toggleClass("--menu-open");
		burgerBtn.toggleClass("--burger-active");
		topMenu.stop().toggle(500);
		menuWrapper.attr("inert", "");

		$(document).on("mouseleave", ".menu", function () {
			$(this).removeClass("--menu-open");
			topMenu.hide(300);
			burgerBtn.removeClass("--burger-active");
			menuWrapper.removeAttr("inert");
		});
	});
	$(".menu__button").keydown(function (e) {
		if (e.keyCode == 39) {
			// right
			e.preventDefault();
			$(this)
				.parent()
				.next(".menu__li")
				.children(".menu__button")
				.focus();
		} else if (e.keyCode == 37) {
			//left
			e.preventDefault();
			$(this)
				.parent()
				.prev(".menu__li")
				.children(".menu__button")
				.focus();
		}
	});
	$(".menu__link").keydown(function (e) {
		const $parentList = $(this).parent();

		if (e.keyCode == 38) {
			// up
			e.preventDefault();
			$parentList
				.prevAll(".menu__li")
				.first()
				.children(".menu__link")
				.focus();
		} else if (e.keyCode == 39) {
			// right
			e.preventDefault();
			$parentList
				.parent()
				.next(".menu__list")
				.children(".menu__li")
				.first()
				.children(".menu__link")
				.focus();
		} else if (e.keyCode == 37) {
			//left
			e.preventDefault();
			$parentList
				.parent()
				.prev(".menu__list")
				.children(".menu__li")
				.first()
				.children(".menu__link")
				.focus();
		} else if (e.keyCode == 40) {
			// bottom
			e.preventDefault();
			$parentList
				.nextAll(".menu__li")
				.first()
				.children(".menu__link")
				.focus();
		}
	});
});

class Grain {
	constructor(el) {
		this.patternSize = 150;
		this.patternScaleX = 1;
		this.patternScaleY = 1;
		this.patternRefreshInterval = 3;
		this.patternAlpha = 15;
		this.canvas = el;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.scale(this.patternScaleX, this.patternScaleY);
		this.patternCanvas = document.createElement("canvas");
		this.patternCanvas.width = this.patternSize;
		this.patternCanvas.height = this.patternSize;
		this.patternCtx = this.patternCanvas.getContext("2d");
		this.patternData = this.patternCtx.createImageData(
			this.patternSize,
			this.patternSize,
		);
		this.patternPixelDataLength = this.patternSize * this.patternSize * 4;
		this.resize = this.resize.bind(this);
		this.loop = this.loop.bind(this);
		this.frame = 0;
		window.addEventListener("resize", this.resize);
		this.resize();
		window.requestAnimationFrame(this.loop);
	}
	resize() {
		this.canvas.width = window.innerWidth * devicePixelRatio;
		this.canvas.height = window.innerHeight * devicePixelRatio;
	}
	update() {
		const {
			patternPixelDataLength,
			patternData,
			patternAlpha,
			patternCtx,
		} = this;
		for (let i = 0; i < patternPixelDataLength; i += 4) {
			const value = Math.random() * 255;
			patternData.data[i] = value;
			patternData.data[i + 1] = value;
			patternData.data[i + 2] = value;
			patternData.data[i + 3] = patternAlpha;
		}
		patternCtx.putImageData(patternData, 0, 0);
	}
	draw() {
		const { ctx, patternCanvas, canvas, viewHeight } = this;
		const { width, height } = canvas;
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = ctx.createPattern(patternCanvas, "repeat");
		ctx.fillRect(0, 0, width, height);
	}
	loop() {
		const shouldDraw = ++this.frame % this.patternRefreshInterval === 0;
		if (shouldDraw) {
			this.update();
			this.draw();
		}
		window.requestAnimationFrame(this.loop);
	}
}
const grain = new Grain(document.getElementById("grain"));

ScrollReveal().reveal(".scroll-reveal");
