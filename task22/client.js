function NLR_se(currentNode) {
  var delay = 300;
  currentNode.style.backgroundColor = 'blue';
  //设置定时器在delay后将背景颜色恢复
  setTimeout(function() {
    currentNode.style.backgroundColor = 'white';
  }, delay);
  //若存在子树，则设置定时器下次遍历左子树
  if (currentNode.children.length !== 0) {
    setTimeout(function() {
      NLR(currentNode.children[0]);
    }, delay);
    return;
  }
  var parent = currentNode.parentNode; //获得父元素
  var parentLeftChild = parent.children[0]; //获得父元素的左子树
  var parentRightChild = parent.children[1]; //获得父元素的右子树
  //若当前树为父元素的左子树，则下次遍历父元素的右子树
  if (currentNode === parentLeftChild) {
    setTimeout(function() {
      NLR(parentRightChild);
    }, delay);
    return;
  }
  /*若当前元素为父元素的右子树，则一直向上查找父元素
  直到找到一个元素，为其父元素的左子树，则下次遍历其父元素的右子树
  若没有父元素，则说明到达树的根部，遍历结束
   */
  if (currentNode === parentRightChild) {
    var superParent = parent.parentNode;
    while (parent !== superParent.children[0]) {
      parent = superParent;
      superParent = parent.parentNode;
      if (parent === tree) {
        return;
      }
    }
    setTimeout(function() {
      NLR(superParent.children[1]);
    }, delay);
    return;
  }
}

function NLR(tree) {
  var queue = [];
  preOrder(tree, queue);
  return queue;
}

function LNR(tree) {
  var queue = [];
  inOrder(tree, queue);
  return queue;
}

function LRN(tree) {
  var queue = [];
  postOrder(tree, queue);
  return queue;
}

function preOrder(node, queue) {
  queue.push(node);
  var leftChild = node.children[0],
      rightChild = node.children[1];
  if (leftChild) {
    preOrder(leftChild, queue);
  }
  if (rightChild) {
    preOrder(rightChild, queue);
  }
}

function inOrder(node, queue) {
  var leftChild = node.children[0],
      rightChild = node.children[1];
  if (leftChild) {
    inOrder(leftChild, queue);
  }
  queue.push(node);
  if (rightChild) {
    inOrder(rightChild, queue);
  }
}

function postOrder(node, queue) {
  var leftChild = node.children[0],
      rightChild = node.children[1];
  if (leftChild) {
    inOrder(leftChild, queue);
  }
  if (rightChild) {
    inOrder(rightChild, queue);
  }
  queue.push(node);
}

function render(queue, delay) {
  var currentNode = queue.shift();
  if (!currentNode) {
    return;
  }
  currentNode.style.backgroundColor = 'blue';
  setTimeout(function() {
    currentNode.style.backgroundColor = 'white';
  }, delay);
  setTimeout(function() {
    render(queue, delay);
  }, delay);
}

var nlr = document.querySelector('#nlr'),
    lnr = document.querySelector('#lnr'),
    lrn = document.querySelector('#lrn'),
    tree = document.querySelector('#tree');
nlr.onclick = function() {
  var queue = NLR(tree);
  render(queue, 500);
  return false;
};

lnr.onclick = function() {
  var queue = LNR(tree);
  render(queue, 500);
  return false;
}

lrn.onclick = function() {
  var queue = LRN(tree);
  render(queue, 500);
  return false;
}