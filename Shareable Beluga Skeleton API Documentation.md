## **THIS IS AN EXAMPLE DOCUMENT ONLY. PLEASE DO NOT USE FOR** 

## **DEVELOPMENT.** 

## Usage: 

Please include your staging or production api key in each API request header as specified in the **Authorization** section of this document. These will be shared with you separately. 

## Staging URLS: 

Please note that our api endpoint will only accept HTTPS requests. 

Staging: 

Production: 

## Authorization: 

Please use the Authorization header to send through the correct API key based on the environment (staging or production): 

## **Headers** : 

{ Authorization: Bearer {API_KEY} } 

## Endpoints: 

Use the following endpoints to interact with our API. {base url} will change depending on whether you are sending test (staging) data or real (production) data. **Please note the exact syntax, capitalization, and nesting structure of the request body in order to ensure proper processing on our end.** 

** Please do not allow any data fields to be sent as empty, null, undefined, or empty string. ** 

## _If client verifying patient ID (no ID photos)_ 

## Visit form submission: 

This endpoint accepts the full patient visit creation payload. We will return specific error responses if there is any missing or malformed data before processing the visit details. 

## **Method** : 

POST 

## **URL** : 

## **Request body** : 

{ formObj: { consentsSigned: _Boolean_ (ONLY true) (REQUIRED), firstName: _String_ (100 character limit) (REQUIRED), lastName: _String_ (100 character limit) (REQUIRED), dob: _String_ (MM/DD/YYYY, 18+ verified in client) (REQUIRED), phone: _String_ (10 characters, only digits, ex. “5554567890”, valid US mobile number verified in client) (REQUIRED), email: _String_ (REQUIRED), address: _String_ (REQUIRED), city: _String_ (REQUIRED), state: _String_ (2 characters, capitalized, ex. “CA”) (REQUIRED), zip: _String_ (5 characters, only digits, ex. “54321”) (REQUIRED), sex: _String_ (ONLY “Male”, “Female”, “Other”) (REQUIRED), selfReportedMeds: _String_ (REQUIRED), allergies: _String_ (REQUIRED), 

medicalConditions: _String_ (REQUIRED), patientPreference: _Array_ [ _Object_ { name: _String_ (REQUIRED), strength: _String_ (REQUIRED), quantity: _String_ (REQUIRED), refills: _String_ (REQUIRED), daysSupply: _String_ , medId: _String_ (REQUIRED), }, ... ] (REQUIRED), Q1: _String_ , A1: _String_ , ... Q[n]: _String_ , A[n]: _String_ }, patientVerified: _Boolean_ (ONLY true) (REQUIRED), verificationId: _String_ (REQUIRED), pharmacyId: _String_ (REQUIRED), visitId: _String_ (REQUIRED), company: _String_ (REQUIRED), visitType: _String_ (“weightloss”, “weightlossfollowup”, “ED”, “PE”, “hairloss”) (REQUIRED) } 

For **req.body.visitId** , this is a unique id your system will generate for each visit submission. Please ensure uniqueness. 

For **req.body.formObj.phone** , this needs to be a unique phone number PER PATIENT. Please ensure uniqueness. 

For **req.body.formObj[selfReportedMeds, allergies,** 

**medicalConditions]** , please map these answers to these fields only, without also sending them in the custom questions section. 

For **custom req.body.formObj questions (Q1, A1, etc.)** , if the question includes multiple choice answers, please include those choices IN THE QUESTION TEXT and any multiple answers in the answer text in the following format (including capitalization, use of colon (:), and use of semicolons (;)): 

{ 

Q1: “Have you experienced any of these things? POSSIBLE ANSWERS: answer1; answer2; answer3”, A1: “answer2; answer3” 

} 

- If the visit is created successfully, we will return the following response. **The visitId is what will be passed in with the image submission request** : **Response body** : 

{ 

status: 200, info: “Patient visit created successfully”, data: visitId 

} 

- If any of the required parameters are missing from req.body.formObj , we will return the following response: 

**Response body** : 

{ status: 400, error: _Specific error message_ } 

- If any of the required metadata parameters are missing from req.body , we will return the following response: 

**Response body** : 

{ status: 400, error: "Missing metadata" } 

- If req.body.formObj.state is not included in our allowable state list, we will return the following response: 

**Response body** : 

{ status: 400, error: "State not valid" } 

- If we have a record of this patient creating a visit with the same visitType as req.body.visitType from a different client within the last 24 hours, we will return the following response: 

