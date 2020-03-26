const API_URL = 'http://localhost:8000/search/losangeles/';

var app = new Vue({
    el: '#app',
    data: {
        loading: false,
        term: '',
        activeTerm: null,
        terms: ['moog', 'synth', 'keyboard'],
        activeResults: [],
        deleted: {},
        fav: []
    },
    mounted() {
        if (localStorage.terms) {
            this.terms = JSON.parse(localStorage.terms);
        }

        if (localStorage.deleted) {
            this.deletedResults = JSON.parse(localStorage.deleted);
        }
    },
    methods: {
        deleteTerm(term) {
            const index = this.terms.indexOf(term);
            this.terms.splice(index, 1);
            this.activeTerm = null;
            this.activeResults = [];
            localStorage.terms = JSON.stringify(this.terms);
        },
        addTerm() {
            this.terms.push(this.term);
            localStorage.terms = JSON.stringify(this.terms);
            this.term = '';
        },
        searchTerm(term) {
            this.activeResults = [];
            this.activeTerm = term;
            const url = `${API_URL}${term}`;
            this.loading = true;

            fetch(url)
                .then(res => res.json())
                .then(json => {
                    this.activeResults = json.results
                    this.loading = false;
                })
        },
        deleteResult(result) {
            this.$set(this.deleted, result.url, true);
            localStorage.deleted = JSON.stringify(this.deleted);
        },
        showFav() {

        },
        addFav() {

        }

    }
})
