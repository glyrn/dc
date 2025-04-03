import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #ffffff; /* 白色 */
    --secondary-color: #1d1d1f; /* 深灰色，接近黑色 */
    --accent-color: #0071e3; /* 苹果蓝 */
    --background-color: #ffffff; /* 白色背景 */
    --text-color: #1d1d1f;
    --light-text: #ffffff;
    --gray-text: #86868b; /* 淡灰色文字 */
    --transition: all 0.3s ease;
    --box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    --font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    --font-sans: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-family);
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.47059;
    letter-spacing: -0.022em;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-sans);
    margin-bottom: 0.8rem;
    line-height: 1.1;
    font-weight: 600;
    letter-spacing: -0.022em;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    text-decoration: none;
    color: var(--accent-color);
    transition: var(--transition);
    
    &:hover {
      text-decoration: underline;
    }
  }

  img {
    max-width: 100%;
    display: block;
  }

  button {
    cursor: pointer;
    font-family: var(--font-sans);
    transition: var(--transition);
    background: none;
    border: none;
    outline: none;
  }

  .container {
    width: 980px;
    max-width: 90%;
    margin: 0 auto;
    padding: 0 15px;
  }

  .section {
    padding: 5rem 0;
  }

  @media (max-width: 768px) {
    .section {
      padding: 3rem 0;
    }
  }
`;

export default GlobalStyles; 