## **Response body** : 

{ status: 400, error: "Patient not eligible for new visit" } 

## _If client is NOT verifying patient ID (ID photos)_ 

## Visit form submission: 

This endpoint accepts the full patient visit creation payload. We will return specific error responses if there is any missing or malformed data before processing the visit details. 

## **Method** : 

POST 

## **URL** : 

## **Request body** : 

{ formObj: { consentsSigned: _Boolean_ (ONLY true) (REQUIRED), firstName: _String_ (100 character limit) (REQUIRED), lastName: _String_ (100 character limit) (REQUIRED), dob: _String_ (MM/DD/YYYY, 18+ verified in client) (REQUIRED), phone: _String_ (10 characters, only digits, ex. “5554567890”, valid US mobile number verified in client) (REQUIRED), email: _String_ (REQUIRED), address: _String_ (REQUIRED), city: _String_ (REQUIRED), state: _String_ (2 characters, capitalized, ex. “CA”) (REQUIRED), zip: _String_ (5 characters, only digits, ex. “54321”) (REQUIRED), sex: _String_ (ONLY “Male”, “Female”, “Other”) (REQUIRED), selfReportedMeds: _String_ (REQUIRED), allergies: _String_ (REQUIRED), 

medicalConditions: _String_ (REQUIRED), patientPreference: _Array_ [ _Object_ { name: _String_ (REQUIRED), strength: _String_ (REQUIRED), quantity: _String_ (REQUIRED), refills: _String_ (REQUIRED), daysSupply: _String_ , medId: _String_ (REQUIRED), }, ... ] (REQUIRED), Q1: _String_ , A1: _String_ , ... Q[n]: _String_ , A[n]: _String_ }, pharmacyId: _String_ (REQUIRED), masterId: _String_ (REQUIRED), company: _String_ (REQUIRED), visitType: _String_ (“weightloss”, “weightlossfollowup”, “ED”, “PE”, “hairloss”) (REQUIRED) } 

For **req.body.masterId** , this is a unique id your system will generate for each visit submission. Please ensure uniqueness. 

For **req.body.formObj.phone** , this needs to be a unique phone number PER PATIENT. Please ensure uniqueness. 

For **req.body.formObj[selfReportedMeds, allergies,** 

**medicalConditions]** , please map these answers to these fields only, without also sending them in the custom questions section. 

For **custom req.body.formObj questions (Q1, A1, etc.)** , if the question includes multiple choice answers, please include those choices IN THE QUESTION TEXT and any multiple answers in the answer text in the following format (including capitalization, use of colon (:), and use of semicolons (;)): 

{ Q1: “Have you experienced any of these things? POSSIBLE ANSWERS: 

answer1; answer2; answer3”, A1: “answer2; answer3” } 

- If the visit is created successfully, we will return the following response. **The visitId is what will be passed in with the photo id request** : **Response body** : 

{ status: 200, info: “Patient visit created successfully”, data: { masterId: _String_ , visitId: _String_ } } 

- If any of the required parameters are missing from req.body.formObj , we will return the following response: 

**Response body** : 

{ status: 400, error: _Specific error message_ } 

- If any of the required metadata parameters are missing from req.body , we will return the following response: 

**Response body** : 

{ status: 400, error: "Missing metadata" } 

- If req.body.formObj.state is not included in our allowable state list, we will return the following response: 

**Response body** : 

{ status: 400, error: "State not valid" } 

- If we have a record of this patient creating a visit with the same visitType as req.body.visitType from a different client within the last 24 hours, we will return the following response: 

**Response body** : 

{ status: 400, error: "Patient not eligible for new visit" } 

_If client will be sending lab test results AND verifying patient ID (no ID photos)_ 

## Lab results submission: 

This endpoint accepts a visit creation request that includes lab results. We will return specific error responses if there is any missing or malformed data before processing the request. 

## **Method** : 

POST 

**URL** : 

## **Request body** : 

