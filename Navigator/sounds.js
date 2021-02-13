import Sound from 'react-native-sound';
Sound.setCategory('Playback');

// https://www.cubui.com/blog/react/pull-to-refresh-and-button-press-sound-effect-in-react-native/
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

const rewind = new Sound(require('../audio/rewind.wav'), error =>
  console.log(error),
);

export const playRewind = () => {
  rewind.play(success => rewind.reset());
};

const forward = new Sound(require('../audio/forward.mp3'), error =>
  console.log(error),
);

export const playForward = () => {
  forward.play(success => forward.reset());
};

const nope = new Sound(require('../audio/nope.wav'), error =>
  console.log(error),
);

export const playNope = () => {
  nope.play(success => nope.reset());
};
