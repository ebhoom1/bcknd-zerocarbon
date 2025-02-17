require("dotenv").config();
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const schema = {
  description: "Decarbonization roadmap milestones",
  type: SchemaType.OBJECT,
  properties: {
    milestones: {
      type: SchemaType.ARRAY,
      description: "Array of milestone objects",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          year: {
            type: SchemaType.STRING,
            description: "Target year for the milestone",
            nullable: false,
          },
          milestone: {
            type: SchemaType.STRING,
            description: "Description of the milestone",
            nullable: false,
          },
          reduction: {
            type: SchemaType.NUMBER,
            description: "Reduction percentage achieved at this milestone",
            nullable: false,
          },
          start: {
            type: SchemaType.NUMBER,
            description: "Start year for the milestone period",
            nullable: false,
          },
          end: {
            type: SchemaType.NUMBER,
            description: "End year for the milestone period",
            nullable: false,
          },
        },
        required: ["year", "milestone", "reduction", "start", "end"],
      },
    },
  },
  required: ["milestones"],
};

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

exports.analyseRoadmap = async (
  industry,
  targetYear,
  totalEmissions,
  annualReduction,
  energyMix,
  technologyAdoption,
  operationalChanges,
  budgetConstraints
) => {
  try {
    const sampleOutput = {
      milestones: [
        {
          year: "2025",
          milestone: "Adopt 50% renewable energy",
          reduction: 20,
          start: 2024,
          end: 2025,
        },
        {
          year: "2027",
          milestone: "Switch 60% of fleet to EVs",
          reduction: 35,
          start: 2025,
          end: 2027,
        },
        {
          year: "2030",
          milestone: "Engage suppliers in carbon-neutral practices",
          reduction: 50,
          start: 2027,
          end: 2030,
        },
        {
          year: "2035",
          milestone: "Improve energy efficiency by 30%",
          reduction: 75,
          start: 2030,
          end: 2035,
        },
        {
          year: "2040",
          milestone: "Achieve Net Zero",
          reduction: 100,
          start: 2035,
          end: 2040,
        },
      ],
    };

    const prompt = `
      Given the following decarbonization roadmap milestones:
      ${JSON.stringify(sampleOutput, null, 2)}
      
      Generate a similar roadmap for the ${industry} industry to reach Net Zero by ${targetYear} starting from ${totalEmissions} tons of CO2 emissions.

      Additional Factors:
      - **Emission Reduction Goals:** The company aims to reduce emissions by ${annualReduction}% annually.
      - **Current Energy Mix:** Currently, ${energyMix} of the company's energy comes from fossil fuels vs renewables.
      - **Planned Technology Adoption:** The company plans to implement ${technologyAdoption} as part of the sustainability plan.
      - **Operational Changes:** The company is considering ${operationalChanges} to reduce emissions further.
      - **Budget Constraints:** The total budget allocated for sustainability initiatives is ${budgetConstraints} USD.
      
      Create a realistic roadmap incorporating these constraints and strategies.
    `;

    const results = await model.generateContent(prompt);
    let responseText = results.response.text();

    // Remove any markdown code block markers if present
    responseText = responseText.trim();
    if (responseText.startsWith("```json")) {
      responseText = responseText.replace(/^```json\s*/, "");
    }
    if (responseText.endsWith("```")) {
      responseText = responseText.replace(/```$/, "");
    }

    // Parse the response text as JSON and return it
    const jsonResponse = JSON.parse(responseText);
    return jsonResponse;
  } catch (error) {
    console.error(error.message);
    return { error: error.message };
  }
};
