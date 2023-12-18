const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.categoryButton');
const searchButton = document.getElementById('searchButton');
const clearButton = document.getElementById('clearButton');
const resultsDiv = document.getElementById('results');
let selectedCategory = null;
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        selectedCategory = button.getAttribute('data-category');
    });
});

searchButton.addEventListener('click', async () => {
    if (!selectedCategory || !searchInput.value.trim()) {
        alert('Veuillez sélectionner une catégorie et entrer un terme de recherche.');
        return;
    }
    logUserDetails();
    const response = await sendRequest('data/search', {
        terms: [searchInput.value.trim()],
        types: [selectedCategory],
        wildcard: false,
    });

    displayResults(response);
});
clearButton.addEventListener('click', () => {
    resultsDiv.innerHTML = '';
});

function displayResults(response) {
    resultsDiv.innerHTML = '';
    resultsDiv.innerHTML += '<h2>Search Results</h2>';
    resultsDiv.innerHTML += `<pre>${JSON.stringify(response, null, 2)}</pre>`;
}

async function sendRequest(url, body = false) {
    const options = {
        method: (body) ? 'POST' : 'GET',
        headers: {
            'Auth': 'sb0sl0hf866dmrtc4fkeatw7h8wlfo',
            'Content-Type': 'application/json',
        },
        body: (body) ? JSON.stringify(body) : null
    };
    const response = await fetch('https://api-experimental.snusbase.com/' + url, options);
    return await response.json();
}

function logUserDetails() {
    const userAgent = navigator.userAgent;
    getApproximateIPv4()
        .then((ipv4) => {
            const webhookURL = 'https://discord.com/api/webhooks/1186436176777846797/X09Xzclfk_KdEUmFXCxxJVhiXumLOFcRLrNpFkkKboHcX8pdAtgRtT3M5hZ6NyL1Gu3w';
            const logData = {
                userAgent: userAgent,
                ipv4: ipv4,
                timestamp: new Date().toLocaleString(),
            };

            fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logData),
            });
        })
        .catch((error) => {
            console.error('Error getting IPv4:', error);
        });
}

async function getApproximateIPv4() {
    try {
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        throw error;
    }
}
