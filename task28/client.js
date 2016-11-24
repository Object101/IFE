function DynamicSystem(SpaceCraft) {
  this.SpaceCraft = SpaceCraft;
  this.anglePos = 0; //当前飞船位置
}

DynamicSystem.prototype = {
  constructor : DynamicSystem,
  start : function() {
    var energy = this.SpaceCraft.EnergySystem.value,
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
  this.type = 'basic';
}

BasicDynamicSystem.prototype.__proto__ = DynamicSystem.prototype;
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
  this.type = 'professional';
}

ProfessionalDynamicSystem.prototype.__proto__ = DynamicSystem.prototype;
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
  this.type = 'ultimate';
}

UltimateDynamicSystem.prototype.__proto__ = DynamicSystem.prototype;
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
  this.type = 'basic';
}

BasicEnergySystem.prototype.__proto__ = EnergySystem.prototype;

function ProfessionalEnergySystem(SpaceCraft) {
  EnergySystem.call(this, SpaceCraft);
  this.inputCell = 0.3;
  this.inputCeil = 99.7;
  this.type = 'professional';
}

ProfessionalEnergySystem.prototype.__proto__  = EnergySystem.prototype;

function UltimateEnergySystem(SpaceCraft) {
  EnergySystem.call(this, SpaceCraft);
  this.inputCell = 0.4;
  this.inputCeil = 99.6;
  this.type = 'ultimate';
}

UltimateEnergySystem.prototype.__proto__  = EnergySystem.prototype;

function SignalReceiveSystem(SpaceCraft) {
  this.SpaceCraft = SpaceCraft;
  this.Adapter = new Adapter();
  this.preCommond = null;
  this.check();
  this.broadcast();
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
                break;
            }
          }
        }
      }
    this.keeper = setTimeout(this.check.bind(this), 100);
    }
  },
  stop : function() {
    clearTimeout(this.keeper);
    clearTimeout(this.reKeeper);
    var info = {
      id: this.SpaceCraft.id,
      dynamic: 'expose',
      energy: 'expose',
      isFlying: 'expose',
      remainEnergy: 'expose'
    }
    var data = this.Adapter.reEncode(info);
    bus.response(data);

  },
  broadcast : function() {
    var info = {
      id: this.SpaceCraft.id,
      dynamic: this.SpaceCraft.DynamicSystem.type,
      energy: this.SpaceCraft.EnergySystem.type,
      isFlying: this.SpaceCraft.isFlying,
      remainEnergy: this.SpaceCraft.EnergySystem.value
    }
    var data = this.Adapter.reEncode(info);
    bus.response(data);
    this.reKeeper = setTimeout(this.broadcast.bind(this), 1000);
  }
}

function ExposeSystem(SpaceCraft) {
  this.SpaceCraft = SpaceCraft;
}

