/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 */

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */


//
function getSelectedText() {
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();
  var ui = DocumentApp.getUi();

  var elements = selection.getSelectedElements();
  var endOffset;
  var startOffset;
  if (elements.length > 1) {}
  else {
    var element = elements[0].getElement();
    startOffset = elements[0].getStartOffset();      // -1 if whole element
    endOffset = elements[0].getEndOffsetInclusive(); // -1 if whole element
    var selectedText = element.asText().getText();       // All text from element
    // Is only part of the element selected?
    if (elements[0].isPartial())
        selectedText = selectedText.substring(startOffset,endOffset+1);

      // Google Doc UI "word selection" (double click)
      // selects trailing spaces - trim them
      selectedText = selectedText.trim();
      endOffset = startOffset + selectedText.length - 1;

      // Now ready to hand off to format, setLinkUrl, etc.


      //report += " and is " + (elements[0].isPartial() ? "part" : "all") + " of the paragraph."
    }
  var obj = {selectedText: selectedText, endOffset: endOffset, startOffset: startOffset}
  return obj;
}

function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Start', 'showHomeSidebar')
      .addToUi();
}

/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showHomeSidebar() {
  var home = HtmlService.createHtmlOutputFromFile('Home')
      .setTitle('Fact Flow');
  DocumentApp.getUi().showSidebar(home);
}


function showFactDetailSidebar(fact){
  var factDetail = HtmlService.createHtmlOutputFromFile('FactDetail')
       .setTitle('Fact Flow');
  DocumentApp.getUi().showSidebar(factDetail);
  return fact;
}

/**
function showHighlighterLibraryDialog() {
  const dialogTemplate = HtmlService.createTemplateFromFile('LibraryDialog');
  const dialog = dialogTemplate.evaluate();
  dialog.setWidth(450)
    .setHeight(600);
  DocumentApp.getUi()
    .showModalDialog(dialog, 'Highlighter Library');
}
*/

function highlightSelection(color){
  const doc = DocumentApp.getActiveDocument();
  const range = doc.getSelection();
  //if the user has selected a range of text
  if (range) {
    const rangeElements =range.getRangeElements();
    rangeElements.forEach(function (rangeElement) {
      if (rangeElement.isPartial()) {
        rangeElement.getElement().asText().setBackgroundColor(rangeElement.getStartOffset(),
                                                              rangeElement.getEndOffsetInclusive(),
                                                              color);}
      else {
        rangeElement.getElement().asText().setBackgroundColor(color);
      }});}
  else {
    showRequireSelectionError();
  }
}

function showRequireSelectionError() {
  const ui = DocumentApp.getUi();
  ui.alert('No text selected', 'Please try again and select some text before clicking a highlighter.', ui.ButtonSet.OK);
}

function changeScreenToFactDetailHtml(){
  var factDetail = HtmlService.createHtmlOutputFromFile('FactDetail').setTitle('Fact Flow');
  DocumentApp.getUi().showSidebar(factDetail);
}
