var View = require('./View');
var popup = require('../popup');
var sanitise = require('../utils').sanitise;
var jsonData = require('../site-data.json');

class ProjectView extends View {
	
	constructor(className, models){
		super(className, models);
		
		//this.exampleChanged = false;
		this.on('example-changed', () => this.exampleChanged = true );
	}

	// UI events
	selectChanged($element, e){
	
		if (this.exampleChanged){
			this.exampleChanged = false;
			popup.exampleChanged( () => {
				this.emit('message', 'project-event', {func: $element.data().func, currentProject: $element.val()});
			}, undefined, 0, () => {
				$element.find('option').filter(':selected').attr('selected', '');
				$element.val($('#projects > option:first').val());
				this.exampleChanged = true;
			});
			return;
		}

		this.emit('message', 'project-event', {func: $element.data().func, currentProject: $element.val()})
		
	}
	buttonClicked($element, e){
		var func = $element.data().func;
		if (func && this[func]){
			this[func](func);
		}
	}
	
	newProject(func){

		if (this.exampleChanged){
			this.exampleChanged = false;
			popup.exampleChanged(this.newProject.bind(this), func, 500, () => this.exampleChanged = true );
			return;
		}
				
		// build the popup content
		popup.title(jsonData.popups.create_project.title);
		popup.subtitle(jsonData.popups.create_project.text);
		
		var form = [];
		form.push('<input id="popup-C" type="radio" name="project-type" data-type="C" checked>');
		form.push('<label for="popup-C">C++</label>')
		form.push('</br>');
		form.push('<input id="popup-PD" type="radio" name="project-type" data-type="PD">');
		form.push('<label for="popup-PD">Pure Data</label>')
		form.push('</br>');
		form.push('<input id="popup-SC" type="radio" name="project-type" data-type="SC">');
		form.push('<label for="popup-SC">SuperCollider</label>')
		form.push('</br>');
		form.push('<input type="text" placeholder="Enter your project name">');
		form.push('</br>');

		// Buttons:
		form.push('<button type="submit" class="button popup ' + jsonData.buttons.create_project.class_name + '">' + jsonData.buttons.create_project.button_text + '</button>');
		form.push('<button type="button" class="button popup ' + jsonData.buttons.cancel.class_name + '">' + jsonData.buttons.cancel.button_text + '</button>');
		
		// popup.subtitle(jsonData.popups.create_project.text);

		popup.form.append(form.join('')).off('submit').on('submit', e => {
			e.preventDefault();
			this.emit('message', 'project-event', {
				func, 
				newProject	: sanitise(popup.find('input[type=text]').val()),
				projectType	: popup.find('input[type=radio]:checked').data('type')
			});
			popup.hide();
		});

		// Hide popup when cancel button is clicked:
		popup.find('.' + jsonData.buttons.cancel.class_name).on('click', popup.hide );
		
		popup.show();

	}
	saveAs(func){
	
		// build the popup content
		popup.title(jsonData.popups.save_as.title);
		popup.subtitle(jsonData.popups.save_as.text);
		
		var form = [];
		form.push('<input type="text" placeholder="' + jsonData.popups.save_as.input_text + '">');
		form.push('</br >');
		form.push('<button type="submit" class="button popup ' + jsonData.buttons.save.class_name + '">' + jsonData.buttons.save.button_text + '</button>');
		form.push('<button type="button" class="button popup ' + jsonData.buttons.cancel.class_name + '">' + jsonData.buttons.cancel.button_text + '</button>');
		
		popup.form.append(form.join('')).off('submit').on('submit', e => {
			e.preventDefault();
			this.emit('message', 'project-event', {func, newProject: sanitise(popup.find('input[type=text]').val())});
			popup.hide();
		});
		
		// Hide popup when cencel button is clicked: 
		popup.find('.' + jsonData.buttons.cancel.class_name).on('click', popup.hide );
		
		popup.show();

	}
	deleteProject(func){

		// build the popup content
		popup.title(jsonData.popups.delete_project.title);
		popup.subtitle(jsonData.popups.delete_project.text);
		
		var form = [];
		form.push('<button type="submit" class="button popup ' + jsonData.buttons.confirm_delete.class_name + '">' + jsonData.buttons.confirm_delete.button_text + '</button>');
		form.push('<button type="button" class="button popup ' + jsonData.buttons.cancel.class_name + '">' + jsonData.buttons.cancel.button_text + '</button>');
		
		popup.form.append(form.join('')).off('submit').on('submit', e => {
			e.preventDefault();
			this.emit('message', 'project-event', {func});
			popup.hide();
		});
		
		popup.find('.'+jsonData.buttons.cancel.class_name).on('click', popup.hide );
		
		popup.show();
		
		popup.find('.'+jsonData.buttons.confirm_delete.class_name).trigger('focus');
		
	}
	cleanProject(func){
		this.emit('message', 'project-event', {func});
	}
	
