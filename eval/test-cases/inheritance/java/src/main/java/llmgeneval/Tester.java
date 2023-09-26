package llmgeneval;

import llmgeneval.generated.api.GetDocumentByIdRequest;
import llmgeneval.generated.api.PostDocumentRequest;
import llmgeneval.generated.model.Document;
import llmgeneval.generated.model.Letter;
import llmgeneval.generated.model.Certificate;
import llmgeneval.generated.exception.ApiException;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

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

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String result = objectMapper
                    .writeValueAsString(new TestResult(successes, fails, numSuccesses, numTests, successRate));
            System.out.println(TEST_OUTPUT_MARKER);
            System.out.println(result);
            System.out.println(TEST_OUTPUT_MARKER);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void getLetterById() {
        try {
            Document doc = new GetDocumentByIdRequest().getDocumentById(1);
            if (doc.getId() == 1) {
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
            Document doc = new GetDocumentByIdRequest().getDocumentById(2);
            if (doc.getId() == 2) {
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
            new GetDocumentByIdRequest().getDocumentById(3);
            fails.add("getDocumentByUnknownId:Request should have led to error but did not.");
        } catch (ApiException e) {
            successes.add("getDocumentByUnknownId");
        } catch (Exception e) {
            fails.add("getDocumentByUnknownId:" + e.getMessage());
        }
    }

    public static void saveLetter() {
        try {
            Letter letter = new Letter(3, "Mars");
            new PostDocumentRequest().postDocument(letter);
            successes.add("saveLetter");
        } catch (Exception e) {
            fails.add("saveLetter:" + e.getMessage());
        }
    }

    public static void saveCertificate() {
        try {
            Certificate certificate = new Certificate(4, "Rainer Zufall");
            new PostDocumentRequest().postDocument(certificate);
            successes.add("saveCertificate");
        } catch (Exception e) {
            fails.add("saveCertificate:" + e.getMessage());
        }
    }

    public static void postDocumentWithConflictingId() {
        try {
            Document document = new Document(1);
            new PostDocumentRequest().postDocument(document);
            fails.add("postDocumentWithConflictingId:Request should have led to error but did not.");
        } catch (ApiException e) {
            successes.add("postDocumentWithConflictingId");
        } catch (Exception e) {
            fails.add("postDocumentWithConflictingId:" + e.getMessage());
        }
    }
}
