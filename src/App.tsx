
const App = () => {
  // Dummy data
  const user = { name: "Ravi", age: 28, role: "Developer" };
  const users = [
    { id: 1, name: "Ravi", role: "Admin" },
    { id: 2, name: "John", role: "Editor" },
    { id: 3, name: "Sara", role: "Viewer" },
  ];

  console.clear(); // Clears previous logs

  // 1. Basic log
  console.log("User Data:", user);

  // 2. Info message
  console.info("Application started successfully");

  // 3. Warning message
  console.warn("Warning: API response time is slow");

  // 4. Error message
  console.error("Error: Failed to load dashboard");

  // 5. Table log
  console.table(users);

  // 6. Group logs
  console.group("User Details");
  console.log("Name:", user.name);
  console.log("Role:", user.role);
  console.groupEnd();

  // 7. Assert log (only prints if condition is false)
  console.assert(user.age < 18, "User is not under 18"); // Won't run (28 >= 18)

  // 8. Execution time tracking
  console.time("Loop Time");
  for (let i = 0; i < 500000; i++) {}
  console.timeEnd("Loop Time");

  // 9. Count how many times it's called
  function loginAttempt() {
    console.count("Login Attempt Count");
  }
  loginAttempt();
  loginAttempt();
  loginAttempt();

  // 10. Debug message
  console.debug("Debug Message: User object", user);

  return <div>App</div>;
};

export default App;
