package llmgeneval;

import generated.api.GetDocumentByIdRequest;
import generated.api.PostDocumentRequest;
import generated.model.Document;
import generated.model.Letter;
import generated.model.Certificate;
import generated.exception.ApiException;

import java.util.ArrayList;
import java.util.List;

public class Tester {
    private static final String TEST_OUTPUT_MARKER = "#+#";
    private static List<String> successes = new ArrayList<>();
    private static List<String> fails = new ArrayList<>();

    public static void main(String[] args) {
        getLetterById();
        getCertificateById();
        getDocumentByUnknownId();
        saveLetter();
        saveCertificate();
        postDocumentWithConflictingId();

        int numSuccesses = successes.size();
        int numTests = numSuccesses + fails.size();
        double successRate = (double) numSuccesses / numTests;

        TestResult result = new TestResult(successes, fails, numSuccesses, numTests, successRate);

        System.out.println(TEST_OUTPUT_MARKER);
        System.out.println(result);
        System.out.println(TEST_OUTPUT_MARKER);
    }

    public static void getLetterById() {
        try {
            Letter letter = GetDocumentByIdRequest.getDocumentById(1);
            if (
                    letter.getId() == 1 
                    && "Germany".equals(letter.getDestination()) 
                    && "LETTER".equals(letter.getDocumentType())
            ) {
                successes.add("getLetterById");
            } else {
                fails.add("getLetterById:Received letter did not match expected values");
            }
        } catch (Exception e) {
            fails.add("getLetterById:" + e.getMessage());
        }
    }

    public static void getCertificateById() {
        try {
            Certificate certificate = GetDocumentByIdRequest.getDocumentById(2);
            if (
                    certificate.getId() == 2 
                    && "Maria Mustermann".equals(certificate.getCertificateHolder()) 
                    && "CERTIFICATE".equals(certificate.getDocumentType())
            ) {
                successes.add("getCertificateById");
            } else {
                fails.add("getCertificateById:Received certificate did not match expected values");
            }
        } catch (Exception e) {
            fails.add("getCertificateById:" + e.getMessage());
        }
    }

    public static void getDocumentByUnknownId() {
        try {
            GetDocumentByIdRequest.getDocumentById(3);
            fails.add("getDocumentByUnknownId:Request should have led to error but did not.");
        } catch (ApiException e) {
            successes.add("getDocumentByUnknownId");
        } catch (Exception e) {
            fails.add("getDocumentByUnknownId:" + e.getMessage());
        }
    }

    public static void saveLetter() {
        try {
            Letter letter = new Letter(3, "Mars", "LETTER");
            PostDocumentRequest.postDocument(letter);
            successes.add("saveLetter");
        } catch (Exception e) {
            fails.add("saveLetter:" + e.getMessage());
        }
    }

    public static void saveCertificate() {
        try {
            Certificate certificate = new Certificate(4, "Rainer Zufall", "CERTIFICATE");
            PostDocumentRequest.postDocument(certificate);
            successes.add("saveCertificate");
        } catch (Exception e) {
            fails.add("saveCertificate:" + e.getMessage());
        }
    }

    public static void postDocumentWithConflictingId() {
        try {
            Document document = new Document(1);
            PostDocumentRequest.postDocument(document);
            fails.add("postDocumentWithConflictingId:Request should have led to error but did not.");
        } catch (ApiException e) {
            successes.add("postDocumentWithConflictingId");
        } catch (Exception e) {
            fails.add("postDocumentWithConflictingId:" + e.getMessage());
        }
    }
}

