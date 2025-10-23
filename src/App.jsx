import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import AuthProvider from "./contexts/AuthProvider";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
