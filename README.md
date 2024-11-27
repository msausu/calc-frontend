# NTD Calculator Frontend

## Tech Stack, choose from: Java, Clojure, MySQL, Node.js, Go, Python, Vue.js/React.js, AWS.

- [x] React (Vite)

## Repos

- [x] Frontend and Backend should be on separate stacks.
- [x] Frontend and Backend should be on separate repos.

## Technical requirements

### Frontend requirements

- [x] use a Bootstrap or Material Design library (CSS/Design Library) of your choice. YES React Material UI (mui)
- [x] make sure that the current balance is always visible (always display the User Balance and its value should be deducted immediately each time an operation is performed.)
- [x] Login and "sign out" button anywhere available for all session-required screens, YES the exit button in the Calculator
    - [x] A simple username and password input form
- [x] new Operation
    - [x] an input form providing all fields to request a new operation on behalf of the current user, YES the Calculator keypad 
- [x] user Records
    - [x] Datatable of all operation records from the current user
    - [x] Datatable should have pagination (page number and per-page option) and sorting, Yes for Dates and Operation Names
    - [x] Datatable should have a filter/search input field for partial matches, YES for Operation Names
    - [x] Delete button to delete records, YES in the Datatable, when deleting elements the current "page" will reflect that deletion removing those elements, but it won'r refresh the page implicitly
- [x] operations should be able to handle negative numbers. For example (-1) - (-5) = 4, YES but no parenthesis only one operation at a time (no expressions)
- [x] add automated tests such as Unit Tests front-end

## Behaviour

- The display is at most 31 chars and readonly
- Invalid operations are shown in the display and have to be cleared with the ⇤ key, or `del` key when in focus
- The random operation always provides 8 random numbers
- Negative numbers are prefixed with `-`, for a subtraction of a negative number use `--`, eg. `-3--4`.
- `tab` and `shift-tab` navigate forth and back among keys  

## Improvements

- [ ] improve TypeScript typing
- [ ] add a spinner 
