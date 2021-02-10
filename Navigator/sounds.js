import Sound from 'react-native-sound';
Sound.setCategory('Playback');

const swish = new Sound(require('../audio/swish.mp3'), error =>
  console.log(error),
);

export const playSwish = () => {
  swish.play(success => swish.reset());
};

const clunk = new Sound(require('../audio/clunk.wav'), error =>
  console.log(error),
);

export const playClunk = () => {
  clunk.play(success => clunk.reset());
};

const shoeSqueak = new Sound(require('../audio/shoeSqueak.wav'), error =>
  console.log(error),
);

export const playShoeSqueak = () => {
  shoeSqueak.play(success => shoeSqueak.reset());
};
