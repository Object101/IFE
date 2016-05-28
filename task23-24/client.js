//深度优先搜索路径生成
function depthFirstPath(tree, queue) {
  queue.push(tree);
  var length = tree.children.length;
  if (length > 1) {
    for (var i = 1; i < length; i++) {
      depthFirstPath(tree.children[i], queue);
    }
  }
}
//广度优先搜索路径生成
function breadthFirstPath(tree, queue) {
  queue.push(tree);
  var i = 0;
  while (queue[i]) {
    var length = queue[i].children.length;
    for (var j = 1; j < length; j++) {
      queue.push(queue[i].children[j]);
    }
    i++;
  }
}
//效果渲染
function render(queue) {
  var currentNode = queue.shift();
  if (!currentNode) {
    return;
  }
  currentNode.style.backgroundColor = 'blue';
  setTimeout(function() {
    currentNode.style.backgroundColor = 'white';
  }, 500);

  setTimeout(function() {
    render(queue);
  }, 500);
}
//搜索
function match(queue, value) {
  var currentNode = queue.shift();
  if (!currentNode) {
    alert("未找到匹配的节点");
    return;
  }
  if (value === currentNode.firstElementChild.innerHTML) {
    currentNode.style.backgroundColor = 'red';
    matchElement = currentNode;
    return;
  }
  currentNode.style.backgroundColor = 'blue';
  setTimeout(function() {
    currentNode.style.backgroundColor = 'white';
  }, 500);
  setTimeout(function() {
    match(queue, value);
  }, 500);
}

var matchElement;//上次找到的元素
var selectedElement;//被选择的元素

window.onload = function() {
  var tree = document.querySelector('#root'),
      dft = document.querySelector('#dft'),
      bft = document.querySelector('#bft'),
      search = document.querySelector('#search'),
      dfs = document.querySelector('#dfs'),
      bfs = document.querySelector('#bfs'),
      del = document.querySelector('#del'),
      content = document.querySelector('#content'),
      add = document.querySelector('#add');
  dft.onclick = function() {
    if (matchElement) {
      matchElement.style.backgroundColor = 'white';//将上次找到的元素恢复背景颜色
    }
    var queue = [];
    depthFirstPath(tree, queue);
    render(queue);
    return false;
  }
  bft.onclick = function() {
    if (matchElement) {
      matchElement.style.backgroundColor = 'white';
    }
    var queue = [];
    breadthFirstPath(tree, queue);
    render(queue);
    return false;
  }
  dfs.onclick = function() {
    if (matchElement) {
      matchElement.style.backgroundColor = 'white';
    }
    var queue = [],
        value = search.value;
    depthFirstPath(tree, queue);
    matchElement = match(queue, value);
    return false;
  }
  bfs.onclick = function() {
    if (matchElement) {
      matchElement.style.backgroundColor = 'white';
    }
    var queue = [],
        value = search.value;
    breadthFirstPath(tree, queue);
    matchElement = match(queue, value);
    return false;
  }
  tree.onclick = function(e) {
    var target = e.target;
    if (selectedElement) {
      selectedElement.style.backgroundColor = 'white';
    }
    if (target.nodeName.toLowerCase() === 'div') {
      target.style.backgroundColor = 'yellow';
      selectedElement = target;
    } else {
      target.parentNode.style.backgroundColor = 'yellow';
      selectedElement = target.parentNode;
    }
    return false;
  }
  del.onclick = function() {
    if (selectedElement.id === 'root') {return false;}
    selectedElement.parentNode.removeChild(selectedElement);
  }
  add.onclick = function() {
    var value = content.value.trim(),
        div = document.createElement('div'),
        p = document.createElement('p');
    if (value === '' || !selectedElement) {return false;}
    p.innerHTML = value;
    div.appendChild(p);
    div.className = 'tree';
    selectedElement.appendChild(div);
    return false;
  }
}
