const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.weather-info');

for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', (event) => {
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('tab--active');
        }
        event.target.classList.add('tab--active');


        for (let i = 0; i < tabs.length; i++) {
            contents[i].classList.remove('content--active');
        }
        contents[i].classList.add('content--active');
    });
}