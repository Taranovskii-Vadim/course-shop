const mapCartItems = items =>
  items.map(item => ({
    id: item.courseId.id,
    count: item.count,
    ...item.courseId._doc,
  }));

const calculateTotalPrice = items =>
  items.reduce((acc, item) => (acc += item.count * item.price), 0);

const isOwner = (course, req) =>
  course.userId.toString() === req.user._id.toString();

module.exports = {
  mapCartItems,
  calculateTotalPrice,
  isOwner,
};
