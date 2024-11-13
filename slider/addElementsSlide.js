document.addEventListener("DOMContentLoaded", () => {
    createSliderElements();

    const script = document.createElement('script');
    script.setAttribute('src', "/slider/switchSlideByClick.js");
    script.setAttribute('id', "switchSlideByClick");
    document.querySelector('head').appendChild(script);

    document.querySelector('.pfalse').classList.toggle('disabled', true)

    const swapeSlide = document.createElement('script');
    swapeSlide.setAttribute('src', "/slider/swapeSlide.js");
    swapeSlide.setAttribute('id', "swapeSlide");
    document.querySelector('head').appendChild(swapeSlide)
    manage();
})

const slidess = [
    {
        img: 'https://www.w3schools.com/howto/img_nature_wide.jpg',
        text: 'Caption Text 1'
    },
    {
        img: 'https://www.w3schools.com/howto/img_snow_wide.jpg',
        text: 'Caption Text 2'
    },
    {
        img: 'https://www.w3schools.com/howto/img_mountains_wide.jpg',
        text: 'Caption Text 3'
    },
    {
        img: 'https://www.w3schools.com/howto/img_lights_wide.jpg',
        text: 'Caption Text 4'
    },
];

function createSliderElements(){
    const slider = document.createElement('div');
    slider.setAttribute('class', "slider");
    slider.setAttribute('id', "slider");
    const sliderList = document.createElement('div');
    sliderList.setAttribute('class', "sliderList");
    sliderList.setAttribute('id', "sliderList");
    const sliderTrack = document.createElement('div');
    sliderTrack.setAttribute('class', "sliderTrack");
    sliderTrack.setAttribute('id', "sliderTrack");
    for(let i=0; i < slidess.length; i++){
        const slide = document.createElement('div');
        slide.setAttribute('class', "slide");
        slide.setAttribute('id', "slide");
        const photo = document.createElement('img');
        photo.setAttribute('src', slidess[i].img);
        photo.setAttribute('alt', slidess[i].text);
        slide.appendChild(photo);
        sliderTrack.appendChild(slide);
    }
    sliderList.appendChild(sliderTrack);
    slider.appendChild(sliderList);

    const numslide = document.createElement('span');
    numslide.setAttribute('class', "numslide");
    numslide.innerText = `1/${slidess.length}`;
    slider.appendChild(numslide);

    const sliderArrows = document.createElement('div');
    sliderArrows.setAttribute('class',"slider-arrows");
    sliderArrows.setAttribute('id',"slider-arrows");
    const btn_prev = document.createElement('button');
    btn_prev.setAttribute('type', "button");
    btn_prev.setAttribute('class', "prev");
    btn_prev.setAttribute('id', "prev");
    btn_prev.innerHTML = '&lt';
    const btn_next = document.createElement('button');
    btn_next.setAttribute('type', "button");
    btn_next.setAttribute('class', "next");
    btn_next.setAttribute('id', "next");
    btn_next.innerHTML = '&gt';
    sliderArrows.appendChild(btn_prev);
    sliderArrows.appendChild(btn_next);
    slider.appendChild(sliderArrows);

    const captionText = document.createElement('span');
    captionText.setAttribute('class', "captiontext");
    captionText.innerText = "Caption Text 1";
    slider.appendChild(captionText);

    const pointlist = document.createElement('div');
    pointlist.setAttribute('class', "pointlist");
    pointlist.setAttribute('id', "pointlist");
    for(let i=1; i <= slidess.length; i++){
        const point = document.createElement('div');
        point.setAttribute('class', "pfalse");
        point.setAttribute('id', `point_${i}`);
        point.setAttribute('onclick', `currentSlide('${i}')`);
        pointlist.appendChild(point);
    }
    slider.appendChild(pointlist);

    const h2 = document.getElementById('controls');
    h2.after(slider, h2);
}

function manage(){
    const checkboxes = [
        document.getElementById('loop'),
        document.getElementById('navs'),
        document.getElementById('pags'),
        document.getElementById('swipe'),
        document.getElementById('auto'),
        document.getElementById('stopMouseHover')
    ];
    const delayInput = document.getElementById('delay');

    function updateStatus() {
        const states = checkboxes.map(checkbox => ({
            id: checkbox.id,
            checked: checkbox.checked
        }));

        const delayValue = delayInput.value;

        console.clear();
        console.log("Текущее состояние:");
        states.forEach(state => {
            if(state.id == 'loop'){
                loop = state.checked ? true : false;
                slide();
            }
            if(state.id == 'navs'){
                prev.classList.toggle('none', state.checked===false);
                next.classList.toggle('none', state.checked===false);
            }
            if(state.id == 'pags'){
                document.getElementById('pointlist').style.display = state.checked ? 'flex' : 'none'  ;
            }
            if(state.id == 'swipe'){
                swipe = state.checked ? onSwipe() : offSwipe();
            }
            if(state.id == 'auto'){
                stateAutoSwipe = state.checked ? true : false;
                if (stateAutoSwipe) {
                    stopAutoSwipe();
                    secSwipe = delayValue;
                    startAutoSwipe(); // Запускаем автослайд
                } else {
                    stopAutoSwipe(); // Останавливаем автослайд
                }
            }
            if(state.id == 'stopMouseHover'){
                if(!stateAutoSwipe && state.checked){
                    setTimeout(()=>{
                        document.getElementById('stopMouseHover').checked = false;
                        stopAutoSwipeOnHover = false;
                        mous();
                        alert('Чтобы воспользоваться данной функцией включите Слайд-шоу');
                    },500);
                    return
                }
                stopAutoSwipeOnHover = state.checked ? true : false;
                mous();
            }
            console.log(`${state.id}: ${state.checked ? 'Истина' : 'Ложь'}`);
        });
        console.log(`Время (сек): ${delayValue}`);
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateStatus);
    });

    delayInput.addEventListener('input', updateStatus);

    updateStatus();
}