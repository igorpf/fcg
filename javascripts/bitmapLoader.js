var inputElement = document.getElementById("input");
//quando escolher o arquivo, já carrega o mapa do jogo
inputElement.addEventListener("change", handleFiles, false);

function handleFiles(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.addEventListener("load",
            processimage, false);
    reader.readAsArrayBuffer(file);
}


var numberToColorDict = {};
var numberToType = {};
function processimage(e) {
    var buffer = e.target.result;
    var bitmap = getBMP(buffer);

    var size = 20;
    var map = new Array(size);
    for (var i = 0; i < size; ++i)
        map[i] = new Array(size);

    var c = new Color(0, 0, 0);
    var index = 0;
    for (var i in c.colors()) {
        numberToColorDict[index] = c.colors()[i];
        numberToType[index++] = i;
    }

    for (var i = 0; i < size; ++i)
        for (var j = 0; j < size; ++j) {
            var index = 3 * (i * size + j);
            var color = new Color(bitmap.pixels[index+2],
                            bitmap.pixels[index + 1],
                            bitmap.pixels[index]);
                            
                for (var k in numberToColorDict)
                    if (numberToColorDict[k].equals(color))
                        map[i][j] = k;
                
            
        }
    console.log(numberToType);
    console.log(numberToColorDict);
    console.log(map);

}
function getBMP(buffer) {
    var datav = new DataView(buffer);
    var bitmap = {};
    bitmap.fileheader = {};
    bitmap.fileheader.bfType =
            datav.getUint16(0, true);
    bitmap.fileheader.bfSize =
            datav.getUint32(2, true);
    bitmap.fileheader.bfReserved1 =
            datav.getUint16(6, true);
    bitmap.fileheader.bfReserved2 =
            datav.getUint16(8, true);
    bitmap.fileheader.bfOffBits =
            datav.getUint32(10, true);
    bitmap.infoheader = {};
    bitmap.infoheader.biSize =
            datav.getUint32(14, true);
    bitmap.infoheader.biWidth =
            datav.getUint32(18, true);
    bitmap.infoheader.biHeight =
            datav.getUint32(22, true);
    bitmap.infoheader.biPlanes =
            datav.getUint16(26, true);
    bitmap.infoheader.biBitCount =
            datav.getUint16(28, true);
    bitmap.infoheader.biCompression =
            datav.getUint32(30, true);
    bitmap.infoheader.biSizeImage =
            datav.getUint32(34, true);
    bitmap.infoheader.biXPelsPerMeter =
            datav.getUint32(38, true);
    bitmap.infoheader.biYPelsPerMeter =
            datav.getUint32(42, true);
    bitmap.infoheader.biClrUsed =
            datav.getUint32(46, true);
    bitmap.infoheader.biClrImportant =
            datav.getUint32(50, true);
    var start = bitmap.fileheader.bfOffBits;
    bitmap.stride =
            Math.floor((bitmap.infoheader.biBitCount
                    * bitmap.infoheader.biWidth +
                    31) / 32) * 4;
    bitmap.pixels =
            new Uint8Array(buffer, start);
    return bitmap;
}