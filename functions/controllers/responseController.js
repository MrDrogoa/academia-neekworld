const ResponseModel = require('../models/responseModel');
const EvaluationModel = require('../models/evaluationModel');
const EnrollmentModel = require('../models/enrollmentModel');

// Enviar respuesta a una evaluación
const submitResponse = async (req, res) => {
  try {
    const { evaluationId, answers, timeSpent, flaggedQuestions } = req.body;
    const userId = req.user.uid;

    if (!evaluationId || !answers || typeof answers !== 'object') {
      return res.status(400).json({ 
        message: 'Datos incompletos. Se requiere ID de la evaluación y respuestas.' 
      });
    }

    // Validar que la evaluación existe
    const evaluation = await EvaluationModel.findById(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ message: 'La evaluación no existe' });
    }

    // Verificar que el usuario está inscrito en el curso
    const enrollment = await EnrollmentModel.findByUserAndCourse(userId, evaluation.courseId);
    if (!enrollment) {
      return res.status(403).json({ message: 'No estás inscrito en este curso' });
    }

    // Verificar si la evaluación está disponible
    const now = new Date();
    const availableFrom = evaluation.availableFrom ? new Date(evaluation.availableFrom) : null;
    const availableUntil = evaluation.availableUntil ? new Date(evaluation.availableUntil) : null;

    if (availableFrom && now < availableFrom) {
      return res.status(400).json({ message: 'La evaluación aún no está disponible' });
    }

    if (availableUntil && now > availableUntil) {
      return res.status(400).json({ message: 'La evaluación ya no está disponible' });
    }

    try {
      // Calcular puntuación automáticamente
      const gradeResult = await calculateAutomaticGrade(evaluation, answers);
      
      // Crear respuesta con datos completos
      const responseData = {
        userId,
        evaluationId,
        answers,
        timeSpent: timeSpent || null,
        flaggedQuestions: flaggedQuestions || {},
        score: gradeResult.score,
        maxScore: gradeResult.maxScore,
        percentage: gradeResult.percentage,
        correctAnswers: gradeResult.correctAnswers,
        incorrectAnswers: gradeResult.incorrectAnswers,
        unanswered: gradeResult.unanswered,
        detailedResults: gradeResult.detailedResults,
        submittedAt: new Date(),
        gradeDate: new Date(),
        status: 'completed'
      };

      const result = await ResponseModel.submitResponse(responseData);
      
      // Actualizar progreso del curso si es necesario
      await updateCourseProgress(userId, evaluation.courseId);
      
      res.status(201).json({
        message: 'Respuestas enviadas correctamente',
        id: result.id,
        score: gradeResult.score,
        maxScore: gradeResult.maxScore,
        percentage: gradeResult.percentage,
        correctAnswers: gradeResult.correctAnswers,
        incorrectAnswers: gradeResult.incorrectAnswers,
        unanswered: gradeResult.unanswered
      });
    } catch (error) {
      if (error.message === 'Ya has respondido esta evaluación') {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error al enviar respuesta:', error);
    res.status(500).json({ 
      message: 'Error al procesar las respuestas', 
      details: error.message 
    });
  }
};

// Obtener historial de evaluaciones completadas por el usuario
const getCompletedEvaluations = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const evaluationsHistory = await ResponseModel.getCompletedEvaluations(userId);
    
    res.status(200).json({
      completed: evaluationsHistory.length,
      evaluations: evaluationsHistory
    });
  } catch (error) {
    console.error('Error al obtener historial de evaluaciones:', error);
    res.status(500).json({ 
      message: 'Error al obtener historial de evaluaciones', 
      details: error.message 
    });
  }
};

// Obtener una respuesta específica por ID
const getResponseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const userRole = req.user.role;

    const response = await ResponseModel.findById(id);
    if (!response) {
      return res.status(404).json({ message: 'Respuesta no encontrada' });
    }

    // Verificar permisos - el usuario debe ser el dueño de la respuesta o instructor
    if (response.userId !== userId && userRole !== 'instructor' && userRole !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para ver esta respuesta' });
    }

    // Obtener datos de la evaluación
    const evaluation = await EvaluationModel.findById(response.evaluationId);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluación no encontrada' });
    }

    res.status(200).json({
      ...response,
      evaluation
    });
  } catch (error) {
    console.error('Error al obtener respuesta:', error);
    res.status(500).json({ 
      message: 'Error al obtener respuesta', 
      details: error.message 
    });
  }
};

