window.addEventListener('DOMContentLoaded', async () => {
	const TOTALELEMENTS = 7;
	try {
		const urlParams = new URLSearchParams(window.location.search);
		const searchParam = urlParams.get('search')|| '';
		const isNumber = /^\d+$/.test(searchParam);
		const pageParam = parseInt(urlParams.get('page')) || 0;
		if (isNumber) {
			const jsonDigimon = await getJsonOneDigimon(searchParam);
			if (jsonDigimon.id){
				createDigimonItem(searchParam);
			} else {
				createError(`No hay resultados para ID: #${searchParam}`);
			}
		} else {
			const jsonDigimon = await getJsonListDigimon(searchParam, pageParam);
			if (jsonDigimon.pageable?.totalElements !== 0 )	{
				createDigimonList(jsonDigimon);
				createPagination(jsonDigimon);
			} else {
				createError(`No hay resultados para nombre: #${searchParam}`);
			}
		}
		document.getElementById('random-digimon').addEventListener('click', () => {
			let randomNumber = Math.floor((Math.random() * TOTALELEMENTS) + 1);
			window.location.href = `attributes.html?search=${randomNumber}`;
		});
	} catch (error) {
		createError(`Error processing Digimon data: #${error}`);
	}
})

const getJsonOneDigimon = async(id) => {
	const result = await fetch(`https://digi-api.com/api/v1/attribute/${id}`);
	const resultJson = await result.json();
	return resultJson;
}

const getJsonListDigimon = async(searchParam, pageParam) => {
	result = await fetch(`https://digi-api.com/api/v1/attribute?name=${searchParam}&page=${pageParam}`);
	const resultJson = await result.json();
	return resultJson;
}

const createDigimonList = (jsonDigimon) => {
	const idsList = jsonDigimon.content.fields.map(item => item.id);
	idsList.forEach(id =>{
		createDigimonItem(id);
	})
}

const createDigimonItem = async (digimon) => {
	const result = await fetch(`https://digi-api.com/api/v1/attribute/${digimon}`);
	const resultJson = await result.json();
	const { 
		name, 
		id, 
		href, 
		description
	} = resultJson;
	const finalName = checkParam(name, "-");
	const finalId = checkParam(id, "-");
	const finalImage = checkParam(href, "images/default.jpg");
	const finalDescription = checkParam(description, "-");
	
	const listFields = document.querySelector('#attributes_list');
	listFields.insertAdjacentHTML('beforeend', `
		<div class="attribute-card">
			<div class="field-data">
				
				<div class="field-title correctY "> ${finalName} </div>
				<div class="field-title correctY "> #${finalId} </div>
			</div>
			<div class="field-description">${finalDescription}</div>
		</div>
	`);
}

const checkParam = (param, defaultValue) => {
	return param ? param : defaultValue;
}

const createPagination = (jsonDigimon) => {
	const pagination = document.querySelector('#pagination');
	const { currentPage, nextPage, previousPage } = jsonDigimon.pageable;
	pagination.innerHTML = `
		<div class="pag-button" id="prev-button"><</div>
		<div class="" id="current-pag">${currentPage + 1}</div>
		<div class="pag-button" id="next-button">></div>
	`;
	const prevButton = document.getElementById('prev-button');
	const nextButton = document.getElementById('next-button');

	if (!nextPage) {
		nextButton.style.pointerEvents = 'none';
		nextButton.style.opacity = '0.5';
	} else {
		nextButton.style.pointerEvents = 'auto';
		nextButton.style.opacity = '1';
	}

	if (!previousPage) {
		prevButton.style.pointerEvents = 'none';
		prevButton.style.opacity = '0.5';
	} else {
		prevButton.style.pointerEvents = 'auto';
		prevButton.style.opacity = '1';
	}

	prevButton.addEventListener('click', () => updatePage(-1));
    nextButton.addEventListener('click', () => updatePage(1));
};

const updatePage = (offset) => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 0;
    const searchParam = urlParams.get('search') || '';
    window.location.href = `attributes.html?search=${searchParam}&page=${currentPage + offset}`;
}

$(document).ready(function() {
	$(document).on("click", ".attribute-card", function(event) {
		event.stopPropagation(); 
		$(this).find('.field-description').slideToggle();
	});
});

const createError = (message) =>{
	const attributes_list = document.querySelector('#attributes_list');
	const errorMessage = document.createElement('div');
	errorMessage.className = 'tittle';
	errorMessage.innerHTML = `<p>${message}</p>`;
	attributes_list.appendChild(errorMessage);
	console.warn(message);
};