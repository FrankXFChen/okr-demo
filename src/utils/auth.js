import KeycloakApp from 'keycloak-js';
// import Logger from './Logger';

// const logger = new Logger();

export const keycloak = KeycloakApp({
	realm    : 'shdata',
	url      : 'https://sso.shdata.com:9443/auth',
  clientId : 'meeting-video'
  // url: 'http://xtjsuser.shdata.com:9080/auth',
  // realm: 'okr',
  // clientId: 'okrClientWeb',
  // onLoad:"login-required"
});

export default () => 
{
	console.log('初始化keycloak>', keycloak);

	return new Promise((resolve, reject) => 
	{
		keycloak.init()
			.success((authenticated) =>
			{
				console.log('初始化keycloak后>', authenticated);
				if (!authenticated)
				{
					keycloak.login();
					resolve({ status: 301 });
				}
				else
				{
					keycloak.loadUserInfo()
						.then((userInfo) =>
						{
							console.log('成功获取用户信息>', userInfo);
							resolve({ status: 200, user: userInfo });
						})
						.catch((err) => 
						{
							console.log('获取用户信息出错>', err);
							reject({ status: 401, error: err });
						});
				}
			})
			.error((err) =>
			{
				console.log('初始化已经出错>', err);
				reject({ status: 400, error: err });
			});

	});
};

export const loadUserInfo = () => new Promise((resolve, reject) => 
{
	try
	{
		keycloak.loadUserInfo()
			.success((userInfo) =>
			{
				console.log('user info>', userInfo);
				resolve(userInfo);
			})
			.error((error) =>
			{
				console.log(`Failed to load user info: ${error}`);
				reject(error);
			});
	}
	catch (error)
	{
		reject(error);
	}
});

export const getUserGroups = async () => 
{
	const userInfo = await loadUserInfo();

	return userInfo;
};

keycloak.onAuthSuccess = function() 
{
	console.log('Auth Success');
};

keycloak.onAuthError = function(errorData) 
{
	console.log(`Auth Error: ${JSON.stringify(errorData)}`);
};

keycloak.onAuthRefreshSuccess = function() 
{
	console.log('Auth Refresh Success');
};

keycloak.onAuthRefreshError = function() 
{
	console.log('Auth Refresh Error');
	keycloak.login();
};

keycloak.onAuthLogout = function()
{
	console.log('Auth Logout');
};

keycloak.onTokenExpired = function()
{
	console.log('Access token expired.');
	console.log('keycloak.authenticated', keycloak.authenticated);
};
