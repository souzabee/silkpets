import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

export default class Som {
  static player = null;

  static async tocar() {
    try {
      await setAudioModeAsync({ playsInSilentMode: true });

      if (Som.player === null) {
        Som.player = createAudioPlayer(require('./assets/som.wav'));
      }

      Som.player.seekTo(0);
      Som.player.play();
    } catch (erro) {}
  }
}
