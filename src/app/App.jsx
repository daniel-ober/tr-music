import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "./routes";
import SiteShell from "../components/layout/SiteShell";

export default function App() {
  return (
    <BrowserRouter>
      <SiteShell>
        <RoutesConfig />
      </SiteShell>
    </BrowserRouter>
  );
}