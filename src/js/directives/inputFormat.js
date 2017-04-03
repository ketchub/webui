export default function (el, binding) {
  console.log('inputFormat directive: ', el, binding);
  // maybe later...
  // el.addEventListener('keyup', () => {
  //   const val = el.value;
  //   el.value = val.replace(/^(\d{3})(\d{3})(\d)+$/, "($1) $2-$3");
  // });
}
