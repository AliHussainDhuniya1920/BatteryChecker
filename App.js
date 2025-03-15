import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Button } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Sound from 'react-native-sound';

const App = () => {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  let sound = null;

  useEffect(() => {
    const checkBatteryLevel = async () => {
      const level = await DeviceInfo.getBatteryLevel();
      setBatteryLevel(level * 100); // Set battery percentage

      // Only trigger sound if battery level >= 79% and sound is not playing
      if (level >= 0.81 && !isPlaying) {
        playSoundOnce(); // Play sound only once when condition met
      }
    };

    const interval = setInterval(checkBatteryLevel, 10000); // Check every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [isPlaying]);

  const playSoundOnce = () => {
    sound = new Sound('bell_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (!error) {
        setIsPlaying(true); // Set sound as playing
        sound.play(() => {
          console.log("Sound played");
          Alert.alert('Battery Full', 'Your battery is fully charged! Tap to stop sound.');
        });
      } else {
        console.log("Error loading sound:", error);
      }
    });
  };

  const stopSound = () => {
    if (sound) {
      sound.stop();
      sound.release();
    }
    setIsPlaying(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Battery Level: {batteryLevel.toFixed(0)}%</Text>
      {isPlaying && <Button title="Stop Sound" onPress={stopSound} />}
    </View>
  );
};

export default App;
