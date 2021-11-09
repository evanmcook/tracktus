//copypasted from a google script. return the tracktus to its home to enable functionality
function fedexInquiry(string) {
  trknum=string;
  var options = {
  };

  //take the input from earlier and concatenate it into the URL
  var URLcat = 'https://www.fedex.com/trackingCal/track?action=trackpackages&data=%7B%22TrackPackagesRequest%22:%7B%22appDeviceType%22:%22DESKTOP%22,%22appType%22:%22WTRK%22,%22processingParameters%22:%7B%7D,%22uniqueKey%22:%22%22,%22supportCurrentLocation%22:true,%22supportHTML%22:true,%22trackingInfoList%22:%5B%7B%22trackNumberInfo%22:%7B%22trackingNumber%22:%22' + trknum + '%22,%22trackingQualifier%22:null,%22trackingCarrier%22:null%7D%7D%5D%7D%7D'; 

  //get a JSON object back
  var response = UrlFetchApp.fetch(URLcat,options);
  var data = JSON.parse(response.getContentText());

//traverse through the json object, picking out and naming some parameters.
//this is a sampling of parameters and by no means an exhaustive list. 
//more are available by printing 'ret' to log.

  var ret = data["TrackPackagesResponse"];
  var tpr = ret["packageList"];
  var packageList = tpr[0];
  var eventList = packageList["scanEventList"]
  var mostRecentFedex = eventList[0];
  var fedexEventDate = mostRecentFedex["date"];
  var fedexEventTime = mostRecentFedex["time"];
  var fedexScanDetails = mostRecentFedex["status"];
  var fedexScanLocation = mostRecentFedex["scanLocation"];

  //turn the timestamp into a string so we can change the formatting from 
// yyyy-MM-dd into MM dd yr 

var fedexDateRaw = JSON.stringify(fedexEventDate);
var yr = fedexDateRaw.substr(1,4);
var mo = fedexDateRaw.substr(6,2);
var dd = fedexDateRaw.substr(9,2);

var fedexDateProcessed = mo + " " + dd + " " + yr +" ";

var fedexTimeRaw = JSON.stringify(fedexEventTime);
var fedexhh = fedexTimeRaw.substr(1,2);
var fedexmm = fedexTimeRaw.substr(4,2);
//Logger.log(fedexhh);

var fedexhhNum = Number(fedexhh);

//if the hour is an AM hour, store it as such. 
if (fedexhhNum < 12){
  fedexmm = fedexmm + " am";
}
//but if it's a pm hour represented in a 24 hour clock, store it as 12 hour and pm.
else if (fedexhhNum > 12){
  fedexhh = fedexhhNum-12
  fedexmm = fedexmm + " pm";
}
//else if it's in the noon hour, it's still PM but don't subtract 12. noon is still 12.
else if(fedexhhNum = 12){
  fedexmm = fedexmm + " pm";
}

//Logger.log(fedexhh +":"+ fedexmm + " ");
var fedexTimeProcessed = fedexhh +":"+ fedexmm ;
//Logger.log(fedexTimeProcessed);

//fedexOutput = fedexDateProcessed + "- " + fedexEventTime + "- " + fedexScanDetails + "- "+ fedexScanLocation;
 

return "As of "+ fedexDateProcessed +"at " + fedexTimeProcessed + ", Fedex lists the status of your package as '" + fedexScanDetails + ".' The most recent location of your package was in " + fedexScanLocation + "." ;

   //Logger.log(fedexOutput);

}
