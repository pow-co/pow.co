import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <div id="drawerControler" />
        <div id="tuningProviderPopupControler" />
        <div id="boostPopupControler" />
        <div id="loveOrdPopupControler"/>
        <NextScript />
      </body>
    </Html>
  )
}
