"use strict";


/**
 * @constructor
 */
var Hypo = function() {
};

Hypo.sampleValues = [];
Hypo.mean= 0;
Hypo.sigma = 1;

Hypo.prototype.setupControls = function(){
	var self = this;
	self.sampleValues = [];
	self.mean = 0;
	self.sigma = 1;
	self.redrawCanvas();
	self.changeSamplePara();
	$("span.sampleStat").css("color","#dddddd"); 
	//$("span.sampleTest").css("color","#dddddd"); 
	//clear samples
	$('#resetSamples').click(function(){
		self.resetSamples();
	});

	
	//Set up show stat and hide stat
	$("#showStat").click(function() {
		$("span.sampleStat").css("color","#000000");
	});
	$("#hideStat").click(function() {
		$("span.sampleStat").css("color","#dddddd");      
	});

	//Set up show stat and hide Test statistics
	//$("#showTest").click(function() {
	//	$("span.sampleTest").css("color","#000000");
	//});
	//$("#hideTest").click(function() {
	//	$("span.sampleTest").css("color","#dddddd");      
	//});

	//Set up gen sample
	$('#sample1').click(function(){
		self.generateSamples(1);
	});
	$('#sample5').click(function(){
		self.generateSamples(5);
	});
	$('#sample10').click(function(){
		self.generateSamples(10);
	});
	
	//execute test
	$('#Test').click(function(){
		self.executeTest();
	});
	
	//sample para change
	$('select[name=varPara]').change(function(){
		self.changeSamplePara();
	});
	
	
	//hypothesis para change
	$('select[name=H0Para]').change(function(){
		self.resetTest();
	});
	$('select[name=H1Para]').change(function(){
		self.resetTest();
	});
	$('select[name=AlphaPara]').change(function(){
		self.resetTest();
	});
	$('select[name=VariancePara]').change(function(){
		self.resetTest();
	});
	

	//
	$('#Draw').click(function(){
		self.redrawCanvas();
	});
}

Hypo.prototype.changeSamplePara = function(){
	var varPara = parseInt($('select[name=varPara]').val());
	if(varPara === 1){
		this.mean = 0;
		this.sigma= Math.sqrt(1);
	}else if(varPara === 2){
		this.mean = 1;
		this.sigma= Math.sqrt(2);
	}else if(varPara === 3){
		this.mean = 2;
		this.sigma= Math.sqrt(3);
	}
		
};


Hypo.prototype.generateSamples= function(numberOfSamples){
	for (var i = 0; i <numberOfSamples; i++){
	var value = this.normrand();
	this.sampleValues.push(parseFloat(value.toFixed(2)));
	}
	var sampletextbox = $("#sampleValuesTextarea");
	sampletextbox.text(this.sampleValues);
	var sampleMean = StatisticsFunctions.mean(this.sampleValues).toFixed(2);
	var sampleSD = StatisticsFunctions.standardDeviation(this.sampleValues).toFixed(2);
	$("#sampleCount").html(this.sampleValues.length);
	$("#sampleMean").html(sampleMean);
	$("#sampleVar").html(sampleSD);
	this.resetTest();
};

Hypo.prototype.executeTest = function(){
	var sampleMean = StatisticsFunctions.mean(this.sampleValues).toFixed(2);
	var h0 = parseInt($('select[name=H0Para]').val());
	var h1= parseInt($('select[name=H1Para]').val());
	var alpha = parseInt($('select[name=AlphaPara]').val());
	var testVar = parseInt($('select[name=VariancePara]').val());
	var zStat = (sampleMean-h0)/Math.sqrt(testVar)*Math.sqrt(this.sampleValues.length);
	$("#z-stat").html(zStat.toFixed(2));
	
	var bound1= 0;
	var bound2= 0;
	if (h1 === 0){
	$("#testTail").html("Two-tailed Test");
		if( alpha === 1){
			bound1= -1.64485;
			bound2=  1.64485;
		}else if( alpha === 2){
			bound1= -1.95996;
			bound2=  1.95996;
		}else if( alpha === 3){
			bound1= -2.57583;
			bound2=  2.57583;
		}
		if(zStat<bound1 || zStat>bound2){
			$("#testResult").html("We reject null hypothesis at the given significant level.");
		}else{
			$("#testResult").html("We cannot reject null hypothesis");
		}
	}else if(h1 === 1) {
		$("#testTail").html("One-tailed Test");
		if( alpha === 1){
			bound1= 1.28155;
		}else if( alpha === 2){
			bound1= 1.64485;
		}else if( alpha === 3){
			bound1= 2.32635;
		}
		if(zStat > bound1){
			$("#testResult").html("We reject null hypothesis at the given significant level.");
		}else{
			$("#testResult").html("We cannot reject null hypothesis");
		}
	}else if (h1 === 2) {
		$("#testTail").html("One-tailed Test");
		if( alpha === 1){
			bound1= -1.28155;
		}else if( alpha === 2){
			bound1= -1.64485;
		}else if( alpha === 3){
			bound1= -2.32635;
		}
		if(zStat < bound1){
			$("#testResult").html("We reject null hypothesis at the given significant level.");
		}else{
			$("#testResult").html("We cannot reject null hypothesis");
		}	
	}
	
//	$('#b1').html(bound1);
//	$('#b2').html(bound2);


	var mydraw= parseInt(zStat*50+155);
	var mycanvas = document.getElementById('testCanvas');
	var mycontext = mycanvas.getContext('2d');
	mycontext.fillText(zStat.toFixed(2),mydraw-8,138);	
	mycontext.beginPath();
	mycontext.font="10px Arial";	
	mycontext.moveTo(mydraw,0);
	mycontext.lineTo(mydraw,130);
	mycontext.strokeStyle = '#00FF00';
	mycontext.stroke();
};


