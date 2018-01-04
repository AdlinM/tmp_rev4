window.AppConfig = {
  baseApiUrl: process.env.NODE_ENV === 'development' ? 'https://dev.mopaps.xtend.net.my/' : 'https://mopaps.xtend.net.my/',
  apiUrl: process.env.NODE_ENV === 'development' ? 'https://dev.mopaps.xtend.net.my/api/v1/' : 'https://mopaps.xtend.net.my/api/v1/',
  clientId: process.env.NODE_ENV === 'development' ? 'mopaps-web' : 'mopaps-web',
  clientSecret: process.env.NODE_ENV === 'development' ? 'a3fb9l4cf4' : 'a3fb9l4cf4',
  googleApiKey: process.env.NODE_ENV === 'development' ? 'AIzaSyAdJbCAEwxfEDtOHkwkqMffMlQr_586erY' : 'AIzaSyAdJbCAEwxfEDtOHkwkqMffMlQr_586erY',
  IntervalRefreshData: 60000
}
