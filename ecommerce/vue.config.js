module.exports = {
    publicPath: '/question-graph/',
    pages: {
        index: {
            entry: 'src/main.js',
            title: 'Index Page',
        },
        ecommerce: {
            entry: 'src/pages/ecommerce/main.js',
            title: 'Find your benefit',
        },
        questionnaire: {
            entry: 'src/pages/questionnaire/main.js',
            title: 'Questionnaire',
        }
    }
}