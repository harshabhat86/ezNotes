Parse.initialize("kL1NFNINEGFag94CWEM6LmL7xRxPzVvAPNhAO6nZ",
	"xlKdh66kYBpTJ33FneuyDkuzlayFQ2HDGfMHgeD1");
var NoteUser = Parse.Object.extend("NoteUser");
var SEARCH_COMMAND = '/?';
var DELETE_COMMAND = '/X';
var EDIT_COMMAND = '/E';

/*
 * If space bar is clicked, we take you to enter the notes.
 */
document.onkeyup = function(e) {
	var keycode = e.keyCode || e.charCode;
	if (keycode === 32 && document.activeElement.id !== 'enterNotes') {
		
		document.getElementById('enterNotes').focus();
		setHelpText('Start Typing !! BTW, did we tell you, we support #hashtags ??');
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}else
		{
		  if (document.activeElement.id !== 'enterNotes'){
		     setHelpText('Hit the spacebar to start entering notes! That\'s the most accessible button according to us ;-)');
          }
		  else{
			if (document.activeElement.id === 'enterNotes' && document.activeElement.value=='' ){
				  setHelpText('Start Typing !! BTW, did we tell you, we support #hashtags ??');
            }
          }
		}
};



var removeElement = function(id) {
	var elem = document.getElementById(id);
	if (!elem){
		return;
    }
	
		elem.parentNode.removeChild(elem);
    
};

var NoteObject = Parse.Object.extend("NoteObject");

var loggedInUser = window.location.href.split('?loggedInUser=')[1];


var username = loggedInUser;

var user = loggedInUser;

getUser();
/*


	if (user==='undefined'||!user)
	{
	 window.location = 'http://harshabhat86.github.io/no_bs_notes/html/index.html';
	}
	else
	{
	 var logoutInfo = '<div id="logout" onclick="logout();">Logout</div>'
	 
	}

*/
function logout()
{
	user = '';
	loggedInUser = '';
	window.location = 'http://harshabhat86.github.io/no_bs_notes/html/index.html';
}
var count = 0;

var ulElem = 'stickies';
var containerDiv = 'stickyContainer';
/*ignore jslint start*/
var hashtagRegexp = '/(\S*#\[[^\]]+\])|(\S*#\S+)/gi';
/*ignore jslint end*/

String.prototype.parseHashtag = function() {
	return this.replace(/(\S*#\[[^\]]+\])|(\S*#\S+)/gi, function(t) {
		//var tag = t.replace("#", "%23");
		return t.italics();
	});
};

/*
 * while(1){ var el = document.getElementById("enterNotes"); if (el){
 * console.log("text is:"+el.value);
 * el.addEventListener("keydown",keyDownTextField , false); break; } }
 */
var NoteBook = function() {
	this.owner = null;
	this.numNotes = 0;
	this.notes = [];
};

NoteBook.prototype.init = function(owner, numNotes, allNotes) {

	this.owner = owner;
	this.numNotes = numNotes;
	this.notes = allNotes;

};

NoteBook.prototype.renderAllNotes = function() {

	removeElement('stickies');
	removeElement('NoNotesDiv');
	var ul = document.createElement('ul'),int,myDiv,note;
	ul.id = ulElem;
	if (this.numNotes===0){
		myDiv = document.createElement('div');
		myDiv.className = 'form-group has-error';
		myDiv.id = 'NoNotesDiv';
		myDiv.innerHTML = "No Notes for you!";
		
		document.getElementById(containerDiv).appendChild(myDiv);
		resetEditNote();
		return;
		
	}
    
	for ( int = 0; int < this.numNotes; int+=1) {
		note = new ANote();
		note = this.notes[int];
		ul.insertBefore(note.toHTML(), ul.firstChild);

	}

	document.getElementById(containerDiv).appendChild(ul);

	resetEditNote();
};

/*
 * Get the notes from the server .
 */
NoteBook.prototype.getNotesForUser = function() {
	this.getFromServer();
};

/*
 * Get the notes from the Parse server and render all of them on the client if
 * successful.
 * 
 */
