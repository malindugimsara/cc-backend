import Student from "../modules/student.js";

export function getStudent(req, res) {
    Student.find().then (
        (students) => {
            res.json(students);
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error fetching students",
                error: err
            });
        }
    )
}

export function postStudent(req, res) {
    const student = new Student(req.body);

    student.save().then(
        () => {
            res.json({
                message: "Student data saved successfully"
            });
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error saving student data",
                error: err
            });
        }
    )
}