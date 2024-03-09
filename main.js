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

    
    
    var storageKeys = [
        'classic-beginner-time',
        'classic-intermediate-time',
        'classic-expert-time',
        'multi-beginner-time',
        'multi-intermediate-time',
        'multi-expert-time',
        'omega-beginner-time',
        'omega-intermediate-time',
        'omega-expert-time'
    ];
    
    for (var i = 0; i < storageKeys.length; i++) {
        document.getElementById(storageKeys[i]).textContent = localStorage.getItem(storageKeys[i]) || 'N/A';
    }
});