NoteBook.prototype.getFromServer = function() {

	var retNoteQuery = new Parse.Query(NoteObject);
	retNoteQuery.equalTo("owner", this.owner);
	retNoteQuery.ascending("updatedAt");
	retNoteQuery.find(
					{
						/* We become free of Parse after this method. */
						success : function(results) {
							
							window.noteBook.notes = window.noteBook
									.parseToMyNote(results);
							window.noteBook.numNotes = results.length;
							window.noteBook.renderAllNotes();
							window.noteBook.showAllTags();

						}
					},
					{
						error : function() {
							alert("Oops!! There was some error we faced. May be you should try again in some time.");
						}
					});

};

NoteBook.prototype.parseToMyNote = function(parseArray) {

	var noteArray = [],i,pa,tnote;

	for (  i = 0; i < parseArray.length; i+=1) {
		pa = parseArray[i].attributes;
		tnote = new ANote();
		tnote.init(parseArray[i].id, pa.text, pa.title, pa.owner, pa.tags);
		noteArray.push(tnote);
	}
	return noteArray;
};

NoteBook.prototype.getNote = function(noteId) {
    var i;
	for ( i = 0; i < this.numNotes; i+=1) {
		if (this.notes[i].id === noteId){
			return this.notes[i];
        }
	}
	return '';
};


NoteBook.prototype.searchHashTag = function(searchString){
	var i,tagString;
	for (i =0;i<this.notes.length;i+=1){
		tagString = this.notes[i].getHashTag().join(',');
		if (tagString.indexOf(searchString)===-1)
			{
				
				this.hideNote(this.notes[i].id);
			}
	}
	
	
	
};



NoteBook.prototype.hideAllNotes = function(){
    var i;
	for ( i =0;i<this.notes.length;i+=1){
		
		document.getElementById(this.notes[i].id+"_li").style.display = 'none';
		
	}
};

NoteBook.prototype.showAllNotes = function(){
    var i;
	for ( i =0;i<this.notes.length;i+=1){
		
		document.getElementById(this.notes[i].id+"_li").style.display = '';
		
	}
};

NoteBook.prototype.showNote = function(noteId){
		if (document.getElementById(noteId+"_li")){
		document.getElementById(noteId+"_li").style.display = '';
        }
	
};

NoteBook.prototype.hideNote = function(noteId){
	if (document.getElementById(noteId+"_li")){
	document.getElementById(noteId+"_li").style.display = 'none';
    }

};

NoteBook.prototype.getAllTags = function(){
	var hashDict = {},i,tagArr,j;
	for (i =0;i<this.notes.length;i+=1){
		tagArr = this.notes[i].getHashTag();
		 for ( j =0;j< tagArr.length;j+=1)
			 {
			 	if (hashDict[tagArr[j]]==null)
			 		{
			 			hashDict[tagArr[j]] = 1;
			 		}
			 	else
			 		{
			 			hashDict[tagArr[j]] = hashDict[tagArr[j]]+1;
			 		}
			 	
			 }
	}
	return hashDict;

};
//Renders all hashtags in a NoteBook as a new list in a div.  
NoteBook.prototype.showAllTags = function(){
	removeElement('allHashTags');
	var div,hashDict,divContent,hashArr,hash,ht;
    div = document.createElement('div');
	hashDict = {};
	divContent = '';
	hashDict = this.getAllTags();
	hashArr = [];
	
	for ( hash in hashDict){
		
		hashArr.push(hash+" :"+hashDict[hash]);
		
		//Create a list for each Dict.
		//Will create a randomly floating elements for future freedom of arrangement of the tags.
	//	divContent+='<li id="tagList_'+hash.substring(1)+'"> '+hash+' :'+hashDict[hash]+'</li></br>';
	//	
	}
	hashArr.sort(charOrdA);
	
	for ( ht = 0;ht<hashArr.length;ht+=1)
		{
		  divContent+='<li id="tagList_'+hashArr[ht].substring(1)+'"> '+hashArr[ht]+'</li></br>';
		}
	divContent+='<li id="tagList_resetAll" class="hashtag" onclick = "window.noteBook.getFromServer();"> Reset All </li></br>';
	divContent = highlightHashTag(divContent);
	div.id = "allHashTags";
	div.innerHTML = divContent;
	document.getElementById('allTagsContainer').appendChild(div);
	
};

