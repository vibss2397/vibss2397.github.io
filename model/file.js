import {MnistData} from './data.js';
import {InitThis, clearArea} from './svg.js';
function drawLine(line, div1, div2){
var x1 = div1.offset().left + (div1.width()/2);
var y1 = div1.offset().top + (div1.height()/2);
var x2 = div2.offset().left + (div2.width()/2);
var y2 = div2.offset().top + (div2.height()/2);
var model = null;

window.ca = function ca(){
    clearArea();
}
line.attr('x1',x1).attr('y1',y1).attr('x2',x2).attr('y2',y2);
}
function drawLines(){
    $('#svg').html('<line id="line" stroke-dasharray="8 2" />');
    drawLine($('#line'), $('.data-card'), $('.card-1'));
    let counter = 1;
    for(let i = 2;i<=$('.nb-layers').children();i++){
        $('#svgContainer').append('<svg id="svg'+i+'"><line id="line'+i+'" stroke-dasharray="8 2" /></svg>');
        drawLine($('#line'+i), $('.card-'+counter), $('.card-'+i));
        counter+=1;
    };
    $('#svg').append('<svg id="svg'+counter+'"><line id="line'+counter+'" stroke-dasharray="8 2" /></svg>');
    drawLine($('#line1'), $('.card-1'), $('.output-card'));
}
$(document).ready(function(){
    drawLines();
    // test_start();

})
window.change_layers = function change_layers(sign){
    drawLines();
    if(sign=='+'){
        let val = parseInt($('.nb-layers-number').text(), 10);
        if(val<4){
            val += 1;
            $('.nb-layers-number').text(val);
            let children = $('.nb-layers').children();
            let leng = children.length;
            leng+=1;
            $('.nb-layers').append('<div class="card card-'+leng+'" style="width:20%;margin-left:4%;">'+
                                    '<div class="card-body">'+
                                    '<h6 class="card-title">Neurons : </h6><hr>'+
                                    '<div style="display: inline-block;"><button class="btn-layers export" onclick="change_neurons(1, '+leng+')">+</button></div>'+
                                    '<div style="display: inline-block;"><button class="btn-layers export" onclick="change_neurons(0, '+leng+')">-</button></div>'+
                                    '<div style="display: inline-block;margin-left:30%">'+
                                    '<div class="row">'+
                                        '<div class="col">'+
                                        '<input type="text" class="form-control nb-neurons-'+leng+' export-1" value="64"></input>'+
                                    '</div></div>'+
                                    '</div>'+
                                    '<small class="text-muted" style="margin-left: 1em;">hl-'+leng+'</small>'+
                                    '</div>')

        }
    }
    else if(sign=='-'){
        let val = parseInt($('.nb-layers-number').text(), 10);
        if(val>1){
            console.log(val);
            val -= 1;
            $('.nb-layers-number').text(val);
            let children = $('.nb-layers').children();
            let leng = children.length;
            $('.card-'+leng).remove();
        }
    }
}

window.change_neurons = function change_neurons(sign, layer_nb){
    if(sign==1){
        let val = parseInt($('.nb-neurons-'+layer_nb).val(), 10);
        val += 1;
        $('.nb-neurons-'+layer_nb).val(val);
    }
    else if(sign==0){
        let val = parseInt($('.nb-neurons-'+layer_nb).val(), 10);
        if(val>1){
            console.log(val);
            val -= 1;
            $('.nb-neurons-'+layer_nb).val(val);
        }
    }
}

