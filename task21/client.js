function insertfav(values, favs, target) {
  var length = favs.length,
      valuelength = values.length,
      totallength = length + valuelength,
      fragment = document.createDocumentFragment();
  if (totallength>10) {
    for (var i=0; i<totallength-10; i++) {
      deletag(favs[0]);
    }
  }
  for (i=0; i<valuelength; i++) {
    var char = document.createElement('div');
    char.className = 'favs';
    char.innerHTML = values[i];
    char.onclick= function() {deletag(this);};
    char.onmouseover = hover;
    char.onmouseout = recovery;
    fragment.appendChild(char);
  }
  target.appendChild(fragment);
  return false;
}

function filter(value, favs) {
  var filted = new Array(),
      splitpattern = /[\s\n,\\、。，\t]/g,
      length=favs.length,
      values = value.split(splitpattern);
  values = values.map(function(item, index, array) {
        return item.trim();
  });
  values = values.filter(function(item, index, array) {
    for (var i=0; i<length; i++) {
      var pattern = new RegExp('^'+favs[i].innerHTML+'$', '');
      if (pattern.test(item)) {
        return false;
      }
    }
    return true;
  });
  return values;
}

function deletag(tag) {
  var parent = tag.parentNode;
  parent.removeChild(tag);
}

function insertskill(key, source, skills, target) {
  if (key===13 || key===32 || key===188) {
    var value = source.value.trim();
    for (var i=0, length=skills.length; i<length; i++) {
      var pattern = new RegExp('^'+skills[i].innerHTML+'$', '');
      if (pattern.test(value)) {
        source.value = '';
        return true;
      }
    }
    if (length===10) {
      deletag(skills[0]);
    }
    var char = document.createElement('div');
    char.innerHTML = value;
    char.className = 'skills';
    char.onclick = function() {deletag(this);};
    char.onmouseover = hover;
    char.onmouseout = recovery;
    target.appendChild(char);
    source.value = '';
    return true;
  }
  return false;
}

function hover() {
  this.innerHTML = this.innerHTML.replace(/(.*)/, "点击删除"+"$1");
}

function recovery() {
  this.innerHTML = this.innerHTML.replace(/点击删除(.*)/, '$1');
}

(function() {
  var skillin = document.querySelector('#skill');
  skillin.onkeydown = function(event) {
    var key = event.keyCode,
        skills = document.getElementsByClassName('skills'),
        source = this;
    var target = document.querySelector('#skillbox')
    if (insertskill(key, source, skills, target)) {
      return false;
    }
    return true;
  };

  var subfav = document.querySelector('#subfav');
  subfav.onclick = function(event) {
    var fav = document.querySelector('#favourite'),
        favs = document.getElementsByClassName('favs'),
        favbox = document.querySelector('#favbox');
    var value = fav.value;
    var values = filter(value, favs);
    insertfav(values, favs, favbox);
    fav.value = '';
    return false;
    };

})();