// Obtener respuestas de una evaluación (solo instructores)
const getEvaluationResponses = async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const userRole = req.user.role;

    if (userRole !== 'instructor' && userRole !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para ver estas respuestas' });
    }

    const responses = await ResponseModel.findByEvaluationId(evaluationId);
    const evaluation = await EvaluationModel.findById(evaluationId);

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluación no encontrada' });
    }

    // Calcular estadísticas
    const stats = calculateEvaluationStats(responses);

    res.status(200).json({
      evaluation,
      responses,
      statistics: stats
    });
  } catch (error) {
    console.error('Error al obtener respuestas de evaluación:', error);
    res.status(500).json({ 
      message: 'Error al obtener respuestas de evaluación', 
      details: error.message 
    });
  }
};

// Calificar respuesta manualmente (para preguntas abiertas)
const gradeResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { manualGrades, feedback, finalScore } = req.body;
    const userRole = req.user.role;

    if (userRole !== 'instructor' && userRole !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para calificar respuestas' });
    }

    const response = await ResponseModel.findById(id);
    if (!response) {
      return res.status(404).json({ message: 'Respuesta no encontrada' });
    }

    const updatedResponse = await ResponseModel.updateGrade(id, {
      manualGrades,
      instructorFeedback: feedback,
      finalScore: finalScore || response.score,
      gradeDate: new Date(),
      gradedBy: req.user.uid,
      status: 'graded'
    });

    res.status(200).json({
      message: 'Respuesta calificada correctamente',
      response: updatedResponse
    });
  } catch (error) {
    console.error('Error al calificar respuesta:', error);
    res.status(500).json({ 
      message: 'Error al calificar respuesta', 
      details: error.message 
    });
  }
};

// Funciones auxiliares
const calculateAutomaticGrade = async (evaluation, answers) => {
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unanswered = 0;
  let totalScore = 0;
  let maxScore = 0;
  const detailedResults = {};

  evaluation.questions.forEach((question, index) => {
    const userAnswer = answers[index];
    const questionPoints = question.points || 1;
    maxScore += questionPoints;

    if (userAnswer === undefined || userAnswer === null) {
      unanswered++;
      detailedResults[index] = {
        correct: false,
        points: 0,
        maxPoints: questionPoints
      };
      return;
    }

    let isCorrect = false;

    switch (question.type) {
      case 'multiple-choice':
      case 'true-false':
        isCorrect = userAnswer === question.correctAnswer;
        break;
      
      case 'multiple-select':
        if (Array.isArray(userAnswer) && Array.isArray(question.correctAnswer)) {
          const userSorted = [...userAnswer].sort();
          const correctSorted = [...question.correctAnswer].sort();
          isCorrect = JSON.stringify(userSorted) === JSON.stringify(correctSorted);
        }
        break;
      
      case 'open-text':
        // Las preguntas abiertas necesitan calificación manual
        isCorrect = false; // Se calificarán manualmente
        break;
    }

    if (isCorrect) {
      correctAnswers++;
      totalScore += questionPoints;
    } else {
      incorrectAnswers++;
    }

    detailedResults[index] = {
      correct: isCorrect,
      points: isCorrect ? questionPoints : 0,
      maxPoints: questionPoints
    };
  });

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return {
    score: totalScore,
    maxScore,
    percentage,
    correctAnswers,
    incorrectAnswers,
    unanswered,
    detailedResults
  };
};

const calculateEvaluationStats = (responses) => {
  if (!responses || responses.length === 0) {
    return {
      totalResponses: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passRate: 0
    };
  }

  const scores = responses.map(r => r.percentage || 0);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);
  const passRate = (scores.filter(score => score >= 60).length / scores.length) * 100;

  return {
    totalResponses: responses.length,
    averageScore: Math.round(averageScore),
    highestScore,
    lowestScore,
    passRate: Math.round(passRate)
  };
};

const updateCourseProgress = async (userId, courseId) => {
  try {
    // Aquí podrías actualizar el progreso del curso
    // Por ejemplo, marcar evaluaciones como completadas
    console.log(`Actualizando progreso del curso ${courseId} para usuario ${userId}`);
  } catch (error) {
    console.error('Error actualizando progreso del curso:', error);
  }
};

module.exports = {
  submitResponse,
  getCompletedEvaluations,
  getResponseById,
  getEvaluationResponses,
  gradeResponse
};
