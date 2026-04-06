# AGENTS.md

Repository rules for coding agents working in this project.

## Non-Negotiable Rule

- All coding MUST follow strict TDD.
- Required cycle: Red -> Green -> Refactor.
- Red: write or update a failing test that defines the behavior first.
- Green: write the minimum production code needed to make the test pass.
- Refactor: improve the code while keeping the tests green.
- Do not write production code before there is a failing test that justifies it.
- Any bug fix must begin with a regression test that fails before the fix.
- Run the relevant tests after each change and keep the suite passing.

## General Expectations

- Prefer the smallest correct change.
- Preserve readability and maintainability.
- Do not add behavior that is not covered by tests.
- Use atomic commits only.
- Each commit must contain one logical change that can be described clearly and reverted safely.
