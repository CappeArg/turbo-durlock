document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login');
    const signupButton = document.getElementById('signup');
    const logoutButton = document.getElementById('logout');
    const authContainer = document.getElementById('auth-container');
    const adminPanel = document.getElementById('admin-panel');
    const usernameInput = document.getElementById('username-input');
    const profilePictureInput = document.getElementById('profile-picture-input');
    const whatsappInput = document.getElementById('whatsapp-input');
    const instagramInput = document.getElementById('instagram-input');
    const tiktokInput = document.getElementById('tiktok-input');
    const saveProfileButton = document.getElementById('save-profile');

    // Handle user sign-up
    signupButton.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log('User signed up:', userCredential.user);
            })
            .catch(error => {
                console.error('Sign-up error:', error.message);
            });
    });

    // Handle user login
    loginButton.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log('User logged in:', userCredential.user);
            })
            .catch(error => {
                console.error('Login error:', error.message);
            });
    });

    // Handle user logout
    logoutButton.addEventListener('click', () => {
        auth.signOut().then(() => {
            console.log('User logged out');
        });
    });

    // Listen for auth state changes
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is logged in
            authContainer.style.display = 'none';
            adminPanel.style.display = 'block';
            logoutButton.style.display = 'block';
            loadProfileData(user.uid);
        } else {
            // User is logged out
            authContainer.style.display = 'block';
            adminPanel.style.display = 'none';
            logoutButton.style.display = 'none';
        }
    });

    // Save profile data
    saveProfileButton.addEventListener('click', () => {
        const user = auth.currentUser;
        if (user) {
            const file = profilePictureInput.files[0];
            if (file) {
                // Convert image to Base64
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64String = event.target.result;
                    saveUserData(user.uid, base64String);
                };
                reader.readAsDataURL(file);
            } else {
                // Save without changing the picture
                saveUserData(user.uid);
            }
        }
    });

    function saveUserData(uid, profilePictureBase64) {
        const username = usernameInput.value;
        const whatsapp = whatsappInput.value;
        const instagram = instagramInput.value;
        const tiktok = tiktokInput.value;

        const userData = {
            username,
            whatsapp,
            instagram,
            tiktok,
        };

        if (profilePictureBase64) {
            userData.profilePictureBase64 = profilePictureBase64;
        }

        db.collection('users').doc(uid).set(userData, { merge: true })
            .then(() => {
                console.log('Profile saved!');
            })
            .catch(error => {
                console.error('Error saving profile:', error.message);
            });
    }

    function loadProfileData(uid) {
        db.collection('users').doc(uid).get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                usernameInput.value = data.username || '';
                whatsappInput.value = data.whatsapp || '';
                instagramInput.value = data.instagram || '';
                tiktokInput.value = data.tiktok || '';
                // Note: We don't load the profile picture back into the file input
            }
        });
    }
});