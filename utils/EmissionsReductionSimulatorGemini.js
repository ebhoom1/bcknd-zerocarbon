require("dotenv").config();
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const schema = {
  description: "Emissions Reduction Impact Analysis",
  type: SchemaType.OBJECT,
  properties: {
    reduction: {
      type: SchemaType.NUMBER,
      description: "Estimated reduction in CO2 emissions in tonnes",
      nullable: false,
    },
    savings: {
      type: SchemaType.NUMBER,
      description: "Estimated financial savings from reduction strategies in USD",
      nullable: false,
    },
    investment: {
      type: SchemaType.NUMBER,
      description: "Estimated investment required for implementing reduction strategies in USD",
      nullable: false,
    }
  },
  required: ["reduction", "savings", "investment"],
};

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

exports.analyseEmissionsReduction = async (
  strategyAdjustments,
  energyConsumption,
  fuelUsage,
  buildingEfficiency,
  vehicleFleet,
  wasteManagement,
  carbonCapture,
  financialConstraints,
  policyChanges
) => {
  try {
    const sampleOutput = {
      reduction: 18.5,  // Estimated CO2e reduction in tonnes
      savings: 50000,   // Estimated financial savings in USD
      investment: 150000 // Estimated investment required in USD
    };

    const prompt = `
      Given the following emissions reduction impact analysis:
      ${JSON.stringify(sampleOutput, null, 2)}

      Generate a similar analysis for an organization with:
      - **Strategy Adjustments:** ${strategyAdjustments}
      - **Current Energy Consumption:** ${energyConsumption} kWh annually.
      - **Fuel Usage:** ${fuelUsage} liters of petrol/diesel/natural gas annually.
      - **Building Efficiency Data:** ${buildingEfficiency}.
      - **Vehicle Fleet Data:** ${vehicleFleet} petrol/diesel vehicles, planned EV transition.
      - **Waste Management Practices:** ${wasteManagement}.
      - **Carbon Capture/Offset Programs:** ${carbonCapture}.
      - **Financial Constraints:** ${financialConstraints} budget for reduction strategies.
      - **Expected Policy Changes:** ${policyChanges}.

      Provide only the estimated CO2e reduction in tonnes, cost savings in USD, and the investment required in USD.
    `;

    const results = await model.generateContent(prompt);
    let responseText = results.response.text();

    // Remove markdown code block markers if present
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
    console.error("Error in AI calculation:", error.message);
    return { error: error.message };
  }
};
