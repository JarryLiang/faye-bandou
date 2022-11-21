
function readFile(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        resolve(reader.result);
      };
      reader.readAsText(file);
  });
}

export const TextFile = {
    readFile
}
