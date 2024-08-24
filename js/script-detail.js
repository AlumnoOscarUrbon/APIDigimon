window.addEventListener('DOMContentLoaded', async () => {
  const TOTALELEMENTS = 1460;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')|| '1';
    const jsonDigimon = await getJsonDigimon(id);
    if (jsonDigimon.id){
      createDigimonItem(jsonDigimon);
    } else{
      createError(`No hay resultados para: #${id}`);
    }
    document.getElementById('random-digimon').addEventListener('click', () => {
			const randomNumber = Math.floor((Math.random() * TOTALELEMENTS)+1);
			window.location.href = `detail.html?id=${randomNumber}`;
		});
  } catch (error) {
    createError(`Error processing Digimon data: #${error}`);
  }
})
	
const getJsonDigimon = async(id) => {
		const url = `https://digi-api.com/api/v1/digimon/${id}`;
		const result = await fetch(url);
		const resultJson = await result.json();
		console.log(resultJson);
		return resultJson;
}

const createDigimonItem = async (jsonDigimon) => {
	const {
    name,
    id,
    images,
    levels,
    releaseDate,
    types,
    descriptions,
    fields,
    attributes
  } = jsonDigimon;
  const finalName = checkParam(name, "-");
  const finalId = checkParam(id, "-");
  const finalImage = checkParam(images[0]?.href, "images/default.jpg");
  const finalReleaseDate = checkParam(releaseDate, "-");
  const finalTypes = arrayToString(types, 'type', "-");
  const finalAttributes = attributes.map(item => `<a href="attributes.html?search=${item.attribute}" class="detail-attribute">${item.attribute}</a>`).join(', ');
  const finalDescriptions = checkParam(descriptions[1]?.description, "");
  const finalLevels = arrayToString(levels, 'level', "-");
  const classLevel = `${levels[0]?.level.replace(/\s+/g, '-')}-t`;
  const imagesFields = fields.map(item => `<a href="fields.html?search=${item.field}"><img class="image-field" src="${item.image}" alt="Image ${item.field}" title="${item.field}"></a>`).join('');
  const finalFields = checkParam (imagesFields, "-");

  const digi_list = document.getElementById('digi_list');
	digi_list.innerHTML = `
    <div class="detail-card ${classLevel} ">
      <img src="${finalImage}" class="detail-image" alt="imagen de ${finalName}">
        <div class="detail-stats">
          <h1 class="detail-name correctY "> ${finalName} #${finalId} </h1>
          <ul class="correctY">
            <li >Year: <strong> ${finalReleaseDate} </strong></li>
            <li >Type: <strong>${finalTypes}</strong></li>
            <li >Level: <strong>${finalLevels} </strong></li>
            <li >Attribute: <strong> ${finalAttributes} </strong></li>
            <li >Fields: <div class="detail-fields-wrapper">${finalFields}</div></li>
          </ul >
        </div>
        <div class="detail-description" id="description">${finalDescriptions}</div>
    </div>
  `;

  !finalDescriptions? document.querySelector('#description').style.display = 'none' :'';
}

const createError = (message) =>{
	const digi_list = document.querySelector('#digi_list');
	const errorMessage = document.createElement('div');
	errorMessage.innerHTML = `
		<div class="tittle">
			<p class="tittle""> ${message} </p>
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