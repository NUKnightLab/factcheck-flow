function getDB() {
  var secret = "mmJQ3xla2pNpgxCulhvIqyTXktWcEOCgxXgFYoEh"
  var database = FirebaseApp.getDatabaseByUrl("https://factflow-abe6a.firebaseio.com/", secret);
  return database;
}

//Based on what the user has selected, writes a new, default fact to the database
function writeNewFactData(highlighterId) {
  var secret = "mmJQ3xla2pNpgxCulhvIqyTXktWcEOCgxXgFYoEh"
  var database = FirebaseApp.getDatabaseByUrl("https://factflow-abe6a.firebaseio.com/", secret);

  const doc = DocumentApp.getActiveDocument();
  const range = doc.getSelection();
  var elements = range.getRangeElements();
  var text = "";
  text = getSelectedText();
   var data = {"fact-text" : text.selectedText,
              "highlighter-id" : highlighterId,
               "text-range-start" : text.startOffset, //saves position relative to paragraph, not whole document - FIX THIS LATER
               "text-range-end" : text.endOffset};
  database.pushData("Document1/facts", data);
}


function updateFact(assignTo, createdBy, status, source, recommendedFix, uniqueId){
  //WHERE WE LEFT OFF - PASS OTHER PARAMS TO FIREBASE - AND ADD STARRED PARAM?
  //save fact data to firebase
  var text = "";

  var data = {"source" : source,
               "recommended-fix" : recommendedFix,
               "status" : status,
               "assign-to": assignTo,
               "created-by" : createdBy};

  var db = getDB();
  db.updateData("Document1/facts/" + uniqueId, data);
  db.removeData("Document1/current-fact");

  //update UI
  showHomeSidebar();
}


/* Called when you click on "Jump To Fact */
function findFactInDb(val) {
  var cursor =  DocumentApp.getActiveDocument().getCursor();
  var offset = cursor.getOffset();
  var resultFact = searchDbForFact(offset); //resultFact = [factUniqueId, factObj]

  //store current fact in database so we can get it later once we update HTML
    if (resultFact == null || resultFact.length == 0) {
     const ui = DocumentApp.getUi();
     ui.alert('Oops! Could not jump to fact.', 'No fact found at that spot.', ui.ButtonSet.OK);
  }
  else{
    getDB().updateData("Document1/current-fact", resultFact[1]);
    getDB().updateData("Document1/current-fact", {"unique-id": resultFact[0]});

    changeScreenToFactDetailHtml()
  }
}


function searchDbForFact(cursorPos){
  var data = getDB().getData("Document1/facts");

  var start = -1;
  var end = -1;
  var factObj = null;
  var factUniqueId = null;

    for (var [key,value] in data) {
      start = value['text-range-start'];
      end = value['text-range-end'];
       if (start <= cursorPos && end >= cursorPos) {
         factUniqueId = key;
         factObj = data[key];
        }
    }
  if(factUniqueId && factObj){
    return [factUniqueId, factObj];
  }
  return null;
}

  function retrieveCurrentFactFromDb(){
       return getDB().getData("Document1/current-fact");
  }

 function deleteFact(uniqueId){
   var db = getDB();
   db.removeData("Document1/facts/" + uniqueId);
   db.removeData("Document1/current-fact");

   showHomeSidebar();
 }

function getFactsFromDB(){
   return getDB().getData("Document1/facts");
}
