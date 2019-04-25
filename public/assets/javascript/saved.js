$(document).ready(function(){
  var articleContainer = $('.article-container');
  $(document).on('click', '.btn.delete', handleArticleDelete);
  $(document).on('click', '.btn.notes', handleArticleNotes);
  $(document).on('click', '.btn.save', handleArticleSave);
  $(document).on('click', '.btn.notes-delete', handleArticleDelete);

  initPage();

  function initPage(){
    articleContainer.empty();
    $.get('/api/headlines?saved=true')
      .then(function(data){
        if (data && data.length) {
          renderArticles(data);
        }
        else{
          renderEmpty();
        }
      });
  }
  function renderArticles(articles){
    var articlePanels = [];
    for (var i; i < articles.length; i++){
      articlePanels.push(createPanel(articles[i]));
    }
    articleContainer.append(articlePanels);
  }
  function createPanel(article){
    var panel = 
    $(["<div class= 'panel panel-default'>",
  "<div class = 'panel-heading'>",
  "<h3>",
  article.headline,
  "<a class = 'btn btn-danger delete'>",
  "Delete them",
  "</a>",
  "<a class = 'btn btn-info notes'Article Notes</a>",
  "</h3>",
  "</div>",
  "<div class = 'panel-body'>",
  article.summary,
  "</div>",
  "</div>"
].join(""));
panel.data("_id", article._id);
return panel;
  }
  function renderNotesList(){
    var notesToRender = []
    var curretnNote;
    if(!data.notes.length){
      curretnNote = [
        "<li class = 'list-group-item'>",
        "no notes for this one",
        "</li>"
      ].join("");
      notesToRender.push(curretnNote)
    }
    else{
      for (var i = 0; i < data.notes.length; i++){
        curretnNote = $([
          "<li class = 'list-group-item note'>",
          data.notes[i].noteText,
          "<button class = 'btn btn-danger note-delete'>x</button>",
          "</li>"
        ].join(""));
        curretnNote.children('button').data('_id', data.notes[i]._id);
        notesToRender.push(curretnNote);
      }
    }
    $('.note-container').append(notesToRender)
  }
  function handleArticleDelete(){
    var articleToDelete = $(this).parents('panel').data();
    $.ajax({
      method: 'DELETE',
      url: '/api/headlines/' + articleToDelete._id
    })
    .then(function(data){
      if(data.ok){
        initPage();
      }
    })
  }
  function handleArticleNotes(){
    $.get('/api/notes/' + currentArticle._id).then(function(data){
      var modalText = [
        "<div class = 'container-fluid text-center'>",
        "<h4>Ntes for articles</h4>",
        currentArticle._id,
        "</h4>",
        "<hr />",
        "<ul class = 'list-group note-container'>",
        "</ul>",
        "<textarea placeholder = 'new note' rows = '4' cols= '60'></textarea>",
        "<button class = 'btn btn-success save'>Save Notes</button>",
        "</div>"
      ].join("");
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      $('btn.save').data('article', noteData);
      renderNotesList(noteData);
    })
  }
  function handleNoteSave(){
    var noteData;
    var newNote = $('.bootbox-body textarea').val().trim();
    if (newNote){
      noteData = {
        _id: $(this).data('article')._id,
        noteText: newNote
      };
      $.post('/api/notes', noteData).then(function(){
        bootbox.hideAll();
      })
    }
  }
  function handleNoteDelete(){
    var noteToDelete = $(this).data('_id');
    $ajax({
      url: '/api/notes/' + noteToDelete,
      method: 'DELETE'
    }) .then(function(){
bootbox.hideAll();
    })
  }
})