import { app } from "./app.js";

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`server started on port ${PORT}`);
});
