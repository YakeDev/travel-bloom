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

if (btnSearch) {
	btnSearch.addEventListener('click', async () => {
		await recommendationSearch();
	});
}

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
						`
            <div class="max-w-lg bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 my-5">
						<a class="card-header">
							<img src="${item.imageUrl}" alt="${item.name}" class="rounded-t-lg" />
						</a>
						<div class="card-description p-6">
							<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${item.name}</h5>
							<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${item.description}</p>
							<a class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Visit 
							<svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
							</a>
						</div>
					</div>
            
            `
				)
				.join('');
		} else {
			searchResult.innerHTML = `<p class="my-36 text-gray-700 p-8 bg-gray-100 rounded-2xl">Aucune recommandation trouvée pour <strong>"${keyWord}"</strong>.</p>`;
		}
	} else {
		console.error("Le format des recommandations n'est pas valide.");
	}
}
