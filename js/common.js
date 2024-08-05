document.addEventListener('DOMContentLoaded', () => {
    const toggleViewButton = document.getElementById('toggle-view');

    toggleViewButton.addEventListener('click', () => {
        const currentRole = localStorage.getItem('role');
        if (currentRole === 'client') {
            localStorage.setItem('role', 'admin');
            window.location.href = 'admin.html';
        } else {
            localStorage.setItem('role', 'client');
            window.location.href = 'index.html';
        }
    });
});
