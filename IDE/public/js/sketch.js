let sliderSpacing = {
  baseX: 20,
  baseY: 20,
  xSpacing: 400,
  ySpacing: 60
}

function setup() {

  noCanvas();

  for(let i = 0; i < 10; i++)
    sliders.push(new Slider(i));

  sortSliders();
  distributeSliders();
  assignSliderLabels();


}

function draw() {
  // put drawing code here
}

function sortSliders() {
  sliders = sliders.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
}

function assignSliderLabels() {
  let labelOffset = 10;
  for(s in sliders) {
    let label = createSpan(sliders[s].name);
    let sPos = sliders[s].getPosition();
    label.position(sPos[0], sPos[1]-labelOffset);
    label.style('white-space', 'nowrap');
  }
}

function distributeSliders() {
    for(s in sliders) {
      if(s > 0) {
        prevPos = sliders[s-1].getPosition();
        x = prevPos[0];
        y = prevPos[1] + sliderSpacing.ySpacing;
        if(y > windowHeight - 20) {
          y = sliderSpacing.baseY;
          x = x + sliderSpacing.xSpacing;
        }
      } else {
        x = sliderSpacing.baseX;
        y = sliderSpacing.baseY;
      }
      sliders[s].setPosition(x, y);
    }
}
function Slider(id, name, min, max, value, step) {
  this.id = id;
  this.name = name || 'Slider '+id;
  this.min = min || 0;
  this.max = max || 1;
  this.value = value || 0.5;
  this.step = step || 0;
  this.element;

  this.create();

  let style  = {
    width: '300px',
    height: '30px'
  };

  this.setStyle(style);

  this.onChange( () => {
    console.log("*Slider("+this.id+")"+" aka. '"+this.name+"' -> "+this.getVal());
  });
  this.onInput( () => {
    console.log("Slider("+this.id+")"+" aka. '"+this.name+"' -> "+this.getVal());
  });

}

Slider.prototype.create = function() {
  this.element = createSlider(this.min, this.max, this.value, this.step);
  //sliders.push(this.element);
  //this.index = sliders.length -1;
  return this.element;
}

Slider.prototype.setStyle = function(styleObj) {
  for (let key in styleObj)
    if (styleObj.hasOwnProperty(key))
      this.element.style(key, styleObj[key]);
}

Slider.prototype.onChange = function(callback) {
  this.element.changed(callback);
}

Slider.prototype.onInput = function(callback) {
  this.element.input(callback);
}

Slider.prototype.getVal = function() {
  return this.element.value();
}

Slider.prototype.setPosition = function(x, y) {
  this.element.position(x, y);
}

Slider.prototype.getPosition = function() {
  return [this.element.x, this.element.y];
}

Slider.prototype.getDimensions = function() {
  return [this.element.width, this.element.height];
}