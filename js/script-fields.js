window.addEventListener('DOMContentLoaded', async () => {
	try {
		const urlParams = new URLSearchParams(window.location.search);
		const searchParam = urlParams.get('search')|| '';
		const pageParam = parseInt(urlParams.get('page')) || 0;
		const jsonDigimon = await getJsonDigimon(searchParam, pageParam);
		if (jsonDigimon.pageable.totalElements === 0){
			createErrorNotFound(searchParam);
		} else{
			createDigimonList(jsonDigimon);
		}
		pagDisplay (jsonDigimon);

	} catch (error) {
		console.error('Error processing Digimon data:', error);
}
})
	
const getJsonDigimon = async(searchParam, pageParam) => {
	const url = `https://digi-api.com/api/v1/field?name=${searchParam}&page=${pageParam}`;
	const result = await fetch(url);
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
	const digi_list = document.querySelector('#digi_list');
	
	const card = document.createElement('div');
	
	card.classList.add('field-card');
	const url = `https://digi-api.com/api/v1/field/${digimon}`;
	const result = await fetch(url);
	const resultJson = await result.json();
	console.log(resultJson);
	//checks y conversiones
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
	
	card.setAttribute('data-id', finalId);

	card.innerHTML = `
		<div class="field-data">
			<img src="${finalImage}" class="field-card-img" alt="imagen de ${finalName}">
			<div class="field-title correctY "> ${finalName} </div>
			<div class="field-title correctY "> #${finalId} </div>
		</div>
		<div class="field-description">${finalDescription}</div>
	`;

	field_list.appendChild(card);
}

const createErrorNotFound = (searchParam) =>{
	const digi_list = document.querySelector('#digi_list');
	const errorNotFoundMessage = document.createElement('div');
	errorNotFoundMessage.innerHTML = `
		<div class="titulo">
			<p class="titulo""> No hay resultados para:  #${searchParam} </p>
		</div> `;
		digi_list.appendChild(errorNotFoundMessage);
};


const arrayToString = (array, param) => {
	if (!array || array.length === 0) { return  "-"; };
	const newArray =  array.map(element => element[param]);
	return newArray.join(', ');
}

const checkParam = (param, defaultValue) => {
	return param ? param : defaultValue;
}

//Aparicion de paginacion
const pagDisplay = (jsonDigimon) => {
    if (!jsonDigimon.pageable.nextPage) {
        $('#next-button').css('pointer-events', 'none'); 
        $('#next-button').css('opacity', '0.5'); 
    } else {
        $('#next-button').css('pointer-events', 'auto'); 
        $('#next-button').css('opacity', '1'); 
    }
    
    if (!jsonDigimon.pageable.previousPage) {
        $('#prev-button').css('pointer-events', 'none');
        $('#prev-button').css('opacity', '0.5'); 
    } else {
        $('#prev-button').css('pointer-events', 'auto'); 
        $('#prev-button').css('opacity', '1'); 
    }
	const currentPag = jsonDigimon.pageable.currentPage;
	document.getElementById('current-pag').textContent = currentPag + 1;
};

$(document).ready(function() {
    // Envio a digimon al azar
    $(document).on("click", "#random-digimon", function() {
        const randomNumber = Math.floor(Math.random() * 1460); // Simplificado rango
        window.location.href = `detail.html?id=${randomNumber}`;
    });

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
	  

    // Listener Paginacion
    $(document).on("click", "#prev-button", function() {
        updatePage(-1);
    });

    $(document).on("click", "#next-button", function() {
        updatePage(1);
    });
});

function updatePage(offset) {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 0;
    const searchParam = urlParams.get('search') || '';
    window.location.href = `fields.html?search=${searchParam}&page=${currentPage + offset}`;
}

