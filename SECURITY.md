# Security Policy

Quill is currently an early prototype.

For security-sensitive reports, avoid posting exploit details in a public GitHub issue. Contact the repository owner through an appropriate private channel until a dedicated security reporting address is established.

Areas that should be treated as security-sensitive include:

- path traversal or unintended filesystem access;
- plugin permission bypasses (when plugins are introduced);
- command/shell execution;
- remote embed content;
- updater/signature validation;
- handling of untrusted Markdown/HTML content.

The current v0.1 application does not expose a third-party plugin runtime.
