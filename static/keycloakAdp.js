function initKeycloak() {
  var keycloak = new Keycloak({
    url: 'http://xtjsuser.shdata.com:9080/auth',
    realm: 'okr',
    clientId: 'okrClientWeb',
  //   "realm": "okr",
  // "auth-server-url": "http://xtjsuser.shdata.com:9080/auth",
  // "ssl-required": "external",
  // "resource": "okrClientWeb",
  // "public-client": true,
  // "confidential-port": 0
  });
  keycloak.init({onLoad: "login-required"}).then(function(authenticated) {
      window.localStorage.setItem('userInfo',JSON.stringify({name:'陈旭峰', userId:'user1'}))
      alert(authenticated ? 'authenticated' : 'not authenticated');
  }).catch(function() {
      alert('failed to initialize');
  });
}

initKeycloak();