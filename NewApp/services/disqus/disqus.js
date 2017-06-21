var DISQUS_SECRET = "gSasM98sikC8Dg2N2bkCZhtBoS5wPXwlGOKU4PcBnNHCYoj8jRKWJN28lMuAF6m1";
var DISQUS_PUBLIC = "FaTNwq6VULuQZENp4UF8y0c6RY0YBGOmnE6oxUD506SMY3ZxtSWhCz2fZaVdPm61";

function disqusSignon() {
    var disqusData = {
      id: user_data.id,
      username: user_data.getUsername(),
      email: user_data.getEmail()
    };

    var disqusStr = JSON.stringify(disqusData);
    var timestamp = Math.round(+new Date() / 1000);

    var message = window.btoa(disqusStr);

    /* 
     * CryptoJS is required for hashing (included in dir)
     * https://code.google.com/p/crypto-js/
     */
    var result = CryptoJS.HmacSHA1(message + " " + timestamp, DISQUS_SECRET);
    var hexsig = CryptoJS.enc.Hex.stringify(result);

    return {
      pubKey: DISQUS_PUBLIC,
      auth: message + " " + hexsig + " " + timestamp
    };
}