{ formObj: { consentsSigned: _Boolean_ (ONLY true) (REQUIRED), firstName: _String_ (100 character limit) (REQUIRED), lastName: _String_ (100 character limit) (REQUIRED), dob: _String_ (MM/DD/YYYY) (REQUIRED), phone: _String_ (10 characters, only digits, ex. 5554567890) (REQUIRED), email: _String_ (REQUIRED), address: _String_ (REQUIRED), city: _String_ (REQUIRED), state: _String_ (2 characters, capitalized, ex. “CA”) (REQUIRED), zip: _String_ (5 characters, only digits, ex. “54321”) (REQUIRED), sex: _String_ (ONLY “Male”, “Female”, “Other”) (REQUIRED), selfReportedMeds: _String_ (REQUIRED), 

allergies: _String_ (REQUIRED), medicalConditions: _String_ (REQUIRED), testToTreat: _Boolean_ (REQUIRED), results: _Array_ [ _Object_ { screeningDate: _String_ (MM/DD/YYYY) (REQUIRED), testName: _String_ (REQUIRED), testResult: _String_ (REQUIRED), testResultUnits: _String_ (“N/A” if not applicable) (REQUIRED), refRange: _String_ (“N/A” if not applicable) (REQUIRED), statusIndicator: _String_ (“N/A” if not applicable) (“H” if testResult > refRange, “L” if testResult < refRange, “N” if testResult inside refRange) (REQUIRED), reportDate: _String_ (MM/DD/YYYY) (REQUIRED), sampleSource: _String_ (“URINE”, “BLOOD”, “SALIVA”, “VAGINAL”, “RECTAL”, “SEMEN”) (REQUIRED), }, ... ], patientPreference: _Array_ [ _Object_ { name: _String_ (“N/A” if not applicable) (REQUIRED), strength: _String_ (“N/A” if not applicable) (REQUIRED), refills: _String_ (“N/A” if not applicable) (REQUIRED), quantity: _String_ (“N/A” if not applicable) (REQUIRED), daysSupply: _String_ , medId: _String_ (“N/A” if not applicable) (REQUIRED) } (REQUIRED), ... ] (REQUIRED if testToTreat: true), Q1: _String_ , A1: _String_ , ... Q[n]: _String_ , A[n]: _String_ }, patientVerified: _Boolean_ (ONLY true) (REQUIRED), verificationId: _String_ (REQUIRED), pharmacyId: _String_ (REQUIRED), masterId: _String_ (REQUIRED), company: _String_ (REQUIRED), visitType: _String_ (“weightloss”, “weightlossfollowup”, “ED”, “PE”, 

“hairloss”) (REQUIRED) 

} 

If req.body.formObj.testToTreat is true , patientPreference is required. Otherwise, DO NOT include the patientPreference field. 

- If the request is received successfully, we will return the following response. **Response body** : 

{ status: 200, info: “Patient visit created successfully”, data: { masterId: String, visitId: String } } 

- If any of the required parameters are missing from req.body.formObj or 

req.body.formObj.results , we will return the following response: **Response body** : 

{ status: 400, error: _Specific error message_ } 

● If any of the required metadata parameters are missing from req.body , we will return the following response: **Response body** : 

{ status: 400, error: "Missing metadata" } 

● If req.body.testToTreat is false and req.body.patientPreference is present in the payload, we will return the following response: **Response body** : 

{ status: 400, error: "Patient preference not allowed" } 

- If there are any unexpected fields in either req.body or req.body.formObj , we will return the following response: 

## **Response body** : 

{ status: 400, error: "Payload contains bad fields: {FIELD NAMES}" } 

## _If client will be sending lab test results AND NOT verifying patient ID (ID photos)_ 

## Lab results submission: 

This endpoint accepts a visit creation request that includes lab results. We will return specific error responses if there is any missing or malformed data before processing the request. 

## **Method** : 

POST 

**URL** : 

## **Request body** : 

