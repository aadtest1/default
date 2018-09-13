var ct = (function() {
      
 /* inject:functions */
 var f_setPreviousDialogVals = function(index){


window.logManager.consoleLog(
    'function fn_setPreviousDialogVals', 
    'info'
  )

if (window.debugDialog) {
  debugger;
}

// Start with reference to main page - we're going to add _prev values to the page for displaying previous data.
const page = cti.store.pages.DialogFormOne || {};

const currentAnswers = cti.store.variables.dialogPlusCurrentAnswers || {};

// Grab any data from the pre form so we can display that as well.
const pagePre = cti.store.pages.DialogFormPre || {};
for (let attrname in pagePre) {
  page[attrname] = pagePre[attrname];
}

const questions = [
  { cti: "ACSatActions", form: "acSatActions" },
  { cti: "ACSatHelp", form: "acSatHelp", isNotPrev: true },
  { cti: "ACSatPl", form: "acSatPl", declinedPrefix: "ACSat", isSlider: true },
  { cti: "AssessmentDate", form: "assessmentDate" },
  { cti: "CNSatActions", form: "cnSatActions" },
  { cti: "CNSatHelp", form: "cnSatHelp", isNotPrev: true },
  { cti: "CNSatPl", form: "cnSatPl", declinedPrefix: "CNSat", isSlider: true },
  { cti: "CareDec", form: "careDec", isObj: true },
  { cti: "CareDecUnplan", form: "careDecUnplan", isObj: true },
  { cti: "CarerView", form: "carerView" },
  { cti: "DialogplusCpaAttendRows", form: "dialogplusCpaAttendRows", isNotPrev: true, isEverything: true, isRepeater: true },
  { cti: "FISatActions", form: "fiSatActions" },
  { cti: "FISatHelp", form: "fiSatHelp", isNotPrev: true },
  { cti: "FISatPl", form: "fiSatPl", declinedPrefix: "FISat", isSlider: true },
  { cti: "FSSatActions", form: "fsSatActions" },
  { cti: "FSSatHelp", form: "fsSatHelp", isNotPrev: true },
  { cti: "FSSatPl", form: "fsSatPl", declinedPrefix: "FSSat", isSlider: true },
  { cti: "Funded", form: "funded", isObj: true },
  { cti: "InCareDec", form: "inCareDec", isObj: true },
  { cti: "JSSatActions", form: "jsSatActions" },
  { cti: "JSSatHelp", form: "jsSatHelp", isNotPrev: true },
  { cti: "JSSatPl", form: "jsSatPl", declinedPrefix: "JSSat", isSlider: true },
  { cti: "LASatActions", form: "laSatActions" },
  { cti: "LASatHelp", form: "laSatHelp", isNotPrev: true },
  { cti: "LASatPl", form: "laSatPl", declinedPrefix: "LASat", isSlider: true },
  { cti: "MDSatActions", form: "mdSatActions" },
  { cti: "MDSatHelp", form: "mdSatHelp", isNotPrev: true },
  { cti: "MDSatPl", form: "mdSatPl", declinedPrefix: "MDSat", isSlider: true },
  { cti: "MHMatters", form: "mhMatters" },
  { cti: "MHRecovery", form: "mhRecovery" },
  { cti: "MHSatPl", form: "mhSat1", declinedPrefix: "MHSat", isSlider: true },
  { cti: "MHSatActions", form: "mhSatActions" },
  { cti: "MHSatHelp", form: "mhSatHelp", isNotPrev: true },
  { cti: "MHSkills", form: "mhSkills" },
  { cti: "MPSatActions", form: "mpSatActions" },
  { cti: "MPSatHelp", form: "mpSatHelp", isNotPrev: true },
  { cti: "MPSatPl", form: "mpSatPl", declinedPrefix: "MPSat", isSlider: true },
  { cti: "NxtRev", form: "nxtRev" },
  { cti: "PHSatActions", form: "phSatActions" },
  { cti: "PHSatHelp", form: "phSatHelp", isNotPrev: true },
  { cti: "PHSatPl", form: "phSatPl", declinedPrefix: "PHSat", isSlider: true},
  { cti: "PRSatActions", form: "prSatActions" },
  { cti: "PRSatHelp", form: "prSatHelp", isNotPrev: true },
  { cti: "PRSatPl", form: "prSatPl", declinedPrefix: "PRSat", isSlider: true },
  { cti: "PSSatActions", form: "psSatActions" },
  { cti: "PSSatHelp", form: "psSatHelp", isNotPrev: true },
  { cti: "PSSatPl", form: "psSatPl", declinedPrefix: "PSSat", isSlider: true },
  { cti: "RCYN", form: "rcyn" },
  { cti: "RSSatActions", form: "rsSatActions" },
  { cti: "RSSatHelp", form: "rsSatHelp", isNotPrev: true },
  { cti: "RSSatPl", form: "rsSatPl", declinedPrefix: "RSSat", isSlider: true },
  { cti: "RevUnplan", form: "revUnplan" },
  { cti: "S117Comm", form: "s117Comm" },
  { cti: "SUCap", form: "suCap", isObj: true },
  { cti: "SUDisagree", form: "suDisagree" },
  { cti: "SUSatActions", form: "suSatActions" },
  { cti: "SUSatHelp", form: "suSatHelp", isNotPrev: true },
  { cti: "SUSatPl", form: "suSatPl", declinedPrefix: "SUSat", isSlider: true },
  { cti: "SUYN", form: "suyn" },
  { cti: "StageTreat", form: "stageTreat" },
  { cti: "StageTreat1", form: "stageTreat1", isObj: true }
];

let originalIndex = index;
if (index === -1) {
  index = 0;
  //cti.store.variables.currentPreviousDialogIndex = originalIndex; 
}


// Grab the form instance
const form =
  (cti.store.variables.selected_visit.patientData &&
    cti.store.variables.selected_visit.patientData.dialogPlusForms &&
    cti.store.variables.selected_visit.patientData.dialogPlusForms.length > 0 &&
    cti.store.variables.selected_visit.patientData.dialogPlusForms[index]) ||
  null;

if (form) {
  // If we've got something in the result, use it - this may differ, need to check...
  // If we don't have anything, make sure we clear any previous model value down.
  questions.forEach(n => {
    let val = null;
    if (form[`${n.form}`] && form[`${n.form}`].result) {
      // Check if we need to set an object value or an individual value.
      if (n.isObj) {
        val = {
          value: form[n.form].result,
          label: form[n.form].resultString
        };
      } else if (n.isEverything) {
        val = form[n.form];
      } else {
        val = form[n.form].result;
      }
    }

    if (n.isEverything) {
      val = form[n.form];
    }

    if (val === undefined && n.isRepeater) {
      val = { repeater: [] };
    }

    // Get the slider and set readOnly accordingly.
    let sliderElement = document.querySelector(`#${n.cti}_Slider`);


    // If this is a read only form then we can display things like declined to answer or if the client needs help...
    if (cti.store.variables.dialogIsReadOnly) {

      // If this is a slider and has been set to `8`, the client declined to answer so tick the check box.
      if (n.declinedPrefix) {
        let declined = Number(val) === 8;
        if (declined) {
          page[`${n.declinedPrefix}DeclinedToAnswer`] = { selected: true };
        } else {
          page[`${n.declinedPrefix}DeclinedToAnswer`] = {};
        }

        if (sliderElement) {
          sliderElement.setAttribute("readonly", declined ? "true" : "false");
        }
      }

      // Check if this will display alongside another - i.e. as a 'previous' value. Some will not - i.e. the YES/NO radio buttons for require help.
      if (n.isNotPrev) {
        page[n.cti] = val;
      } else {
        // Special case...
        if (n.cti === "RevUnplan") {
          page[`${n.cti}_prev`] = {
            yes: form[n.form].result && form[n.form].result.toString() === "1"
          };
        } else {
          page[`${n.cti}_prev`] = val;
        }
      }
    } else {
      
      if (n.isSlider) {

        if (sliderElement) {

          if( page[`${n.declinedPrefix}DeclinedToAnswer`] === {} || page[`${n.declinedPrefix}DeclinedToAnswer`].selected === undefined || page[`${n.declinedPrefix}DeclinedToAnswer`].selected === false   ){
            sliderElement.setAttribute("readonly", "false");
          }else{
            sliderElement.setAttribute("readonly", "true");
          }
    
        }

        // We only want to set previous values for sliders if this isn't the first run...
        if ( originalIndex === -1 ) {

          delete page[`${n.cti}_prev`];

        } else {

          page[`${n.cti}_prev`] = val;

        }

      } else {

        page[`${n.cti}_prev`] = val;

      }
    }
  });
}

cti.utils.updatePage(); 

}
 /* end:inject:functions */
    
      return {

        /* inject:returns */
        f_setPreviousDialogVals:f_setPreviousDialogVals
        /* end:inject:returns */  
             
      };
    })();
    