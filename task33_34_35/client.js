window.addEventListener('load', function() {
  var commond = document.querySelector('#commond');
  var chess = document.querySelector('#block');
  chess.rowP = 1; //初始化棋子当前纵坐标，下为横坐标
  chess.colP = 1;
  chess.face = 1; //1:up 2:right 3:down 4:left
  ul = commond.children[0].children[0];
  input = commond.children[1];
  button = commond.children[2];
  button.addEventListener('click', function() {
    var commonds = input.value.split(/\n/);
    commonds = commonds.filter(function(item, index, array) {
      if (item === '') {
        return false; //过滤掉空行
      } else {
        return true;
      }
    });
    //通过延迟递归调用的方式，每隔1s执行一行指令
    setTimeout(function() {
      operate(commonds.shift(), chess);
      if (commonds.length > 0) {
        setTimeout(arguments.callee, 1000);
      }
    }, 1000);
  });
  input.addEventListener('keyup', function() {
    var commonds = this.value.split(/\n/);
    var curlen = ul.children.length;
    var comlen = commonds.length;
    var diff = comlen - curlen;
    //每次输入后，判断textarea行数与标示数的差值，相应增删表示数，同时同步滚动
    if (diff > 0) {
      for (var i = 0; i < diff; i++) {
        var li = document.createElement('li');
        li.innerHTML = curlen + i + 1;
        ul.style.top = -parseInt(this.scrollTop) + 'px';  //同步滚动
        ul.appendChild(li);
      }
    } else if (diff < 0) {
      ul.style.top = -parseInt(this.scrollTop) + 'px';
      var lastEle = ul.children[comlen - 1];
      while (lastEle.nextElementSibling) {
        ul.removeChild(lastEle.nextElementSibling);
      }
    }
    commonds.forEach(function(item, index, array) {
      //
    });
  });
  input.addEventListener('scroll', function(e) {
    ul.style.top = -parseInt(this.scrollTop) + 'px';
  });
});

//棋子控制函数
function operate(commond, chess) {
  switch (commond) {
    case 'GO':
      var top = chess.style.top !== '' ? parseInt(chess.style.top) : 0,
          left = chess.style.left !== '' ? parseInt(chess.style.left) : 0,
          rowP = chess.rowP,
          colP = chess.colP;
      switch (chess.face) {
        case 1:
          if (rowP > 1) {
            top -= 51;
            chess.style.top = top + 'px';
            chess.rowP = rowP - 1;
          } else {
            console.log('移动不能超出格子空间');
          }
          break;
        case 2:
          if (colP < 10) {
            left += 51;
            chess.style.left = left + 'px';
            chess.colP = colP + 1;
          } else {
            console.log('移动不能超出格子空间');
          }
          break;
        case 3:
          if (rowP < 10) {
            top += 51;
            chess.style.top = top + 'px';
            chess.rowP = rowP + 1;
          } else {
            console.log('移动不能超出格子空间');
          }
          break;
        case 4:
          if (colP > 1) {
            left -= 51;
            chess.style.left = left + 'px';
            chess.colP = colP - 1;
          } else {
            console.log('移动不能超出格子空间');
          }
      }
      break;
    case 'TUN LEF':
      var curAngle = chess.style.transform !== '' ? parseInt(chess.style.transform.slice(7)) : 0,
          newAngle = curAngle - 90,
          curface = chess.face,
          newface = curface - 1;
      chess.style.transform = 'rotate(' + newAngle + 'deg)';
      if (newface < 1) {
        chess.face = 4;
      } else {
        chess.face = newface;
      }
      break;
    case 'TUN RIG':
      var curAngle = chess.style.transform !== '' ? parseInt(chess.style.transform.slice(7)) : 0,
          newAngle = curAngle + 90,
          curface = chess.face,
          newface = curface + 1;
      chess.style.transform = 'rotate(' + newAngle + 'deg)';
      if (newface > 4) {
        chess.face = 1;
      } else {
        chess.face = newface;
      }
      break;
    case 'TUN BAC':
      var curAngle = chess.style.transform !== '' ? parseInt(chess.style.transform.slice(7)) : 0,
          newAngle = curAngle + 180,
          curface = chess.face,
          newface = curface + 2;
      chess.style.transform = 'rotate(' + newAngle + 'deg)';
      if (newface > 4) {
        chess.face = newface - 4;
      } else {
        chess.face = newface;
      }
      break;
    case 'TRA TOP':
      if (rowP > 1) {
        top -= 51;
        chess.style.top = top + 'px';
        chess.rowP = rowP - 1;
      } else {
        console.log('移动不能超出格子空间');
      }
      break;
    case 'TRA RIG':
      if (colP < 10) {
        left += 51;
        chess.style.left = left + 'px';
        chess.colP = colP + 1;
      } else {
        console.log('移动不能超出格子空间');
      }
      break;
    case 'TRA BOT':
      if (rowP < 10) {
        top += 51;
        chess.style.top = top + 'px';
        chess.rowP = rowP + 1;
      } else {
        console.log('移动不能超出格子空间');
      }
      break;
    case 'TRA LEF':
      if (colP > 1) {
        left -= 51;
        chess.style.left = left + 'px';
        chess.colP = colP - 1;
      } else {
        console.log('移动不能超出格子空间');
      }
      break;
    default: console.log('无效命令');
  }
}