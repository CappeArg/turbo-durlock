document.addEventListener('DOMContentLoaded', () => {
    const profilePicture = document.getElementById('profile-picture');
    const usernameH1 = document.getElementById('username');
    const linksDiv = document.getElementById('links');

    // Get username from URL hash
    const username = window.location.hash.substring(1); // Remove the leading '#'

    if (username) {
        // Fetch user data from Firestore
        db.collection('users').where('username', '==', username).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No such user!');
                    usernameH1.textContent = 'User not found';
                    return;
                }
                snapshot.forEach(doc => {
                    const user = doc.data();
                    // Use the Base64 string directly as the image source
                    profilePicture.src = user.profilePictureBase64 || 'placeholder.png';
                    usernameH1.textContent = user.username;
                    createLink('WhatsApp', user.whatsapp);
                    createLink('Instagram', user.instagram);
                    createLink('TikTok', user.tiktok);
                });
            })
            .catch(err => {
                console.log('Error getting document', err);
            });
    } else {
        usernameH1.textContent = 'No user specified';
    }

    function createLink(name, url) {
        if (url) {
            const a = document.createElement('a');
            a.href = url;
            a.textContent = name;
            a.target = '_blank'; // Open in a new tab
            linksDiv.appendChild(a);
        }
    }
});