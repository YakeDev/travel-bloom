const btnSearch = document.getElementById('btn-search');
const btnClear = document.getElementById('btn-clear');
const inputSearch = document.getElementById('input-search');
const searchResult = document.querySelector('.search-result');

async function showRecommandation() {
	try {
		const response = await fetch('travel_recommendation_api.json');
		const recommendations = await response.json();
		return recommendations;
	} catch (error) {
		console.error(`Erreur de téléchargement: ${error.message}`);
	}
}

if (btnClear) {
	btnClear.addEventListener('click', () => {
		inputSearch.value = '';
		searchResult.innerHTML = ''; // Efface les résultats de recherche
	});
}

btnSearch.addEventListener('click', async () => {
	await recommendationSearch();
});

//recommandation search function
async function recommendationSearch() {
	// Vérification de l'entrée utilisateur
	if (inputSearch.value === '') {
		searchResult.innerHTML = `<p>Please enter a search keyword</p>`;
		return;
	}

	const keyWord = inputSearch.value.trim().toLowerCase();
	const recommendations = await showRecommandation();

	// Vérification de l'objet de recommandations
	if (recommendations && typeof recommendations === 'object') {
		let filteredResults = [];

		// Rechercher dans les `countries`
		if (['countries', 'country', 'countrie'].includes(keyWord)) {
			if (recommendations.countries) {
				recommendations.countries.forEach((country) => {
					country.cities.forEach((city) => {
						filteredResults.push({
							name: city.name,
							description: city.description,
							imageUrl: city.imageUrl,
						});
					});
				});
			}
		}

		// Rechercher dans les `temples`
		if (['temples', 'temple', 'templ'].includes(keyWord)) {
			if (recommendations.temples) {
				recommendations.temples.forEach((temple) => {
					filteredResults.push({
						name: temple.name,
						description: temple.description,
						imageUrl: temple.imageUrl,
					});
				});
			}
		}

		// Rechercher dans les `beaches`
		if (['beaches', 'beach', 'beache'].includes(keyWord)) {
			if (recommendations.beaches) {
				recommendations.beaches.forEach((beach) => {
					filteredResults.push({
						name: beach.name,
						description: beach.description,
						imageUrl: beach.imageUrl,
					});
				});
			}
		}

		// Affichage des résultats filtrés
		if (filteredResults.length > 0) {
			searchResult.innerHTML = filteredResults
				.map(
					(item) =>
						`<div class="result-item">
							<img src="${item.imageUrl}" alt="${item.name}" />
							<h3>${item.name}</h3>
							<p>${item.description}</p>
						</div>`
				)
				.join('');
		} else {
			searchResult.innerHTML = `<p>Aucune recommandation trouvée pour <strong>"${keyWord}"</strong>.</p>`;
		}
	} else {
		console.error("Le format des recommandations n'est pas valide.");
	}
}
