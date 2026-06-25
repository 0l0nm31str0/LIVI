## Usage: 

These requests will be made to your specified URL endpoint. 

## Events: 

## Consult canceled: 

This event will be triggered if the patient wants to cancel their visit for any reason. 

## **Method** : 

## POST 

## **Request body** : 

{ masterId: _String_ , event: ‘CONSULT_CANCELED’, } 

## Prescription written: 

This event will be triggered if the doctor writes and submits a prescription. 

## **Method** : 

POST 

## **Request body** : 

{ masterId: _String_ , event: ‘RX_WRITTEN’, docName: _String_ , medsPrescribed: _Array_ [ _Object_ { name: _String_ , strength: _String_ , refills: _String_ , quantity: _String_ , medId: _String_ , rxId: _String_ (can be “N/A” if not applicable), 

}, ... ] } 

## Consult concluded: 

This event will be triggered when the doctor concludes the visit, either with writing a prescription or referring the patient. 

## **Method** : 

POST 

## **Request body** : 

{ masterId: _String_ , event: ‘CONSULT_CONCLUDED’, visitOutcome: _String_ (either “prescribed” or “referred”), } 

## _- If client will be using API for doctor < > patient chat_ 

## Chat Events: 

The following event will be passed to your URL. 

## Doctor messages patient: 

This event will be triggered when the doctor sends a message to the patient. 

## **Method** : 

POST 

## **Request body** : 

{ masterId: _String_ , event: “DOCTOR_CHAT”, content: _String_ , } 

## _- If client will be using API for admin < > CS messaging_ 

## Customer Service Events: 

The following event will be passed to your URL. 

## Beluga messages client: 

This event will be triggered when a Beluga admin contacts client customer service. 

## **Method** : 

POST 

## **Request body** : 

{ masterId: _String_ , event: "CS_MESSAGE", content: _String_ , } 

## _If client will be using Beluga Pharmacy Integration_ 

## Pharmacy Status Update: 

This event will be triggered if we receive any status update from the pharmacy about the order. 

**Method** : 

POST 

**Request body** : 

{ masterId: _String_ , orderId: _String_ , event: _String_ (ONLY: "PHARMACY_ORDER_IN_FULFILLMENT", "PHARMACY_ORDER_SHIPPED", "PHARMACY_ORDER_DELIVERED"), info: _Object_ { carrier: _String_ (ONLY: in the "PHARMACY_ORDER_SHIPPED" event), tracking: _String_ (ONLY: in the "PHARMACY_ORDER_SHIPPED" event) } } 

## Lab Status Update: 

This event will be triggered if we receive any status update from the lab about the order. 

## **Method** : 

## POST 

## **Request body** : 

{ masterId: _String_ , orderId: _String_ , event: _String_ (ONLY: "LAB_ORDER_SHIPPED_TO_PATIENT", "LAB_ORDER_DELIVERED_TO_PATIENT", "LAB_ORDER_SHIPPED_TO_LAB", "LAB_ORDER_RECEIVED_BY_LAB", "LAB_ORDER_RESULTS", "LAB_ORDER_REQUISITION_CREATED"), bookingLink: _String_ (ONLY: in the "LAB_ORDER_RESULTS" event), info: _Object_ { carrier: _String_ (ONLY: in the "LAB_ORDER_SHIPPED_TO_PATIENT" and "LAB_ORDER_SHIPPED_TO_LAB" events), tracking: _String_ (ONLY: in the "LAB_ORDER_SHIPPED_TO_PATIENT" and "LAB_ORDER_SHIPPED_TO_LAB" events) }, labReqPdf: String (base64-encoded PDF), (ONLY: in the "LAB_ORDER_REQUISITION_CREATED" event) } 

