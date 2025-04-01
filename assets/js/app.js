const navbar = document.querySelector('.navbar')
const hamburger = document.querySelector('.hamburger')
const navLinks = document.querySelector('.nav-links')
const navLinksLi = document.querySelectorAll('.nav-links li')


window.addEventListener('scroll', () => {
    if(this.scrollY >= 100) {
        navbar.classList.add('scrolled')
    } else {
        navbar.classList.remove('scrolled')
    }
})

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active')
    hamburger.classList.toggle('active')
})

navLinksLi.forEach(li => li.addEventListener('click', ()=> {
    navLinksLi.forEach(li => li.classList.remove('active'))
    li.classList.add('active')

    hamburger.classList.remove('active')
    navLinks.classList.remove('active')

}))


// Typed js
var options = {
    strings: [
        'اهلا وسهلا بكم', 
        'العمل والحياة داخل اليونان',
        'Είστε ευπρόσδεκτοι',
    ],
    typeSpeed: 40,
    loop: true,
    loopCount: Infinity,
    typeSpeed: 60,
    backDelay: 2500,
  };
  
var typed = new Typed('#hero-titles', options);

// AOS
AOS.init();