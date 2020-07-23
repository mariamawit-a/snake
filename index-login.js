/* 
login.js

This code handles the process so users can log in to Snake Squad using their Snap accounts on index.html. 
Once logged in, the program redirects to game.html 
It's mostly adapted from SnapKit documentation. There are only two places that you need to change. 
*/

window.snapKitInit = function () {
    var loginButtonIconId = 'my-login-button-target';
    // Mount Login Button
    snap.loginkit.mountButton(loginButtonIconId, {
      clientId: '64b37b2b-8cb3-41a3-a7aa-e405764f53af', /*YOU CHANGE: Must be changed to the development client ID on snapckit*/
      redirectURI: 'https://maria-a-snake.glitch.me/', /*YOU CHANGE: Must be changed to your glitch project's url AND added as the redirect URI on snapkit */
      scopeList: [
        'user.display_name',
        'user.bitmoji.avatar',
      ],
      //Once snapchat logs user in, this funciton is run: 
      handleResponseCallback: function() {
        snap.loginkit.fetchUserInfo()
          .then(function(data) {
            //Once snapchat logs us in, we can...
            //have access to user data. Inspect the web page to see this!...
            console.log('User info:', data)        
            // store user data in localStorage...
            var bitmoji_avatar_url = data.data.me.bitmoji.avatar;
            localStorage.setItem("avatarurl", bitmoji_avatar_url);
            //and redirect the user to the game.html
            location.href="game.html"
        });
      },
    });
  };
  
  /* This code is copy-pasted from SnapKit documentation and loads the Snap login SDK asynchronously.*/
  (function (d, s, id) {
    var js, sjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://sdk.snapkit.com/js/v1/login.js";
    sjs.parentNode.insertBefore(js, sjs);
  }(document, 'script', 'loginkit-sdk'));
  