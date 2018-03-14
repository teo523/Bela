var overlay	= $('#overlay');
var parent	= $('#popup');
var content	= $('#popup-content');
var titleEl	= parent.find('h1');
var subEl	= parent.find('p');
var formEl	= parent.find('form');

var jsonData = require('./site-data.json');


var popup = {
	
	show(){
		overlay.addClass('active');
		parent.addClass('active');
		content.find('input[type=text]').first().trigger('focus');
	},
	
	hide(keepOverlay){
		if (keepOverlay !== 'keep overlay') overlay.removeClass('active');
		parent.removeClass('active');
		titleEl.empty();
		subEl.empty();
		formEl.empty();
	},
	
	overlay(){
		overlay.toggleClass('active');
	},
	
	find: selector => content.find(selector),
	
	title: text => titleEl.text(text),
	subtitle: text => subEl.text(text),
	formEl: html => formEl.html(html),
	
	append: child => content.append(child),
	
	form: formEl,
	
	exampleChanged: example
	
};

module.exports = popup;

function example(cb, arg, delay, cancelCb){

	// build the popup content

	// The text is included from an external JSON file for easy editing.
	popup.title(jsonData.popups.exampleChanged.title);
	popup.subtitle(jsonData.popups.exampleChanged.text);
	// popup.subtitle('You have made changes to an example project. If you continue, your changes will be lost. To keep your changes, click cancel and then Save As in the project manager tab');
	
	var form = [];

	// Here we want to pull the class names and button text from the JSON file.
	form.push('<button type="submit" class="button popup ' + jsonData.buttons.save_changes.class_name + '">' + jsonData.buttons.save_changes.button_text + '</button>');
	form.push('<button type="button" class="button popup ' + jsonData.buttons.cancel.class_name + '">'+ jsonData.buttons.cancel.button_text + '</button>');
	
	popup.form.append(form.join('')).off('submit').on('submit', e => {
		e.preventDefault();
		setTimeout(function(){
			cb(arg);
		}, delay);
		popup.hide();
	});
		
	popup.find('.popup-cancel').on('click', () => {
		popup.hide();
		if (cancelCb) cancelCb();
	});
	
	popup.show();
	
	popup.find('.popup-continue').trigger('focus');
	
}