import Quiz from "../models/quizModel.js";

export async function filteration(req, res) {
    const { grade, subject, minMarks, maxMarks, completedDateFrom, completedDateTo } = req.query;

    const filter = { username: req.user.username };

    if (grade) filter.grade = parseInt(grade);
    if (subject) filter.subject = subject;

    // Prepare the submission filter
    const submissionFilter = {};
    if (minMarks) submissionFilter.score = { $gte: parseInt(minMarks) };
    if (maxMarks) submissionFilter.score = { $lte: parseInt(maxMarks) };

    if (completedDateFrom || completedDateTo) {
        submissionFilter.completedAt = {};
        if (completedDateFrom) {
            let [day, month, year] = completedDateFrom.split('/');

            console.log(new Date(year, month-1, day,23,59,59,999))
            submissionFilter.completedAt.$gte = new Date(year, month - 1, day,23,59,59,999);
        }

        if (completedDateTo) {
            const [day, month, year] = completedDateTo.split('/');
            console.log(new Date(year, month - 1, day,23,59,59,999))
            submissionFilter.completedAt.$lte = new Date(year, month - 1, day,23,59,59,999);
        }
    }

    try {

        const quizzes = await Quiz.find({
            ...filter,
            oldSubmissions: { $elemMatch: submissionFilter }
        });
        console.log(quizzes)    
        res.status(200).json({data:quizzes});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
    }
}
