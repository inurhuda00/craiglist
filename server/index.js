const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const port = 8000;


const app = express();

app.use(cors());

app.use(morgan('tiny'));

function getResults(body) {
    const $ = cheerio.load(body);
    const rows = $('li.result-row');

    const result = [];

    rows.each((index, element) => {
        const results = $(element);
        const title = results.find('.result-title').text();
        const price = $(results.find('.result-price').get(0)).text();
        const imageData = results.find('a.result-image').attr('data-ids');
        let images = [];
        if (imageData) {
            const parts = imageData.split(',');
            images = parts.map((id) => {
                return `https://images.craigslist.org/${id.split(':')[1]}_300x300.jpg`;
            });
        };
        let hood = results.find('span.result-hood').text();

        if (hood) {
            hood = hood.match(/\((.*)\)/)[1];
        }

        let url = results.find('.result-title.hdrlnk').attr('href');
        result.push({
            title,
            price,
            images,
            hood,
            url
        });
    });

    return result;
}

// var result = $('li.result-row');

// result.each((index, element) => {
//     const result = $(element);
//     const city = result.find('span.result-hood').text();
//     cities = city.replace('(', '');
//     c = cities.replace(')', '');
//     console.log(c);
// });

app.get('/', (req, res) => {
    res.json({
        message: 'hellow world'
    });
});

app.get('/search/:location/:search_term', (req, res) => {
    const { location, search_term } = req.params;

    const url = `https://${location}.craigslist.org/search/sss?query=${search_term}`;

    fetch(url)
        .then(res => res.text())
        .then(body => {
            const results = getResults(body);
            res.json({
                results
            })
        })
})

app.use((req, res, next) => {
    const err = new Error('Not Found');
    res.status(404);
    next(err);
});


app.use((err, req, res, next) => {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message
    });
});

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);

});
