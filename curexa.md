This is a comprehensive, production-ready technical reference manual for the **Curexa API and Webhook Integration**, structured directly from the documentation source.

---

# Curexa API Integration Guide

The Curexa API allows telehealth partners to programmatically create, manage, and track prescription and over-the-counter (OTC) fulfillment orders. Curexa operates on an **all-or-nothing shipping policy**: orders containing multiple items are never split-shipped; they are either shipped together or held entirely.

## 1. System Core & Authentication

### Global Connection Parameters

* **Base URL:** `[https://api.curexa.com](https://api.curexa.com)`
* **Data Format:** `application/json` (Payloads and responses)
* **Authentication:** `Basic Auth` HTTP header using credentials provided manually by the Curexa development team.

### Critical Operational Constraints

* **Item Mutability:** Prescriptions (`rx_items`) and OTC products (`otc_items`) **cannot** be modified once an order is created. If order item details must change, you must issue a `Cancel Order` request and submit a new payload under a completely unique `order_id`.
* **Patient Mutability:** Certain demographic information, addresses, and tracking details *can* be dynamically updated via subsequent `POST /orders.php` requests using the same `order_id`.

---

## 2. Patient Identity Matching (eScript Linkage)

Curexa relies on matching API order payloads to electronic prescriptions (eScripts) received by the pharmacy using the **Patient Email Address**. Partners must configure identity mapping using one of two methods:

### Method A: Direct Email Mapping (Preferred)

Set the `patient_id` parameter in the API payload exactly to the patient's email address registered in your eScript platform.

* **eScript Patient Email:** `jane.doe@example.com`
* **API `patient_id` Value:** `jane.doe@example.com`

### Method B: Synthetic Suffix Concat (Fallback)

If your platform utilizes internal alphanumeric IDs, coordinate an exclusive domain suffix (e.g., `@partnerdomain.com`) with Curexa. The pharmacy system automatically concatenates your unique token with the suffix to cross-reference the incoming prescription:


$$\text{API } \texttt{patient\_id} \text{ (e.g., } \texttt{pat123}\text{)} + \text{Domain Suffix (e.g., } \texttt{@partnerdomain.com}\text{)} = \text{Matching Email (} \texttt{pat123@partnerdomain.com}\text{)}$$

---

## 3. Shipping Architecture & Third-Party Carrier Log

Curexa handles standard courier dispatch routing via **Shippo**. Partners are expected to manage shipping logistics profiles directly:

