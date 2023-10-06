
const add = document.querySelector(".add");
const cards = document.querySelectorAll(".card")
// Add a click event listener to the SVG element
add.addEventListener("click", () => {
    // Perform an action, such as making an HTTP request to a specific route
    // Replace the URL with the actual route you want to hit
    window.location.href = "/new";
});
cards.forEach(card => {
    const c = card.querySelector('.priority')
    const priority = c.innerText
    const a = { High: "high", Low: "low", Medium: "medium" }
    console.log(a[priority])
    card.classList.add(a[priority])
    card.addEventListener('mouseover', handleHoverIn);
    card.addEventListener('mouseout', handleHoverOut);
});

function handleHoverIn(event) {
    const hoveredCard = event.target;
    cards.forEach((card) => {
        if (card !== hoveredCard) {

            card.classList.add('ab');
        }
    });
}

function handleHoverOut() {
    cards.forEach((card) => {
        card.classList.remove('ab');
    });
}