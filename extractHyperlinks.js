function extractHyperlinks(doc) {
    "use strict";
    var i,
	    linkedText,
		linkedURL,
        extracted_hyperlinks = [],
        myHyperlinks = doc.hyperlinks,
        extracted_hyperlink,
        destination_type;
    for (i = 0; i < myHyperlinks.length; i += 1) {
	    // If you don't do the following check to make sure the objects exist and are not null, the script will break when there isnt a source or destination available.
        if (myHyperlinks.item(i).source.sourceText && myHyperlinks.item(i).destination) {
            linkedText = myHyperlinks.item(i).source.sourceText.contents || ""; //extract linked text
            for (destination_type in myHyperlinks.item(i).destination) {
                if (myHyperlinks.item(i).destination.hasOwnProperty(destination_type) && destination_type.toString().match('destination.*')) {
                    linkedURL = myHyperlinks.item(i).destination[destination_type] || "";
                    break;
                }
            }
        }
		extracted_hyperlink = {
			text: linkedText,
			URL: linkedURL
		};
        extracted_hyperlinks.push(extracted_hyperlink);
    }
    return extracted_hyperlinks;
}


function writeHyperlinksToFile(hyperlinks) {
    "use strict";
    var myFilePath = File.saveDialog("Choose where to save your Hyperlinks"),
        outputFile = new File(myFilePath),
        i;
    outputFile = new File(outputFile);
    outputFile.open('w');
    for (i = 0; i < hyperlinks.length; i += 1) {
        outputFile.writeln(hyperlinks[i].text + "\t" + hyperlinks[i].URL);
    }
    outputFile.close();
}
function main() {
    "use strict";
    var extracted_hyperlinks = extractHyperlinks(app.documents[0]);
    writeHyperlinksToFile(extracted_hyperlinks);
}
main();
