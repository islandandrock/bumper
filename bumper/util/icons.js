export default function getIcon(app) {
  switch (app) {
    case 'instagram': return require('../assets/app_icons/instagram.png');
    case 'facebook': return require('../assets/app_icons/facebook.png');
    case 'twitter': return require('../assets/app_icons/twitter.png');
    case 'youtube': return require('../assets/app_icons/youtube.png');
  }
}

