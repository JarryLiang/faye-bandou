
 function isEmpty(s) {
  if (!s) {
    return true;
  }
  if (typeof s === 'string') {
    if (s.length === 0) {
      return true;
    }
    return false;
  }
  try {
    console.log('isEmpy get invalid type');
    console.log(JSON.stringify(s, null, 2));
  } catch (e) {
    console.log(JSON.stringify(e, null, 2));
  }

  return false;
}

 function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}


 function compareString(a, b) {
  return (a || '').localeCompare(b || '');
}


 function sortStrings(list) {
  if (list) {
    list.sort((a, b) => {
      return compareString(a, b);
    });
  }
}


function copyTextToClipboard(text){
  navigator.clipboard.writeText(text);
}

 function fallbackCopyTextToClipboard(text) {

   const textArea = document.createElement('textarea');
   textArea.value = text;
   document.body.appendChild(textArea);
   textArea.focus();
   textArea.select();

   try {
     const successful = document.execCommand('copy');
     const msg = successful ? 'successful' : 'unsuccessful';
     console.log(`Fallback: Copying text command was ${msg}`);
   } catch (err) {
     console.error('Fallback: Oops, unable to copy', err);
   }

   document.body.removeChild(textArea);
 }

function splitWord(str) {
  const len = str.length;
  let result=[];
  for(let i=0;i<len;i++){
    result.push(str.charAt(i));
  }
  return result;
}

export const StringHelper = {
  isBlank,
  isEmpty,
  compareString,
  sortStrings,
  splitWord,
  copyTextToClipboard,
  fallbackCopyTextToClipboard,
}
