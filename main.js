document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const myTimesButton = document.getElementById('mytimes-button');
    const helpButton = document.getElementById('help-button');
    const closeModalButton = [...document.getElementsByClassName('close')];

    const myTimesModal = document.getElementById('modal-mytimes');
    const helpModal = document.getElementById('modal-help');

    loginButton.addEventListener('click', () => {
        alert("why");
    });

    myTimesButton.addEventListener('click', () => {
        myTimesModal.style.display = 'block';
    });

    helpButton.addEventListener('click', () => {
        helpModal.style.display = 'block';
    });

    closeModalButton.forEach(button => {
        button.addEventListener('click', () => {
            myTimesModal.style.display = 'none';
            helpModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == myTimesModal || event.target == helpModal) {
            myTimesModal.style.display = 'none';
            helpModal.style.display = 'none';
        }
    });

    var beginnerTime = localStorage.getItem("beginner-time");
    var intermediateTime = localStorage.getItem("intermediate-time");
    var expertTime = localStorage.getItem("expert-time");

    document.getElementById("beginner-time").textContent = beginnerTime || "N/A";
    document.getElementById("intermediate-time").textContent = intermediateTime || "N/A";
    document.getElementById("expert-time").textContent = expertTime || "N/A";

    var multiBeginnerTime = localStorage.getItem("multi-beginner-time");
    var multiIntermediateTime = localStorage.getItem("multi-intermediate-time");
    var multiExpertTime = localStorage.getItem("multi-expert-time");

    document.getElementById("multi-beginner-time").textContent = multiBeginnerTime || "N/A";
    document.getElementById("multi-intermediate-time").textContent = multiIntermediateTime || "N/A";
    document.getElementById("multi-expert-time").textContent = multiExpertTime || "N/A";
});
