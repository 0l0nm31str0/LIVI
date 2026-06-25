## **Beluga Health Integration Guide** 

## **PRIVATE AND CONFIDENTIAL** 

**This material is the confidential property of Beluga Health. Unauthorized use, disclosure, or distribution is strictly prohibited.** 

## **1. High-Level Workflow** 

1. **Customer visits brand site (Customer or sub-company)** 

2. **Customer selects product / program** 

3. **Dynamic clinical questionnaire is presented** 

4. **Customer completes forms and consents** 

5. **Customer packages data and calls Beluga API** 

6. **Beluga clinicians review and complete visit** 

7. **Beluga sends prescription to appropriate pharmacy** 

8. **Beluga sends status + messages back to Customer via webhooks** 

9. **Customer surfaces updates and messages in its patient portal** 

## ‑ ‑ **2. Detailed Step by Step Workflow** 

## **Step 1: Customer shopping & product selection** 

- Customer browses your ecommerce experience (web or app). 

- Customer selects a health vertical (e.g., weight loss, ED, etc.) with products attached that Beluga supports and that are available at the pharmacy. 

- Health vertical selection determines which clinical questionnaire will be used. 

## **Step 2: Trigger health vertical specific clinical questionnaire** 

- Your platform presents the appropriate questionnaire flow to the patient: 

   - Weight loss → weight loss questionnaire 

   - ED → ED questionnaire 

   - Other products → corresponding questionnaires 

- **Beluga provides** : 

   - Full question sets 

   - Conditional logic 

   - Exclusion criteria 

   - Output mapping and visit types 

- **You build/host** : 

   - The forms in your UI 

   - Conditional branching and validation 

- Any additional UX or branding 

## **Step 3: Patient data capture & consents** 

- Your system collects: 

   - Demographics and medical history 

   - 

   - ○ Product specific clinical answers 

   - Required consents (checkboxes / yes–no) 

   - Any ID verification outputs (booleans, IDs, etc.) 

- 

- ● For multi brand/platform use: 

   - 

   - ○ Additional fields identify which sub company/brand the visit belongs to. 

## **Step 4: Package visit into JSON and send to Beluga** 

- Your backend compiles all form data into a JSON object aligned with Beluga’s schema, including: 

   - Patient info 

   - Clinical responses 

   - Consents 

   - Requested Product SKU / medId 

   - 

   - ○ Platform company / sub company identifiers (if applicable) 

- Your system calls Beluga’s visit-creation endpoint with this JSON. 

- Beluga returns: 

   - Synchronous acknowledgement / success response when the visit is accepted. 

## **Step 5: Beluga clinical workflow** 

- Beluga ingests the JSON and: 

   - Creates a new clinical visit. 

   - Routes the case to an appropriate provider. 

- Beluga provider completes the evaluation and: 

   - Approves, modifies, or declines treatment. 

   - Generates a prescription when appropriate. 

## **Step 6: Pharmacy routing** 

- Each product in your catalog maps to a medId /SKU. 

- When Beluga processes the visit: 

   - 

   - You can: 

      - 

      - ■ Use Beluga contracted pharmacies where our pricing is advantageous. ■ Use your existing pharmacies for other products. 

- Result: 

   - Beluga transmits the prescription to the correct pharmacy based on the medId and the pharmacyid submitted in the visit creation . 

## **Step 7: Status updates via webhooks** 

- As the visit progresses, Beluga sends webhooks back to your system, including: 

   - Visit outcome (approved/denied) 

   - Prescription written / sent to pharmacy 

   - Other key lifecycle updates 

- Your system consumes these webhooks and updates internal state and customer UI. 

## **Step 8: Ongoing patient–provider messaging (via your portal)** 

- 

- ● Because you already have a patient portal, messaging is API driven: (if you do not have a patient portal, communication can be via SMS) 

   - Beluga **pushes** provider messages to your system via API. 

   - Your system **displays** messages in your portal / app. 

   - When patients reply, your system **sends responses back** to Beluga via webhook/API. 

- Result: 

   - All patient communication appears native to your brand. 

   - Beluga maintains complete clinical record and audit trail. 

## **Step 9: Refills and reminders** 

- Your platform can handle: 

   - Refill reminders 

   - 

   - ○ Follow up flows (e.g., updated questionnaires if needed) 

- When a refill request needs clinical review: 

   - 

   - ○ You repeat Steps 3–8 with a refill specific questionnaire and payload. 

Links to API documentation: 

API Document 

Webhooks Document 

GET Requests API Documents 

## **Copyright © 2026 Beluga Health. All Rights Reserved.** 

This document and its contents are protected by copyright law. Clients of Beluga Health are granted permission to copy the content solely for the purpose of integrating with Beluga Health services and systems. Any other use, reproduction, distribution, or transmission of this document or its content, in whole or in part, is strictly prohibited without the prior written permission of Beluga Health. For permission requests, contact Beluga Health at info@belugahealth.com. 

