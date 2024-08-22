
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')|| '';
    const jsonDigimon = await getJsonDigimon(id);
    if (!jsonDigimon.id){
      createErrorNotFound();
    } else{
      createDigimonItem(jsonDigimon);
    }
  } catch (error) {
    console.error('Error processing Digimon data:', error);
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
  const digi_list = document.querySelector('#digi_list');
	const card = document.createElement('div');
	card.classList.add('detail-card');

	//checks y conversiones
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
  const finalTypes = arrayToString(types, 'type');
  const finalAttributes = arrayToString(attributes, 'attribute');
  const finalDescriptions = checkParam(descriptions[1]?.description, "");
  const finalLevels = arrayToString(levels, 'level');
  const classLevel = `${levels[0]?.level.replace(/\s+/g, '-')}-t`;
  const imagesFields = fields.map(item => `<a href="fields.html?search=${item.field}"><img class="image-field" src="${item.image}" alt="Image ${item.field}" title="${item.field}"></a>`).join('');
  const finalFields = checkParam (imagesFields, "-");
  
  
  // Añadir clase y atributos al card
  card.classList.add(classLevel);


	card.innerHTML = `
    <img src="${finalImage}" class="detail-image" alt="imagen de ${finalName}">
      <div class="detail-stats">
        <h1 class="detail-name correctY "> ${finalName} #${finalId} </h1>
        <ul class="correctY ">
          <li >Year: <strong> ${finalReleaseDate} </strong></li>
          <li >Type: <strong>${finalTypes}</strong></li>
          <li >Level: <strong>${finalLevels} </strong></li>
          <li >Attribute: <strong>${finalAttributes}</strong></li>
          <li class="align-text-image">Fields: ${finalFields}</li>
        </ul >
      </div>
      <div class="detail-description" id="description">${finalDescriptions}  </div>
  `;

  if (!finalDescriptions) {
    card.querySelector('#description').style.display = 'none';
  }
  
	digi_list.appendChild(card);
}



const createErrorNotFound = () =>{
	const digi_list = document.querySelector('#digi_list');
	const errorNotFoundMessage = document.createElement('div');
	errorNotFoundMessage.innerHTML = `
		<div class="titulo">
			<p class="titulo""> No se ha encontrado el digimon </p>
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

//Envio a digimon al azar
$(document).ready(function() {
    $(document).on("click", "#random-digimon", function() {
        const randomNumber = Math.floor(Math.random() * 1460); 
        window.location.href = `detail.html?id=${randomNumber}`;
    });
});