{ formObj: { consentsSigned: _Boolean_ (ONLY true) (REQUIRED), firstName: _String_ (100 character limit) (REQUIRED), lastName: _String_ (100 character limit) (REQUIRED), dob: _String_ (MM/DD/YYYY) (REQUIRED), phone: _String_ (10 characters, only digits, ex. 5554567890) (REQUIRED), email: _String_ (REQUIRED), address: _String_ (REQUIRED), city: _String_ (REQUIRED), state: _String_ (2 characters, capitalized, ex. “CA”) (REQUIRED), zip: _String_ (5 characters, only digits, ex. “54321”) (REQUIRED), sex: _String_ (ONLY “Male”, “Female”, “Other”) (REQUIRED), selfReportedMeds: _String_ (REQUIRED), allergies: _String_ (REQUIRED), medicalConditions: _String_ (REQUIRED), testToTreat: _Boolean_ (REQUIRED), 

results: _Array_ [ _Object_ { screeningDate: _String_ (MM/DD/YYYY) (REQUIRED), testName: _String_ (REQUIRED), testResult: _String_ (REQUIRED), testResultUnits: _String_ (“N/A” if not applicable) (REQUIRED), refRange: _String_ (“N/A” if not applicable) (REQUIRED), statusIndicator: _String_ (“N/A” if not applicable) (“H” if testResult > refRange, “L” if testResult < refRange, “N” if testResult inside refRange) (REQUIRED), reportDate: _String_ (MM/DD/YYYY) (REQUIRED), sampleSource: _String_ (“URINE”, “BLOOD”, “SALIVA”, “VAGINAL”, “RECTAL”, “SEMEN”) (REQUIRED), }, ... ], patientPreference: _Array_ [ _Object_ { name: _String_ (“N/A” if not applicable) (REQUIRED), strength: _String_ (“N/A” if not applicable) (REQUIRED), refills: _String_ (“N/A” if not applicable) (REQUIRED), quantity: _String_ (“N/A” if not applicable) (REQUIRED), daysSupply: _String_ , medId: _String_ (“N/A” if not applicable) (REQUIRED) } (REQUIRED), ... ] (REQUIRED if testToTreat: true), Q1: _String_ , A1: _String_ , ... Q[n]: _String_ , A[n]: _String_ }, pharmacyId: _String_ (REQUIRED), masterId: _String_ (REQUIRED), company: _String_ (REQUIRED), visitType: _String_ (“weightloss”, “weightlossfollowup”, “ED”, “PE”, “hairloss”) (REQUIRED) } 

If req.body.formObj.testToTreat is true , patientPreference is required. Otherwise, DO NOT include the patientPreference field. 

- If the request is received successfully, we will return the following response. **The visitId is what will be passed in with the photo id request** : **Response body** : 

{ status: 200, info: “Patient visit created successfully”, data: { masterId: String, visitId: String } } 

- If any of the required parameters are missing from req.body.formObj or 

req.body.formObj.results , we will return the following response: 

**Response body** : 

{ status: 400, error: _Specific error message_ } 

- If any of the required metadata parameters are missing from req.body , we will return the following response: 

**Response body** : 

{ status: 400, error: "Missing metadata" } 

- If req.body.testToTreat is false and req.body.patientPreference is present in the payload, we will return the following response: 

   - **Response body** : 

{ status: 400, error: "Patient preference not allowed" } 

- If there are any unexpected fields in either req.body or req.body.formObj , we will return the following response: 

**Response body** : 

{ status: 400, error: "Payload contains bad fields: {FIELD NAMES}" 

} 

_If client will be sending any images (ID photos and any other images)_ 

## Patient photos submission: 

This endpoint accepts a patient’s photos associated with a visit, including the patient’s photo ID image. The **visitId** value is provided in the visit creation endpoint success response. Please do the following before sending the request: 

1. Convert all images to jpeg format 

2. Compress the images to width: 1000px before encoding (or ensure that all images are <3MB) 

3. Encode the compressed images to base64 encoding. Do not include the MIME at the beginning of this string. 

## **Method** : 

POST **URL** : 

## **Request body** : 

{ visitId: _String_ (REQUIRED), images: _Array_ [ _Object_ { mime: “image/jpeg” (REQUIRED), data: _String_ (base64 encoded) (REQUIRED) } ... ] } 

- If the image submission succeeds, the following success response will be returned: **Response body** : 

{ status: 200, info: "Successfully received images" } 

- If the visitId does not match a visit in our system, the following error response will be returned: 

## **Response body** : 

{ status: 400 info: "Visit does not exist" } 

- If an error occurs for any other reason, the following error response will be returned: **Response body** : 

{ status: 400, info: "Error accepting images" } 

## _If client will be sending any PDF data_ 

## PDF submission: 

This endpoint accepts a PDF. The **visitId** value is provided in the visit creation endpoint success response shown above. Please do the following before sending the request: 

1. Convert image to PDF format only 

2. Encode the compressed image to base64 encoding 

## **Method** : 

POST 

## **URL** : 

## **Request body** : 

{ visitId: _String_ (REQUIRED), image: { mime: “application/pdf” (REQUIRED), data: _String_ (base64 encoded) (REQUIRED) } } 

- If the image submission succeeds, the following success response will be returned: **Response body** : 

{ status: 200, info: "Successfully received image" } 

- If the visitId does not match a visit in our system, the following error response will be returned: 

## **Response body** : 

{ status: 400 info: "Visit does not exist" } 

