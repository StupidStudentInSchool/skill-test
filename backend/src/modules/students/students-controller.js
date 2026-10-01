const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent } = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    // The client builds the filter from the student list screen. It sends the
    // class filter as `class`, while the repository layer expects `className`.
    const { name, className, class: classFilter, section, roll } = req.query;
    const students = await getAllStudents({
        name,
        className: className ?? classFilter,
        section,
        roll,
    });

    res.json({ students });
});

const handleAddStudent = asyncHandler(async (req, res) => {
    const payload = req.body;
    const message = await addNewStudent(payload);

    res.json(message);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    const payload = req.body;
    // `student_add_update` treats a payload with `userId` as an update and a
    // payload without it as an insert, so the route param has to be injected.
    const message = await updateStudent({ ...payload, userId });

    res.json(message);
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await getStudentDetail(id);

    res.json(student);
});

const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    const { id: reviewerId } = req.user;
    const { status } = req.body;
    const message = await setStudentStatus({ userId, reviewerId, status });

    res.json(message);
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
};