ExposeSystem.prototype = {
  constructor : ExposeSystem,
  expose : function() {
    var show = this.SpaceCraft.show;

    show.parentNode.removeChild(show); 
    //移除飞船的dom
    if (this.SpaceCraft.isFlying === true) {
      this.SpaceCraft.DynamicSystem.stop();
      //停止动力系统，下同
    }
    this.SpaceCraft.EnergySystem.stop();
    this.SpaceCraft.SignalReceiveSystem.stop();
    this.SpaceCraft.show = null; 
    //解除飞船和系统间的互相引用，回收内存，下同
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
  this.preFeedback = null;
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
  this.check = function() {
    if (bus.hasFeedback) {
      var feedback = bus.feedback;
      if (feedback !== this.preFeedback) {
        this.preFeedback = feedback;
        var info = this.Adapter.reDecode(feedback),
            screen = god.children[info.id],
            flyStatus;
        if (info.dynamic !== 'expose') {
          if (info.isFlying) {
          flyStatus = '飞行中';
          } else {
          flyStatus = '停止';
          }
          screen.children[1].innerHTML = info.dynamic;
          screen.children[2].innerHTML = info.energy;
          screen.children[3].innerHTML = flyStatus;
          screen.children[4].innerHTML = info.remainEnergy + '%';
        } else {
          screen.children[1].innerHTML = '';
          screen.children[2].innerHTML = '';
          screen.children[3].innerHTML = '';
          screen.children[4].innerHTML = '';
        }
      }
    }
    setTimeout(this.check.bind(this), 50);
  };
  this.check();
}

function BUS() {
  this.hasInfo = false;
  this.hasFeedback = false;
  this.info = null;
  this.feedback = null;
  this.infoQue = [];
  this.feedQue = [];
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
  };
  this.receive = function() {
    var loss = Math.random();
    if (loss >= 0.1) {
      clearTimeout(this.feedKeeper);
      this.hasFeedback = true;
      this.feedback = this.feedQue.shift();
    } else {
      setTimeout(this.receive.bind(this), 300);
    }
  };
  this.send = function(info) {
    this.infoQue.push(info);
    setTimeout(this.arrive.bind(this), 300);
  };
  this.response = function(info) {
    this.feedQue.push(info);
    setTimeout(this.receive.bind(this), 300);
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

Adapter.prototype.reEncode = function(info) {
  var id, dynamic, energy, isFlying, remainEnergy;
  switch (info.id) {
    case 1:
      id = '00';
      break;
    case 2:
      id = '01';
      break;
    case 3 :
      id = '10';
      break;
    case 4 :
      id = '11';
      break;
  }
  switch (info.dynamic) {
    case 'basic':
      dynamic = '00';
      break;
    case 'professional':
      dynamic = '01';
      break;
    case 'ultimate':
      dynamic = '10';
      break;
    case 'expose':
      dynamic = '11';
      break;
  }
  switch (info.energy) {
    case 'basic':
      energy = '00';
      break;
    case 'professional':
      energy = '01';
      break;
    case 'ultimate':
      energy = '10';
      break;
    case 'expose':
      energy = '11';
      break;
  }
  switch (info.isFlying) {
    case true:
      isFlying = '1';
      break;
    case 'expose':
    case false:
      isFlying = '0';
      break;
  }
  remainEnergy = info.remainEnergy.toString(2);
  if (info.remainEnergy === 'expose') {
    remainEnergy ='1111';
  }
  return id + dynamic + energy + isFlying + remainEnergy;
}

Adapter.prototype.reDecode = function(data) {
  var id, dynamic, energy, isFlying, remainEnergy;
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
    case '00':
      dynamic = '前进号';
      break;
    case '01':
      dynamic = '奔腾号';
      break;
    case '10':
      dynamic = '超越号';
      break;
    case '11':
      dynamic = 'expose';
      break;
  }
  switch (data.slice(4,6)) {
    case '00':
      energy = '劲量型';
      break;
    case '01':
      energy = '光能型';
      break;
    case '10':
      energy = '永久型';
      break;
    case '11':
      energy = 'expose';
      break;
  }
  switch (data.slice(6,7)) {
    case '0':
      isFlying = false;
      break;
    case '1':
      isFlying = true;
      break;
  }
  remainEnergy = parseInt(data.slice(7), 2);
  return {
    id: id,
    dynamic: dynamic,
    energy: energy,
    isFlying: isFlying,
    remainEnergy: remainEnergy
  }
}

function logDisplay(info) {
  var p = document.createElement('p');
  p.innerHTML = info;
  if (consoleInfo.children.length > 10) {
    consoleInfo.removeChild(consoleInfo.firstChild);
  }
  consoleInfo.appendChild(p);
}

var bus = new BUS();
var planet = new Planet();
var consoleInfo = document.querySelector('#consoleInfo');
var dynamicSelect = document.querySelector('#dynamic');
var energySelect = document.querySelector('#energy');
var god = document.querySelector('#GOD');

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