Hypo.prototype.resetSamples = function(){
	var sampletextbox = $("#sampleValuesTextarea");
	sampletextbox.text("");
	this.sampleValues = [];
	$("#sampleCount").html("");
	$("#sampleMean").html("");
	$("#sampleVar").html("");
	this.resetTest();
};

Hypo.prototype.resetTest = function(){
	$("#z-stat").html("");
	$("#testTail").html("");
	$("#testResult").html("");
	this.redrawCanvas();
};

Hypo.prototype.redrawCanvas= function(){
	var mycanvas = document.getElementById('testCanvas');
	var mycontext = mycanvas.getContext('2d');
	mycontext.clearRect(0, 0, mycanvas.width, mycanvas.height);
	mycontext.beginPath();
	var h0 = parseInt($('select[name=H0Para]').val());
	var h1= parseInt($('select[name=H1Para]').val());
	var alpha = parseInt($('select[name=AlphaPara]').val());
	mycontext.font="10px Arial";

	mycontext.fillText("0",152,138);
	
	if(h1 === 0 && alpha === 1){
		mycontext.moveTo(73,0);
		mycontext.lineTo(73,130);
		mycontext.moveTo(237,0);
		mycontext.lineTo(237,130);
		mycontext.strokeStyle = '#0000FF';
		mycontext.stroke();
		mycontext.fillText(-1.64,65,138);	
		mycontext.fillText(1.64,229,138);	
	}else if(h1 === 0 && alpha === 2){
		mycontext.moveTo(57,0);
		mycontext.lineTo(57,130);
		mycontext.moveTo(253,0);
		mycontext.lineTo(253,130);
		mycontext.strokeStyle = '#0000FF';
		mycontext.stroke();
		mycontext.fillText(-1.96,49,138);	
		mycontext.fillText(1.96,245,138);	
	}else if(h1 === 0 && alpha === 3){
		mycontext.moveTo(26,0);
		mycontext.lineTo(26,130);
		mycontext.moveTo(283,0);
		mycontext.lineTo(283,130);
		mycontext.strokeStyle = '#0000FF';
		mycontext.stroke();
		mycontext.fillText(-2.58,18,138);	
		mycontext.fillText(2.58,275,138);	
	}else if(h1 === 1 && alpha === 1){
		mycontext.moveTo(219,0);
		mycontext.lineTo(219,130);
		mycontext.strokeStyle = '#0000FF';
		mycontext.stroke();
		mycontext.fillText((1.28).toFixed(2),211,138);	
	}else if(h1 === 1 && alpha === 2){
		mycontext.moveTo(237,0);
		mycontext.lineTo(237,130);
		mycontext.strokeStyle = '#0000FF';
		mycontext.stroke();
		mycontext.fillText((1.64).toFixed(2),229,138);		
	}else if(h1 === 1 && alpha === 3){
		mycontext.moveTo(271,0);
		mycontext.lineTo(271,130);
		mycontext.strokeStyle = '#0000FF';
		mycontext.stroke();
		mycontext.fillText((2.33).toFixed(2),263,138);	
	}else if(h1 === 2 && alpha === 1){
		mycontext.moveTo(91,0);
		mycontext.lineTo(91,130);
		mycontext.strokeStyle = '#0000FF';
		mycontext.stroke();
		mycontext.fillText((-1.28).toFixed(2),83,138);	
	}else if(h1 === 2 && alpha === 2){
		mycontext.moveTo(73,0);
		mycontext.lineTo(73,130);
		mycontext.strokeStyle = '#0000FF';
		mycontext.stroke();
		mycontext.fillText((-1.64).toFixed(2),65,138);		
	}else if(h1 === 2 && alpha === 3){
		mycontext.moveTo(39,0);
		mycontext.lineTo(39,130);
		mycontext.strokeStyle = '#0000FF';
		mycontext.stroke();
		mycontext.fillText((-2.33).toFixed(2),31,138);	
	}


};

Hypo.prototype.normrand= function(){
	return this.normsrand()*this.sigma+this.mean;
};


Hypo.prototype.normsrand= function(){
	return Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()-6
};
