import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Admin() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [instagram, setInstagram] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUsername(data.username || '');
                    setWhatsapp(data.whatsapp || '');
                    setInstagram(data.instagram || '');
                    setTiktok(data.tiktok || '');
                }
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Sign-up error:', error.message);
        }
    };

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Login error:', error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfilePicture(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        const userData = {
            username,
            whatsapp,
            instagram,
            tiktok,
        };
        if (profilePicture) {
            userData.profilePictureBase64 = profilePicture;
        }
        try {
            await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
            console.log('Profile saved!');
        } catch (error) {
            console.error('Error saving profile:', error.message);
        }
    };

    if (!user) {
        return (
            <div id="auth-container">
                <h2>Admin</h2>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button onClick={handleLogin}>Login</button>
                <button id="signup" onClick={handleSignUp}>Sign Up</button>
            </div>
        );
    }

    return (
        <div id="admin-panel">
            <h2>Edit Profile</h2>
            <button id="logout" onClick={handleLogout}>Logout</button>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="file" onChange={handleFileChange} />
            <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp URL" />
            <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram URL" />
            <input type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="TikTok URL" />
            <button onClick={handleSaveProfile}>Save</button>
        </div>
    );
}
