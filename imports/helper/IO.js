export function download(url, fileName) {
  const fn = fileName || 'file';
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.target = '_blank';
  a.style = 'display: none';
  a.href = url;
  a.download = fn;
  a.click();
}
export function saveStringToFile(srcContent, fileName) {
  if (!srcContent) {
    return;
  }
  let content = srcContent;

  if (typeof (content) !== 'string') {
    content = JSON.stringify(srcContent, null, 2);
  }

  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';

  const blob = new Blob([content], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);

  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}


export function readJsonFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      try {
        const obj = JSON.parse(text);
        resolve(obj);
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsText(file);
  });
}
