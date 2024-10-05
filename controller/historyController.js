import Quiz from "../models/CompanyExamModel.js";
import redis from 'redis';

import { redisClient } from "../config/redisConn.js";

// for getting quiz questions of a particular quiz id
export async function getQuizQuestionData(req, res) {
    const quizId = req.params.quizId;

    try {

        redisClient.get(quizId, async (err, cachedData) => {
            if (err) throw err;

            if (cachedData) {
                const parsedData = JSON.parse(cachedData)
                const formattedData = JSON.stringify(parsedData, null, 2);

                return res.status(200).json(parsedData);
            } else {

                const quiz = await Quiz.findOne({ quizId, username: req.user.username });

                if (!quiz) {
                    return res.status(404).json({ message: 'Quiz not found' });
                }

                const sanitizedQuizContent = quiz.quizContent.map(({ answer, ...rest }) => rest);
                


                redisClient.set(quizId,JSON.stringify(sanitizedQuizContent)); 

                res.status(200).json({ data: sanitizedQuizContent });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving submissions', error });
    }
}

// for getting all submissions of a particular quiz id
export async function getAllSubmissionForQuizID(req, res) {
    const quizId = req.params.quizId;

    try {
        redisClient.get(`${quizId}-submissions`, async (err, cachedData) => {
            if (err) throw err;

            if (cachedData) {
                const parsedData = JSON.parse(cachedData)
                const formattedData = JSON.stringify(parsedData, null, 2);

                return res.status(200).json(parsedData);
            } else {
                const quiz = await Quiz.findOne({ quizId });

                if (!quiz) {
                    return res.status(404).json({ message: 'Quiz not found' });
                }

                const submissions = quiz.oldSubmissions;
                const formattedSubmissions = submissions.map(submission => ({
                    score: submission.score,
                    completedAt: submission.completedAt,
                    responses: submission.responses.map(response => ({
                        questionId: response.questionId,
                        userResponse: response.userResponse
                    }))
                }));

                redisClient.set(`${quizId}-submissions`, JSON.stringify(formattedSubmissions,null,2)); 

                res.json({ length: submissions.length, data: submissions });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving submissions', error });
    }
}
