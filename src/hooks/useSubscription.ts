import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { getUserProfile, updateSubscription, cancelSubscription } from '../services/userService';

export function useSubscription(userId: string | undefined) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (userId) {
      loadUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [userId]);

  const loadUserProfile = async () => {
    if (!userId) return;
    const profile = await getUserProfile(userId);
    setUserProfile(profile);
  };

  const handleSubscribe = async () => {
    if (!userId) return;
    await updateSubscription(userId, 'premium');
    await loadUserProfile();
  };

  const handleCancelSubscription = async () => {
    if (!userId) return;
    await cancelSubscription(userId);
    await loadUserProfile();
  };

  return {
    userProfile,
    handleSubscribe,
    handleCancelSubscription,
  };
}