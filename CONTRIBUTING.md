# Contributing to Quill

Thanks for helping improve Quill.

## Priorities

During the early releases, please prioritize:

1. source integrity;
2. cursor/selection behavior;
3. Chinese/CJK IME behavior;
4. undo/redo correctness;
5. Windows reliability;
6. performance;
7. only then additional visible features.

## Development

```bash
npm install
npm run tauri:dev
```

## Pull requests

Keep changes focused. For editor behavior, describe:

- Markdown input used to reproduce the behavior;
- cursor/selection location;
- expected visual result;
- expected raw Markdown result;
- whether undo/redo and IME were tested.

Do not introduce a second authoritative representation of document content without an explicit architecture discussion.

## Licensing

By submitting a contribution, you agree that your contribution can be distributed under the repository's MIT license.

If code is based on or adapted from another project, state the source and license explicitly in the pull request.
