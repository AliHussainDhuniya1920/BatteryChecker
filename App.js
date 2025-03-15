import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Sound from 'react-native-sound';

const App = () => {
  const [batteryLevel, setBatteryLevel] = useState(0);

  useEffect(() => {
    const checkBatteryLevel = async () => {
      const level = await DeviceInfo.getBatteryLevel(); // Returns a value between 0 and 1
      setBatteryLevel(level * 100); // Convert to percentage

      // Play sound when the battery reaches 75% or more
      if (level >= 0.75) {
        playSound();
      }
    };

    const interval = setInterval(checkBatteryLevel, 10000); // Check every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const playSound = () => {
    const bellSound = new Sound('bell_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (!error) {
        bellSound.play(); // Play the sound
        Alert.alert('Battery Full', 'Your battery is at 75% or more!');
      } else {
        console.log('Error loading sound:', error);
      }
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Battery Level: {batteryLevel.toFixed(0)}%</Text>
    </View>
  );
};

export default App;
