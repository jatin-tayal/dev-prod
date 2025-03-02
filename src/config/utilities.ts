import { UtilityCategory } from "../types";

const utilitiesConfig: UtilityCategory[] = [
  {
    id: "json",
    name: "JSON Utilities",
    description: "Tools for working with JSON data",
    utilities: [
      {
        id: "json-formatter",
        name: "JSON Formatter",
        description: "Format and beautify JSON with customizable indentation",
        path: "/utilities/json-formatter",
        icon: "code",
      },
      {
        id: "json-validator",
        name: "JSON Validator",
        description: "Validate JSON with helpful error messages",
        path: "/utilities/json-validator",
        icon: "check-circle",
      },
      {
        id: "json-path-finder",
        name: "JSON Path Finder",
        description: "Extract data using JSONPath expressions",
        path: "/utilities/json-path-finder",
        icon: "search",
      },
      {
        id: "json-to-string",
        name: "JSON to String",
        description: "Convert JSON to escaped string formats",
        path: "/utilities/json-to-string",
        icon: "arrow-right",
      }
    ],
  },
  {
    id: "string",
    name: "String Manipulation",
    description: "Tools for manipulating text and strings",
    utilities: [
      {
        id: "string-encoder",
        name: "String Encoder/Decoder",
        description: "Encode and decode strings in various formats",
        path: "/utilities/string-encoder",
        icon: "code",
      },
      {
        id: "base64",
        name: "Base64 Conversion",
        description: "Encode and decode Base64 data",
        path: "/utilities/base64",
        icon: "64",
      },
      {
        id: "url-encoder",
        name: "URL Encoder/Decoder",
        description: "Encode and decode URL components",
        path: "/utilities/url-encoder",
        icon: "link",
      },
      {
        id: "case-converter",
        name: "Case Converter",
        description: "Convert between different text cases",
        path: "/utilities/case-converter",
        icon: "type",
      },
    ],
  },
  {
    id: "jwt",
    name: "JWT Token Tools",
    description: "Tools for working with JSON Web Tokens",
    utilities: [
      {
        id: "jwt-decoder",
        name: "JWT Decoder",
        description: "Decode and inspect JWT tokens",
        path: "/utilities/jwt-decoder",
        icon: "key",
      },
      {
        id: "jwt-generator",
        name: "JWT Generator",
        description: "Generate JWT tokens with custom claims",
        path: "/utilities/jwt-generator",
        icon: "plus-circle",
      },
      {
        id: "jwt-verifier",
        name: "JWT Verifier",
        description: "Verify JWT token signatures",
        path: "/utilities/jwt-verifier",
        icon: "shield",
      },
    ],
  },
  {
    id: "web",
    name: "Web Developer Tools",
    description: "Helpful tools for web development",
    utilities: [
      {
        id: "css-beautifier",
        name: "CSS Beautifier",
        description: "Format and beautify CSS code",
        path: "/utilities/css-beautifier",
        icon: "layout",
      },
      {
        id: "html-beautifier",
        name: "HTML Beautifier",
        description: "Format and beautify HTML code",
        path: "/utilities/html-beautifier",
        icon: "code",
      },
      {
        id: "regex-tester",
        name: "RegEx Tester",
        description: "Test and debug regular expressions",
        path: "/utilities/regex-tester",
        icon: "search",
      },
      {
        id: "color-converter",
        name: "Color Converter",
        description: "Convert between color formats (HEX, RGB, HSL)",
        path: "/utilities/color-converter",
        icon: "droplet",
      },
    ],
  },
  {
    id: "converters",
    name: "Data Format Converters",
    description: "Convert between different data formats",
    utilities: [
      {
        id: "json-yaml",
        name: "JSON <> YAML",
        description: "Convert between JSON and YAML formats",
        path: "/utilities/json-yaml",
        icon: "refresh-cw",
      },
      {
        id: "json-xml",
        name: "JSON <> XML",
        description: "Convert between JSON and XML formats",
        path: "/utilities/json-xml",
        icon: "refresh-cw",
      },
      {
        id: "csv-json",
        name: "CSV <> JSON",
        description: "Convert between CSV and JSON formats",
        path: "/utilities/csv-json",
        icon: "refresh-cw",
      },
    ],
  },
  {
    id: "hash",
    name: "Hash Generators",
    description: "Generate and verify hash values",
    utilities: [
      {
        id: "hash-generator",
        name: "Hash Generator",
        description: "Generate hash values (MD5, SHA-1, SHA-256, etc.)",
        path: "/utilities/hash-generator",
        icon: "hash",
      },
      {
        id: "hash-comparison",
        name: "Hash Comparison",
        description: "Compare file or text hashes",
        path: "/utilities/hash-comparison",
        icon: "check-square",
      },
    ],
  },
];

export default utilitiesConfig;
