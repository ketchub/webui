export default function math(value, operation, against) {
  switch(operation) {
    case 'multiply':
      return value * against;
    default:
      return value;
  }
}
