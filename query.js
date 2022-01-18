const apiUrl = 'https://api.data.gov.sg/v1/transport/traffic-images';
const date = new Date();
const causewayCam = '2701';
const fallback = 'https://source.unsplash.com/random/600x600/?dog,cats,hamsters'
const props =
      {
        selected: causewayCam,
      };


window.addEventListener('DOMContentLoaded',async () => {

  props.before = document.getElementById('before');
  props.today = document.getElementById('today');
  props.select = document.getElementById('camId');
  try {
    props.before.src = await getBeforeCovid();
    const today = await fetchUrl(apiUrl);
    props.today.src = filterData(today);
    props.ids = getIds(today);
    for(let i of  props.ids){
      let opt = new Option(i, i);
      if(i === causewayCam) {
        opt.selected = true;
      }
      props.select.add(opt)
    }
    props.select.addEventListener('change', async (evt)=>{
      props.selected = evt.target.value;
      props.before.src = await getBeforeCovid();
      props.today.src = await getToday();
    })
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


const getBeforeCovid = async () => {
  const url = new URL(apiUrl);
  url.search = generateParams();
  console.log(url);
  const data = await fetchUrl(url);
  return filterData(data);
}
const getToday = async() => {
   const data = await fetchUrl(apiUrl);
  return filterData(data);
}
const getIds = (arr) =>
arr.map(cam => cam.camera_id);

const filterData = (arr) =>
arr.filter(cam => cam.camera_id === props.selected)[0].image;

const fetchUrl = async function fetchData(api) {
  try {
    const response = await fetch(api);
    const data = await response.json();
    return data.items[0].cameras;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const test = async () => {
  await getToday();
  await getBeforeCovid();
}
