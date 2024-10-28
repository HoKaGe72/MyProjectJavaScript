let swipeAction, swipeEnd, swipeStart, stateAutoSwipe = false, secSwipe = 0, stopAutoSwipeOnHover = false, stateautoswipe = true, autoswipeInterval; 

// Включение свапа
onSwipe = () =>{
    slide();
    let posInit = 0,
        posX1 = 0,
        posX2 = 0,
        posY1 = 0,
        posY2 = 0,
        posFinal = 0,
        isSwipe = false,
        isScroll = false,
        allowSwipe = true,
        nextTrf = 0,
        prevTrf = 0,
        lastTrf = --slides.length * slideWidth,
        posThreshold = slideWidth * 0.35,
        trfRegExp = /([-0-9.]+(?=px))/,
        swipeStartTime,
        swipeEndTime;

    swipeStart = function() {
        let evt = getEvent();
        if (allowSwipe) {
            swipeStartTime = Date.now();
            transition = true;

            nextTrf = (slideIndex + 1) * -slideWidth;
            prevTrf = (slideIndex - 1) * -slideWidth;

            posInit = posX1 = evt.clientX;
            posY1 = evt.clientY;

            sliderTrack.style.transition = '';

            document.addEventListener('touchmove', swipeAction);
            document.addEventListener('mousemove', swipeAction);
            document.addEventListener('touchend', swipeEnd);
            document.addEventListener('mouseup', swipeEnd);

            sliderList.classList.remove('grab');
            sliderList.classList.add('grabbing');
        }
    };

    swipeAction = function() {
        let evt = getEvent();
        let style = sliderTrack.style.transform;

        let transformMatch = style.match(trfRegExp);
        let transform = transformMatch ? +transformMatch[0] : 0;

        posX2 = posX1 - evt.clientX;
        posX1 = evt.clientX;

        posY2 = posY1 - evt.clientY;
        posY1 = evt.clientY;

        if (!isSwipe && !isScroll) {
            let posY = Math.abs(posY2);
            if (posY > 7 || posX2 === 0) {
                isScroll = true;
                allowSwipe = false;
            } else if (posY < 7) {
                isSwipe = true;
            }
        }

        if (isSwipe) {
            if (slideIndex === 0) {
                if (posInit < posX1) {
                    setTransform(transform, 0);
                    return;
                } else {
                    allowSwipe = true;
                }
            }

            if (slideIndex === --slides.length) {
                if (posInit > posX1) {
                    setTransform(transform, lastTrf);
                    return;
                } else {
                    allowSwipe = true;
                }
            }

            if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
                reachEdge();
                return;
            }

            sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
        }
    };

    swipeEnd = function() {
        posFinal = posInit - posX1;

        isScroll = false;
        isSwipe = false;

        document.removeEventListener('touchmove', swipeAction);
        document.removeEventListener('mousemove', swipeAction);
        document.removeEventListener('touchend', swipeEnd);
        document.removeEventListener('mouseup', swipeEnd);

        sliderList.classList.add('grab');
        sliderList.classList.remove('grabbing');

        if (allowSwipe) {
            swipeEndTime = Date.now();
            if (Math.abs(posFinal) > posThreshold || swipeEndTime - swipeStartTime < 300) {
                if (posInit < posX1) {
                    slideIndex--;
                } else if (posInit > posX1) {
                    slideIndex++;
                }
            }

            if (posInit !== posX1) {
                allowSwipe = false;
                slide();
            } else {
                allowSwipe = true;
            }
        } else {
            allowSwipe = true;
        }

        numslide.innerHTML = `${slideIndex + 1}/${slides.length}`;
        captiontext.innerHTML = `Caption Text ${slideIndex + 1}`;
        for (let i = 0; i < pags.length; i++) {
            pags[i].classList.toggle('disabled', false);
        }
        pags[slideIndex].classList.toggle('disabled', true);
    };

    const setTransform = function(transform, comapreTransform) {
        if (transform >= comapreTransform) {
            if (transform > comapreTransform) {
                sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
            }
        }
        allowSwipe = false;
    };

    const reachEdge = function() {
        transition = false;
        swipeEnd();
        allowSwipe = true;
    };

    if(slideIndex===0){
        sliderTrack.style.transform = `translate3d(${slideIndex}px, 0px, 0px)`;  
    }else{
        sliderTrack.style.transform = `translate3d(-${slideIndex}000px, 0px, 0px)`
    }
    
    sliderList.classList.add('grab');
    sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
    slider.addEventListener('touchstart', swipeStart);
    slider.addEventListener('mousedown', swipeStart);
}

// Отключение свап
offSwipe = () => {
    sliderTrack.style.transform = 'none';
    sliderTrack.removeEventListener('transitionend', () => allowSwipe = true);
    document.removeEventListener('touchmove', swipeAction);
    document.removeEventListener('mousemove', swipeAction);
    document.removeEventListener('touchend', swipeEnd);
    document.removeEventListener('mouseup', swipeEnd);
    slider.removeEventListener('touchstart', swipeStart);
    slider.removeEventListener('mousedown', swipeStart);
    sliderList.classList.remove('grab');
    allowSwipe = false;
    slide();
}



// Включение Слайд-шоу
startAutoSwipe = () => {
    if (stateautoswipe) {
        autoswipeInterval = setInterval(() => {
            if (slideIndex + 1 === slides.length && loop) {
                slideIndex = 0;
                transition = false;
            } else if (slideIndex < slides.length - 1) {
                slideIndex++;
                transition = true;
            }
            currentSlide(slideIndex + 1);
        }, secSwipe*1000);
    }
}
// Отключение Слайд-шоу
stopAutoSwipe = () => {
    clearInterval(autoswipeInterval);
}

// Остановка Слайд-шоу при наведении
function handleMouseHover(event) {
    if (stopAutoSwipeOnHover && stateautoswipe) {
        if (event.type === 'mouseenter') {
            stopAutoSwipe();
        } else if (event.type === 'mouseleave') {
            startAutoSwipe();
        }
    }
}

// обработчики событий для слайдов
mous = () =>{
    if(stopAutoSwipeOnHover){
        slides.forEach(slide => {
            slide.addEventListener('mouseenter', handleMouseHover);
            slide.addEventListener('mouseleave', handleMouseHover);
        });
    }else{
        slides.forEach(slide => {
            slide.removeEventListener('mouseenter', handleMouseHover);
            slide.removeEventListener('mouseleave', handleMouseHover);
        });
    }
    
}