	// model events
	_projectList(projects, data){

		var $projects = $('#projects');
		$projects.empty();
		
		// add an empty option to menu and select it
		var opt = $('<option></option>').attr({'value': '', 'selected': 'selected'}).html('--Projects--').appendTo($projects);

		// fill project menu with projects
		for (let i=0; i<projects.length; i++){
			if (projects[i] && projects[i] !== 'undefined' && projects[i] !== 'exampleTempProject' && projects[i][0] !== '.'){
				var opt = $('<option></option>').attr('value', projects[i]).html(projects[i]).appendTo($projects);
			}
		}
		
		if (data && data.currentProject) this._currentProject(data.currentProject);
		
	}
	_exampleList(examplesDir){

		var $examples = $('#examples');
		$examples.empty();

		if (!examplesDir.length) return;

		for (let item of examplesDir){
			let ul = $('<ul></ul>').html(item.name+':');
			for (let child of item.children){
				if (child && child.length && child[0] === '.') continue;
				$('<li></li>').addClass('sourceFile').html(child).appendTo(ul)
					.on('click', (e) => {

						if (this.exampleChanged){
							this.exampleChanged = false;
							popup.exampleChanged( () => {
								this.emit('message', 'project-event', {
									func: 'openExample',
									currentProject: item.name+'/'+child
								});
								$('.selectedExample').removeClass('selectedExample');
								$(e.target).addClass('selectedExample');
							}, undefined, 0, () => this.exampleChanged = true );
							return;
						}
							
						this.emit('message', 'project-event', {
							func: 'openExample',
							currentProject: item.name+'/'+child
						});
						$('.selectedExample').removeClass('selectedExample');
						$(e.target).addClass('selectedExample');
						
					});
			}
			ul.appendTo($examples);
		}
		
	}
	_currentProject(project){
	
		// unselect currently selected project
		$('#projects').find('option').filter(':selected').attr('selected', '');
		
		if (project === 'exampleTempProject'){
			// select no project
			$('#projects').val($('#projects > option:first').val());
		} else {
			// select new project
			//$('#projects option[value="'+project+'"]').attr('selected', 'selected');
			$('#projects').val($('#projects > option[value="'+project+'"]').val());
			// unselect currently selected example
			$('.selectedExample').removeClass('selectedExample');
		}
		
		// set download link
		$('#downloadLink').attr('href', '/download?project='+project);
		
	}
	
	__currentProject(){
		this.exampleChanged = false;
	}
	
	subDirs(dir){
		var ul = $('<ul></ul>').html(dir.name+':');
		for (let child of dir.children){
			if (!child.dir)
				$('<li></li>').addClass('sourceFile').html(child.name).data('file', (dir.dirPath || dir.name)+'/'+child.name).appendTo(ul);
			else {
				child.dirPath = (dir.dirPath || dir.name) + '/' + child.name;
				ul.append(this.subDirs(child));
			}
		}
		return ul;
	}
	
}

module.exports = ProjectView;

