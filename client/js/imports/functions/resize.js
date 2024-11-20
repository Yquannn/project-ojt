export default function resizeGame() {
  const { innerWidth, innerHeight } = window;
  this.scale.resize(innerWidth, innerHeight);
}
