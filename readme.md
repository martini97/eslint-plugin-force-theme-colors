# eslint-plugin-force-theme-colors

This plugin is meant to force the use of variables from the styled theme, and
avoid using the color values directly.

## force-theme-colors

Valid:
```javascript
const myStyle = css`color: ${({ theme }) => theme.colors.blue};`
const Component = styled.div`color: ${({ theme }) => theme.colors.red};`
const myStyle = css`color: ${theme.colors.blue};`
const Component = styled.div`color: ${theme.colors.red};`
```

Invalid:
```javascript
const myStyle = css`color: blue;`
const myStyle = css`color: #0000ff;`
const myStyle = css`color: rgb(0, 0, 255);`
const myStyle = css`color: rgba(0, 0, 255, 0);`
const myStyle = css`color: ${isBlue ? "blue" : "red"};`
```
