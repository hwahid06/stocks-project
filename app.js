$(document).ready(() => {
	//function to display news
	function displayNews(newsData) {
		const newsContainer = $('#newsContainer')
		let newsHTML = ''

		// for loop to iterate over articles and create html for articles
		for (let i = 0; i < newsData.length; i++) {
			const article = newsData[i]
			const title = article.title
			const source = article.source
			const url = article.url
            //appending news articles to html
			newsHTML += `
                <div>
                <h2>${title}</h2>
                <p>Source: ${source}</p>
                <p><a href="${url}" target='_blank">Read More</a></p>
                </div>`
		}

		newsContainer.html(newsHTML)
	}

	//function for fetching 3 api req
	function fetchData() {
		let newsURL = 'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=technology,earnings&apikey=FKGNY01DWDV4G28G'
		let stocksListURL = 'https://api.twelvedata.com/stocks'
		let stocksPricesURL = 'https://api.twelvedata.com/time_series?symbol=AAPL&interval=1min&apikey=63ee659aa58b484fb18a38bd3a045443'

		fetch(newsURL)
			.then((res) => res.json())
			.then((newsData) => {
				console.log(newsData)
				displayNews(newsData)

				return fetch(stocksListURL).then((res) => res.json())
			})
			.then((stocksData) => {
				console.log(stocksData)

				return fetch(stocksPricesURL).then((res) => res.json())
			})
			.then((stocksPricesData) => {
				console.log(stocksPricesData)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	fetchData()
})
