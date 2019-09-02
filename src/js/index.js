import 'bootstrap';

import '../scss/index.scss';

const api_key = 'ba8159941b16e12958a2898e29ca82b1';
const resultsContainer = $('#results-container');
const totalResults = $('#totalresults');
const castContainer = $('#castcontainer');

const containers = [resultsContainer, totalResults, castContainer];

$(document).ready(function ($) {
    $('#search').keyup(function () {
        let query = $('#search').val();
        if (query.length > 3) {
            $.get(
                'https://api.themoviedb.org/3/search/movie?api_key=' +
                api_key +
                '&language=en-US&query=' +
                query +
                '&page=1&include_adult=false',
                function (data, status) {
                    console.log(data);
                    console.log(status);
                    searchResults(data);
                }
            );
        }
    });
});

function searchResults(data) {
    resetElements(containers);

    let num_results = data.total_results;

    console.log(data.results);
    $.each(data.results, function (index, value) {
        resultsContainer.append(
            '<p><a href="#" class="movie-title" data-movieid="' +
            value.id +
            '">' +
            value.title +
            '</a></p>'
        );
    });

    totalResults.append(num_results);
    $('.movie-title').on('click', function () {
        castContainer.html('');
        getCredits($(this).data('movieid'));
    });
}

function getCredits(movieid) {
    $.get(
        'https://api.themoviedb.org/3/movie/' +
        movieid +
        '/credits?api_key=' +
        api_key +
        '',
        function (moviedata, status) {
            console.log(moviedata.cast);
            console.log(status);
            $.each(moviedata.cast, function (index, castvalue) {
                castContainer.append(
                    '<p><a href="#" class="person" data-personid="' +
                    castvalue.id +
                    '">' +
                    castvalue.character +
                    ' - ' +
                    castvalue.name +
                    '</a></p>'
                );
            });
            $('.person').on('click', function () {
                getPerson($(this).data('personid'));
            });
        }
    );
}

function getPerson(personid) {
    $.get(
        'https://api.themoviedb.org/3/person/' +
        personid +
        '?api_key=' +
        api_key +
        '',
        function (persondata, status) {
            console.log(persondata);
            console.log(status);
            if (persondata.deathday) {
                alert('dead - ' + persondata.deathday);
                //var life = '<span class="badge badge-danger">dead</span>';
            } else {
                alert('alive probably');
            }
        }
    );
}

function resetElements(elements) {
    elements.forEach(element => {
        element.html('');
    });
}
