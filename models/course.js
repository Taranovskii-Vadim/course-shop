const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

class Course {
  constructor(title, price, img) {
    this.id = uuidv4();
    this.title = title;
    this.price = price;
    this.img = img;
  }

  getCurrentCourse() {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      img: this.img,
    };
  }

  static fillFile(courses) {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, "..", "data", "courses.json"),
        JSON.stringify(courses),
        err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async save() {
    const data = await Course.getCourses();
    data.push(this.getCurrentCourse());
    await Course.fillFile(data);
  }

  static async update(body) {
    const courses = await Course.getCourses();
    const index = courses.findIndex(item => item.id === body.id);
    courses[index] = body;
    await Course.fillFile(courses);
  }

  static getCourses() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, "..", "data", "courses.json"),
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(data));
          }
        }
      );
    });
  }

  static async getCourse(id) {
    const courses = await Course.getCourses();
    return courses.find(item => item.id === id);
  }
}

module.exports = Course;
