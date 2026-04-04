export default async function loginUser(email, password) {
  return {
    _id: "1",
    role: email.includes("faculty") ? "faculty" : "student"
  };
}