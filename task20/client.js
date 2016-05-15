var text = document.querySelector('#text');
var insertion = document.querySelector('#insert');
var pat = document.querySelector('#pat');
var match = document.querySelector('#match');
var box = document.querySelector('#box');

insertion.onclick = function() {
  var value = text.value;
  splitpattern = /[\s\n,\\、。，\t]/g;
  var values = value.split(splitpattern),  
      fragment = document.createDocumentFragment();
  for (var i=0, length=values.length;; i<length; i++) {
    var char = document.createElement('p');
    char.className = 'chars';
    char.innerHTML = values[i];
    fragment.appendChild(char);
  }
  box.appendChild(fragment);
  return false;
}

match.onclick = function() {
  var chars = document.querySelectorAll('.chars'),
      value = pat.value.trim(),
      patlength = value.length,
      pattern = new RegExp('(<span class="select">)?' + value + '(</span>)?', 'g'),
      length = chars.length,
      delepat = /<span class="select">(.*)<\/span>/g;
  for (var i=0; i<length; i++) {
    chars[i].innerHTML = chars[i].innerHTML.replace(delepat, "$1");
  }
  for (var i=0; i<length; i++) {
    chars[i].innerHTML = chars[i].innerHTML.replace(pattern, '<span class="select">' + value + '</span>');
  }
  return false;
};
