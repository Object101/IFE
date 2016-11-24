function DynamicSystem(SpaceCraft) {
  this.SpaceCraft = SpaceCraft; //保存飞船对象，方便引用飞船的其他系统，同时防止飞船对象被回收
  this.anglePos = 0; //当前飞船位置
  this.rotateSpeed = this.speed();
}

DynamicSystem.prototype = {
  constructor : DynamicSystem,
  start : function() {
    var energy = this.SpaceCraft.EnergySystem.value;
    if (energy >= 0.5)  {
      this.SpaceCraft.EnergySystem.output(0.5);
      this.SpaceCraft.show.classList.add('fly');
      this.SpaceCraft.isFlying = true;
      this.anglePos -= this.rotateSpeed;
      this.SpaceCraft.show.style.transform = 'rotate(' + this.anglePos + 'deg)';
      this.keeper = setTimeout(this.start.bind(this), 100);
    } else {
      this.stop();
    }
  },
  stop : function() {
    clearTimeout(this.keeper);
    this.SpaceCraft.show.classList.remove('fly');
    this.SpaceCraft.isFlying = false;
    var currentPos = this.anglePos;
    while (currentPos < -360) {
      currentPos += 360;
    }
    this.anglePos = currentPos;
    this.SpaceCraft.show.style.transform = 'rotate(' + this.anglePos + 'deg)';
  },
  speed : function() {
    switch (this.SpaceCraft.id) {
      case 1 : return 4.8;
      case 2 : return 3.2;
      case 3 : return 2.4;
      case 4 : return 1.9;
    }
  }
}

function EnergySystem(SpaceCraft) {
  this.SpaceCraft = SpaceCraft;
  this.value = 100;
  this.input();
}

EnergySystem.prototype = {
  constructor : EnergySystem,
  input : function() {
    if (this.value <= 99.8) {
      this.value += 0.2;
      this.refresh();
    }
    this.keeper = setTimeout(this.input.bind(this), 100);
  },
  output : function(cost) {
    this.value -= cost;
  },
  refresh : function() {
    this.SpaceCraft.show.innerHTML = Math.ceil(this.value) + '%';
  },
  stop : function() {
    clearTimeout(this.keeper);
  }
}

function SignalReceiveSystem(SpaceCraft) {
  this.SpaceCraft = SpaceCraft;
  this.check();
  this.preCommond = null;
}

SignalReceiveSystem.prototype = {
  constructor : SignalReceiveSystem,
  check : function() {
    if (this.SpaceCraft) {
      if (mediator.hasInfo) {
        if (mediator.info.id === this.SpaceCraft.id) {
          var commond = mediator.info.commond;
          if (commond !== this.preCommond) {
            logDisplay('飞天' + this.SpaceCraft.id +'号接到命令');
            this.preCommond = commond;
            switch (commond) {
              case 'fly' :
                if (this.SpaceCraft.isFlying === false) {
                  this.SpaceCraft.DynamicSystem.start();
                }
                break;
              case 'stop' :
                this.SpaceCraft.DynamicSystem.stop();
                break;
              case 'expose' :
              this.SpaceCraft.ExposeSystem.expose();
            }
          }
        }
      }
    this.keeper = setTimeout(this.check.bind(this), 100);
    }
  },
  stop : function() {
    clearTimeout(this.keeper);
  }
}

function ExposeSystem(SpaceCraft) {
  this.SpaceCraft = SpaceCraft;
}

ExposeSystem.prototype = {
  constructor : ExposeSystem,
  expose : function() {
    var show = this.SpaceCraft.show;
    show.parentNode.removeChild(show); //移除飞船的dom
    if (this.SpaceCraft.isFlying === true) {
      this.SpaceCraft.DynamicSystem.stop();//停止动力系统，下同
    }
    this.SpaceCraft.EnergySystem.stop();
    this.SpaceCraft.SignalReceiveSystem.stop();
    this.SpaceCraft.show = null; //解除飞船和系统间的互相引用，回收内存，下同
    this.SpaceCraft.DynamicSystem.SpaceCraft = null;
    this.SpaceCraft.EnergySystem.SpaceCraft = null;
    this.SpaceCraft.SignalReceiveSystem.SpaceCraft = null;
    this.SpaceCraft = null;
  }
}

function SpaceCraft(id) {
  this.id = id;
  this.show = this.createDom(id);
  this.DynamicSystem = new DynamicSystem(this);
  this.EnergySystem = new EnergySystem(this);
  this.SignalReceiveSystem = new SignalReceiveSystem(this);
  this.ExposeSystem = new ExposeSystem(this);
  this.isFlying = false;
}

SpaceCraft.prototype.createDom = function(id) {
  var show = document.createElement('div'); //创建飞船dom
  show.className = 'craft' + id;
  show.innerHTML = '100%';
  var orbit = document.querySelector('#orbit' + id);
  orbit.appendChild(show);
  return show;
}

function Planet() {
  this.hasCraft = [];
  this.create = function(id) {
    if (!this.hasCraft[id]) {
      logDisplay('飞天' + id + '号已就绪');
      new SpaceCraft(id);
      this.hasCraft[id] = true;
    } else {
      logDisplay('飞天' + id + '号已存在');
    }
  };
  this.fly = function(id) {
    var info = {
          id : id,
          commond : 'fly'
        };
    mediator.send(info);
  };
  this.stop = function(id) {
    var info = {
          id : id,
          commond : 'stop'
        };
    mediator.send(info);
  };
  this.expose = function(id) {
    this.hasCraft[id] = false;
    var info = {
        id : id,
        commond : 'expose'
      };
    mediator.send(info);
  };
}

function Mediator() {
  this.hasInfo = false;
  this.info = null;
  this.infoQue = [];
  this.arrive = function() {
    var loss = Math.random();
    if (loss >= 0.3) {
      clearTimeout(this.keeper);
      this.hasInfo = true;
      this.info = this.infoQue.shift();
      var that = this;
      this.keeper = setTimeout(function() {
        that.info = null;
        that.hasInfo = false;
      }, 1000)
      logDisplay('指令发送成功');
    } else {
      this.infoQue.shift();
      logDisplay('指令丢失');
    }
  }
  this.send = function(info) {
    this.infoQue.push(info);
    setTimeout(this.arrive.bind(this), 1000)
  };
}

function logDisplay(info) {
  var p = document.createElement('p');
  p.innerHTML = info;
  if (consoleInfo.children.length > 10) {
    consoleInfo.removeChild(consoleInfo.firstChild);
  }
  consoleInfo.appendChild(p);
}

var planet = new Planet();
var mediator = new Mediator();
var consoleInfo = document.querySelector('#consoleInfo');

window.onload = function() {
  var controlPanel = document.querySelector('#controlPanel');
  controlPanel.onclick = function(e) {
    var target = e.target,
        id = parseInt(target.id.slice(4,5)),
        commond = target.id.slice(5);
    switch (commond) {
      case 'Create' :
        planet.create(id);
        break;
      case 'Fly' :
        planet.fly(id);
        break;
      case 'Stop' :
        planet.stop(id);
        break;
      case 'Expose' :
        planet.expose(id);
        break;
    }
  }
}
