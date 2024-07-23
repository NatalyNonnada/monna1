import "@/styles/globals.css";
import type { AppProps } from "next/app";
import lightTheme from "../themes/lightTheme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { UiProvider, CartProvider, NonnaProvider, SaleProvider } from "../context";
import 'animate.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UiProvider>
      <CartProvider>
        <NonnaProvider>
          <SaleProvider>
            <ThemeProvider theme={lightTheme}>
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </SaleProvider>
        </NonnaProvider>
      </CartProvider>
    </UiProvider>
  )
}