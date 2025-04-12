// scripts/seedStaticQuestionsToAllUsers.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../../models/User");
const UserSurvey = require("../../models/survey/SurveyQuestionModel");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const staticSections = [
  {
    section: "Employee Well-being & Benefits",
    questions: [
      { question: "How satisfied are you with your work-life balance?" },
      { question: "Do you receive paid leave, maternity/paternity leave, and sick leave?" },
      { question: "Does the company offer health insurance benefits?" },
      { question: "Do you feel that your workplace provides mental health support?" },
      { question: "Does your company offer employee assistance programs (EAPs)?" },
      { question: "Does your workplace support flexible work arrangements (remote/hybrid)?" },
      { question: "Does your company have safety policies and training in place?" }
    ],
  },
  {
    section: "Training & Career Development",
    questions: [
      { question: "How many hours of training does each employee receive annually?" },
      { question: "Does the company have a structured career development plan?" },
      { question: "Does the company offer mentorship programs?" },
      { question: "How often do employees receive performance evaluations?" },
      { question: "Do employees receive support for further education/certifications?" }
    ],
  },
  {
    section: "Employee Engagement & Workplace Culture",
    questions: [
      { question: "Do you feel valued at work?" },
      { question: "Does your company encourage employee volunteering?" },
      { question: "How often does the company conduct employee engagement activities?" },
      { question: "Would you recommend your company as a great place to work?" }
    ],
  },
  {
    section: "ESG & Climate Awareness",
    questions: [
      { question: "Does the company provide training on sustainability and ESG goals?" },
      { question: "Are employees aware of their role in reducing the company’s carbon footprint?" },
      { question: "Does the company encourage green commuting (carpooling, EVs, biking)?" }
    ],
  },
];

const seedStaticPerUser = async () => {
  try {
    const users = await User.find({userType:"user"}); // You may limit/filter

    for (let user of users) {
      const exists = await UserSurvey.findOne({ userId: user._id });
      if (!exists) {
        await UserSurvey.create({
          userId: user._id,
          companyName: user.companyName,
          staticQuestions: staticSections.flatMap(sec =>
            sec.questions.map(q => ({
              question: q.question,
              section: sec.section
            }))
          ),
          dynamicQuestions: []
        });
        console.log(`Seeded for ${user.companyName}`);
      }
    }

    console.log("Done seeding static questions per user.");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedStaticPerUser();