/** ************************************************** */

var ANote = function() {
	this.id = '';
	this.text = '';
	this.title = '';
	this.owner = '';
	this.archived = false;
	this.tags = [];

};
ANote.prototype = {};

ANote.prototype.init = function(id, text, title, owner, tags) {
	this.id = id;
	this.text = text;
	this.title = title;
	this.owner = owner;
	this.tags = tags;

};

ANote.prototype.toHTML = function() {

	var li = document.createElement('li'),hashTagLink,str;
	//The text that has hashtag will be highlighted.
	hashTagLink = highlightHashTag(this.text);
	//Changing the new lines with an HTML new line called <br> :-)
	hashTagLink = hashTagLink.replace(/\r\n|\r|\n/g,"<br />");
    str = "<a id='"
			+ this.id
			+ "' class='stickyNote' >"
			+ "<img id='"
			+ this.id
			+ "_edit' class='icon edit' src='../images/pencil.png' onclick='editNote(\""
			+ this.id
			+ "\")'  />"
			+ "<img id='"
			+ this.id
			+ "_delete' class='icon delete' src='../images/cross.png' onclick='deleteNote(\""
			+ this.id + "\")'/>" + "<p>" + hashTagLink + "</p> " + "</a>";
	li.innerHTML = str;
	li.id = this.id + "_li";

	return li;

};

ANote.prototype.update = function() {

	var parseObj = new NoteObject(),nQuery;
	nQuery = new Parse.Query(NoteObject);
	nQuery.get(	this.id,
					{
						success : function(parseObj) {
							var note = window.noteBook.getNote(parseObj.id);
							
							parseObj.set("text", note.text);
							parseObj.set("title", note.title);
							parseObj.set("owner", note.owner);
							parseObj.set("tags", note.tags);
							parseObj.save(null, {
								success : function() {
									
									window.noteBook.getFromServer();
								}
							});

						},
						error : function(parseObj, error) {
							alert('Sorry, Could not retrieve the note. Please try again later.');
						}
					});

};

ANote.prototype.destroy = function() {

	if (this.id == ''){
		return;
    }
	var parseObj = new NoteObject(),nQuery;
	nQuery = new Parse.Query(NoteObject);
	nQuery
			.get(
					this.id,
					{
						success : function(parseObj) {
							parseObj
									.destroy({
										success : function() {
											window.noteBook.getFromServer();
										},
										error : function() {
											alert('Sorry, there was some error deleting the object');
										}
									});

						},
						error : function(parseObj, error) {
							alert('Sorry, Could not retrieve the note. Please try again later.');
						}
					});

};

ANote.prototype.saveToServer = function() {

	var noteObject = new NoteObject();

	noteObject
			.save(
					{

						text : this.text,
						title : this.title,
						owner : this.owner,
						archived : this.archived,
						tags : this.tags
					},
					{
						success : function(noteObject) {

							console.log("Note Saved with ID " + noteObject.id);
							window.noteBook.getFromServer();
						},
						error : function(noteObject, error) {
							alert('The record could not be saved unfortunately. Please try again in sometime.'
									+ error);
						}

					});

};

ANote.prototype.getParseObject = function() {

	var noteObject = new NoteObject(),nQuery;
	nQuery = new Parse.Query(NoteObject);
	nQuery
			.get(
					this.id,
					{
						success : function(noteObject) {
                                return noteObject;
						},
						error : function(object, error) {
							alert('Sorry, Could not retrieve the note. Please try again later.');
						}
					});

	return noteObject;
};

ANote.prototype.getHashTag = function(){
	
	if (this.tags)
		{
			return this.tags;
		}
	return [];
};

/*
 * Temporary code. To be made solid...... or may be, we can retain this. 
 * Will think later.
 * 
 */

var noteBook = new NoteBook();
//noteBook.init(user, 0, []);
//noteBook.getFromServer();

