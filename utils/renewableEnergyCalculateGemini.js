require("dotenv").config();
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const schema = {
  description: "Renewable Energy Impact Analysis",
  type: SchemaType.OBJECT,
  properties: {
    scope2Reduction: {
      type: SchemaType.NUMBER,
      description: "Estimated reduction in Scope 2 CO2 emissions in tonnes",
      nullable: false,
    },
    costSavings: {
      type: SchemaType.NUMBER,
      description: "Estimated financial savings from renewable energy adoption in USD",
      nullable: false,
    },
    paybackPeriod: {
      type: SchemaType.NUMBER,
      description: "Expected payback period in years",
      nullable: false,
    },
    solarFeasibility: {
      type: SchemaType.STRING,
      description: "Assessment of solar power feasibility at the site",
      nullable: false,
    },
    gridMixImpact: {
      type: SchemaType.STRING,
      description: "Impact of the local energy grid mix on the renewable transition",
      nullable: false,
    },
    batteryStorageRecommendation: {
      type: SchemaType.STRING,
      description: "Recommended battery storage plan for peak energy balancing",
      nullable: false,
    },
    investmentReturn: {
      type: SchemaType.NUMBER,
      description: "Expected return on investment (ROI) based on budget allocation",
      nullable: false,
    },
    governmentIncentiveBenefit: {
      type: SchemaType.STRING,
      description: "Impact of government incentives on the investment and payback period",
      nullable: false,
    },
    siteConstraintsAnalysis: {
      type: SchemaType.STRING,
      description: "Analysis of site constraints affecting renewable energy installation",
      nullable: false,
    },
  },
  required: [
    "scope2Reduction",
    "costSavings",
    "paybackPeriod",
    "solarFeasibility",
    "gridMixImpact",
    "batteryStorageRecommendation",
    "investmentReturn",
    "governmentIncentiveBenefit",
    "siteConstraintsAnalysis",
  ],
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
    const sampleOutput = {
        "scope2Reduction": 15.8,
        "costSavings": 4500.25,
        "paybackPeriod": 5.2,
        "solarFeasibility": "High",
        "gridMixImpact": "Moderate impact with 40% renewable grid mix",
        "batteryStorageRecommendation": "Battery storage at 50% ensures peak load balancing",
        "investmentReturn": 7.3,
        "governmentIncentiveBenefit": "Eligible for 20% subsidy, reducing payback period",
        "siteConstraintsAnalysis": "Limited rooftop space, ground-mount installation required"
      }
      ;

      const prompt = `
      Given the following renewable energy impact analysis:
      ${JSON.stringify(sampleOutput, null, 2)}
    
      Generate a similar impact analysis for an organization with:
      - **Energy Consumption:** ${energyConsumption} kWh annually.
      - **Renewable Energy Adoption:** ${renewablePercentage}% planned adoption.
      - **Solar/Wind Feasibility:** ${solarWindFeasibility} availability at the site.
      - **Grid Energy Mix:** ${gridEnergyMix} renewable vs fossil fuel ratio.
      - **Investment Budget:** ${investmentBudget} allocated for renewable transition.
      - **Expected Government Incentives:** ${governmentIncentives} available subsidies/tax breaks.
      - **Battery Storage Plans:** ${batteryStoragePlans} percentage of energy stored for peak hours.
      - **Site Constraints:** ${siteConstraints} affecting renewable installation.
    
      **Ensure that all numerical values are provided as actual numbers, without text explanations.**
      
      The response must follow this **exact format**:
      {
        "scope2Reduction": <numeric value in tonnes>,
        "costSavings": <numeric value in USD>,
        "paybackPeriod": <numeric value in years>,
        "solarFeasibility": "<brief high/medium/low>",
        "gridMixImpact": "<brief percentage impact>",
        "batteryStorageRecommendation": "<brief recommendation>",
        "investmentReturn": <numeric ROI in years>,
        "governmentIncentiveBenefit": "<brief incentive impact>",
        "siteConstraintsAnalysis": "<brief constraint summary>"
      }
    
      **Do NOT return any long explanations. Only provide the structured numerical and brief categorical values.**
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
