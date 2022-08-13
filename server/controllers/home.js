export const home = (req, res) => {
  return res
    .status(200)
    .send("Welcome to the Homepage........ This data is sensitive and directly comming from the server, only logged in users can see this.");
};
