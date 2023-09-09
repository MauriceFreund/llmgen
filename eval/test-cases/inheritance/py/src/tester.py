from generated.api import GetDocumentByIdRequest, PostDocumentRequest
from generated.model import Document, Letter, Certificate
from generated.exception import ApiException

TEST_OUTPUT_MARKER = "#+#"

successes = []
fails = []


def get_letter_by_id():
    try:
        letter = GetDocumentByIdRequest.get_document_by_id(1)
        if (
            letter.id == 1
            and letter.destination == "Germany"
            and letter.document_type == "LETTER"
        ):
            successes.append("getLetterById")
        else:
            fails.append("getLetterById:Received letter did not match expected values")
    except Exception as e:
        fails.append(f"getLetterById:{e}")


def get_certificate_by_id():
    try:
        certificate = GetDocumentByIdRequest.get_document_by_id(2)
        if (
            certificate.id == 2
            and certificate.certificate_holder == "Maria Mustermann"
            and certificate.document_type == "CERTIFICATE"
        ):
            successes.append("getCertificateById")
        else:
            fails.append("getCertificateById:Received certificate did not match expected values")
    except Exception as e:
        fails.append(f"getCertificateById:{e}")


def get_document_by_unknown_id():
    try:
        GetDocumentByIdRequest.get_document_by_id(3)
        fails.append("getDocumentByUnknownId:Request should have led to error but did not.")
    except ApiException:
        successes.append("getDocumentByUnknownId")
    except Exception as e:
        fails.append(f"getDocumentByUnknownId:{e}")


def save_letter():
    try:
        letter = Letter(3, "Mars", "LETTER")
        PostDocumentRequest.post_document(letter)
        successes.append("saveLetter")
    except Exception as e:
        fails.append(f"saveLetter:{e}")


def save_certificate():
    try:
        certificate = Certificate(4, "Rainer Zufall", "CERTIFICATE")
        PostDocumentRequest.post_document(certificate)
        successes.append("saveCertificate")
    except Exception as e:
        fails.append(f"saveCertificate:{e}")


def post_document_with_conflicting_id():
    try:
        document = Document(1)
        PostDocumentRequest.post_document(document)
        fails.append("postDocumentWithConflictingId:Request should have led to error but did not.")
    except ApiException:
        successes.append("postDocumentWithConflictingId")
    except Exception as e:
        fails.append(f"postDocumentWithConflictingId:{e}")


# Run the tests
get_letter_by_id()
get_certificate_by_id()
get_document_by_unknown_id()
save_letter()
save_certificate()
post_document_with_conflicting_id()

num_successes = len(successes)
num_tests = num_successes + len(fails)
success_rate = num_successes / num_tests

result = {
    "successful_tests": successes,
    "failed_tests": fails,
    "num_successes": num_successes,
    "num_tests": num_tests,
    "success_rate": success_rate,
}

print(TEST_OUTPUT_MARKER)
print(result)
print(TEST_OUTPUT_MARKER)