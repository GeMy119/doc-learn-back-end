import questionModel from "../../db/model/questions.model.js";

//? Retrieve all Students
const getAllQuestions = async (req, res) => {
  try {
    // Retrieve questions from the database using Mongoose or any other ORM
    let questions = await questionModel.find(); // Example using Mongoose

    // If no questions are found, handle the case
    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "No questions found in the database" });
    }
    
    // Randomize the order of options for each question
    questions.forEach(question => {
      question.options = shuffleArray(question.options);
    });

    // Randomize the order of questions
    questions = shuffleArray(questions);

    // Send the questions as a JSON response
    res.json({ message: "Here's a list of all questions", questions });
  } catch (error) {
    // Check for specific error types and handle accordingly
    if (error.name === 'MongoError' && error.code === 11000) {
      // Duplicate key error (e.g., unique index violation)
      return res.status(400).json({ error: 'Duplicate key error. Please check your data.' });
    } else if (error.name === 'ValidationError') {
      // Mongoose validation error
      return res.status(400).json({ error: error.message });
    }

    // Log the error for debugging purposes
    console.error('Error fetching questions:', error);

    // Send a generic error response
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export {
  getAllQuestions
}