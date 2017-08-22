
// map from newer dcmjs object format to older dcmio format used by step
// NOTE: dataset is modified as a byproduct
function DCMJSToDCMIO(dataset) {

  /*
  dataset.SOPClass = DCMJS.data.DicomMetaDictionary.sopClassNamesByUID[dataset.SOPClassUID];
  dataset.SharedFunctionalGroups = dataset.SharedFunctionalGroupsSequence;
  dataset.PerFrameFunctionalGroups = dataset.PerFrameFunctionalGroupsSequence;
  */

  //
  // strip 'Sequence' from names
  // strip UID from names
  // map SOPClassUID from numbers to name
  //
  let dcmioDataset = {};
  for (let name in dataset) {
    let data = dataset[name];
    if (name.match(/Sequence$/)) {
      name = name.replace(/Sequence$/, '');
      if (!Array.isArray(data)) {
        data = [data];
      }
      let convertedData = [];
      data.forEach(sequenceElement => {
        convertedData.push(DCMJSToDCMIO(sequenceElement));
      });
      if (convertedData.length == 1) {
        convertedData = convertedData[0];
      }
      data = convertedData;
    } else if (name.match(/UID$/)) {
      name = name.replace(/UID$/, '');
      sopClassName = DCMJS.data.DicomMetaDictionary.sopClassNamesByUID[data];
      if (sopClassName) {
        data = sopClassName;
      }
    }
    dcmioDataset[name] = data;
  }
  return(dcmioDataset);
}

// some dcmio classes are global where the DCMJS ones are in the namespace
let Colors = DCMJS.data.Colors;
