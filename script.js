const changing-text = document.querySelector('.changing-text');


const texts = [
  'Leaving is easy.. Leaving it behind you is hard.',
  'Sharkz? SHARKZ? are you even awake? Fuck sakes.',
  'I might hide my social security number here hehe.',
  'Cheese balls',
  '"life is roblox- dj kahlid',
  '"HOW DO U KNOW I USE ARCH :0',
  '"Drugs are rad- me 2 weeks ago',
  '"yes" -flamingo's ban reason on roblox',
  '"subscribe to my channel youtube.com/thesharkzmanout',
  'I\'m quite out of context some times.',
  'Wait shadys back?',
  'Thank you mario but the princess is in another castle',
  'i ding womp ping pong lollipop',
];

function changeText() {
  const randomIndex = Math.floor(Math.random() * texts.length);
  const newText = texts[randomIndex];
  changingText.textContent = newText;
}


changeText();


setInterval(changeText, 3000); 
