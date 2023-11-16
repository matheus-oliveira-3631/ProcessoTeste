/**
 *
 *
 * @param {FormController} form
 * @param {customHTML} customHTML
 */
function displayFields(form, customHTML) {
    var today = new Date();
    var year = today.getFullYear();
    var month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    var day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    var hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
    var minute = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    var second = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();
    var currentHour = hour + ":" + minute + ":" + second;
    var currentDate = day + '/' + month + '/' + year;
    var currentTime = currentDate + "  " + currentHour;
    var atividade = getValue('WKNumState');
    var numProces = getValue("WKNumProces");
    var colleageID = getValue('WKUser');
    var WKCardId = form.getDocumentId();
    var WKFormId = form.getCardIndex();
    var formMode = form.getFormMode();
    var mobile = form.getMobile() ? true : false;
  
    if (atividade == null && numProces == null) {
      atividade = form.getValue('idAtividade');
      numProces = form.getValue('idSolicitacao');
    } else {
      form.setValue('idAtividade', atividade);
      form.setValue('idSolicitacao', numProces);
    }

    customHTML.append("<script>function getWKNumState(){ return " + atividade + "; }</script>");
    customHTML.append("<script>function getTodayDate(){ return " + new java.util.Date().getTime() + "; }</script>");
    customHTML.append("<script>function getFormMode(){ return '" + formMode + "'; }</script>");
    customHTML.append("<script>function getUser(){ return '" + colleageID + "'; }</script>");
    customHTML.append("<script>function getCompany(){ return " + getValue("WKCompany") + "; }</script>");
    customHTML.append("<script>");
    customHTML.append("\n   var WKNumState     		=  " + atividade + ";");
    customHTML.append("\n   var WKNumProces     	=  " + numProces + ";");
    customHTML.append("\n   var WKCardId     		=  " + WKCardId + ";");
    customHTML.append("\n   var WKFormId     		=  " + WKFormId + ";");
    customHTML.append("\n   var user	     		= '" + colleageID + "';");
    customHTML.append("\n   var dataAbertura   		= '" + currentTime + "';");
    customHTML.append("\n   var mobile 				= '" + mobile + "';");
    customHTML.append("\n   var formMode 			= '" + formMode + "';");
    customHTML.append("\n   var formController = new FormController(WKNumState, WKNumProces, WKCardId, WKFormId, user, mobile, formMode);");
    customHTML.append("\n </script>");
  
    if (numProces != 0) {
      form.setValue("idSolicitacao", numProces);
    }
    form.setShowDisabledFields(true);
  
    var cColleagueID = DatasetFactory.createConstraint("colleaguePK.colleagueId", colleageID, colleageID, ConstraintType.MUST);
    var colaborador = DatasetFactory.getDataset("colleague", null, [cColleagueID], null);
    var loginFluig = colaborador.getValue(0, "login") // LOGIN DO USUARIO

    form.setValue("dataSolicitacao", currentTime) ; 
    form.setValue("nomeSolicitante", colaborador.getValue(0, "colleagueName"));  

}


function getCurrentDate() {
    var df = new java.text.SimpleDateFormat("dd/MM/yyyy");
    var cal = java.util.Calendar.getInstance();
    return df.format(cal.getTime());
  }