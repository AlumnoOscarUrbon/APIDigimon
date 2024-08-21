window.addEventListener('DOMContentLoaded', async () => {
	try {
		const urlParams = new URLSearchParams(window.location.search);
		const searchParam = urlParams.get('search')|| '';
		const pageSizeParam = 8;
		const pageParam = parseInt(urlParams.get('page')) || 0;
		const jsonDigimon = await getJsonDigimon(searchParam, pageSizeParam, pageParam);
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
	
const getJsonDigimon = async(searchParam, pageSizeParam, pageParam) => {
	const url = `https://digi-api.com/api/v1/digimon?name=${searchParam}&page=${pageParam}&pageSize=${pageSizeParam}`;
	const result = await fetch(url);
	const resultJson = await result.json();
	console.log(resultJson);
	return resultJson;

}

const createDigimonList = (jsonDigimon) => {
	const idsList = jsonDigimon.content.map(item => item.id);
	idsList.forEach(id =>{
		createDigimonItem(id);
	})
}


const createDigimonItem = async (digimon) => {
	const digi_list = document.querySelector('#digi_list');
	const card = document.createElement('div');
	card.classList.add('card');
	const url = `https://digi-api.com/api/v1/digimon/${digimon}`;
	const result = await fetch(url);
	const resultJson = await result.json();

	//checks y conversiones
	const { 
		name, 
		id, 
		images, 
		levels, 
		releaseDate, 
		types 
	} = resultJson;
	const finalName = checkParam(name, "-");
	const finalId = checkParam(id, "-");
	const finalImage = checkParam(images[0].href, "images/default.jpg");
	const finalLevels = arrayToString(levels, `level`);
	const classLevel = `${levels[0]?.level.replace(/\s+/g, '-')}`;
	const finalReleaseDate = checkParam(releaseDate, "-");
	const finalTypes = arrayToString(types, `type`);

	card.setAttribute('data-id', finalId);

	card.innerHTML = `
		<div class="card-header ${classLevel}">
			<p class="card-body-id"> #${finalId} </p>
		</div>
		<div class="card-body">
			<img src="${finalImage}" class="card-body-img ${finalLevels}" alt="imagen de ${finalName}">
			<p class="card-body-title elipsis"> ${finalName} </p>
		</div>
		<div class="card-footer ${classLevel}">
			<div class="card-footer-item">
				<h3 class="elipsis "> ${finalLevels} </h3>
				<p>Level</p>
			</div>
			<div class="card-footer-item">
				<h3 class="elipsis "> ${finalTypes} </h3>
				<p>Type</p>
			</div>
			<div class="card-footer-item">
				<h3 class="elipsis"> ${finalReleaseDate} </h3>
				<p>Year</p>
			</div>
		</div> `;

	digi_list.appendChild(card);
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

    // Envio a página detalle
    $(document).on("click", ".card", function() {
        let id = $(this).data('id');
        window.location.href = `detail.html?id=${id}`;
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
    window.location.href = `index.html?search=${searchParam}&page=${currentPage + offset}`;
}

