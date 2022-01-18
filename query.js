const apiUrl = 'https://api.data.gov.sg/v1/transport/traffic-images';
const date = new Date();
const causewayCam = '2701';
const fallback = 'https://source.unsplash.com/random/600x600/?dog,cats,hamsters'
const props = {};


window.addEventListener('DOMContentLoaded',async () => {

  props.before = document.getElementById('before');
  props.today = document.getElementById('today');
  try {
    props.before.src = await getBeforeCovid();
    props.today.src = await getToday();
  } catch (error) {
    console.error(error)
  }
});

const getBeforeCovidDate = () => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().split('.')[0];
  return localISOTime.replace(date.getFullYear(), '2019');
}

const generateParams = function getParams(){
  const params = { date_time : getBeforeCovidDate()};
  return new URLSearchParams(params).toString();
}

const getToday = async () => {
   const imageUrl = await getImage(apiUrl);
   return imageUrl;
}

const getBeforeCovid = async () => {
  const url = new URL(apiUrl);
  url.search = generateParams();
  console.log(url);
  const imageUrl = await getImage(url);
  return imageUrl;
}
const getImage = async function fetchImageUrl(api) {
  try {
    const response = await fetch(api);
    const data = await response.json();

    const url = data.items[0].cameras
              .filter(cam => cam.camera_id === causewayCam)[0].image;

    return url;
  } catch (error) {

    console.error(error);
    return fallback

  }
}
const test = async () => {
  await getToday();
  await getBeforeCovid();
}
