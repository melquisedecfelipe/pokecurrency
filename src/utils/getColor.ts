import Vibrant from 'node-vibrant';

export default async function getDominantColor(image: string) {
  return Vibrant.from(image)
    .getPalette()
    .then(data => data);
}