- If an error occurs for any other reason, the following error response will be returned: **Response body** : 

{ status: 400, info: "Error accepting image" } 

## _- If client will be using API for doctor < > patient chat_ 

## Send patient chat message: 

This is an endpoint for passing along a patient’s chat message to Beluga’s system. Please note the exact object structure, field names and capitalization. 

## **Method** : 

POST 

**URL** : 

## **Request body** : 

{ firstName: _String_ (REQUIRED), 

lastName: _String_ (REQUIRED), content: _String_ (REQUIRED), isMedia: _Boolean_ (REQUIRED), masterId: _String_ (REQUIRED), 

} 

If a patient sends an image through the chat interface, please do the following: 

   1. Convert/compress/encode the image as described in the image submission API section 

   2. Enter this encoded string as the value for req.body.content 

   3. Enter isMedia: true 

- If the chat is received successfully, the following response will be returned: **Response body** : 

{ status: 200, info: “Message received successfully” } 

- If there is something wrong with the formatting of the request body or any field is missing, the following response will be returned: **Response body** : 

{ status: 400, info: “Incorrect data structure or missing data” } 

- If the masterId does not match any record in our system, the following response will be returned: 

## **Response body** : 

{ status: 400, info: “Visit does not exist” } 

## _- If client will be using API for admin < > CS messaging_ 

## Customer service message: 

This is an endpoint for routing a customer service-related message from client customer service team to Beluga’s admin. Please note the exact object structure, field names and capitalization. 

## **Method** : 

POST 

## **URL** : 

## **Request body** : 

{ content: _String_ (REQUIRED), masterId: _String_ (REQUIRED) } 

- If the chat is received successfully, the following response will be returned: **Response body** : 

{ status: 200, info: “Message received successfully” } 

- If there is something wrong with the formatting of the request body or any field is missing, the following response will be returned: 

**Response body** : 

{ status: 400, info: “Incorrect data structure or missing data” } 

- If the masterId does not match any record in our system, the following response will be returned: 

**Response body** : 

{ status: 400, 

info: “Visit does not exist” } 

## _If client will need to search for retail pharmacies_ 

## Pharmacy list: 

This endpoint accesses our list of pharmacies. Depending on the structure/content of the request JSON, this endpoint will return the first 100 pharmacies that match the search criteria. The request must include at least the zip code for the search to be valid, but may include other parameters as well. 

## **Method** : 

POST 

## **URL** : 

## **Request body** : 

{ name: _String_ (REQUIRED), city: _String_ , state: _String_ (“XX”), zip: _String_ (“XXXXX”), } 

- If there is a successful response, the endpoint will pass back an array of pharmacies that match the search criteria. 

## **Response body** : 

{ status: 200, data: [array of pharmacy objects] } 

● If there is an error, the endpoint will pass that error back to the request origin: 

## **Response body** : 

{ status: _Error status code_ data: _Error response data_ } 

- If the endpoint is hit with an empty search request payload, it will respond with an error message: 

## **Response body** : 

{ status: 400, data: “Invalid search parameters” } 

## Update visit/Resend prescription: 

This endpoint accepts visit update data and/or preference data for resending/updating a prescription. We will return specific error responses if there is any missing or malformed data before processing the request details. 

** Please do not allow any data fields to be sent as null, undefined, or empty string. ** 

## **Method** : 

POST 

**URL** : 

## **Request body** : 

{ patientPreference: Array [ Object { name: String (REQUIRED), strength: String (REQUIRED), refills: String (REQUIRED), quantity: String (REQUIRED), daysSupply: _String_ , medId: String (REQUIRED) } (REQUIRED), ... ] (REQUIRED), pharmacyId: String (REQUIRED), masterId: String (REQUIRED), apiKey: String (REQUIRED) 

} 

- If the visit is updated successfully without resulting in a new prescription, we will return the following response. This situation would happen if a visit has not been resolved by a doctor yet: 

## **Response body** : 

{ status: “VISIT_DATA_UPDATED”, info: “Visit data updated for {masterId}” } 

- If a new prescription is sent successfully, we will return the following response: **Response body** : 

{ status: “NEW_RX_SENT”, info: “Successfully prescribed {medIds}”, medsPrescribed: Array [ Object { rxName: String, rxStrength: String, rxRefills: String, rxQuantity: String, rxId: String, medId: String }, ... ] } 

- If the masterId does not match any record in our system, the following response will be returned: 

