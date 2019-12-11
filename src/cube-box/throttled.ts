export default function throttled(delay:number, fn:Function) {
  let lastCall = 0;
  return function (...args :any) {
    const now = (new Date).getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}