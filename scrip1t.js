window.addEventListener('DOMContentLoaded', async () => {
	const PAGESIZE = 8;
	try {
		const urlParams = new URLSearchParams(window.location.search);
		const searchParam = urlParams.get('search')|| '';
		const pageParam = parseInt(urlParams.get('page')) || 0;
		const jsonDigimon = await getJsonDigimon(searchParam, PAGESIZE, pageParam);
		if (jsonDigimon.pageable.totalElements !== 0){
			createDigimonList (jsonDigimon);
			createPagination (jsonDigimon);
			document.getElementById('random-digimon').addEventListener('click', () => {
				const randomNumber = Math.floor(Math.random() * jsonDigimon.pageable.totalElements);
				window.location.href = `detail.html?id=${randomNumber}`;
			});
			document.addEventListener('click', (event) => {
				if (event.target.closest('.card')) {
					const id = event.target.closest('.card').dataset.id;
					window.location.href = `detail.html?id=${id}`;
				}
			});
		} else {
			createError(`No hay resultados para:  #${searchParam}`);
		}
	} catch (error) {
		createError(`Error processing Digimon data: #${error}`)
	}
})

const getJsonDigimon = async(searchParam, pageSize, pageParam) => {
	const url = `https://digi-api.com/api/v1/digimon?name=${searchParam}&page=${pageParam}&pageSize=${pageSize}`;
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
	const result = await fetch(`https://digi-api.com/api/v1/digimon/${digimon}`);
	const resultJson = await result.json();
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
	const finalLevels = arrayToString(levels, `level`, "-");
	const classLevel = `${levels[0]?.level.replace(/\s+/g, '-')}`;
	const finalReleaseDate = checkParam(releaseDate, "-");
	const finalTypes = arrayToString(types, `type`, "-");

	const digi_list = document.querySelector('#digi_list');
	digi_list.insertAdjacentHTML('beforeend', `
		<div class="card" data-id="${finalId}">
			<div class="card-header ${classLevel}">
				<p class="card-body-id"> #${finalId} </p>
			</div>
			<div class="card-body">
				<img src="${finalImage}" class="card-body-img" alt="imagen de ${finalName}">
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
			</div> 
		</div>
	`);
}

const createError = (message) =>{
	const digi_list = document.querySelector('#digi_list');
	const errorMessage = document.createElement('div');
	errorMessage.innerHTML = `
		<div class="titulo">
			<p class="titulo""> ${message} </p>
		</div> 
	`;
	digi_list.appendChild(errorMessage);
	console.warn(message);
};


const arrayToString = (array, param, defaultValue) => {
	if (!array || array.length === 0) { 
		return  defaultValue; 
	} else {
		const newArray =  array.map(element => element[param]);
		return newArray.join(', ');
	};
}

const checkParam = (param, defaultValue) => {
	return param ? param : defaultValue;
}

//Creacion de paginacion
const createPagination = (jsonDigimon) => {
	const pagination = document.querySelector('#pagination');
	pagination.innerHTML = `
		<div class="pag-button" id="prev-button"><</div>
		<div class="" id="current-pag">${jsonDigimon.pageable.currentPage + 1}</div>
		<div class="pag-button" id="next-button">></div>
	`;
	const prevButton = document.getElementById('prev-button');
	const nextButton = document.getElementById('next-button');
	const currentPag = document.getElementById('current-pag');

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
    window.location.href = `index.html?search=${searchParam}&page=${currentPage + offset}`;
}

