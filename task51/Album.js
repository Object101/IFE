/**
 * Created by LiangSen on 2016/8/12.
 */

'use strict';
class Album {
  /**
   * 创建相册
   * @param id 相册根元素id
   */
  constructor(id) {
    let album = document.getElementById(id);
    this.album = album;
    this.images = [...album.querySelectorAll('img')];
    this.gutterX = 8;
    this.gutterY = 8;
    this.col = 4;
    this.baseHeight = 250;
  }
  /**
   * 更改布局，默认为瀑布布局
   * @param {String} layout 布局样式
   * @param {Number} gutterX 横向间距
   * @param {Number} gutterY 纵向间距
   * @param {Number} col 瀑布布局的列数
   * @param {Number} baseHeight 木桶布局的基准高度
   */
  setLayout(layout = 'waterfall', {gutterX, gutterY, col, baseHeight} = {}) {
    if (!isNaN(gutterX)) {
      this.gutterX = gutterX;
    }
    if (!isNaN(gutterY)) {
      this.gutterY = gutterY;
    }
    if (!isNaN(col)) {
      this.col = col;
    }
    if (!isNaN(baseHeight)) {
      this.baseHeight = baseHeight;
    }
    let album = this.album;
    album.innerHTML = '';
    let currentLayout = this.layout;
    if (currentLayout !== 'none') {
      album.classList.remove(currentLayout);
    }
    switch(layout) {
      case 'none':
        this.layout = layout;
        this.regressed();
        break;
      case 'puzzle':
        this.layout = layout;
        this.puzzled();
        break;
      case 'waterfall':
        this.layout = layout;
        this.waterfalled();
        break;
      case 'barrel':
        this.layout = layout;
        this.barreled();
    }
  }
  /**
   * 更改图片与布局，默认为瀑布布局(会移除原有图片)
   * @param {String} imgs 单个图片url或图片url组成的数组
   * @param {String} layout 布局样式
   * @param {Number} gutterX 横向间距
   * @param {Number} gutterY 纵向间距
   * @param {Number} col 瀑布布局的列数
   * @param {Number} baseHeight 木桶布局的基准高度
   */
  setImage(imgs, {layout, gutterX, gutterY, col, baseHeight} = {}) {
    if (!Array.isArray(imgs)) {
      imgs = [imgs];
    }
    this.images = [];
    this.setLayout(layout, {gutterX, gutterY, col, baseHeight});
    this.addImg(imgs);
  }
  /**
   * 添加图片
   * @param {String} imgs 单个图片url或图片url组成的数组
   * @returns {Array} 图片元素组成的数组，方便链式调用
   */
  addImg(imgs) {
    if (!Array.isArray(imgs)) {
      imgs = [imgs];
    }
    imgs = imgs.filter(function (item, index, array) {
      return (typeof item === 'string');
    });
    let _this = this;
    let layout = this.layout;
    let loadImg = this.loadImg;
    let loadedImgs = [];
    switch (layout) {
      case 'none':
        for (let img of imgs) {
          loadImg(img).then(function (img) {
            _this.addOnRegress(img);
            loadedImgs.push(img);
          }).catch(function (e) {
            console.log(e);
          });
        }
        return loadedImgs;
      case 'puzzle':
        for (let img of imgs) {
          loadedImgs.push(loadImg(img));
        }
        Promise.all(loadedImgs).then(function (imgs) {
          _this.addOnPuzzle(imgs);
          loadedImgs = imgs;
        }).catch(function (e) {
          console.log(e);
        });
        return loadedImgs;
      case 'waterfall':
        for (let img of imgs) {
          loadImg(img).then(function (img) {
            _this.addOnWaterfall(img);
            loadedImgs.push(img);
          }).catch(function (e) {
            //console.log(e);
          });
        }
        return loadedImgs;
      case 'barrel':
        for (let img of imgs) {
          loadImg(img).then(function (img) {
            _this.addOnBarrel(img);
            loadedImgs.push(img);
          }).catch(function (e) {
            //console.log(e);
          });
        }
        return loadedImgs;
    }
  }
  /**
   * 加载图片，返回promise
   * @param {String} url
   * @returns {Promise}
   */
  loadImg(url) {
    return new Promise(function (resolve, reject) {
      let img = new Image();
      img.onload = function () {
        this.onload = null;
        resolve(this);
      };
      img.onerror = function (e) {
        this.onerror = null;
        reject(e);
      };
      img.src = url;
    });
  }
  /**
   * 设置图片之间的间距
   * @param {Number} x 图片之间的横向间距
   * @param {Number} [y] 图片之间的纵向间距，如果是 undefined 则等同于 x
   */
  setGutter(x, y = x) {
    this.setLayout(this.layout, {gutterX: x, gutterY: y});
  }
  setCols(col) {
    this.setLayout(this.layout, {col: col});
  }
  regressed() {
    let album = this.album;
    let imgs = this.images;
    for (let img of imgs) {
      album.appendChild(img);
    }
  }
  addOnRegress(imgs) {
    if (!Array.isArray(imgs)) {
      imgs = [imgs];
    }
    this.images.push(...imgs);
    let album = this.album;
    for (let img of imgs) {
      album.appendChild(img);
    }
  }
  puzzled() {
    let imgs = this.images.slice();
    imgs = imgs.slice(0,6);
    let count = imgs.length;
    let prefix;
    switch (count) {
      case 1: prefix = 'one'; break;
      case 2: prefix = 'two'; break;
      case 3: prefix = 'three'; break;
      case 4: prefix = 'four'; break;
      case 5: prefix = 'five'; break;
      case 6: prefix = 'six'; break;
    }
    let album = this.album;
    album.classList.add('puzzle');
    let i = 1;
    for (let img of imgs) {
      img.classList.add(prefix + '-' + i++);
      album.appendChild(img);
    }
  }
  addOnPuzzle(imgs) {
    this.images.push(...imgs);
    this.puzzled();
  }
  waterfalled() {
    let gutterX = this.gutterX;
    let col = this.col;
    let album = this.album;
    album.classList.add('waterfall');
    let colWidth = (parseInt(getComputedStyle(album).getPropertyValue('width')) - (col - 1) * gutterX)  / col;
    for (let i = 1; i <= col; i++) {
      let div = document.createElement('div');
      div.style.width = colWidth + 'px';
      if (i !== col) {
        div.style.marginRight= gutterX + 'px';
      }
      album.appendChild(div);
    }
    let imgs = this.images;
    this.images = [];
    this.addOnWaterfall(imgs);
  }

