$(document).ready(() => {
	//function for fetching 2 api req
	function fetchData() {
		const newsURL =
			'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=technology,earnings&apikey=FKGNY01DWDV4G28G'
		const apiKey = '63ee659aa58b484fb18a38bd3a045443'
		const stocksSymbols = ['AAPL', 'TSLA', 'NKE']

		const fetchStockData = async (symbol) => {
			const stocksPricesURL = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1h&apikey=${apiKey}`
			const res = await fetch(stocksPricesURL)
			return await res.json()
		}
		//fetching stocks and news from url
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

			const cardElement = $('<div class="card">')
			const cardBody = $('<div class="card-body">')

			if (values && values.length > 0) {
				const openingPrice = Number(values[0].open).toFixed(2)
				const closingPrice = Number(values[values.length - 1].close).toFixed(2)

				cardBody.append(`<h5 class="card-title">${symbol}</h5>`)
				cardBody.append(
					`<p class="card-text">Opening Price: ${openingPrice}</p>`
				)
				cardBody.append(
					`<p class="card-text">Closing Price: ${closingPrice}</p>`
				)
				const priceChange = closingPrice - openingPrice

				if (priceChange > 0) {
					cardElement.addClass('stock-up')
					cardBody.addClass('text-success')
				} else if (priceChange < 0) {
					cardElement.addClass('stock-down')
					cardBody.addClass('text-danger')
				}

				cardElement.append(cardBody)
				stocksContainer.append(cardElement)
			}
		})
	}

	// function to fetch stock data for a given symbol
	const fetchStockDataBySymbol = async (symbol) => {
		const apiKey = '63ee659aa58b484fb18a38bd3a045443'
		const stocksPricesURL = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1h&apikey=${apiKey}`
		const res = await fetch(stocksPricesURL)
		return await res.json()
	}

	//function to display news
	function displayNews(newsData) {
		const newsContainer = $('#newsContainer')
		// console.log(newsData)

		// for loop to iterate over articles and create html card for articles
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
					<a href="${url}">Read More</a>
				</p>
				</div>`)

			// console.log(articleElement)

			newsContainer.append(articleElement)
		}
	}
	
	//portfolioLink using .hide and .show to navigate pages
	$('#portfolioLink').click(() => {
		$('#newsContainer').hide()
		$('#portfolioContent').show()
		$('#stocksContainer').show()
	})

	//latestNews using .hide and .show to navigate pages
	$('#latestNews').click(() => {
		$('#portfolioContent').hide()
		$('#newsContainer').show()
		$('#stocksContainer').hide()
	})

	//searchButton - takes input, fetches it using fetchStockDataBySymbol function and renders data via displayStocks function
	$('#searchButton').on('click', () => {
		const stockSymbol = $('#stockInput').val().toUpperCase()
		$('#stockInput').val('')
		if (stockSymbol) {
			fetchStockDataBySymbol(stockSymbol)
				.then((stockData) => {
					const stocksPricesDataArray = [stockData]
					displayStocks(stocksPricesDataArray)
				})
				.catch((error) => {
					console.log(error)
				})
		}
	})
});





// const stocksListURL = 'https://api.twelvedata.com/stocks'
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

	//news button for each stock container
	// const newsButton = $(
	// 	`<button class="btn btn-primary btn-news" data-symbol="${symbol}">View News</button>`
	// )

	// $('#newsContainer').on('click', '.btn-news', (event) => {
	// 	const symbol = $(event.currentTarget).data('symbol')
	// 	fetchNews(symbol)
	// })

	// Append newsButton
	// cardElement.append(newsButton)