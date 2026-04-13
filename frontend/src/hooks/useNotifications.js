import { useEffect } from 'react';
import { getProfile } from '../services/api';

const useNotifications = () => {
  useEffect(() => {
    let intervalId;

    const checkSchedules = async () => {
      if (!('Notification' in window)) return;
      
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }

      if (Notification.permission !== 'granted') return;

      try {
        const { data: profile } = await getProfile();
        if (!profile) return;
        
        const now = new Date();
        const currentHours = now.getHours().toString().padStart(2, '0');
        const currentMinutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${currentHours}:${currentMinutes}`;

        const todayKey = now.toDateString();
        const sentKey = `notifs_${todayKey}`;
        let sentLogs = {};
        try {
          sentLogs = JSON.parse(localStorage.getItem(sentKey) || '{}');
        } catch(e) {}

        const triggerNotification = (key, title, body) => {
          if (!sentLogs[key]) {
            new Notification(title, { body });
            sentLogs[key] = true;
            localStorage.setItem(sentKey, JSON.stringify(sentLogs));
          }
        };

        // 1. Meal Schedules
        if (profile.mealTimes) {
          Object.entries(profile.mealTimes).forEach(([meal, time]) => {
            if (time === currentTime) {
              triggerNotification(`meal_${meal}`, 'Time to Eat!', `It's time for your ${meal}. Open FitPlanner to check your diet plan!`);
            }
          });
        }
        
        // 2. Workout Schedule
        if (profile.workoutTime === currentTime) {
          triggerNotification('workout', 'Workout Time!', 'Time to crush your workout goal today!');
        }

        // 3. Water Tracker (Hardcoded Triggers)
        const waterTimes = {
          '09:00': ['water_morn', 'Morning Hydration', "Start your day right! Don't forget to track your Morning Liters."],
          '14:00': ['water_aft', 'Afternoon Hydration', "Stay hydrated! Have you logged your Afternoon Liters?"],
          '20:00': ['water_eve', 'Evening Hydration', "Wrap up the day hydrated. Log your Evening Liters!"]
        };

        if (waterTimes[currentTime]) {
          const [key, title, body] = waterTimes[currentTime];
          triggerNotification(key, title, body);
        }

      } catch (err) {
        console.error('Hook fetch err:', err);
      }
    };

    // Check roughly every minute
    intervalId = setInterval(checkSchedules, 50000);
    // Initial check on load
    checkSchedules();

    return () => clearInterval(intervalId);
  }, []);
};

export default useNotifications;
