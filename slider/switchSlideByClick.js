
let slider = document.querySelector('.slider'),
    sliderList = document.querySelector('.sliderList'),
    sliderTrack = document.querySelector('.sliderTrack'),
    numslide = document.querySelector('.numslide'),
    captiontext = document.querySelector('.captiontext'),
    arrows = document.querySelector('.slider-arrows'),
    prev = document.querySelector('.prev'),
    next = document.querySelector('.next'),
    pags = document.querySelectorAll('.pfalse'),
    slides = document.querySelectorAll('#slide'),
    slideWidth = slides[0].offsetWidth,
    slideIndex = 0,
    transition = true,
    loop = true,
    swipe = true,
    getEvent = function() {
        return (event.type.search('touch') !== -1) ? event.touches[0] : event;
    },
    slide = function() {
        if (transition) {
            sliderTrack.style.transition = "transform .5s";
        } else {
            sliderTrack.style.transition = "none"; // Убираем плавный переход
        }

        sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;

        // Запретить слайда по кругу
        if (loop) {
            prev.classList.toggle('disabled', false);
            next.classList.toggle('disabled', false);

        }else{
            prev.classList.toggle('disabled', slideIndex === 0);
            next.classList.toggle('disabled', slideIndex === slides.length - 1);
        }
    }

// Отслеживаем нажатие на стрелочки навигации
document.querySelector('.slider-arrows').addEventListener('click', function(event) {
    let target = event.target;
    if (target.classList.contains('next')) {
        if (slideIndex + 1 === slides.length && loop) {
            slideIndex = 0;
            transition = false;
        } else {
            slideIndex++;
            transition = true;
        }
    } else if (target.classList.contains('prev')) {
        if (slideIndex === 0 && loop) {
            slideIndex = slides.length - 1;
            transition = false;
        } else {
            slideIndex--;
            transition = true;
        }
    } else {
        return;
    }
    currentSlide(slideIndex+1);
});

// изменение надписей и пагинации
function currentSlide(index){
    slideIndex=index-1;
    numslide.innerHTML = `${index}/${slides.length}`;
    captiontext.innerHTML = `Caption Text ${index}`;
    for(let i=0;i<pags.length;i++){
        pags[i].classList.toggle('disabled', false);
    }
    pags[index-1].classList.toggle('disabled', true);
    slide();
}