async function showExamples(data) {
    // Create a container in the visor
    const surface =
      tfvis.visor().surface({ name: 'Input Data Examples', tab: 'Input Data'});  
  
    // Get the examples
    const examples = data.nextTestBatch(20);
    const numExamples = examples.xs.shape[0];
    
    // Create a canvas element to render each example
    for (let i = 0; i < numExamples; i++) {
      const imageTensor = tf.tidy(() => {
        // Reshape the image to 28x28 px
        let a= examples.xs
          .slice([i, 0], [1, examples.xs.shape[1]])
          .reshape([28, 28, 1]);
        console.log(a);
        return a;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = 28;
      canvas.height = 28;
      canvas.style = 'margin: 4px;';
      await tf.browser.toPixels(imageTensor, canvas);
      surface.drawArea.appendChild(canvas);
  
      imageTensor.dispose();
    }
  }
  function getModel(lr, activation, nb_layers, nb_neurons) {
    const model = tf.sequential();
    
    const IMAGE_SIZE = 28*28;
    const IMAGE_CHANNELS = 1;  
    for(let i=0;i<nb_layers;i++){
        if(i==0){
            model.add(tf.layers.dense({units: nb_neurons[i], activation: activation, inputShape: [IMAGE_SIZE]}));
        }
        else{
            model.add(tf.layers.dense({units: nb_neurons[i], activation: activation}));
        }
    }
    // Our last layer is a dense layer which has 10 output units, one for each
    // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9).
    const NUM_OUTPUT_CLASSES = 10;
    model.add(tf.layers.dense({
      units: NUM_OUTPUT_CLASSES,
      kernelInitializer: 'varianceScaling',
      activation: 'softmax'
    }));
  
    
    // Choose an optimizer, loss function and accuracy metric,
    // then compile and return the model
    const optimizer = tf.train.adam(lr);
    model.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
  
    return model;
  }
  
  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',
  
      // The data for our dataset
      data: {
          labels: [],
          datasets: [{
              data: [],
              pointRadius: 0,  
              backgroundColor: 'rgba(255, 99, 132, 0)',
              borderColor: 'rgba(255, 99, 132, 0.5)'
          },
          {
            data: [],
            pointRadius: 0,  
            backgroundColor: 'rgba(54, 162, 235, 0)',
            borderColor: 'rgba(54, 162, 235, 0.5)'
        }
        ]
      },
  
      // Configuration options go here
      options: {legend: false,
        scales: {
        xAxes: [{
            gridLines: {
                display:false
            }
        }],
        yAxes: [{
            ticks:{suggestedMin:0},
            gridLines: {
                display:false
            }   
        }]
    }}
  });
  chart.canvas.parentNode.style.height = '80px';
  chart.canvas.parentNode.style.width = '80px';

