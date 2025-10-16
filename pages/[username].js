import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Head from 'next/head';

export default function UserProfile() {
    const router = useRouter();
    const { username } = router.query;
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (username) {
            const fetchUserProfile = async () => {
                setLoading(true);
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('username', '==', username));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setUserProfile(null);
                } else {
                    setUserProfile(querySnapshot.docs[0].data());
                }
                setLoading(false);
            };
            fetchUserProfile();
        }
    }, [username]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userProfile) {
        return <div>User not found</div>;
    }

    return (
        <div id="profile">
            <Head>
                <title>{userProfile.username}'s Profile</title>
            </Head>
            <img id="profile-picture" src={userProfile.profilePictureBase64 || '/placeholder.png'} alt="Profile Picture" />
            <h1 id="username">{userProfile.username}</h1>
            <div id="links">
                {userProfile.whatsapp && <a href={userProfile.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
                {userProfile.instagram && <a href={userProfile.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
                {userProfile.tiktok && <a href={userProfile.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>}
            </div>
        </div>
    );
}
