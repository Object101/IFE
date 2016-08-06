var input = document.getElementsByTagName('input')[0];
var numbers = document.getElementsByClassName('numbers');
var box = document.getElementById('box');
//creat new number box//
function createbox() {
  var value = input.value;
  input.value = '';
  value = parseInt(value, 10);
  if (!isNaN(value) && value>=10 && value<=100) {
    var number = document.createElement('p');
    number.className = 'numbers';
    number.style.height = value + 'px';
    number.onclick = function() {
      box.removeChild(this);
    };
    return number;
  } else {
    return false;
  }
}
//left insert
var leftin = document.getElementById('leftin');
leftin.onclick = function() {
  var length = numbers.length;
  if (length>=60) {
    alert("can't add more...")
    return false;
  }
  var insertion = createbox();
  if (insertion) {
    if (length === 0) {
      box.appendChild(insertion)
    } else {
      var first = numbers[0];
      box.insertBefore(insertion, first);
    }
  }
  input.focus();
  return false;
};

var rightin = document.getElementById('rightin');
rightin.onclick = function() {
  var length = numbers.length;
  if (length>=60) {
    alert("can't add more...")
    return false;
  }
  var insertion = createbox();
  if (insertion) {
    box.appendChild(insertion);
  }
  input.focus();
  return false;
}
;
var leftout = document.getElementById('leftout');
leftout.onclick = function() {
  var first = box.firstChild;
  box.removeChild(first);
  input.focus();
  return false;
};

var rightout = document.getElementById('rightout');
rightout.onclick = function() {
  var last = box.lastChild;
  box.removeChild(last);
  input.focus();
  return false;
};

var bubble = document.getElementById('bubble');
bubble.onclick = function() {
  bubbleSort(numbers);
  return false;
};

function bubbleSort(doms) {
  var length = doms.length, i = 0, j = length -1, delay = 10, timer;
  timer = setInterval(function() {
    if (i === length - 2) {
      clearInterval(timer);
      alert('Done');
      return;
    }
    if (j === i) {
      j = length - 1;
      i++;
      return;
    } else {
      var h1 = parseInt(numbers[j].style.height),
          h2 = parseInt(numbers[j-1].style.height);
      if (h1 < h2) {
        numbers[j].style.height = h2 + 'px';
        numbers[j-1].style.height = h1 + 'px';
      }
      j--;
    }
  }, delay);
}

var produce = document.querySelector('#produce');
produce.onclick = function() {
  var length = numbers.length;
  for (var i = 0; i < length; i++) {
    box.removeChild(numbers[0]);
  }
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < 60; i++) {
    var number = document.createElement('p');
    number.className = 'numbers';
    number.style.height = (Math.floor(Math.random()*90) + 10) + 'px';
    fragment.appendChild(number);
  }
  box.appendChild(fragment);
  return false;
}