function enableThings(){
  $('.lr-select').prop('disabled', false);
    $('.activation-select').prop('disabled', false);
    $('.batch-select').prop('disabled', false);
    let nb_layers = parseInt($('.nb-layers-number').html(), 10);
    $('.epochs-val').prop('disabled', false);
    console.log(nb_layers);;
    for(let i=1;i<=nb_layers;i++){
       
        $('.nb-neurons-'+i).prop('disabled', false);
    }
    $('.exp1').attr('onclick', 'downloadModel()');
    $('.exp1').removeClass('export2');
    $('.exp1').addClass('export');
}
async function train(batch_size, epo, model, data) {
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    // const container = {
    //   name: 'Model Training', styles: { height: '1000px' }
    // };
    // const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);
    
    const BATCH_SIZE = batch_size;
    const TRAIN_DATA_SIZE = 10000;
    const TEST_DATA_SIZE = 1000;
    // let epochs = epochs;
    console.log(epo);
    const [trainXs, trainYs] = tf.tidy(() => {
      const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
      return [
        d.xs.reshape([TRAIN_DATA_SIZE, 784]),
        d.labels
      ];
    });
  
    const [testXs, testYs] = tf.tidy(() => {
      const d = data.nextTestBatch(TEST_DATA_SIZE);
      return [
        d.xs.reshape([TEST_DATA_SIZE, 784]),
        d.labels
      ];
    });
    function onEpochEnd(epoch_nb, logs) {
      let val = parseInt($('.epochs-val').val())
      $('#status-text').html('Epoch '+parseInt(epoch_nb+1, 10) + '/'+val+'...');
        let loss = Math.round(parseFloat(logs.loss)*1000)/1000;
        let val_loss = Math.round(parseFloat(logs.val_loss)*1000)/1000;
        let temp = '<h6>Output: </h6><small class="text-muted">loss:'+loss+'</small><br><small class="text-muted">test loss:'+val_loss+'</small>'
        $('.metrics').html(temp);
        chart.data.datasets[0].data.push(loss);
        chart.data.datasets[1].data.push(val_loss);
        chart.data.labels.push(epoch_nb);
        chart.update();
        // $('.epochs-val').val(epoch_nb+1)
      }
      
      
    return model.fit(trainXs, trainYs, {
      batchSize: BATCH_SIZE,
      validationData: [testXs, testYs],
      epochs: epo,
      shuffle: true,
      callbacks: {onEpochEnd}
    }).then(info=>{
        console.log('Final accuracy', info.history.acc);
        enableThings();
        test_start();
    });
  }
  function scaleImageData(imageData, scale){
    var newCanvas = $("<canvas>")
      .attr("width", imageData.width)
      .attr("height", imageData.height)[0];

    newCanvas.getContext("2d").putImageData(imageData, 0, 0);

    // Second canvas, for scaling
    var scaleCanvas = $("<canvas>")
      .attr("width", canvas.width)
      .attr("height", canvas.height)[0];

    var scaleCtx = scaleCanvas.getContext("2d");

    scaleCtx.scale(scale, scale);
    scaleCtx.drawImage(newCanvas, 0, 0);

    var scaledImageData =  scaleCtx.getImageData(0, 0, scaleCanvas.width, scaleCanvas.height);

    return scaledImageData;
}
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}
  window.downloadModel = async function download(){
    await window.model.save('downloads://my-model');
  }
  window.predict = function predict(){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    let dat = ctx.getImageData(0,0,c.width,c.height);
    // var c1 = document.getElementById("myCanvas2");
    // c1.getContext('2d').putImageData(dat, 0, 0);
    let temp = tf.browser.fromPixels(dat);
    // temp.print();
    let temp_new = tf.image.resizeBilinear(temp, [28, 28]);
    // tf.browser.toPixels(temp_new, c1);
    temp_new= temp_new.mean(2).reshape([1, 784]);
    let prediction = window.model.predict(temp_new);
    prediction = prediction.arraySync();
    console.log(prediction);
    const indexOfMaxValue = indexOfMax(prediction[0]);
    console.log(indexOfMaxValue)
    $('.result').html(indexOfMaxValue);

  }
function test_start(){
    $('.result-screen').html('<canvas id="myCanvas" width="140" height="140" style="border:2px solid black"></canvas><br /><br />'+
    '<button class="btn export" style="margin-right: 10%;" onclick="javascript:predict();">Predict</button>'+
    '<button class="btn export" onclick="javascript:ca();return false;">Clear Area</button>'+
    '<hr><div class="result"></div>')
    InitThis();
}
  
window.start_train =async function start_train(){
    var ele = document.getElementsByTagName("line")
    for(let i=0;i<ele.length;i++){
       ele[i].classList.add('lin')
    };
    $('#status-text').html('Loading Data...');
    const data = new MnistData();
    await data.load();
    let lr = parseFloat($('.lr-select').val());
    let activation = $('.activation-select').val();
    let batch = parseInt($('.batch-select').val(),10);
    let nb_layers = parseInt($('.nb-layers-number').html(), 10);
    let nb_epochs = parseInt($('.epochs-val').val(), 10);

    $('.lr-select').prop('disabled', true);
    $('.activation-select').prop('disabled', true);
    $('.batch-select').prop('disabled', true);
    $('.nb-layers-number').prop('disabled', true);
    $('.epochs-val').prop('disabled', true);
    let nb_neurons = [];
    for(let i=1;i<=nb_layers;i++){
        nb_neurons.push(parseInt($('.nb-neurons-'+i).val(), 10));
        $('.nb-neurons-'+i).prop('disabled', true);
    }
    console.log(lr+activation+nb_layers+nb_neurons);
    $('#status-text').html('Preparing Model....')
    window.model = getModel(lr, activation,nb_layers,nb_neurons);
    // tfvis.show.modelSummary({name: 'Model Architecture'}, model);
    $('#status-text').html('Starting Training...')
    await train(batch, nb_epochs, window.model, data);
}

