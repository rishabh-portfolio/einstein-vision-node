const readFile              = require('./read-file');
const analyzeFile           = require('./analyze-file');
const fileDimensions        = require('./file-dimensions');
const cloudinaryResizeImage = require('./cloudinary-resize-image');
const queryVisionApi         = require('./query-vision-api');
const Episode7 = require('episode-7');

function* sendImageToVisionApi(pvsUrl,
                              filePath,
                              fileExt,
                              modelId,
                              accountId,
                              privateKey,
                              jwtToken) {
  
  //get base64 Image Data
  let fileData = yield Episode7.call(
    readFile,
    filePath
  );

  //get the file size
  let fileInfo = yield Episode7.call(
    analyzeFile,
    filePath
  );

  //get img dimensions
  let dimensions = yield Episode7.call(
    fileDimensions,
    filePath
  );

  //save image to cloud - resize if needed
  let resizedImgUrl = yield Episode7.call(
    cloudinaryResizeImage,
    fileExt,
    fileData,
    fileInfo.size,
    dimensions.width,
    dimensions.height
  );

  // send image to Vision API
  let visionApiResult = yield Episode7.call(
    queryVisionApi,
    pvsUrl,
    resizedImgUrl,
    modelId,
    accountId,
    privateKey,
    jwtToken
  );
  
  return visionApiResult;
}

module.exports = sendImageToVisionApi;