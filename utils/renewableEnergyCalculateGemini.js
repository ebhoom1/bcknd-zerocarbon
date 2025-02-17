

require("dotenv").config();
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const schema = {
  description: "Renewable Energy Impact Analysis",
  type: SchemaType.OBJECT,
  properties: {
    scope2Impact: {
      type: SchemaType.STRING,
      description: "Estimated reduction in Scope 2 CO2 emissions",
      nullable: false,
    },
    paybackPeriod: {
      type: SchemaType.STRING,
      description: "Expected payback period in years",
      nullable: false,
    },
    renewableOptions: {
      type: SchemaType.STRING,
      description: "Recommended local renewable energy sources",
      nullable: false,
    },
  },
  required: ["scope2Impact", "paybackPeriod", "renewableOptions"],
};

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

exports.calculateRenewableImpact = async (
  energyConsumption,
  renewablePercentage,
  solarWindFeasibility,
  gridEnergyMix,
  investmentBudget,
  governmentIncentives,
  batteryStoragePlans,
  siteConstraints
) => {
  try {
    const prompt = `
      Given the following renewable energy data:

      - Current Energy Consumption: ${energyConsumption} kWh
      - Renewable Energy Goals: ${renewablePercentage}%
      - Solar/Wind Feasibility: ${solarWindFeasibility}
      - Grid Energy Mix: ${gridEnergyMix}%
      - Investment Budget: $${investmentBudget}
      - Expected Government Incentives: ${governmentIncentives}
      - Battery Storage Plans: ${batteryStoragePlans}%
      - Site Constraints: ${siteConstraints}

      
      **Provide a concise JSON response with only key values:**
      {
        "scope2Impact": "Estimated reduction of <X> metric tons CO2e per year",
        "paybackPeriod": "<Y> years",
        "renewableOptions": "Recommended local renewable energy sources with estimated generation (e.g., Solar panels: 50,000 kWh/year, Wind turbines: 30,000 kWh/year)."
      }
      
      **Do NOT include any explanations, just formatted JSON output.**
    `;

    const results = await model.generateContent(prompt);
    let responseText = results.response.text();

    // Clean up AI response
    responseText = responseText.trim();
    if (responseText.startsWith("```json")) {
      responseText = responseText.replace(/^```json\s*/, "");
    }
    if (responseText.endsWith("```")) {
      responseText = responseText.replace(/```$/, "");
    }

    // Convert AI response to JSON
    const jsonResponse = JSON.parse(responseText);
    return jsonResponse;
  } catch (error) {
    console.error("Error in AI calculation:", error.message);
    return { error: error.message };
  }
};
