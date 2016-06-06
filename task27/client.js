function DynamicSystem(SpaceCraft) {
  this.SpaceCraft = SpaceCraft; //保存飞船对象，方便引用飞船的其他系统，同时防止飞船对象被回收
  this.anglePos = 0; //当前飞船位置
}

DynamicSystem.prototype = {
  constructor : DynamicSystem,
  start : function() {
    var energy = this.SpaceCraft.EnergySystem.value
        cost = this.cost;
    if (energy >= cost)  {
      this.SpaceCraft.EnergySystem.output(cost);
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
  }
}

function BasicDynamicSystem(SpaceCraft) {
  DynamicSystem.call(this, SpaceCraft);
  this.rotateSpeed = this.speed();
  this.cost = 0.5;
}

BasicDynamicSystem.prototype = DynamicSystem.prototype;
BasicDynamicSystem.prototype.constructor = BasicDynamicSystem;
BasicDynamicSystem.prototype.speed = function() {
  switch (this.SpaceCraft.id) {
      case 1 : return 2.9;
      case 2 : return 1.9;
      case 3 : return 1.4;
      case 4 : return 1.1;
  }
}

function ProfessionalDynamicSystem(SpaceCraft) {
  DynamicSystem.call(this, SpaceCraft);
  this.rotateSpeed = this.speed();
  this.cost = 0.7;
}

ProfessionalDynamicSystem.prototype = DynamicSystem.prototype;
ProfessionalDynamicSystem.prototype.constructor = ProfessionalDynamicSystem;
ProfessionalDynamicSystem.prototype.speed = function() {
  switch (this.SpaceCraft.id) {
      case 1 : return 4.8;
      case 2 : return 3.2;
      case 3 : return 2.4;
      case 4 : return 1.9;
  }
}

function UltimateDynamicSystem(SpaceCraft) {
  DynamicSystem.call(this, SpaceCraft);
  this.rotateSpeed = this.speed();
  this.cost = 0.9;
}

UltimateDynamicSystem.prototype = DynamicSystem.prototype;
UltimateDynamicSystem.prototype.constructor = UltimateDynamicSystem;
UltimateDynamicSystem.prototype.speed = function() {
  switch (this.SpaceCraft.id) {
      case 1 : return 6.7;
      case 2 : return 4.48;
      case 3 : return 3.4;
      case 4 : return 2.7;
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
    if (this.value <= this.inputCeil) {
      this.value += this.inputCell;
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

function BasicEnergySystem(SpaceCraft) {
  EnergySystem.call(this, SpaceCraft);
  this.inputCell = 0.2;
  this.inputCeil = 99.8;
}

BasicEnergySystem.prototype = EnergySystem.prototype;
BasicEnergySystem.prototype.constructor = BasicEnergySystem;

function ProfessionalEnergySystem(SpaceCraft) {
  EnergySystem.call(this, SpaceCraft);
  this.inputCell = 0.3;
  this.inputCeil = 99.7;
}

ProfessionalEnergySystem.prototype = EnergySystem.prototype;
ProfessionalEnergySystem.prototype.constructor = ProfessionalEnergySystem;

function UltimateEnergySystem(SpaceCraft) {
  EnergySystem.call(this, SpaceCraft);
  this.inputCell = 0.4;
  this.inputCeil = 99.6;
}

UltimateEnergySystem.prototype = EnergySystem.prototype;
UltimateEnergySystem.prototype.constructor = UltimateEnergySystem;

function SignalReceiveSystem(SpaceCraft) {
  this.SpaceCraft = SpaceCraft;
  this.Adapter = new Adapter();
  this.check();
  this.preCommond = null;
}

SignalReceiveSystem.prototype = {
  constructor : SignalReceiveSystem,
  check : function() {
    if (this.SpaceCraft) {
      if (bus.hasInfo) {
        var info = this.Adapter.decode(bus.info);
        if (info.id === this.SpaceCraft.id) {
          var commond = info.commond;
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

function SpaceCraft(id, dynamic, energy) {
  this.id = id;
  this.show = this.createDom(id);
  this.DynamicSystem = function(dynamic, SpaceCraft) {
    switch (dynamic) {
      case 'basic' :
        return new BasicDynamicSystem(SpaceCraft);
      case 'professional' :
        return new ProfessionalDynamicSystem(SpaceCraft);
      case 'ultimate' :
        return new UltimateDynamicSystem(SpaceCraft);
    }
  }(dynamic, this);
  this.EnergySystem = function(energy, SpaceCraft) {
    switch (energy) {
      case 'basic' :
        return new BasicEnergySystem(SpaceCraft);
      case 'professional' :
        return new ProfessionalEnergySystem(SpaceCraft);
      case 'ultimate' :
        return new UltimateEnergySystem(SpaceCraft);
    }
  }(energy, this);
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
  this.Adapter = new Adapter();
  this.create = function(id, dynamic, energy) {
    if (!this.hasCraft[id]) {
      logDisplay('飞天' + id + '号已就绪');
      new SpaceCraft(id, dynamic, energy);
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
    var data = this.Adapter.encode(info);
    bus.send(data);
  };
  this.stop = function(id) {
    var info = {
          id : id,
          commond : 'stop'
        };
    var data = this.Adapter.encode(info);
    bus.send(data);
  };
  this.expose = function(id) {
    this.hasCraft[id] = false;
    var info = {
        id : id,
        commond : 'expose'
      };
    var data = this.Adapter.encode(info);
    bus.send(data);
  };
}

function BUS() {
  this.hasInfo = false;
  this.info = null;
  this.infoQue = [];
  this.arrive = function() {
    var loss = Math.random();
    if (loss >= 0.1) {
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
      logDisplay('指令发送失败。。。准备再次发送');
      setTimeout(this.arrive.bind(this), 300);
    }
  }
  this.send = function(info) {
    this.infoQue.push(info);
    setTimeout(this.arrive.bind(this), 300);
  };
}

function Adapter() {}

Adapter.prototype.encode = function(info) {
  var id, commond;
  switch (info.id) {
    case 1 :
      id = '00';
      break;
    case 2 :
      id = '01';
      break;
    case 3 :
      id = '10';
      break;
    case 4 :
      id = '11';
      break;
  }
  switch (info.commond) {
    case 'fly' :
      commond = '00';
      break;
    case 'stop' :
      commond = '01';
      break;
    case 'expose' :
      commond = '10';
      break;
  }
  return id + commond;
}

Adapter.prototype.decode = function(data) {
  var id, commond;
  switch (data.slice(0,2)) {
    case '00' :
      id = 1;
      break;
    case '01' :
      id = 2;
      break;
    case '10' :
      id = 3;
      break;
    case '11' :
      id = 4;
      break;
  }
  switch (data.slice(2,4)) {
    case '00' :
      commond = 'fly';
      break;
    case '01' :
      commond = 'stop';
      break;
    case '10' :
      commond = 'expose';
      break;
  }
  return {
    id: id,
    commond: commond
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
var bus = new BUS();
var consoleInfo = document.querySelector('#consoleInfo');
var dynamicSelect = document.querySelector('#dynamic');
var energySelect = document.querySelector('#energy');

window.onload = function() {
  var controlPanel = document.querySelector('#controlPanel');
  controlPanel.onclick = function(e) {
    var target = e.target,
        id = parseInt(target.id.slice(4,5)),
        commond = target.id.slice(5),
        dynamic = dynamicSelect.value,
        energy = energySelect.value;
    switch (commond) {
      case 'Create' :
        planet.create(id, dynamic, energy);
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
