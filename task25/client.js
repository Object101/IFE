function find(value) {
  if (finded) {
    finded.forEach(function(item, index, array) {
      item.classList.remove('finded');
    });
    finded = [];
  }
  if (value === '') {return;}
  var texts = document.querySelectorAll('p'),
      length = texts.length,
      pattern = new RegExp(value, 'g');
  for (var i = 0; i < length; i++) {
    if (texts[i].innerHTML.toLowerCase().match(pattern)) {
      var parent = texts[i].parentNode.parentNode;
      while (parent.nodeName.toLowerCase() === 'ul') {
        parent.classList.remove('hidden');
        parent = parent.parentNode.parentNode;
      }
      texts[i].classList.add('finded');
      finded.push(texts[i]);
    }
  }
  if (!finded[0]) {
    alert('未找到');
  }
}

function addEle(value, target) {
  var ul = target.nextElementSibling;
  if (!ul) {
    ul = document.createElement('ul');
    target.parentNode.appendChild(ul);
    var arrow = document.createElement('div'),
        blank = document.createTextNode(' '),
        parent = target.parentNode;
    arrow.classList.add('down-arrow');
    parent.insertBefore(arrow, target);
    parent.insertBefore(blank, target);
  }
  var li = document.createElement('li'),
      p = document.createElement('p');
  p.innerHTML = value;
  li.appendChild(p);
  ul.appendChild(li);
  if (ul.classList.contains('hidden')) {
    switchDisplay(target);
  }
}

function switchDisplay(target) {
  var ul = target.nextElementSibling;
  if (ul) {
    ul.classList.toggle('hidden');
    var isHidden = ul.classList.contains('hidden'),
        arrow = target.previousElementSibling;
    if (isHidden) {
      arrow.classList.remove('down-arrow');
      arrow.classList.add('right-arrow');
    } else {
      arrow.classList.remove('right-arrow');
      arrow.classList.add('down-arrow');
    }
  }
}

var finded = [],//保存找到的节点
    contextTarget;//保存右键菜单目标

window.onload = function() {
  var search = document.querySelector('#search'),
      treeRoot = document.querySelector('#root'),
      context = document.querySelector('#context'),
      add = document.querySelector('#add'),
      del = document.querySelector('#del');
  search.addEventListener('click', function() {
    context.classList.add('hidden');
    var searchContent = document.querySelector('#searchContent'), 
        value = searchContent.value.trim().toLowerCase();
    find(value);
    return false;
  }, false);
  treeRoot.addEventListener('click', function(e) {
    context.classList.add('hidden');
    var target = e.target;
    if (target.nodeName.toLowerCase() === 'p') {
      switchDisplay(target);
    }
    return false;
  }, false);
  treeRoot.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    var target = e.target;
    if (target.nodeName.toLowerCase() === 'p') {
      contextTarget = target;
      context.style.left = e.clientX + 'px';
      context.style.top = e.clientY + 'px';
      context.classList.remove('hidden');
    }
    return false;
  }, false);
  add.addEventListener('click', function() {
    context.classList.add('hidden');
    var value = prompt('请输入要插入的内容','').trim();
    addEle(value, contextTarget);
    return false;
  }, false);
  del.addEventListener('click', function() {
    context.classList.add('hidden');
    contextTarget.parentNode.parentNode.removeChild(contextTarget.parentNode);
    return false;
  }, false);
  document.documentElement.onclick = function() {
    context.classList.add('hidden');
  };
};