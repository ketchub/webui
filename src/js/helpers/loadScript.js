export default function loadScript(url, callback) {
  let script  = document.createElement('script');
  script.type = 'text/javascript';
  script.src  = url;
  script.onreadystatechange = script.onload = callback;
  document.querySelector('head').appendChild(script);
}
