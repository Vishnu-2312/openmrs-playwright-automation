# OpenMRS Playwright Testing

Automated test suite for OpenMRS: [https://dev3.openmrs.org/openmrs/index.htm](https://dev3.openmrs.org/openmrs/index.htm).

---

## ⚙️ Environment Configuration (`.env`)

All URLs, credentials, and search queries are configured in `.env` without any hardcoding:

```env
# OpenMRS URLs
BASE_URL=https://dev3.openmrs.org/openmrs/
LOGIN_URL=https://dev3.openmrs.org/openmrs/index.htm
FIND_PATIENT_URL=https://dev3.openmrs.org/openmrs/findPatient.htm

# OpenMRS Credentials
OPENMRS_USERNAME=admin
OPENMRS_PASSWORD=Admin123

# Patient Search Inputs
PATIENT_SEARCH_POSITIVE=john
PATIENT_SEARCH_NEGATIVE=john123
```

---

## 📋 The 2 Scenarios (`tests/patient-search.spec.js`)

1. **Positive Scenario**:
   * Reads credentials and `LOGIN_URL` from `.env`
   * Navigates to **Find/Create Patient**
   * Searches using `PATIENT_SEARCH_POSITIVE` (`john`)
   * Verifies matching patient records are returned in the table
2. **Negative Scenario**:
   * Reads credentials and `LOGIN_URL` from `.env`
   * Navigates to **Find/Create Patient**
   * Searches using `PATIENT_SEARCH_NEGATIVE` (`john123`)
   * Verifies `No matching records found` message is displayed

---

## 🚀 How to Run the Tests

### 1. Watch the browser open and execute (Headed Mode)
```bash
npm run test:headed
```
*(or `npx playwright test --headed`)*

### 2. Run in the background (Headless Mode)
```bash
npm test
```

### 3. Open the HTML Test Report
```bash
npm run report
```
*(or `npx playwright show-report`)*
