const scriptPromises = {};

export default function (url, callback) {
  if (!scriptPromises[url]) {
    scriptPromises[url] = new Promise((resolve/*, reject*/) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.onreadystatechange = script.onload = resolve;
      document.querySelector('head').appendChild(script);
    });
  }
  scriptPromises[url].then(callback);
}
