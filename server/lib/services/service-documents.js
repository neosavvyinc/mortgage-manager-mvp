
/**
 * Generates a new list of documents depending on the applicants
 * @param applicantDetails
 * @param coapplicantDetails
 */
exports.generateDocumentList = function(applicantDetails, coapplicantDetails){

    var documents = [];

    //W2 - applicant
    documents.push({
        documentName: applicantDetails.firstName + " " + applicantDetails.lastName + "'s " + "W2's",
        description: "W2 for the past two years",
        amount: 2
    });

    // W2 - coapplicant
    if(coapplicantDetails){
        documents.push({
            documentName: coapplicantDetails.firstName + " " + coapplicantDetails.lastName + "'s " + "W2's",
            description: "W2 for the past two years",
            amount: 2
        });
    }

    // Paystubs - applicant
    documents.push({
        documentName: applicantDetails.firstName + " " + applicantDetails.lastName + "'s " + "Paystubs",
        description: "Two recent paystubs for sources of income",
        amount: 2
    });

    // Paystubs - coapplicant
    if(coapplicantDetails){
        documents.push({
            documentName: coapplicantDetails.firstName + " " + coapplicantDetails.lastName + "'s " + "Paystubs",
            description: "Two recent paystubs for sources of income",
            amount: 2
        });
    }

    // Renting
    if(applicantDetails.renting){
        documents.push({
            documentName: "Cancelled checks",
            description: "12 cancelled checks to prove payment is made on time",
            amount: 12
        });
    }

    // Marriage
    if(applicantDetails.marriedRecently){
        documents.push({
            documentName: "Copy of marriage certificate",
            description: "Copy of the marriage certificate",
            amount: 1
        });
    }

    // Self employment documents
    if(applicantDetails.isSelfEmployed){
        documents.push({
            documentName: "Income Statement of Business",
            description: "Copy of the Income statement for the business for the past two years",
            amount: 2
        }, {
            documentName: "Balance Statement",
            description: "Copy of the Balance Statement for the business for the past two years",
            amount: 2
        }, {
            documentName: "Corporate Tax Return",
            description: "copy of the last years and current Corporate Tax Return",
            amount: 2
        });
    }

    // Financial Assets
    if(applicantDetails.financialAssets){
        documents.push({
            documentName: "SEP-IRA / 401k",
            description: "Two recent statements from the account or institution",
            amount: 1
        });
    }

    // OfferLetter
    documents.push({
        documentName: "Offer Letter",
        description: "A copy of the offer letter of the condo or property you are buying",
        amount: 1
    });

    return documents;
};