**Response body** : 

{ status: ”NO_VISIT”, info: “No visit found for masterId {masterId}” } 

- If the visit was originally referred by a doctor, the following response will be returned: **Response body** : 

{ status: ”VISIT_WAS_REFERRED”, info: “The visit {masterId} was referred by a doctor” } 

- If there have already been the agreed number of retries for this visit, we will return the following response: 

## **Response body** : 

{ status: ”TOO_MANY_RETRIES”, info: "Rx retries limit reached for masterId {masterId}" } 

- If the incoming patientPreference packageNDC does not match the dosage category of the original prescription, we will return the following response: **Response body** : 

{ status: “CATEGORY_MISMATCH”, info: "Preference mismatch between original rx and {medIds}" } 

- If the incoming pharmacyId does not match the incoming packageNDC for the same pharmacy (if the packageNDC has an associated pharmacy), we will return the following response: 

## **Response body** : 

{ status: ”PHARMACY_MISMATCH”, info: "Pharmacy mismatch between {pharmacyId} and {medIds}" } 

- If the original prescription was sent greater than 7 days before the request, we will return the following response: 

## **Response body** : 

{ status: ”TOO_LONG_AGO”, info: "Rx was sent too long ago for masterId {masterId}" } 

- If an error occurred sending the electronic prescription, we will return the following response: 

**Response body** : 

{ status: “RX_ERROR”, info: "Something went wrong, please try again" } 

- If any other error occurs, we will return the following response: **Response body** : 

{ status: “GENERIC”, info: "System error: {error}" } 

## Patient name update: 

This is an endpoint for updating a patient’s name in the Beluga system to match the name in  your system. Please note the exact object structure, field names and capitalization. 

## **Method** : 

POST 

**URL** : 

## **Request body** : 

{ masterId: String (REQUIRED), firstName: String (max length 100) (REQUIRED), lastName: String (max length 100) (REQUIRED), } 

- If the patient name is updated successfully, the following response will be returned: **Response body** : 

{ status: 200, info: “Successfully updated patient name” } 

- If the patient’s name and photo ID have already been approved by Beluga’s doctors, the following response will be returned: 

**Response body** : 

{ status: 400, info: “Name change no longer allowed” } 

- If the masterId does not match any record in our system, the following response will be returned: 

**Response body** : 

{ status: 400, info: “Visit does not exist” } 

- If the data format or length of any field is incorrect, the following response will be returned: 

**Response body** : 

{ status: 400, info: “Data format incorrect” } 

- If there is an error for any other reason, the following response will be returned: **Response body** : 

{ status: 400, info: “Error accepting name change” } 

## Visit data: 

This endpoint returns visit-specific data for the masterId sent in the query parameter. 

## **Method** : 

GET 

**URL** : 

● Success response: 

{ status: 200, masterId: _String_ , visitStatus: _String_ (ONLY: “active”, “pending”, “admin”, “resolved”, “holding”, “canceled”), updateTimestamp: _Date_ (datetime format YYYY-MM-DDTHH:mm:ss.sssZ), resolvedStatus: _String_ (ONLY: “open”, “closed”), resolvedTimestamp: _Date_ (datetime format YYYY-MM-DDTHH:mm:ss.sssZ) (ONLY included if resolvedStatus = “closed”), "labResults": [ { "screeningDate": _String_ , "testName": _String_ , "testResult": _String_ , "testResultUnits": _String_ , "refRange": _String_ , "statusIndicator": _String_ , "reportDate": _String_ , "deviceType": _String_ }, ... ], data: { formObj: { consentsSigned: _Boolean_ , firstName: _String_ , lastName: _String_ , dob: _String_ (MM/DD/YYYY), phone: _String_ (10 characters), email: _String_ , address: _String_ , city: _String_ , state: _String_ , zip: _String_ , sex: _String_ (ONLY “Male”, “Female”, “Other”), selfReportedMeds: _String_ , allergies: _String_ , medicalConditions: _String_ , patientPreference: _Array_ [ 

_Object_ { name: _String_ , strength: _String_ , quantity: _String_ , refills: _String_ , medId: _String_ , }, ... ], intakeResults: _Array_ [ _Object_ { question: _String_ , answer: _String_ }, ... ] }, visitType: _String_ , rxHistory: _Array_ [ _Object_ { rxTimestamp: _Date_ (datetime format YYYY-MM-DDTHH:mm:ss.sssZ), favoriteName: _String_ (Beluga system name), name: _String_ (medication on rx), medId: _String_ , refills: _String_ , quantity: _String_ , strength: _String_ , daysSupply: _String_ , unit: _String_ , pharmacyNotes: _String_ , pharmacyName: _String_ , rxId: _String_ } ] } } 