  addOnWaterfall(imgs) {
    if (!Array.isArray(imgs)) {
      imgs = [imgs];
    }
    this.images.push(...imgs);
    let album = this.album;
    let gutterY = this.gutterY;
    for (let img of imgs) {
      //找出高度最小的子容器
      let minDiv = album.children[0];
      let minHeight = minDiv.clientHeight;
      for (let i = 1, len = album.children.length; i < len; i++) {
        let curDiv = album.children[i];
        let curHeight = curDiv.clientHeight;
        if (curHeight < minHeight) {
          minDiv = curDiv;
          minHeight = curHeight;
        }
      }
      if (minDiv.children.length !== 0) {
        img.style.marginTop = gutterY + 'px';
      }
      //将图片加到最小的容器中
      minDiv.appendChild(img);
    }
  }
  barreled() {
    let imgs = this.images;
    this.images = [];
    this.addOnBarrel(imgs);
  }

  addOnBarrel(imgs) {
    if (!Array.isArray(imgs)) {
      imgs = [imgs];
    }
    this.images.push(...imgs);
    let album = this.album;
    let maxRowWidth = parseInt(getComputedStyle(album).getPropertyValue('width'));
    let count = 0;
    let rowWidth = 0;
    let rowRatio = 0;
    let rows = [];
    let gutterX = this.gutterX;
    let gutterY = this.gutterY;
    let baseHeight = this.baseHeight;
    for (let img of imgs) {
      rows.push(img);
      count++;
      //通过图片原始长和宽计算长宽比
      let imgRatio = img.naturalWidth / img.naturalHeight;
      //当前行累积长宽比
      rowRatio += imgRatio;
      let imgWidth = baseHeight * imgRatio;
      rowWidth += imgWidth;
      if (rowWidth > maxRowWidth) {
        rowRatio -= imgRatio;
        rowWidth -= imgWidth + gutterX;
        count -= 1;
        let imgCathe = rows.pop();
        let row = document.createElement('div');
        //行高度按如下计算
        let height = (maxRowWidth - (count - 1) * gutterX) / rowRatio;
        row.style.height = height + 'px';
        if (album.children.length !== 0) {
          row.style.marginTop = gutterY + 'px';
        }
        for (let item of rows) {
          row.appendChild(item);
        }
        album.appendChild(row);
        rows = [];
        rows.push(imgCathe);
        count = 1;
        rowWidth = imgWidth + gutterX;
        rowRatio = imgRatio;
      } else {
        rowWidth += gutterX;
      }
    }
    let row = document.createElement('div');
    for (let item of rows) {
      row.appendChild(item);
    }
    row.style.height = baseHeight + 'px';
    if (album.children.length !== 0) {
      row.style.marginTop = gutterY + 'px';
    }
    album.appendChild(row);
  }
}
