var modal = document.getElementById("attributeModal");
var attributeElms = document.querySelectorAll(".overlay-content ul li");

var btnClose = document.getElementsByClassName("close")[0];

btnClose.onclick = function() {
    modal.classList.add("modal-hidden");
}

window.addEventListener('click', closeModal);
window.addEventListener('touchend', closeModal);

function closeModal(event) {
    if (event.target == modal) {
        modal.classList.add("modal-hidden");
        event.stopPropagation();
    }
}

attributeElms.forEach(attribute => {
    attribute.onclick = function() {
        var msg = '';
        switch (attribute.innerHTML)
        {
            case "Engineer":
                msg = 'I am a passionate engineer who looks at a project in its entirety. I practice  a highly iterative work style and pride myself on clear communication to make sure the project is done right!';
                break;
            case "Tech Savvy":
                msg = 'Computers and technology have been a passion of mine since I was very young. I constantly keep up on new trends and news and frequently attend professional development talks.';
                break;
            case "Passionate":
                msg = 'I am very passionate about what I do. When I learn a new language or a new technology, I try to learn more than the surface level of what I am doing just so I can better unstand it';
                break;
            case "Self Motivated":
                msg = 'I am a very motivated person. I will always strive for improving and learning from my experiences.';
                break;
            default:
                break;
        }

        console.log('Writing:', msg)
        modal.childNodes[1].childNodes[3].innerHTML = msg;
        modal.classList.remove("modal-hidden");
    }
});