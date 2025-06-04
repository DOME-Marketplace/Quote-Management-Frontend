document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});


const API_CONFIG = {
    baseUrl: 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://an-dhub-sbx.dome-project.eu/tmf-api/productCatalogManagement/v4/productSpecification?offset=0&limit=1'),
    timeout: 15000, // 15 seconds
    retryDelay: 2000 // 2 seconds
};

async function loadProducts() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

        const response = await fetch(API_CONFIG.baseUrl, {
            signal: controller.signal,
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const proxyData = await response.json();
        console.log('Proxy response:', proxyData);


        let products;
        if (proxyData.contents) {
            products = JSON.parse(proxyData.contents);
        } else {
            products = proxyData;
        }

        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products. Please try again later.');
    }
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';

    const card = document.createElement('div');
    card.className = 'card h-100';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const title = document.createElement('h5');
    title.className = 'card-title';
    title.textContent = product.name;

    const description = document.createElement('p');
    description.className = 'card-text';
    description.textContent = product.description || 'No description available';

    const status = document.createElement('p');
    status.className = 'card-text';
    status.innerHTML = `<small class="text-muted">Status: ${product.lifecycleStatus}</small>`;

    const lastUpdate = document.createElement('p');
    lastUpdate.className = 'card-text';
    lastUpdate.innerHTML = `<small class="text-muted">Last Update: ${new Date(product.lastUpdate).toLocaleString()}</small>`;

    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(status);
    cardBody.appendChild(lastUpdate);
    card.appendChild(cardBody);
    col.appendChild(card);

    return col;
}

function showError(message) {
    const container = document.getElementById('products-container');
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger" role="alert">
                ${message}
            </div>
        </div>
    `;
} 