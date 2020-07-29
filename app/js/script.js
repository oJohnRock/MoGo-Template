"use strict;"

function showSearchForm() {
	let input = document.querySelector('.search-form__text');
	let button = document.querySelector('.search-form__btn');

	button.addEventListener("click", (event) => {
			event.preventDefault();
			input.classList.toggle('search-form__text_active');
		});
}

showSearchForm();