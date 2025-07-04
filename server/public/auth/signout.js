document.getElementById("signoutBtn").addEventListener("click", async () => {
  try {
    const res = await fetch("/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.ok) {
      window.location.href = "/login";
    } else {
      const text = await res.text(); 
      console.error("Logout failed response:", text);
      alert("Logout failed");
    }
  } catch (err) {
    console.error("Error logging out", err);
    alert("Error logging out");
  }
});
