/**
 * AUTO-GENERATED JSON SCHEMAS FOR CONTRACT TESTING
 * Resource: assets
 */

export const listAssetsResponseSchema = {};

export const assetSummaryResponseSchema = {};

export const getPricesResponseSchema = {};

export const getReturnsResponseSchema = {};

export const ingestAssetsResponseSchema = {
  "properties": {
    "status": {
      "type": "string",
      "title": "Status"
    },
    "results": {
      "additionalProperties": {
        "type": "boolean"
      },
      "type": "object",
      "title": "Results"
    },
    "message": {
      "type": "string",
      "title": "Message"
    }
  },
  "type": "object",
  "required": [
    "status",
    "results",
    "message"
  ],
  "title": "IngestResponse"
};

export const getMacroResponseSchema = {};
