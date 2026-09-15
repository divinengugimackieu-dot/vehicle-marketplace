import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/react";

// Generated components use `data-ocid` for test hooks.
configure({ testIdAttribute: "data-ocid" });
