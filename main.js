document.addEventListener('DOMContentLoaded', () => {
    const githubButton = document.getElementById('github-button');
    const myTimesButton = document.getElementById('mytimes-button');
    const helpButton = document.getElementById('help-button');
    const settingsButton = document.getElementById('settings-button');
    const closeModalButton = [...document.getElementsByClassName('close')];

    const myTimesModal = document.getElementById('modal-mytimes');
    const helpModal = document.getElementById('modal-help');
    const settingsModal = document.getElementById('modal-settings');

    githubButton.addEventListener('click', () => {
        window.location.href = "https://github.com/osutaiko/osutaiko.github.io";
    });

    myTimesButton.addEventListener('click', () => {
        myTimesModal.style.display = 'block';
    });

    helpButton.addEventListener('click', () => {
        helpModal.style.display = 'block';
    });

    settingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });

    closeModalButton.forEach(button => {
        button.addEventListener('click', () => {
            myTimesModal.style.display = 'none';
            helpModal.style.display = 'none';
            settingsModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == myTimesModal || event.target == helpModal || event.target == settingsModal) {
            myTimesModal.style.display = 'none';
            helpModal.style.display = 'none';
            settingsModal.style.display = 'none';
        }
    });

    const toggleLocationSelect = document.getElementById('toggle-location');

    // Retrieve toggle button location from localStorage, defaulting to 'bottom-right'
    const toggleLocation = localStorage.getItem('toggleLocation') || 'bottom-right';
    toggleLocationSelect.value = toggleLocation;

    // Update toggle button location
    function updateToggleButtonLocation(location) {
        const toggleButton = document.getElementById('toggle-button');
        toggleButton.classList.remove('bottom-right', 'bottom-left', 'center-right', 'center-left');
        toggleButton.classList.add(location);
    }

    // Update toggle button location based on dropdown selection
    toggleLocationSelect.addEventListener('change', () => {
        const selectedLocation = toggleLocationSelect.value;
        localStorage.setItem('toggleLocation', selectedLocation);
        updateToggleButtonLocation(selectedLocation);
    });

    // Set initial toggle button location
    updateToggleButtonLocation(toggleLocation);

    
    
    var storageKeys = [
        'classic-beginner-time',
        'classic-intermediate-time',
        'classic-expert-time',
        'multimines-beginner-time',
        'multimines-intermediate-time',
        'multimines-expert-time',
        'omega-beginner-time',
        'omega-intermediate-time',
        'omega-expert-time',
        'liar-beginner-time',
        'liar-intermediate-time',
        'liar-expert-time'
    ];
    
    for (var i = 0; i < storageKeys.length; i++) {
        document.getElementById(storageKeys[i]).textContent = localStorage.getItem(storageKeys[i]) || 'N/A';
    }
});
