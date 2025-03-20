const apiUrl =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

const searchInput = document.getElementById("search");
const tableBody = document.getElementById("tableBody");
const sortMarketCapButton = document.getElementById("sortMarketCap");
const sortPercentageChangeButton = document.getElementById(
  "sortPercentageChange"
);

let coinData = [];

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    coinData = data;
    renderTable(coinData);
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

function renderTable(data) {
  tableBody.innerHTML = ""; 

  data.forEach((coin) => {
   const row = document.createElement("tr");
   const priceChange = document.createElement('td');
   const marketCap = document.createElement('td');
   
   if (coin.price_change_percentage_24h > 0) {
     priceChange.style.color = "green";
   } else {
     priceChange.style.color = "red";
   }
   priceChange.textContent = `${coin.price_change_percentage_24h.toFixed(2)}%`;
   marketCap.textContent = `$${coin.market_cap.toLocaleString()}`;
    row.innerHTML = `
            <td style="display:flex;justify-content:left;align-items:center;"><img src="${coin.image}" alt="${coin.name}">&nbsp;&nbsp;${coin.name}</td>
            <td>${coin.symbol.toUpperCase()}</td>
            <td>$${coin.current_price.toFixed(2)}</td>
            <td>${coin.total_volume.toLocaleString()}</td>
        `;
   row.appendChild(priceChange);
   row.appendChild(marketCap);
    tableBody.appendChild(row);
  });
}

searchInput.addEventListener("input", (event) => {
  const searchQuery = event.target.value.toLowerCase();
  const filteredData = coinData.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery)
  );
  renderTable(filteredData);
});

sortMarketCapButton.addEventListener("click", () => {
  const sortedByMarketCap = [...coinData].sort(
    (a, b) => b.market_cap - a.market_cap
  );
  renderTable(sortedByMarketCap);
});

sortPercentageChangeButton.addEventListener("click", () => {
  const sortedByPercentageChange = [...coinData].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
  );
  renderTable(sortedByPercentageChange);
});

fetchData();
