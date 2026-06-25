## Usage: 

Please include your staging or production api key in each API request header as specified in the **Authorization** section of this document. These will be shared with you separately. 

## Staging URLS: 

Please note that our api endpoint will only accept HTTPS requests. 

Staging: 

https://api-staging.belugahealth.com 

Production: 

https://api.belugahealth.com 

## Authorization: 

Please use the Authorization header to send through the correct API key based on the environment (staging or production): 

## **Headers** : 

{ Authorization: Bearer {API_KEY} } 

## Endpoints: 

Use the following endpoints to interact with our API. {base url} will change depending on whether you are sending test (staging) data or real (production) data. 

## Visit data: 

This endpoint returns visit-specific data for the masterId sent in the query parameter. 

## **Method** : 

GET 

## **URL** : 

{base url}/visit/externalFetch/{masterId} 

● Success response: 

{ status: 200, masterId: _String_ , visitStatus: _String_ (ONLY: “active”, “pending”, “admin”, “resolved”, “holding”, “canceled”), updateTimestamp: _Date_ (datetime format YYYY-MM-DDTHH:mm:ss.sssZ), resolvedStatus: _String_ (ONLY: “open”, “closed”), resolvedTimestamp: _Date_ (datetime format YYYY-MM-DDTHH:mm:ss.sssZ) (ONLY included if resolvedStatus = “closed”), "labResults": [ { "screeningDate": _String_ , "testName": _String_ , "testResult": _String_ , "testResultUnits": _String_ , "refRange": _String_ , "statusIndicator": _String_ , "reportDate": _String_ , "deviceType": _String_ }, ... ], data: { formObj: { consentsSigned: _Boolean_ , firstName: _String_ , lastName: _String_ , dob: _String_ (MM/DD/YYYY), phone: _String_ (10 characters), email: _String_ , address: _String_ , city: _String_ , state: _String_ , zip: _String_ , sex: _String_ (ONLY “Male”, “Female”, “Other”), selfReportedMeds: _String_ , allergies: _String_ , 

medicalConditions: _String_ , patientPreference: _Array_ [ _Object_ { name: _String_ , strength: _String_ , quantity: _String_ , refills: _String_ , medId: _String_ , }, ... ], currentDose: _String_ (for autoRx program), nextDose: _String_ (for autoRx program), checkinResult: _String_ (for autoRx program, ONLY “staythesame”, “increase”, “decrease”), intakeResults: _Array_ [ _Object_ { question: _String_ , answer: _String_ }, ... ] }, visitType: _String_ , rxHistory: _Array_ [ _Object_ { rxTimestamp: _Date_ (datetime format YYYY-MM-DDTHH:mm:ss.sssZ), favoriteName: _String_ (Beluga system name), name: _String_ (medication on rx), medId: _String_ , refills: _String_ , quantity: _String_ , strength: _String_ , daysSupply: _String_ , unit: _String_ , pharmacyNotes: _String_ , pharmacyName: _String_ , rxId: _String_ } ] } } 

- If there is an authorization error, we will return the following: **Status code** : 400 **Response body** : None 

- If there is no found visit, we will return the following: **Status code** : 200 **Response body** : 

{ status: 400, error: "Visit not found" } 

## Patient data: 

This endpoint returns patient-specific data for the phone number sent in the query parameter. Please use the 10 digit phone number, only digits, no punctuation. 

## **Method** : 

GET 

## **URL** : 

{base url}/patient/externalFetch/{10 digit phone number} 

- Success response: 

{ status: 200, data: { firstName: _String_ , lastName: _String_ , dob: _String_ (MM/DD/YYYY), phone: _String_ (10 characters), email: _String_ , address: _String_ , city: _String_ , state: _String_ , zip: _String_ , sex: _String_ (ONLY “Male”, “Female”, “Other”), selfReportedMeds: _String_ , allergies: _String_ , medicalConditions: _String_ , visits: _Array_ [ _String_ (masterId) 

] } } 

- If there is an authorization error, we will return the following: **Status code** : 400 

   - **Response body** : None 

- If there is no found patient, we will return the following: **Status code** : 200 

**Response body** : 

{ 

status: 400, error: "Patient not found" } 

