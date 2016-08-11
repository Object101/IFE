!function () {
  class Barrel {
    constructor() {
      let box = document.querySelector('[class*=barrel]');
      this.box = box;
      let interval = parseInt(box.className.match(/barrel-([0-9]+)/)[1], 10);
      this.padding = interval / 2;
      this.enLoad = true;
      this.init();
    }
    init() {
      let box = this.box;
      let padding = this.padding;
      box.style.padding = padding + 'px';
      let imgs = [...box.children];
      for (let img of imgs) {
        box.removeChild(img);
        img.style.padding = padding + 'px';
      }
      let loading = document.createElement('div');
      loading.classList.add('loading');
      loading.innerHTML = 'Loading';
      box.appendChild(loading);
      this.render(imgs);
      let _this = this;
      window.addEventListener('scroll', function () {
        let body = document.body;
        if ((body.scrollHeight - 50 <= body.scrollTop + this.innerHeight) && _this.enLoad) {
          _this.renderMoreOnScrollEnd();
        }
      });
    }
    render(imgs) {
      let box = this.box;
      let padding = this.padding;
      let maxRowWidth = box.clientWidth - padding * 2;
      let count = 0;
      let rowWidth = 0;
      let rowRatio = 0;
      let rows = [];
      let loading = box.lastElementChild;
      for (let img of imgs) {
        rows.push(img);
        count++;
        //通过图片原始长和宽计算长宽比
        let imgRatio = img.naturalWidth / img.naturalHeight;
        //当前行累积长宽比
        rowRatio += imgRatio;
        //默认高度为300px，考虑到padding，图片宽度需要这样计算，同时累积到总宽度
        rowWidth += (300 - 2 * padding) * imgRatio + 2 * padding;
        //达到成为一行的条件
        if ((rowWidth>=maxRowWidth && count>=3) || count===6) {
          let row = document.createElement('div');
          //行高度按如下计算
          let height = (maxRowWidth - count * 2 * padding) / rowRatio;
          row.style.height = height + 2 * padding + 'px';
          for (let item of rows) {
            row.appendChild(item);
          }
          box.insertBefore(row, loading);
          rows = [];
          count = 0;
          rowWidth = 0;
          rowRatio = 0;
        }
      }
      if (rows.length !== 0) {
        let row = document.createElement('div');
        row.style.height = 300 + 'px';
        for (let item of rows) {
          row.appendChild(item);
        }
        box.insertBefore(row, loading);
      }
    }
    renderMoreOnScrollEnd() {
      this.enLoad = false;
      let box = this.box;
      let loading = box.lastElementChild;
      loading.classList.toggle('on');
      let lastRow = loading.previousElementSibling;
      let imgs = [];
      let imgsPromise = [];
      imgs.push(...lastRow.children);
      for (let i=0; i<6; i++) {
        let width = Math.round(Math.random() * 200 + 400);
        let height = Math.round(Math.random() * 200 + 400);
        imgsPromise.push(this.preLoadImg('http://placekitten.com/' + width + '/' + height));
      }
      let _this = this;
      Promise.all(imgsPromise).then(function (newImgs) {
        imgs = imgs.concat(newImgs);
        box.removeChild(lastRow);
        loading.classList.toggle('on');
        _this.render(imgs);
        _this.enLoad = true;
      }).catch(e => console.log(e));
    }
    preLoadImg(path) {
      let padding = this.padding;
      return new Promise(function (resolve, reject) {
        let img = new Image();
        img.onload = function () {
          img.onload = null;
          resolve(img);
        };
        img.onerror = reject;
        img.style.padding = padding + 'px';
        img.src = path;
      });
    }
  }
  window.addEventListener('load', function () {
    new Barrel();
  });
}();
