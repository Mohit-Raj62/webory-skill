export const testController = (req, res) => {
  res.status(200).send({
    success: true,
    message: "Test successfully completed",
  });
};
