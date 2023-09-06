import GetDocumentByIdRequest from './generated/api/GetDocumentByIdRequest.js';
import PostDocumentRequest from './generated/api/PostDocumentRequest.js';
import Document from './generated/model/Document.js';
import Letter from './generated/model/Letter.js';
import Certificate from './generated/model/Certificate.js';
import ApiException from './generated/exception/ApiException.js';

const TEST_OUTPUT_MARKER="#+#"

let successes = [];
let fails = [];

async function getLetterById() {
    try {
        const letter = await GetDocumentByIdRequest.getDocumentById(1);
        if (
            letter.id === 1
            && letter.destination === "Germany"
            && letter.documentType === "LETTER"
        ) {
            successes.push("getLetterById");
        } else {
            fails.push("getLetterById:Received letter did not match expected values");
        }
    } catch (e) {
        fails.push("getLetterById:" + e);
    }
}

async function getCertificateById() {
    try {
        const certificate = await GetDocumentByIdRequest.getDocumentById(2);
        if (
            certificate.id === 2
            && certificate.certificateHolder === "Maria Mustermann"
            && certificate.documentType === "CERTIFICATE"
        ) {
            successes.push("getCertificateById");
        } else {
            fails.push("getCertificateById:Received certificate did not match expected values");
        }
    } catch (e) {
        fails.push("getCertificateById:" + e);
    }
}

async function getDocumentByUnknownId() {
    try {
        await GetDocumentByIdRequest.getDocumentById(3);
        fails.push("getDocumentByUnknownId:Request should have led to error but did not.");
    } catch (e) {
        if (e instanceof ApiException) {
            successes.push("getDocumentByUnknownId");
        } else {
            fails.push("getDocumentByUnknownId:" + e);
        }
    }
}

async function saveLetter() {
    try {
        const letter = new Letter(3, "Mars", "LETTER");
        await PostDocumentRequest.postDocument(letter);
        successes.push("saveLetter");
    } catch (e) {
        fails.push("saveLetter:" + e);
    }
}

async function saveCertificate() {
    try {
        const certificate = new Certificate(4, "Rainer Zufall", "CERTIFICATE");
        await PostDocumentRequest.postDocument(certificate);
        successes.push("saveCertificate");
    } catch (e) {
        fails.push("saveCertificate:" + e);
    }
}

async function postDocumentWithConflictingId() {
    try {
        const document = new Document(1);
        await PostDocumentRequest.postDocument(document);
        fails.push("postDocumentWithConflictingId:Request should have led to error but did not.");
    } catch (e) {
        if (e instanceof ApiException) {
            successes.push("postDocumentWithConflictingId");
        } else {
            fails.push("postDocumentWithConflictingId:" + e);
        }
    }
}

await getLetterById();
await getCertificateById();
await getDocumentByUnknownId();
await saveLetter();
await saveCertificate();
await postDocumentWithConflictingId();

const numSuccesses = successes.length;
const numTests = numSuccesses + fails.length;
const successRate = numSuccesses / numTests;

const result = {
    "successful_tests": successes,
    "failed_tests": fails,
    "num_successes": numSuccesses,
    "num_tests": numTests,
    "success_rate": successRate,
}

console.log(TEST_OUTPUT_MARKER);
console.log(JSON.stringify(result));
console.log(TEST_OUTPUT_MARKER);
