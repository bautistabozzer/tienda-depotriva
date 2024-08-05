document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // Usuarios predefinidos (para propósitos de demostración)
    const users = [
        { username: 'admin', password: 'admin', role: 'admin' },
        { username: 'cliente', password: 'cliente', role: 'client' }
    ];

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Guardar el rol del usuario en localStorage
            localStorage.setItem('role', user.role);

            // Redireccionar según el rol
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else if (user.role === 'client') {
                window.location.href = 'index.html';
            }
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    });
});
