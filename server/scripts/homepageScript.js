    const categories = ['coffee', 'non-coffee','matcha', 'pastries'];
    let currentIndex = 0;


    function updateMenuDisplay() {
        categories.forEach((id, index) => {
            document.getElementById(id).classList.toggle('hidden', index !== currentIndex);
        });

        const tabs = document.querySelectorAll('.tabs .tab');
        tabs.forEach((tab, index) => {
            tab.classList.toggle('active', index === currentIndex);
        });
    }

    function followingCategory() {
        currentIndex = (currentIndex + 1) % categories.length;
        updateMenuDisplay();
    }

    function prevCategory() {
        currentIndex = (currentIndex - 1 + categories.length) % categories.length;
        updateMenuDisplay();
    }
//make the buttons work
    document.querySelectorAll('.tabs .tab').forEach((tab, index) => {
        tab.addEventListener('click', () => {
            currentIndex = index;
            updateMenuDisplay();
        });
    });


    updateMenuDisplay();
