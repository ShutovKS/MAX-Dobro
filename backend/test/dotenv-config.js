// FILE: backend/test/dotenv-config.js
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Load backend/test/.env before Jest e2e runs.
//   SCOPE: dotenv config from ./test/.env
//   DEPENDS: none
//   LINKS: V-M-BACKEND-BOOTSTRAP
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   dotenv-config - loads e2e environment variables
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

// START_BLOCK_LOAD_ENV
require('dotenv').config({ path: './test/.env' });
// END_BLOCK_LOAD_ENV
