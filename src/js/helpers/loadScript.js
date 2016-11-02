const promises = {};

export default function loadScript(url, callback) {
  if (!promises[url]){
    promises[url] = new Promise((resolve, reject) => {
      let script  = document.createElement('script');
      script.type = 'text/javascript';
      script.src  = url;
      script.onreadystatechange = script.onload = resolve;
      document.querySelector('head').appendChild(script);
    });
  }
  promises[url].then(callback);
}