function editNote(id) {
	var note = new ANote(),elem;
	note = noteBook.getNote(id);
	if (note == ''){
		return;
    }

	elem = document.getElementById('enterNotes');
	elem.value = note.text;
	elem.setAttribute('data-noteid', note.id);
	elem.setAttribute('data-noteediting', 'true');
	elem.focus();
}

function resetEditNote() {
	var elem = document.getElementById('enterNotes');
	elem.value = '';
	elem.setAttribute('data-noteid', '');
	elem.setAttribute('data-noteediting', 'false');
	elem.focus();
}

function deleteNote(id) {
	var note = new ANote();
	note = noteBook.getNote(id);
	if (note == ''){
		return;
    }
	note.destroy();

}
function highlightHashTag(str) {
//Return hashtag in the text as an array.
	var allTags = getHashTags(str),int,tag,spanTag;
	if (allTags !== null){
		for (  int = 0; int < allTags.length; int+=1) {

			tag = allTags[int];
			spanTag = '<span class="hashtag" onClick="searchForTag(\''+tag+'\')" >' + tag + '</span>';
			str = str.replace(tag, spanTag);
		}
    }
	return str;

}

function searchForTag(searchString){
	
	window.noteBook.showAllNotes();
	window.noteBook.searchHashTag(searchString);
	
}


function getHashTags(str) {

	if (str !== null){
		return str.match(/(\S*#\[[^\]]+\])|(\S*#\S+)/gi);
    }

}

/*
 * 
 * Get user information from PArse DB to check if the user exists in the system.
 */
function getUser(){
	
	var noteUser = new Parse.Query(NoteUser);
	noteUser.equalTo("noteUserId", window.username);
	
	noteUser.find(
			{
				/* We become free of Parse after this method. */
				success : function(results) {
					
					if (results.length ===0){
						alert("We dont see this user in the system. Please sign up and then come here.");
						 window.location = 'http://harshabhat86.github.io/no_bs_notes/html/index.html';
					}
					else
						{
						
						noteBook.init(window.user, 0, []);
						noteBook.getFromServer();
						}

				}
			},
			{
				error : function() {
					alert("Oops!! There was some error we faced. May be you should try again in some time.");
				}
			});
	
}


function keyDownTextField(e) {
	
	var elem = document.getElementById('enterNotes'),tempNoteId,tempNoteEditing,keycode,text,note,title,allTags,owner;
	tempNoteId = elem.getAttribute('data-noteid');
	tempNoteEditing = elem.getAttribute('data-noteediting');
	
	if(elem.value=='')
		{
			setHelpText('');
		}
	else
		{
			setHelpText('Press Ctrl+Enter (Ctrl+Return) to save a note!');
		}
	 keycode = e.keyCode|| e.charCode;
	
	if (e.ctrlKey===true && keycode === 13) {
		
		
			
		text = elem.value;
		
		title = elem.value.substr(0, 4) + '...';
		allTags = getHashTags(text);
		owner = user;

		if (tempNoteId == '' && tempNoteEditing == 'false') {

			note = new ANote();
			note.init('', text, title, owner, allTags);
			note.saveToServer();
			
		} else {
			note = new ANote();
			note = window.noteBook.getNote(tempNoteId);
			note.init(tempNoteId, text, title, owner, allTags);
			if (note == ''){
				return;
            }
			note.update();

		}
		
		resetEditNote();
	}

}



function charOrdA(a, b){
	a = a.toLowerCase(); 
    b = b.toLowerCase();
	if (a>b) {return 1;}
	if (a <b) { return -1;}
	return 0; }
	
function charOrdD(a, b){
	a = a.toLowerCase();
    b = b.toLowerCase();
	if (a<b){ return 1;}
	if (a >b){ return -1;}
	return 0; }

function setHelpText(text){
	document.getElementById('helpText').innerHTML  = text;
} 
document.onclick = function(e) {
	
	
	if (document.activeElement.id !== 'enterNotes')
		{
		setHelpText('Hit the spacebar to start entering notes!');
		}else
			{
			setHelpText('Start Typing !! BTW, did we tell you, we support #hashtags ??');
			}
	
};