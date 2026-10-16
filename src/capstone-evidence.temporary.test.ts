import { expect, it } from "vitest";

// NOBE capstone evidence only: intentionally fail this PR's Tests check.
// Remove this entire temporary file in the correction commit; keep all real tests.
it("NOBE EVIDENCE ONLY: temporary intentional failure before correction", () => {
  expect("temporary intentional failure").toBe("corrected passing run");
});
