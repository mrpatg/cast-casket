import 'bootstrap';

import '../scss/index.scss';

const api_key = 'ba8159941b16e12958a2898e29ca82b1';
const resultsContainer = $('#results-container');
const totalResults = $('#totalresults');
const castContainer = $('#castcontainer');
const peoplePerson = $('#peopleperson');
const imagebase = 'https://image.tmdb.org/t/p/w200/';


const containers = [resultsContainer, totalResults, castContainer, peoplePerson];

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
        if( !$('#search').val() ) {
            $('.totalresults-container').removeClass('d-flex');
            $('.totalresults-container').addClass('d-none');
            resultsContainer.html('');
            resetElements(containers);
      }
    });
});

function searchResults(data) {
    resetElements(containers);

    let num_results = data.total_results;

    console.log(data.results);
    $.each(data.results, function (index, value) {
        resultsContainer.append(
            '<li class="list-group-item movie-title-container d-flex justify-content-between lh-condensed"><span class="movie-title" data-movieid="' +
            value.id +
            '">' +
            value.title +
            '</span></li>'
        );
    });
    $('.totalresults-container').removeClass('d-none');
    $('.totalresults-container').addClass('d-flex');
    totalResults.append(num_results);
    $('.movie-title').on('click', function () {
        $('.movie-title-container').removeClass('movie-list-selected');
        castContainer.html('');
        peoplePerson.html('');
        $(this).parent('li').addClass('movie-list-selected');
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
                    '<li class="list-group-item movie-title-container d-flex justify-content-between lh-condensed"><span class="person" data-personid="' +
                    castvalue.id +
                    '">' +
                    castvalue.character +
                    ' - ' +
                    castvalue.name +
                    '</span></li>'
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
            peoplePerson.html('');
            console.log(persondata);
            console.log(status);
            peoplePerson.append('<h5>' + persondata.name + '</h5>');
            peoplePerson.append('<span class="image"><img src="' + imagebase + persondata.profile_path + '"></span>');
            if(persondata.place_of_birth){
                peoplePerson.append('<span class="muted d-block">from ' + persondata.place_of_birth + '</span>');  
            }
            peoplePerson.append('<span class="born-date d-block">Born: ' + persondata.birthday + ' </span>');
            if(persondata.deathday){
                peoplePerson.append('<span class="dead-date d-block">Died: ' + persondata.deathday + ' </span>');
            }       
            
            

        }
    );
}

function resetElements(elements) {
    elements.forEach(element => {
        element.html('');
    });
}
