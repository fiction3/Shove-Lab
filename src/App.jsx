import PushFoldTrainer from "./components/PushFoldTrainer.jsx";
import { LanguageProvider } from "./lib/i18n.jsx";

export default function App() {
  return (
    <LanguageProvider>
      <PushFoldTrainer />
    </LanguageProvider>
  );
}
