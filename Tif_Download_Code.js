
// Load the GLCLU dataset and apply the land mask
var landmask = ee.Image("projects/glad/OceanMask").lte(1);
var m00 = ee.Image('projects/glad/GLCLU2020/v2/LCLUC_2000').updateMask(landmask).clip(covai);
var m05 = ee.Image('projects/glad/GLCLU2020/v2/LCLUC_2005').updateMask(landmask).clip(covai);
var m10 = ee.Image('projects/glad/GLCLU2020/v2/LCLUC_2010').updateMask(landmask).clip(covai);
var m15 = ee.Image('projects/glad/GLCLU2020/v2/LCLUC_2015').updateMask(landmask).clip(covai);
var m20 = ee.Image('projects/glad/GLCLU2020/v2/LCLUC_2020').updateMask(landmask).clip(covai);
var change = ee.Image('projects/glad/GLCLU2020/v2/LCLUC').updateMask(landmask).clip(covai);

// Visualization parameters (same colors as provided)
var visParamMap = {
  "min": 0,
  "max": 255,
  "palette": [
    "FEFECC", "FAFAC3", "F7F7BB", "F4F4B3", "F1F1AB", "EDEDA2", "EAEA9A",
    "E7E792", "E4E48A", "E0E081", "DDDD79", "DADA71", "D7D769", "D3D360",
    "D0D058", "CDCD50", "CACA48", "C6C63F", "C3C337", "C0C02F", "BDBD27",
    "B9B91E", "B6B616", "B3B30E", "B0B006", "609C60", "5C985C", "589558",
    "549254", "508E50", "4C8B4C", "488848", "448544", "408140", "3C7E3C",
    "387B38", "347834", "317431", "2D712D", "296E29", "256B25", "216721",
    "1D641D", "196119", "155E15", "115A11", "0D570D", "095409", "065106",
    "643700", "643a00", "643d00", "644000", "644300", "644600", "644900",
    "654c00", "654f00", "655200", "655500", "655800", "655a00", "655d00",
    "656000", "656300", "666600", "666900", "666c00", "666f00", "667200",
    "667500", "667800", "667b00", "ff99ff", "FC92FC", "F98BF9", "F685F6",
    "F37EF3", "F077F0", "ED71ED", "EA6AEA", "E763E7", "E45DE4", "E156E1",
    "DE4FDE", "DB49DB", "D842D8", "D53BD5", "D235D2", "CF2ECF", "CC27CC",
    "C921C9", "C61AC6", "C313C3", "C00DC0", "BD06BD", "bb00bb", "000003",
    "1964EB", "1555E4", "1147DD", "0E39D6", "0A2ACF", "071CC8", "030EC1",
    "0000BA", "3051cf", "000000", "547FC4", "4D77BA", "466FB1", "4067A7",
    "395F9E", "335896", "ff2828", "ffffff", "d0ffff", "ffe0d0", "ff7d00",
    "fac800", "c86400", "fff000", "afcd96", "64dcdc", "00ffff", "00ffff"
  ]
};

// Add layers to the map
Map.centerObject(covai, 8);
Map.addLayer(m00, visParamMap, '2000 Covai Land Cover');
Map.addLayer(m05, visParamMap, '2005 Covai Land Cover');
Map.addLayer(m10, visParamMap, '2010 Covai Land Cover');
Map.addLayer(m15, visParamMap, '2015 Covai Land Cover');
Map.addLayer(m20, visParamMap, '2020 Covai Land Cover');
Map.addLayer(change, visParamMap, '2000-2020 Covai Land Cover Change');

// Export images for downloading
function exportImage(image, year) {
  Export.image.toDrive({
    image: image,
    description: 'Covai_LandCover_' + year,
    folder: 'GEE_Exports', // Change to your preferred Google Drive folder
    scale: 30,
    region: covai.geometry(),
    maxPixels: 1e13
  });
}

// Call export function for each year
exportImage(m00, "2000");
exportImage(m05, "2005");
exportImage(m10, "2010");
exportImage(m15, "2015");
exportImage(m20, "2020");
exportImage(change, "2000-2020");
