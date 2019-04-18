const contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
const APIKEY = 'tXSGmcqtQfIexAE36efdinQN6ehld8Vi';
const baseurl = 'http://172.16.10.184:8080/HappyMomaArt/';
// const baseurl = 'http://saas.csgxcf.com:9501/HappyMomaArt/';

// const baseurl = '/api/HappyMomaArt/';
const imgUrl = baseurl + 'getImgUrl?ftype=photo&imgurl=';
// const imgUrl = baseurl + 'showPicture?ftype=photo&imgurl=';

const videoUrl = baseurl + 'getImgUrl?ftype=view&imgurl=';
export default {
  CONTENTTYPE: contentType,
  BASEURL: baseurl,
  IMGURL: imgUrl,
  VIDEOURL: videoUrl,
  APIKEY
};
