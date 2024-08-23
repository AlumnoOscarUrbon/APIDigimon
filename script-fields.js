window.addEventListener('DOMContentLoaded', async () => {
	try {
		const urlParams = new URLSearchParams(window.location.search);
		const searchParam = urlParams.get('search')|| '';
		const pageParam = parseInt(urlParams.get('page')) || 0;
		const jsonDigimon = await getJsonDigimon(searchParam, pageParam);
		if (jsonDigimon) {
			createDigimonList(jsonDigimon);
			jsonDigimon.pageable? createPagination(jsonDigimon) :'';
			
		} else {
			createError(`No hay resultados para: #${searchParam}`);
		}
		document.getElementById('random-digimon').addEventListener('click', () => {
			let randomNumber = Math.floor(Math.random() * 11);
			window.location.href = `fields.html?search=${randomNumber}`;
		});
	} catch (error) {
		console.error('Error processing Digimon data:', error);
	}
})
	
const getJsonDigimon = async(searchParam, pageParam) => {
	const isNumber = /^\d+$/.test(searchParam);
	let result = '';
	if (isNumber){
		result = await fetch(`https://digi-api.com/api/v1/field/${searchParam}`);
	} else {
		result = await fetch(`https://digi-api.com/api/v1/field?name=${searchParam}&page=${pageParam}`);
	}
	const resultJson = await result.json();
	console.log(resultJson);
	return resultJson;
}

const createDigimonList = (jsonDigimon) => {
	const idsList = Array.isArray(jsonDigimon.content?.fields)?jsonDigimon.content.fields.map(item => item.id):[jsonDigimon.id];
	console.log(idsList);
	idsList.forEach(id =>{
		createDigimonItem(id);
	})
}

const createDigimonItem = async (digimon) => {
	const result = await fetch(`https://digi-api.com/api/v1/field/${digimon}`);
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
	
	const listFields = document.querySelector('#field_list');
	listFields.insertAdjacentHTML('beforeend', `
		<div class="field-card">
			<div class="field-data">
				<img src="${finalImage}" class="field-card-img" alt="imagen de ${finalName}">
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

//Aparicion de paginacion
const createPagination = (jsonDigimon) => {
	const pagination = document.querySelector('#pagination');
	pagination.innerHTML = `
		<div class="pag-button" id="prev-button"><</div>
		<div class="" id="current-pag">${jsonDigimon.pageable.currentPage + 1}</div>
		<div class="pag-button" id="next-button">></div>
	`;
	const prevButton = document.getElementById('prev-button');
	const nextButton = document.getElementById('next-button');

	if (!jsonDigimon.pageable.nextPage) {
		nextButton.style.pointerEvents = 'none';
		nextButton.style.opacity = '0.5';
	} else {
		nextButton.style.pointerEvents = 'auto';
		nextButton.style.opacity = '1';
	}

	if (!jsonDigimon.pageable.previousPage) {
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
    window.location.href = `fields.html?search=${searchParam}&page=${currentPage + offset}`;
}

$(document).ready(function() {
    // Aparicion descripcion
	$(document).on("click", ".field-card", function(event) {
		event.stopPropagation(); 
		const descriptionElement = $(this).find('.field-description');
		if (descriptionElement.is(':visible')) {
			descriptionElement.slideUp();
		} else {
			descriptionElement.slideDown();
		}
	});
});

const createError = (message) =>{
	const digi_list = document.querySelector('#field_list');
	const errorMessage = document.createElement('div');
	errorMessage.innerHTML = `
		<div class="titulo">
			<p class="titulo""> ${message} </p>
		</div> 
	`;
	digi_list.appendChild(errorMessage);
	console.warn(message);
};
