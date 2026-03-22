

# Question 1:

## Part 1:
* Ranked: 15 most important test cases from the first three steps of the booking process

* 1 - Happy path, Integral business path
    * Validate successful end-to-end booking.
      * Integral path for business and primary revenue driver. Priority #1.

* 2 - Session Security, Server Side Session Token Invalidation upon Sign Out
    * Validate that a valid session token/cookie is invalidated by the server and cannot be reused after User clicks "Sign Out"
      * Security of PII or HIPA protected data is also a paramount priority, especially in a heavily regulated domain.

* 3 - Negative, Payment Auth Failure
    * Validate that in the event of payment decline, validate: 1 - A clear error displays, 2 - Booking is not created. 
      * Failure should be handled gracefully and UI should inform User of reason appropriate to failure, booking should not be reserved without successful payment. (ISF decline, Lost/Stolen card decline, Incorrect CVC/Expiry, etc.)

* 4 - Functional, Data Persistence within session
    * Validate that if User refreshes page in Step 2 or  navigates "back" in the browser from Step 3 to Step 2 the previously entered Questionaire data is preserved.

* 5 - Concurrency, Sucessful booking removes slot from availability.
    * Validate once a slot is booked it becomes unavailable to be booked by another user.
      * Dependent upon business logic of when slot becomes unavailable. (e.g.: When User enters Payment flow, Only when transaction submitted, or only when transaction successful.)

* 6 - Security, Session Timeout Integrity
    * Validate that session timeout occurs as designed, access is lost, token is invalidated, and User is redirected to login.

* 7 - Functional, Mandatory Fields
    * Validate that "Next" button on "Select your Scan" remains disabled if DOB or ASAB lack response.

* 8 - Negative, Invalid Payment Data
    * Validate that expired date or invalid card/CVC entry prevents payment submittal.
    * Validate that "Luhn algorithm" card number failures prevent transaction submittal.

* 9 - Business Logic, Promo Code Correctly Modifies Total Cost.
    * Validate that a valid promo code correctly modifies the total price displayed to User.
      * If applicable: Validate that a valid 100% Promo Code bypasses payment, but books the selected appt.

* 10 - UI/UX/Cross Browser, Mobile end-to-end booking is successful.
    * Validate that booking can be performed on standard mobile browser viewport (375x812)
      * Note: Prioritization of Mobile tests is dependent upon how highly Mobile usage is prioritized by Product/Org.

* 11 - Reliability, Page refresh does not cause duplicate charge.
    * Validate erronious page refresh during pending payment transaction does not generate duplicate charge to User.

* 12 - Resilience, Network Interuption During Payment handled gracefully
    * Validate that a network interuption (Dropped signal, Network Error, Slow Mobile Conn, etc.) is handled gracefuly. (User should be given visual feedback...depending on SLA with payment provider transaction may fail, etc.)

* 13 - UI/UX, Page Navigation Consistency
    * Validate that Nav/Progress bar displays accurately depending on which step the User is on.

* 14 - Business Logic, Race Condition for Booking
    * Validate simultaneous booking attempts for same slot by multiple users results in only one user obtaining the booking in question. 

* 15 - Negative, DOB Boundary
    * Validate that "impossible" DOB values are rejected. (i.e: Future dates, Year 1850, etc.) 


# Question 2

## Part 1
* Objective: Validate that an authenticated user cannot view a medical questionnaire belonging to another user ID via direct URL access or API tampering.

* Setup: Authenticate as User A and save the session state.

* Test: 
  * Load Authentication State: Use User A's stored cookies and tokens.
  * Attempt to access a known resource ID belonging to User B.

* Assert: Failure, (403, or other) and User A unable to access any information. 

* ****Note: If back-end is set up to invalidate token and flag in an instance like this then we would want to validate those outcomes as well.


## Part 2
# These are simple call tests. Would add schema validation and other such tests with better access to source material and better understanding of the systems involved.

* User B checks their own stored medical data (DOB/Sex).
 
    curl -X GET https://api.ezra.com \
        -H "Authorization: Bearer <USER_B_TOKEN>"
    
    * Response: {"dob": "01-01-1985", "sex": "MALE"}


* 

    curl -i -X GET https://api.ezra.com \
        -H "Authorization: Bearer <USER_A_ACCESS_TOKEN>" \
        -H "Content-Type: application/json"

## Part 3
While security tests _could_ be automated for 100+ endpoints, that many endpoints exposed would represent a rather significant and unusual attack surface from an architectural and security standpoint. 

I'd like to know more about the nature of the endpoints in the description and whether they are exposed or internal behind a gateway or revcerse proxy and secured with mTLS. 

If the endpoints are all exposed and there is no other option I would first implement Contract Testing (e.g. Pact) to ensure the _Auth_ header is mandatory across all schemas...then perhaps explore Dynamic App Security Testing tools as an additional measure.
  * PRO: It's much easier and much more economical to thoroughly test a single gateway than 100+ exposed APIs.
  * CON: A Gateway can become a single point of failure for the entire user-facing portion of the system if misconfigured or mismanaged.
