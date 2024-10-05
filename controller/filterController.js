import Quiz from "../models/CompanyExamModel.js";

export async function filteration(req, res) {
    const { grade, subject, minMarks, maxMarks, completedDateFrom, completedDateTo } = req.query;

    const filter = { username: req.user.username };

    if (grade) filter.grade = parseInt(grade);
    if (subject) filter.subject = subject;

    try {
        const quizzes = await Quiz.find(filter);

        // Apply further filtering to oldSubmissions
        const filteredQuizzes = quizzes.map(quiz => {
            const filteredSubmissions = quiz.oldSubmissions.filter(submission => {
                let match = true;

                if (minMarks) match = match && submission.score >= parseInt(minMarks);
                if (maxMarks) match = match && submission.score <= parseInt(maxMarks);

                if (completedDateFrom || completedDateTo) {
                    const submissionDate = new Date(submission.completedAt);

                    if (completedDateFrom) {
                        const [day, month, year] = completedDateFrom.split('/');
                        const fromDate = new Date(year, month - 1, day, 0, 0, 0, 0);
                        match = match && submissionDate >= fromDate;
                    }

                    if (completedDateTo) {
                        const [day, month, year] = completedDateTo.split('/');
                        const toDate = new Date(year, month - 1, day, 23, 59, 59, 999);
                        match = match && submissionDate <= toDate;
                    }
                }

                return match;
            });

            // Return only quizzes that have filtered submissions
            return filteredSubmissions.length > 0 ? { ...quiz._doc, oldSubmissions: filteredSubmissions } : null;
        }).filter(quiz => quiz !== null);

        res.status(200).json({ data: filteredQuizzes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
    }
}
