document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const myTimesButton = document.getElementById('mytimes-button');
    const helpButton = document.getElementById('help-button');
    const closeModalButton = document.getElementsByClassName('close')[0];

    loginButton.addEventListener('click', () => {
        alert("why");
    });

    myTimesButton.addEventListener('click', () => {
        alert("why");
    });

    helpButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});