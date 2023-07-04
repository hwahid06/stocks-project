$(document).ready(() => {
	


	//function for fetching 2 api req
	function fetchData() {
		const newsURL = 'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=technology,earnings&apikey=FKGNY01DWDV4G28G'
		// const stocksListURL = 'https://api.twelvedata.com/stocks'
		const apiKey = '63ee659aa58b484fb18a38bd3a045443'
		const stocksSymbols = ['AAPL', 'GOOGL', 'BRK.A']
		const fetchStockData = (symbol) => {
			const stocksPricesURL = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1h&apikey=${apiKey}`
			return fetch(stocksPricesURL).then((res) => res.json())
		}

		fetch(newsURL)
			.then((res) => res.json())
			.then((newsData) => {
				const stocksPromises = stocksSymbols.map((symbol) =>
					fetchStockData(symbol)
				)

				Promise.all(stocksPromises)
					.then((stocksPricesDataArray) => {
						displayStocks(stocksPricesDataArray)
						displayNews(newsData.feed)
					})
					.catch((error) => {
						console.log(error)
					})
			})
			.catch((error) => {
				console.log(error)
			})
	}
	fetchData()

	//function to display diff tickers
	function displayStocks(stocksPricesDataArray) {
		const stocksContainer = $('#stocksContainer')

		stocksPricesDataArray.forEach((stocksPricesData) => {
			const meta = stocksPricesData.meta
			const symbol = meta.symbol
			const values = stocksPricesData.values

			// console.log(values);

			const cardElement = $(`<div class="card">`)
			const cardBody = $('<div class="card-body">')

			// Retrieve opening and closing prices from the values array
			if (values && values.length > 0) {
				const openingPrice = Number(values[0].open).toFixed(2)
				const closingPrice = Number(values[values.length - 1].close).toFixed(2)

				const priceChange = closingPrice - openingPrice

				//news button for each stock container
				const newsButton = $(
					`<button class="btn btn-primary btn-news" data-symbol="${symbol}">View News</button>`
				)

				// card body for stocks container

				cardBody.append(`<h5 class="card-title">${symbol}</h5>`)
				cardBody.append(
					`<p class="card-text">Opening Price: ${openingPrice}</p>`
				)
				cardBody.append(
					`<p class="card-text">Closing Price: ${closingPrice}</p>`
				)

				//formatting
				if (priceChange > 0) {
					cardElement.addClass('stock-up')
					cardBody.addClass('text-success')
				} else if (priceChange < 0) {
					cardElement.addClass('stock-down')
					cardBody.addClass('text-danger')
				}

				// Append the card body to the card
				cardElement.append(cardBody)
				// Append newsButton
				cardElement.append(newsButton)
				// Append the card to the stocks container
				stocksContainer.append(cardElement)
			}
		})
	}

	//function to display news
	function displayNews(newsData) {
		const newsContainer = $('#newsContainer')
		// console.log(newsData)

		// for loop to iterate over articles and create html for articles
		for (let i = 0; i < newsData.length; i++) {
			const feed = newsData[i]
			const title = feed.title
			const source = feed.source
			const url = feed.url
			// console.log(newsHTML)
			//new article element for each iteration
			const articleElement = $(`<div class="card news-card">
				<h3>${title}</h3>
				<p>Source: ${source}</p>
				<p>
					<a href="${url}" target="_blank">Read More</a>
				</p>
				</div>`)

			// console.log(articleElement)

			newsContainer.append(articleElement)
		}
	}

	$('#portfolioLink').click(() => {
		$('#newsContainer').hide()
		$('#portfolioContent').show()
		$('#stocksContainer').show()
	})

	$('#latestNews').click(() => {
		$('#portfolioContent').hide()
		$('#newsContainer').show()
		$('#stocksContainer').hide()
	})

	$('#newsContainer').on('click', '.btn-news', (event) => {
		const symbol = $(event.currentTarget).data('symbol')
		fetchNews(symbol)
	})
	

})








// function fetchNews() {
	// 	const apiKey = 'FKGNY01DWDV4G28G';
	// 	const newsAPI = 'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=earnings&apikey=FKGNY01DWDV4G28G';

	// 	fetch(newsAPI)
	// 		.then((response) => response.json())
	// 		.then((newsData) => {
	// 			displayNews(newsData.feed)
	// 		})
	// 		.catch((error) => {
	// 			console.log(error)
	// 		})
	// }