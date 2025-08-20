

// 2. Load the GLCLU images
var landmask = ee.Image("projects/glad/OceanMask").lte(1);
var years = [2000, 2005, 2010, 2015, 2020];

var lulc_images = {
  2000: ee.Image('projects/glad/GLCLU2020/v2/LCLUC_2000').updateMask(landmask),
  2005: ee.Image('projects/glad/GLCLU2020/v2/LCLUC_2005').updateMask(landmask),
  2010: ee.Image('projects/glad/GLCLU2020/v2/LCLUC_2010').updateMask(landmask),
  2015: ee.Image('projects/glad/GLCLU2020/v2/LCLUC_2015').updateMask(landmask),
  2020: ee.Image('projects/glad/GLCLU2020/v2/LCLUC_2020').updateMask(landmask)
};

// 3. Define land use classes (official GLCLU codes)
var lulc_classes = [
  {code: 10, name: 'Water'},
  {code: 20, name: 'Wetlands'},
  {code: 30, name: 'Croplands'},
  {code: 40, name: 'Grasslands'},
  {code: 50, name: 'Shrublands'},
  {code: 100, name: 'Forest'},
  {code: 150, name: 'Plantations'},
  {code: 200, name: 'Built-up'},
  {code: 210, name: 'Barren'}
];

// 4. Function to compute area for each LULC type in each Taluk
function getTalukLULCArea(year) {
  var img = lulc_images[year];
  var bandName = ee.String(img.bandNames().get(0));
  
  var results = lulc_classes.map(function(cls) {
    var masked = img.select(bandName).eq(cls.code).multiply(ee.Image.pixelArea()).divide(10000);
    
    var stats = masked.reduceRegions({
  collection: taluks,
  reducer: ee.Reducer.sum(),
  scale: 30,
  tileScale: 4  // Updated!
}).map(function(f) {
  return f.set({
    'LULC_Code': cls.code,
    'LULC_Type': cls.name,
    'Year': year,
    'Area_ha': ee.Number(f.get('sum')).round(),
    'Taluk': f.get('NAME_3')  // adjust if your taluk column is named differently
  }).select(['Taluk', 'LULC_Code', 'LULC_Type', 'Year', 'Area_ha']);
});

    
    return stats;
  });

  // Flatten and return
  return ee.FeatureCollection(results).flatten();
}

// 5. Loop through each year and export as a separate CSV
years.forEach(function(year) {
  var yearTable = getTalukLULCArea(year);
  Export.table.toDrive({
    collection: yearTable,
    description: 'Covai_Taluk_LULC_' + year,
    fileNamePrefix: 'Covai_Taluk_LULC_' + year,
    fileFormat: 'CSV'
  });
});
