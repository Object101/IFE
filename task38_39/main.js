var data = {
  '大娃': randomScore(3),
  '二娃': randomScore(3),
  '三娃': randomScore(3),
  '四娃': randomScore(3),
  '五娃': randomScore(3),
  '六娃': randomScore(3),
  '七娃': randomScore(3),
  '八娃': randomScore(3),
  '九娃': randomScore(3),
  '十娃': randomScore(3),
  '十一娃': randomScore(3),
  '十二娃': randomScore(3),
  '十三娃': randomScore(3),
  '十四娃': randomScore(3),
  '十五娃': randomScore(3)
};
let curSort = null;

window.addEventListener('load', function() {
  var queueTable = document.querySelector('#queueTable').children[1];
  addData(data, queueTable);
  var sort = queueTable.previousElementSibling;
  sort.addEventListener('click', function(e) {
    var target = e.target;
    var id = target.id;
    switch (id) {
      case 'lanague':
        if (curSort) {
          curSort.classList.remove('sort');
        }
        curSort = target;
        target.classList.add('sort');
        i = 1;
        break;
      case 'math':
        if (curSort) {
          curSort.classList.remove('sort');
        }
        curSort = target;
        target.classList.add('sort');
        i = 2;
        break;
      case 'english':
        if (curSort) {
          curSort.classList.remove('sort');
        }
        curSort = target;
        target.classList.add('sort');
        i = 3;
        break;
      case 'total':
        if (curSort) {
          curSort.classList.remove('sort');
        }
        curSort = target;
        target.classList.add('sort');
        i = 4;
        break;
      default: return;
    }
    var doms = [...queueTable.children];
    doms.sort(function(value1, value2) {
      return parseInt(value2.children[i].innerHTML) - parseInt(value1.children[i].innerHTML);
    });
    queueTable.innerHTML = '';
    for (let item of doms) {
      queueTable.appendChild(item);
    }
  });
  var fill = sort.parentNode.previousElementSibling;
  window.addEventListener('scroll', function(e) {
    var top = document.body.scrollTop - 51;
    if (top > 0 && top < 815) {
      sort.classList.add('frozen');
      fill.classList.add('fill');
    } else {
      sort.classList.remove('frozen');
      fill.classList.remove('fill');
    }
  });
});

function addData(data, tbody) {
  var frag = document.createDocumentFragment();
  for (score in data) {
    var tr = document.createElement('tr');
    var name = document.createElement('td');
    name.innerHTML = score;
    var lanague = document.createElement('td');
    lanague.innerHTML = data[score][0];
    var math = document.createElement('td');
    math.innerHTML = data[score][1];
    var english = document.createElement('td');
    english.innerHTML = data[score][2];
    var total = document.createElement('td');
    total.innerHTML = data[score][3];
    tr.appendChild(name);
    tr.appendChild(lanague);
    tr.appendChild(math);
    tr.appendChild(english);
    tr.appendChild(total);
    frag.appendChild(tr);
  }
  tbody.appendChild(frag);
}

function randomScore(n) {
    var arr = [];
    var sum = 0;
    for (var i = 0; i < n; i++) {
        var num = Math.floor(Math.random() * 101);
        sum += num;
        arr.push(num);
    }
    arr.push(sum);
    return arr;
}
[, ,].forEach(function(item) {
  console.log(item)
})