- If there is an authorization error, we will return the following: **Status code** : 400 

   - **Response body** : None 

- If there is no found visit, we will return the following: **Status code** : 200 

## **Response body** : 

{ status: 400, error: "Visit not found" } 

## Patient data: 

This endpoint returns patient-specific data for the phone number sent in the query parameter. Please use the 10 digit phone number, only digits, no punctuation. 

## **Method** : 

GET 

## **URL** : 

● Success response: 

{ status: 200, data: { firstName: _String_ , lastName: _String_ , dob: _String_ (MM/DD/YYYY), phone: _String_ (10 characters), email: _String_ , address: _String_ , city: _String_ , state: _String_ , zip: _String_ , sex: _String_ (ONLY “Male”, “Female”, “Other”), selfReportedMeds: _String_ , allergies: _String_ , medicalConditions: _String_ , visits: _Array_ [ _String_ (masterId) ] } } 

- If there is an authorization error, we will return the following: 

**Status code** : 400 **Response body** : None 

- If there is no found patient, we will return the following: 

   - **Status code** : 200 **Response body** : 

{ status: 400, error: "Patient not found" } 

## Additional error responses for /external/updateVisit endpoint: 

- If the original AUTHORIZATION favorite was for 1 month and the incoming preference is not for 1 month (3 month, etc.), we will return the following response: **Response body** : 

{ status: ”DURATION_MISMATCH”, info: "Duration mismatch between AUTHORIZATION and {medIds}" } 

- If the original AUTHORIZATION favorite was for “maintenance” and the incoming preference is for “titrating”, we will return the following response: **Response body** : 

{ status: ”TITRATION_MISMATCH”, info: "Titration mismatch between AUTHORIZATION and {medIds}" } 

## Automatic titration prescription: 

This endpoint accepts preference data for sending the next titration prescription. We will return specific error responses if there is any missing or malformed data before processing the request details. **Please note that this endpoint requires a single patientPreference item only.** 

** Please do not allow any data fields to be sent as null, undefined, or empty string. ** 

## **Method** : 

POST 

## **URL** : 

## **Request body** : 

{ patientPreference: _Array_ [ _Object_ { name: _String_ (REQUIRED), strength: _String_ (REQUIRED), refills: _String_ (REQUIRED), quantity: _String_ (REQUIRED), medId: _String_ (REQUIRED) } (REQUIRED) ] (array length 1) (REQUIRED), pharmacyId: _String_ (REQUIRED), masterId: _String_ (REQUIRED) } 

- If a new prescription is sent successfully, we will return the following response: **Response body** : 

{ status: “NEW_RX_SENT”, info: “Successfully prescribed {medIds}”, medsPrescribed: _Array_ [ _Object_ { rxName: _String_ , rxStrength: _String_ , rxRefills: _String_ , rxQuantity: _String_ , rxId: _String_ , medId: _String_ } ] } 

- If any required data fields are missing or malformed, the following response will be returned: 

**Response body** : 

{ status: ”GENERIC”, 

info: “Missing required payload fields” 

} 

- If the masterId does not match any record in our system, the following response will be returned: 

## **Response body** : 

{ status: ”NO_VISIT”, info: “No visit found for masterId {masterId}” 

} 

- If the visit was originally referred by a doctor, the following response will be returned: **Response body** : 

{ status: ”VISIT_WAS_REFERRED”, info: “The visit {masterId} was referred by a doctor” } 

- If the visit has not been resolved by a doctor yet, the following response will be returned: **Response body** : 

{ status: ”NOT_RESOLVED”, info: “Visit has not been resolved” } 

- If the incoming masterId does not match the most recent, resolved, weightloss (or weightlossfollowup) visit, for this company, the following response will be returned: **Response body** : 

{ status: ”VISIT_MISMATCH”, info: “Visit mismatch” } 

- If there have already been the max number of months of medication prescribed for this visit, we will return the following response: 

   - **Response body** : 

{ status: ”MAX_MONTHS_REACHED”, info: "Maximum months reached for masterId {masterId}" 

} 

- If visit was resolved more than **180 days ago** , we will return the following response: **Response body** : 

