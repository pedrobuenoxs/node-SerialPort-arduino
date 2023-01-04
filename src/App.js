import "./App.css";

import Heading from "./components/Heading";
import Promo from "./components/Promo";

function App() {
  return (
    <div className="App">
      <Heading firstName="Bob" />
      <Heading firstName="Pedro" />
      <Promo heading="Hello, World!" promoSubHeading="This is a subheading" />
    </div>
  );
}

export default App;
