import ThemeConfig from "./theme";
import GlobalStyles from "./theme/globalStyles";
import WalletGenerator from "./components/WalletGenerator";

function App() {
  return (
    <ThemeConfig>
      <GlobalStyles />
      <WalletGenerator />
    </ThemeConfig>
  );
}

export default App;