1. Create a dedicated commercial account at [goshippo.com](https://goshippo.com/).
2. Select your preferred carriers and service levels, then generate a production API Key.
3. Configure your Shippo Callback Webhook URL to route updates directly back to Curexa:
`[https://api.curexa.com/tracking.php](https://api.curexa.com/tracking.php)`
4. Provide the Curexa DevOps team with your Shippo API Key and mapping profiles.

---

## 4. API Endpoints Reference

### 4.1 Create or Update an Order

Submits a brand new order configuration or updates patchable client records (demographics/addresses) on an existing unfulfilled record.

* **Endpoint:** `/orders.php`
* **Method:** `POST`

#### JSON Request Schema Definition

##### Root Level Arguments

| Field | Type | Required | Max Length | Notes / Mutation Capability |
| --- | --- | --- | --- | --- |
| `order_id` | String | **Yes** | 100 | Unique partner identifier. |
| `patient_id` | String | **Yes** | 100 | Unique identity token used for eScript matching. |
| `patient_first_name` | String | **Yes** | 50 | *Can Update* |
| `patient_last_name` | String | **Yes** | 50 | *Can Update* |
| `patient_dob` | String | **Yes** | 8 | Format: `YYYYMMDD`. *Can Update* |
| `patient_gender` | String | No | 10 | Explicit options: `male`, `female` |
| `patient_ssn` | String | No | 9 | Numeric formatting without hyphens. *Can Update* |
| `patient_driver_license_number` | String | No | 255 | *Can Update* |
| `patient_driver_license_state_code` | String | No | 2 | 2-character ISO state code. *Can Update* |
| `carrier` | String | No | 50 | Explicit options: `UPS`, `USPS`, `FEDEX`. *Can Update* |
| `shipping_method` | String | No | 50 | Options: `usps_priority`, `usps_first`, `usps_priority_express`, `fedex_ground`, `fedex_standard_overnight`, `fedex_priority_overnight`. Defaults to `usps_first`. *Can Update* |
| `insurance_provider` | String | No | 10 | Options: `FEDEX`, `UPS`, `ONTRAC`, `SHIPPO` (uses Shippo internal insurance policy). |
| `insurance_amount` | Decimal | Conditional | - | **Required** if `insurance_provider` is provided. |
| `insurance_contents` | String | Conditional | 50 | **Required** if `insurance_provider` is provided. Content declaration. |
| `address_to_name` | String | **Yes** | 255 | Delivery Recipient Name. *Can Update* |
| `address_to_street1` | String | **Yes** | 255 | Primary Street Line. *Can Update* |
| `address_to_street2` | String | No | 255 | Suite/Apt line. *Can Update* |
| `address_to_city` | String | **Yes** | 255 | Destination City. *Can Update* |
| `address_to_state` | String | **Yes** | 2 | 2-character state abbreviation. *Can Update* |
| `address_to_zip` | String | **Yes** | 20 | Accepts standard 5-digit or ZIP+4 formats. *Can Update* |
| `address_to_country` | String | **Yes** | 2 | 2-character ISO country code (e.g., `US`). *Can Update* |
| `address_to_phone` | String | **Yes** | 28 | Contact phone. *Can Update* |
| `patient_known_allergies` | String | **Yes** | 10240 | Comma-delimited list. Pass an empty string or "None" if NKA. *Can Update* |
| `patient_other_medications` | String | **Yes** | 10240 | Comma-delimited list of concurrent drug lines. *Can Update* |
| `pref_language` | String | No | 50 | Standard selections: `"en"` or `"es"`. |
| `rx_items` | Array | No | - | Array containing zero or more `rx_item` blocks. |
| `otc_items` | Array | No | - | Array containing zero or more `otc_item` blocks. |

##### `rx_items` Array Structure

```json
// Embedded object within rx_items array
{
  "rx_id": "String (Max 200, Optional) - External prescription mapping ID",
  "medication_name": "String (Max 255, Required) - Full label description",
  "quantity_dispensed": "Number (Required) - Count of individual metric units/pills",
  "days_supply": "Number (Required) - Intended length of course",
  "prescribing_doctor": "String (Max 255, Required) - Clinician full identity",
  "medication_sig": "String (Max 255, Required) - Complete clinical patient administration directions",
  "non_child_resistant_acknowledgment": "String (Required) - 'true' or 'false'",
  "is_refill": "String (Optional) - 'true' or 'false'",
  "treatment_type": "String (Max 50, Optional) - Categorization token for patient educational inserts",
  "compound_base": "String (Max 50, Optional) - Vehicle identifier for customized formula builds",
  "pref_packaging": "String (Max 50, Optional) - Explicit instructions when structural options exist",
  "is_replacement": "String (Optional) - 'true' or 'false'",
  "replaced_order_id": "String (Max 100, Optional) - Original broken order tracking string",
  "replacement_reason": "String (Max 255, Optional) - Free-text audit trail documentation",
  "replacement_responsible_party": "Number (Optional) - Options: 1 (Lost/Stolen - Split Cost), 2 (Consistency Complaint - Curexa Fault), 3 (Damaged Pump - Curexa Fault), 4 (Wrong Address - Partner Fault)"
}

```

##### `otc_items` Array Structure

```json
// Embedded object within otc_items array
{
  "name": "String (Max 255, Required) - Retail name of product",
  "quantity": "Number (Required) - Structural pack count",
  "is_replacement": "String (Optional) - 'true' or 'false'",
  "replaced_order_id": "String (Max 50, Optional) - Reference to initial error order ID",
  "replacement_reason": "String (Max 255, Optional) - Free-text metadata explaining dispatch details",
  "replacement_responsible_party": "Number (Optional) - Valid values matching structural code map [1-4]",
  "weight": "Array (Optional) - Structured weight arrays mapping to component payload specs"
}

```

#### Order Interaction Examples

##### Request: New Order Submission

```http
POST /orders.php HTTP/1.1
Host: https://api.curexa.com
Authorization: Basic aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa=
Content-Type: application/json

{
    "order_id": "ORDER1234567",
    "patient_id": "PATIENT1234567",
    "patient_first_name": "Jimmie",
    "patient_last_name": "Leeds",
    "patient_dob": "19690101",
    "patient_gender": "male",
    "patient_known_allergies": "",
    "patient_other_medications": "No, I am not taking any of the above medications",
    "shipping_method": "ups_ground",
    "carrier": "ups",
    "address_to_name": "Jimmie Leeds",
    "address_to_street1": "236 E Jimmie Leeds Road",
    "address_to_street2": "",
    "address_to_city": "Galloway",
    "address_to_state": "NJ",
    "address_to_zip": "08205",
    "address_to_country": "US",
    "address_to_phone": "15555555555",
    "rx_items": [
        {
            "is_replacement": "false",
            "replaced_order_id": null,
            "replacement_reason": null,
            "rx_id": null,
            "medication_name": "Prescription Name",
            "quantity_dispensed": 1,
            "days_supply": 30,
            "prescribing_doctor": "John Golden",
            "medication_sig": "Use as Prescribed",
            "non_child_resistant_acknowledgment": "true",
            "treatment_type": "TP",
            "is_refill": "false"
        }
    ],
    "otc_items": [
        {
            "name": "Over the Counter Wipes",
            "quantity": 1
        }
    ]
}

```

##### Response: Successful Order Intercept

```json
{
    "order_id": "ORDER1234567",
    "rx_item_count": 1,
    "otc_item_count": 1,
    "status": "success",
    "message": "A new order was received successfully. Updates will be sent to your callback URL."
}

```

##### Request: Update Existing Order Demographic

```http
POST /orders.php HTTP/1.1
Host: https://api.curexa.com
Authorization: Basic aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa=
Content-Type: application/json

{
    "order_id": "ORDER1234567",
    "patient_id": "PATIENT1234567",
    "patient_first_name": "James",
    "patient_last_name": "Leads",
    "patient_dob": "19690102",
    "patient_gender": "male",
    "patient_known_allergies": "None",
    "patient_other_medications": "None",
    "shipping_method": "usps_first",
    "carrier": "usps",
    "address_to_name": "Jamie Leads",
    "address_to_street1": "255 E Jimmie Leeds Road",
    "address_to_street2": "Apt1",
    "address_to_city": "Noway",
    "address_to_state": "NC",
    "address_to_zip": "08255",
    "address_to_country": "US",
    "address_to_phone": "14567891541"
}

```

##### Response: Successful Profile Patch

```json
{
    "order_id": "ORDER1234567",
    "rx_item_count": 0,
    "otc_item_count": 0,
    "status": "success",
    "message": "An existing order was updated successfully."
}

```

##### Response: Data Validation Failure Execution

```json
{
    "order_id": "ORDER_ID_123",
    "rx_item_count": 0,
    "otc_item_count": 0,
    "status": "failed",
    "message": "The address to state must not be greater than 2 characters."
}

```

---

### 4.2 Attach Order Media

Appends documentation images, regulatory PDF charts, or scanned medical intake assets directly to an existing active prescription workflow.

* **Endpoint:** `/order/{orderId}/media`
* **Method:** `POST`

#### Requirements & Guardrails

* **Order Condition:** The matching order configuration must be created in the database prior to processing files.
* **Size Ceiling:** Absolute maximum single asset payload limit is **10MB**.
* **Whitelisted Mime/File Formats:** `bmp`, `heic`, `heif`, `jpg`, `jpeg`, `pdf`, `png`, `tif`, `tiff`, `webp`.
* **Status Exclusions:** Processing drops with error responses if target orders are flagged as `cancelled` or have transitioned out to carriers under `out_for_delivery`.

---

### 4.3 Pull Order Status

Enables real-time tracking of fulfillment states via programmatic polling.

* **Endpoint:** `/order_status.php`
* **Method:** `POST`

#### Request Payload

```json
{
  "order_id": "ORDER1234567" // Required, String (Max 100)
}

```

#### Response Structure

```json
{
    "order_id": "ORDER1234567",
    "status": "out_for_delivery", 
    "status_details": null,
    "carrier": "USPS",
    "tracking_number": "ABC123"
}

```

#### Core System State Flags (`status` Codes)

* `new`: Order ingestion acknowledged; queue processing pending.
* `in_progress`: Active review, clinical check, or lab compounding ongoing.
* `out_for_delivery`: Package handed over to courier; tracking fields populated.
* `cancelled`: System drop confirmation.
* `completed`: Direct logistics validation of doorstep arrival.
* `error`: Exception halt triggered. Refer to `status_details`.

#### Exception Handling Log (`status_details` Mapping)

When an order drops into an `error` state, the `status_details` block will return one of the following exact string responses:

| Returned `status_details` Token | Clinical Operational Root Cause |
| --- | --- |
| `Bad Address` | Delivery coordinates fail standard address parsing engine validation. |
| `Duplicate Order` | Active safety block: identical overlapping items found for this patient profile. |
| `Missing Electronic Prescription` | Order manifest received via API, but matching clinical eScript has not landed. |
| `Clarification Required: Allergies` | Explicit drug allergen declaration missing or requires human validation. |
| `Clarification Required: Other Medications` | Concurrent therapy documentation requires immediate confirmation. |
| `No Refills Remaining` | Current authorized medical refills on file stand at zero. |
| `Prescription Expired` | Script data exceeds legal validity date limits. |
| `Regulated Item – Refill Too Soon` | DEA/State monitoring constraint triggered on a scheduled compound refill request. |
| `Clarification of Patient Date of Birth` | API-transmitted DOB discrepancies relative to received master prescription. |
| `Clarification of Patient Name` | Structural alpha name variance detected between API and incoming script. |
| `Duplicate Patient ID` | Internal patient records conflict; entity already linked to a separate ID. |
| `Prescription Transferred Out` | Script records closed due to explicit outside retail fulfillment routing. |
| `Other` | Internal pharmacy issue. High-touch manual helpdesk ticket created. |

---

### 4.4 Cancel Order

Forbids dispatch pipelines from finalizing staging arrays when issues occur upstream.

* **Endpoint:** `/cancel_order.php`
* **Method:** `POST`

#### Operational Warning

If an order is marked `out_for_delivery` with an assigned tracking token, API termination requests will fail to intercept shipment dispatch. Partners must immediately escalate to a voice or direct channel with Curexa Support Teams.

#### Request Schema

```json
{
  "order_id": "ordervalid123213213" // Required, String (Max 100)
}

```

#### Response Schema

```json
{
  "order_id": "ordervalid123213213",
  "status": "success",
  "msg": "The order has been cancelled."
}

```

---

### 4.5 Two-Way Clinical Support Messaging

Provides a programmatic communication loop to resolve operational or demographic bottlenecks (e.g., resolving an address mismatch or confirming updated patient records) without stepping away from platform layouts.

* **Endpoint:** `/messaging.php`
* **Method:** `POST`

#### Message Parameters Definition

| Field | Type | Required | Max Length | Details |
| --- | --- | --- | --- | --- |
| `order_id` | String | **Yes** | 255 | Targeted reference context token. |
| `body` | Longtext | **Yes** | - | Literal string text of the transmission message. |
| `message_created_on` | String | **Yes** | - | ISO 8601 formatting variation: `Y-m-d H:i:s`. |
| `message_type` | Number | No | - | Defaults internally to `1`. |
| `user_id` | String | No | 50 | Internal audit tag for tracking the sending agent. |
| `patient_id` | String | No | 255 | Patient identifier mapping tag. |
| `message_priority` | Number | No | - | Options: `1` (High Priority), `2` (Normal Priority). |

#### Request Example

```http
POST /messaging.php HTTP/1.1
Host: https://api.curexa.com
Authorization: Basic aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa=
Content-Type: application/json

{
    "order_id": "ORDERID1230",
    "body": "Resent Electronic Prescription",
    "message_created_on": "2025-01-01 00:00:00",
    "message_type": 1,
    "user_id": "johndoe",
    "patient_id": "PATIENT123",
    "message_priority": 1
}

```

#### Response Example

```json
{
  "message": "success"
}

```

---

## 5. Automated Webhook Subscriptions

To eliminate wasteful API polling loops, partners must implement an event listener endpoint. Curexa pushes immediate state transitions using structured JSON payloads.

### Supported Authentication Options

Curexa securely wraps outgoing callbacks inside the partner's choice of native authentication structures:

* Standard Basic Authentication Headers
* HMAC SHA-256 Signatures
* Custom Authorization Token Strings
* Standard Bearer Tokens

### 5.1 Order Status Lifecycle Webhook

Fires immediately as a tracking record progresses through fulfillment or encounters exceptions.

* **Method:** `POST`
* **Payload Schema:** Identical to the response object structure defined in the **Pull Order Status API** (`4.3`).

#### Status Webhook JSON Blueprint Example

```json
{
    "order_id": "ORDER1234567",
    "status": "new",
    "status_details": null,
    "carrier" : "USPS",
    "tracking_number": null
}

```

### 5.2 Direct Messaging Webhook

Fires whenever Curexa pharmacy staff post a comment, clinical warning, or administrative clarification regarding an active order profile.

* **Method:** `POST`
* **Payload Schema:** Matches the structure outlined in the **Two-Way Clinical Support Messaging API** (`4.5`).

#### Inbound Messaging Webhook Payload Example

```json
{
    "order_id": "ORDERID1230",
    "body": "Resent Electronic Prescription",
    "message_created_on": "2025-01-01 00:00:00",
    "message_type": 1,
    "user_id": "johndoe",
    "patient_id": "PATIENT123",
    "message_priority": 1
}

```