{ status: ”TOO_LONG_AGO”, info: "Rx was sent too long ago for masterId {masterId}" } 

- If visit was resolved more than **90 days ago** , AND the patient does NOT have a weightlossCheckin visit created at least **75 days** after the original visit was resolved, we will return the following response: 

**Response body** : 

{ status: ”NEEDS_CHECKIN”, info: "Patient needs check-in visit" } 

- If any data field in the patientPreference is missing or malformed, we will return the following response: 

**Response body** : 

{ status: “GENERIC”, info: "patientPreference fields error" } 

- If the incoming patientPreference item does not match any preference in the Beluga system, we will return the following response: 

**Response body** : 

{ status: “CATEGORY_MISMATCH”, info: "No match for {pref}" } 

- If there is more than a single item in the patientPreference array, we will return the following response: 

**Response body** : 

{ status: “TOO_MANY_ITEMS”, 

info: "Too many preferences" 

} 

- If the incoming patientPreference item does not match ALL of the following criteria, we will return the following response: 

   - weightloss preference 

   - preference matches the medication type (semaglutide, tirzepatide) of the original rx 

## **Response body** : 

{ status: “CATEGORY_MISMATCH”, info: "Ineligible product type" } 

- If the incoming patientPreference item does not match the appropriate next titration category, we will return the following response: **Response body** : 

{ status: “CATEGORY_MISMATCH”, info: "Ineligible product category" } 

- If the patient requires a followup visit based on the data in their most recent 

   - weightlossCheckin visit, we will return the following response: **Response body** : 

{ status: “FOLLOWUP_REQUIRED”, info: "Patient needs followup visit" } 

- If the incoming pharmacyId does not match the incoming preference for the same pharmacy (if the preference has an associated pharmacy), we will return the following response: 

**Response body** : 

{ status: ”PHARMACY_MISMATCH”, info: "Pharmacy mismatch between {pharmacyId} and {medIds}" } 

- If the visit’s most recent prescription was sent: 

   - in **production** (1-month Rx): less than **15 days ago** or greater than **60 days ago** , 

   - in **production** (3-month Rx): less than **60 days ago** or greater than **120 days ago** , 

- in **staging** environment: less than **1 minute ago** or greater than **4 days ago** , 

- we will return the following response: 

## **Response body** : 

{ status: ”RX_TIME_OUT_OF_RANGE”, info: "Time between previous rx and request is out of range" } 

- If an error occurred sending the electronic prescription, we will return the following response: 

## **Response body** : 

{ status: “RX_ERROR”, info: "Something went wrong, please try again" } 

- If the original AUTHORIZATION favorite was for “maintenance” and the incoming preference is for “titrating”, we will return the following response: **Response body** : 

{ status: ”TITRATION_MISMATCH”, info: "Titration mismatch between AUTHORIZATION and {medIds}" } 

- If any other error occurs, we will return the following response: 

**Response body** : 

{ status: “GENERIC”, info: "System error: {error}" } 

## weightlossCheckin visit submission: 

This specification is only applicable for a weightlossCheckin visit. We will return specific error responses if there is any missing or malformed data before processing the visit details. 

## **Method** : 

POST 

## **URL** : 

{base url}/visit/{standard visit creation path} 

## **Request body** : 

{ formObj: { {standard patient demographic data fields, _no patientPreference_ }, titration: _String_ (ONLY: - “Increase” - “Decrease” - “Stay the same” ) (REQUIRED), BMI: _String_ (only digits, ex. “23”) (REQUIRED), {specific intake questions for weightlossCheckin} }, {standard request body data fields} 

} 

- If the visit is created successfully, we will return the standard success response. If patient answers “Yes“ to any of the intake questions, we will return a different success response: 

## **Response body** : 

{ status: 200, info: “Patient needs to submit a followup visit”, {standard success response fields} } 

- The standard visit creation error conditions apply, additional visit type-specific errors: **Response body** : 

_- If titration does not pass validation_ { status: 400, error: "Titration details missing" } _- If BMI does not pass validation:_ { status: 400, error: "BMI malformed or missing" } _- If BMI <_ _**19** :_ { status: 400, error: "BMI below eligibility level" } _- If initial autoRx visit has not been resolved yet:_ { status: 400, error: "Patient has not resolved initial visit yet" } _- If patient’s most recent resolved weightloss or weightlossfollowupvisit is for a different client OR if that visit was not processed as an autoRx visit:_ { status: 400, error: "Patient not eligible for this visitType" } 

