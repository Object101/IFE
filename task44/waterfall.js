!function () {
  class Waterfall {
    constructor() {
      let box = document.querySelector('[class*=waterfall]');
      this.box = box;
      //通过正则取得类名中的列数与间隔参数
      let matchs = box.className.match(/waterfall-([0-9]+)-([0-9]+)/);
      this.col = parseInt(matchs[1], 10);
      this.interval = parseInt(matchs[2], 10) / 2;
      this.init();
    }
    //初始化函数
    init() {
      let box = this.box;
      let imgs = [...box.children];//将nodelist转换成数组，方便遍历
      //将原有图片暂时移除
      for (let img of imgs) {
        box.removeChild(img);
      }
      let col = this.col;
      //为容器添加数量为col的列
      for (let i = 0; i < col; i++) {
        let div = document.createElement('div');
        div.style.width = 1/col * 100 + '%';
        box.appendChild(div);
      }
      box.style.padding = this.interval + 'px';
      //为容器绑定点击事件函数
      box.addEventListener('click', function(e) {
        if (!this.display) {
          let display = document.createElement('div');
          this.display = display;
          display.classList.add('display');
          display.appendChild(new Image());
          display.addEventListener('click', function(e) {
            e.stopPropagation();
            if (e.target !== this.children[0]) {
              document.body.removeChild(this);
            }
          });
        }
        this.display.children[0].src = e.target.src;
        document.body.appendChild(this.display);
      });
      //调用add函数将图片数组添加到容器中
      this.add(imgs);
      let _this = this;
      //绑定滚动事件，自动加载图片
      window.addEventListener('scroll', function() {
        let body = document.body;
        if (body.scrollHeight === body.scrollTop + this.innerHeight) {
          _this.addImgOnScrollEnd();
        }
      });
    }
    add(imgs) {
      let box = this.box;
      let interval = this.interval;
      for (let img of imgs) {
        //找出高度最小的子容器
        let minDiv = box.children[0];
        let minHei = minDiv.clientHeight;
        for (let i = 1, len = box.children.length; i < len; i++) {
          let curDiv = box.children[i];
          let curHei = curDiv.clientHeight;
          if (curHei < minHei) {
            minDiv = curDiv;
            minHei = curHei;
          }
        }
        //将图片加到最小的容器中
        img.style.padding = interval + 'px';
        minDiv.appendChild(img);
      }
    }
    //滚动到底部时自动添加图片的函数
    addImgOnScrollEnd() {
      //一次添加4张图片
      for (let i = 0; i < 4; i++) {
        let img = new Image();
        let _this = this;
        img.onload = function() {
          this.onload = null;
          _this.add([this]);//图片载入完成后加入到dom树中去
        };
        let height = Math.round(Math.random() * 300 + 300);
        img.src = 'http://placekitten.com/400/' + height;
      }
    }
  }
  window.addEventListener('load', function() {
    new Waterfall();
  });
}();
