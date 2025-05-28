// // utils/report/generateBRSRSectionCData.js
// const SectionCSubmission = require("../../models/report/sectionCsubmission");
// const BRSRSectionC = require("../../models/report/BRSRSectionC");

// async function generateBRSRSectionCData(userId, year) {
//   const submission = await SectionCSubmission.findOne({ userId, year });
//   if (!submission) return;

//   const mappings = [];

//   for (const disclosure of submission.disclosures) {
//     const number = disclosure.principleNumber;

//     switch (number) {
//       case 1:
//         mappings.push(
//           {
//             qno: "2",
//             fieldName:
//               "Details of fines / penalties/punishment/ award/compounding fees/ settlementamount",
//             report: [`principle1.finesPenaltiesDetails`],
//           },
//           {
//             qno: "4",
//             fieldName: "Details of anti-corruption or anti- bribery policy",
//             report: [
//               `principle1.antiCorruptionRiskAssessment`,
//               `principle1.antiCorruptionInternalControls`,
//               `principle1.antiCorruptionComplaintMechanism`,
//               `principle1.antiCorruptionTrainingCoverage`,
//             ],
//           },
//           {
//             qno: "2L",
//             fieldName:
//               "Processes to avoid/ manage conflict of interests involving members of the Board/ KMPs",
//             report: [`principle1.conflictOfInterestProcesses`],
//           }
//         );
//         break;
//       case 2:
//         mappings.push(
//           {
//             qno: "2",
//             fieldName: "Sustainable sourcing",
//             report: [`principle2.sustainablePolicy`],
//           },
//           {
//             qno: "3",
//             fieldName:
//               "Processes in place to reclaim products for reuse, recycle and safe disposal of products at the end of life",
//             report: [`principle2.circularEconomyPractices`],
//           },
//           {
//             qno: "4",
//             fieldName: "Extended Producer Responsibility (EPR) plan",
//             report: [`principle2.eprPlan`],
//           },
//           {
//             qno: "1L",
//             fieldName: "Life cycle assessment",
//             report: [`principle2.lifecycleRiskAssessment`],
//           },
//           {
//             qno: "4L",
//             fieldName:
//               "Recycled or reused input material as percentage of total input material",
//             report: [`principle2.percentSustainableDesign`],
//           },
//           {
//             qno: "6L",
//             fieldName:
//               "Reclaimed products and their packaging materials (as percentage of products sold) for each product category.",
//             report: [`principle2.reclaimedProductData`],
//           }
//         );
//         break;
//       case 3:
//         mappings.push(
//           {
//             qno: "1",
//             fieldName: "Measures for well-being of employees and workers",
//             report: [`principle3.wellbeingMeasures`],
//           },
//           {
//             qno: "3",
//             fieldName: "Accessibility of workplaces",
//             report: [`principle3.accessibilityOfWorkplace`],
//           },
//           {
//             qno: "5",
//             fieldName:
//               "Return to work and Retention rates of permanent employees / workers",
//             report: [`principle3.parentalLeaveReturnAndRetentionRates`],
//           },
//           {
//             qno: "8",
//             fieldName:
//               "Details of Training imparted to the employees and workers on health & safety",
//             report: [`principle3.trainingOnHealthSafetyAndSkill`],
//           },
//           {
//             qno: "9",
//             fieldName: "Details of performance and career development review",
//             report: [`principle3.performanceAndCareerReview`],
//           },
//           {
//             qno: "10",
//             fieldName: "Health and safety management system",
//             report: [`principle3.healthAndSafetyManagementSystem`],
//           },
//           {
//             qno: "11",
//             fieldName: "Details of safety-related incidents",
//             report: [`principle3.safetyIncidents`],
//           },
//           {
//             qno: "12",
//             fieldName:
//               "Measures taken by the entity to ensure a safe and healthy workplace",
//             report: [`principle3.safeAndHealthyWorkplaceMeasures`],
//           },
//           {
//             qno: "3L",
//             fieldName:
//               "Rehabilitation and suitable employment of employees/workers with high consequence injuries",
//             report: [`principle3.rehabilitationAndAlternateEmployment`],
//           }
//         );
//         break;
//       case 4:
//         mappings.push(
//           {
//             qno: "1",
//             fieldName: "Process for identification of key stakeholders",
//             report: [`principle4.stakeholderIdentificationProcess`],
//           },
//           {
//             qno: "2",
//             fieldName: "Key stakeholder groups",
//             report: [`principle4.keyStakeholderGroupsInfo`],
//           },
//           {
//             qno: "2L",
//             fieldName:
//               "Using stakeholderconsultation to support theidentification andmanagement ofenvironmental, and socialtopics.",
//             report: [`principle4.stakeholderConsultationImpact`],
//           },
//           {
//             qno: "3L",
//             fieldName:
//               "Details of instances of engagement with and actions taken to address the concerns of vulnerable/marginalized groups.",
//             report: [`principle4.vulnerableGroupConcerns`],
//           }
//         );
//         break;

//         case 5:
//           mappings.push(
//             {
//               qno: "1",
//               fieldName: "Training on human rights issues and policies",
//               report: [`principle5.humanRightsTraining`]
//             },
//             {
//               qno: "3",
//               fieldName: "Details of Remuneration/salary/wages (including for differently abled persons)",
//               report: [`principle5.remunerationPractices`]
//             },
//             {
//               qno: "6",
//               fieldName: "Disclosure of complaints made by employees and workers on sexual harassment, discrimination at workplace, Child Labour, Forced Labour/Involuntary Labour, Wages or other human rights related issues",
//               report: [`principle5.humanRightsComplaintsDisclosure`]
//             }
//           );
//           break;
//           case 6:
//             mappings.push(
//               {
//                 qno: "1",
//                 fieldName: "Details of total energy consumption and energy intensity",
//                 report:[ `principle${number}.totalEnergyConsumption`]
//               },
             
//               {
//                 qno: "2",
//                 fieldName: "PAT scheme of the Government of India",
//                 report:[ `principle${number}.patSchemeParticipation`]
//               },
//               {
//                 qno: "3",
//                 fieldName: "Details of total water withdrawn, consumed and water intensity ratio",
//                 report: [`principle${number}.totalWaterUse`]
//               },
//               {
//                 qno: "4",
//                 fieldName: "Zero Liquid Discharge policy",
//                 report: [`principle${number}.zeroLiquidDischargePolicy`]
//               },
//               {
//                 qno: "5",
//                 fieldName: "Disclosure of air emissions (other than GHG emissions)",
//                 report: [`principle${number}.airEmissions`]
//               },
//               {
//                 qno: "6",
//                 fieldName: "Details of Scope 1 and Scope 2 greenhouse gas (GHG) emissions and GHG intensity",
//                 report: [`principle${number}.scope1And2Emissions`]
//               },
//               {
//                 qno: "8",
//                 fieldName: "Details of waste generated, recycled & re-used and disposed off",
//                 report: [`principle${number}.wasteGenerated`]
//               },
//               {
//                 qno: "9",
//                 fieldName: "Description of waste management practices",
//                 report: [`principle${number}.wasteManagementPractices`]
//               },
//               {
//                 qno: "11",
//                 fieldName: "Details of Environmental Impact Assessments (EIA)",
//                 report: [`principle${number}.eiaDetails`]
//               },
//               {
//                 qno: "1L",
//                 fieldName: "Break-up of the total energy consumed from renewable and non-renewable sources",
//                 report: [`principle${number}.renewableVsNonRenewable`]
//               },
//               {
//                 qno: "2L",
//                 fieldName: "Details of water discharged ",
//                 report: [`principle${number}.waterDischarge`]
//               },
//                {
//                 qno: "3L",
//                 fieldName: "Details of water withdrawn, consumed and water intensity ratio",
//                 report: [`principle${number}.totalWaterUse`,`principle${number}.waterStressAreas`]
//               },
//               {
//                 qno: "4L",
//                 fieldName: "Scope 3 emissions",
//                 report: [`principle${number}.scope3Emissions`]
//               },
 
//               {
//                 qno: "5L",
//                 fieldName: "Impact on biodiversity",
//                 report:[ `principle${number}.biodiversityImpact`]
//               }
//             );
//             break;
//             case 7:
//               mappings.push(
//                 {
//                   qno: "1",
//                   fieldName: "Details of public policy positions advocated by the entity",
//                   report: [
//                     `principle${number}.policyIssuesAdvocated`,
//                     `principle${number}.advocacyMethods`,
//                     `principle${number}.isDisclosurePublic`,
//                     `principle${number}.boardReviewFrequency`,
//                     `principle${number}.disclosureLink`,
//                   ]
//                 }
//               );
//               break;
//               case 8:
//                 mappings.push(
//                   {
//                     qno: "1",
//                     fieldName: "Details of Social Impact Assessments (SIA)",
//                     report: [`principle${number}.socialImpactAssessment`]
//                   },
//                   {
//                     qno: "3",
//                     fieldName: "Describe the mechanisms to receive grievances of the local community",
//                     report: [`principle${number}.localCommunityGrievance`]
//                   },
//                   {
//                     qno: "4",
//                     fieldName: "Percentage of inputs directly sourced from MSMEs / small producers",
//                     report: [`principle${number}.msmeSourcingPercent`]
//                   },
                 
//                   {
//                     qno: "2L",
//                     fieldName: "CSR projects undertaken in aspirational districts",
//                     report: [`principle${number}.csrInAspirationalDistricts`]
//                   },
//                   {
//                     qno: "4L",
//                     fieldName: "Details of the benefits derived and shared from the intellectual properties owned/acquired based on traditional knowledge",
//                     report: [`principle${number}.iprTraditionalKnowledge`]
//                   },
//                   {
//                     qno: "6L",
//                     fieldName: "Details of beneficiaries of CSR Projects ",
//                     report: [`principle${number}.csrBeneficiaries`]
//                   },
//                 );
//                 break;
//                 case 9:
//                   mappings.push(
//                     {
//                       qno: "4",
//                       fieldName: "Details of instances of product recalls on account of safety issues",
//                       report: [`principle${number}.productRecalls`],
//                     },
//                     {
//                       qno: "1L",
//                       fieldName: "Channels / platforms where information on goods and services of the business can be accessed",
//                       report: [
//                         `principle${number}.consumerInfoChannels`,
//                         `principle${number}.consumerComplaintMechanism`,
//                         `principle${number}.consumerAwarenessEfforts`,
//                         `principle${number}.dataPrivacyPolicy`
//                       ],
//                     }
//                   );
//                   break;
                   

//       // Future principles (2–9) will go here
//     }
//   }

//   await BRSRSectionC.findOneAndUpdate(
//     { userId, year },
//     { userId, year, data: mappings },
//     { upsert: true, new: true }
//   );
// }

// module.exports = { generateBRSRSectionCData };


const SectionCSubmission = require("../../models/report/sectionCsubmission");
const BRSRSectionC = require("../../models/report/BRSRSectionC");

async function generateBRSRSectionCData(userId, year) {
  const submission = await SectionCSubmission.findOne({ userId, year });
  if (!submission) return;

  const grouped = {};

  for (const disclosure of submission.disclosures) {
    const number = disclosure.principleNumber;
    const principleKey = `principle${number}`;
    grouped[principleKey] = [];

    switch (number) {
      case 1:
        grouped[principleKey].push(
          {
            qno: "2",
            fieldName: "Details of fines / penalties/punishment/ award/compounding fees/ settlementamount",
            report: ["finesPenaltiesDetails"]
          },
          {
            qno: "4",
            fieldName: "Details of anti-corruption or anti- bribery policy",
            report: [
              "antiCorruptionRiskAssessment",
              "antiCorruptionInternalControls",
              "antiCorruptionComplaintMechanism",
              "antiCorruptionTrainingCoverage"
            ]
          },
          {
            qno: "2L",
            fieldName: "Processes to avoid/ manage conflict of interests involving members of the Board/ KMPs",
            report: ["conflictOfInterestProcesses"]
          }
        );
        break;

      case 2:
        grouped[principleKey].push(
          {
            qno: "2",
            fieldName: "Sustainable sourcing",
            report: ["sustainablePolicy"]
          },
          {
            qno: "3",
            fieldName: "Processes in place to reclaim products for reuse, recycle and safe disposal of products at the end of life",
            report: ["circularEconomyPractices"]
          },
          {
            qno: "4",
            fieldName: "Extended Producer Responsibility (EPR) plan",
            report: ["eprPlan"]
          },
          {
            qno: "1L",
            fieldName: "Life cycle assessment",
            report: ["lifecycleRiskAssessment"]
          },
          {
            qno: "4L",
            fieldName: "Recycled or reused input material as percentage of total input material",
            report: ["percentSustainableDesign"]
          },
          {
            qno: "6L",
            fieldName: "Reclaimed products and their packaging materials (as percentage of products sold) for each product category.",
            report: ["reclaimedProductData"]
          }
        );
        break;

      case 3:
        grouped[principleKey].push(
          { qno: "1", fieldName: "Measures for well-being of employees and workers", report: ["wellbeingMeasures"] },
          { qno: "3", fieldName: "Accessibility of workplaces", report: ["accessibilityOfWorkplace"] },
          { qno: "5", fieldName: "Return to work and Retention rates of permanent employees / workers", report: ["parentalLeaveReturnAndRetentionRates"] },
          { qno: "8", fieldName: "Details of Training imparted to the employees and workers on health & safety", report: ["trainingOnHealthSafetyAndSkill"] },
          { qno: "9", fieldName: "Details of performance and career development review", report: ["performanceAndCareerReview"] },
          { qno: "10", fieldName: "Health and safety management system", report: ["healthAndSafetyManagementSystem"] },
          { qno: "11", fieldName: "Details of safety-related incidents", report: ["safetyIncidents"] },
          { qno: "12", fieldName: "Measures taken by the entity to ensure a safe and healthy workplace", report: ["safeAndHealthyWorkplaceMeasures"] },
          { qno: "3L", fieldName: "Rehabilitation and suitable employment of employees/workers with high consequence injuries", report: ["rehabilitationAndAlternateEmployment"] }
        );
        break;

      case 4:
        grouped[principleKey].push(
          { qno: "1", fieldName: "Process for identification of key stakeholders", report: ["stakeholderIdentificationProcess"] },
          { qno: "2", fieldName: "Key stakeholder groups", report: ["keyStakeholderGroupsInfo"] },
          { qno: "2L", fieldName: "Using stakeholderconsultation to support theidentification andmanagement ofenvironmental, and socialtopics.", report: ["stakeholderConsultationImpact"] },
          { qno: "3L", fieldName: "Details of instances of engagement with and actions taken to address the concerns of vulnerable/marginalized groups.", report: ["vulnerableGroupConcerns"] }
        );
        break;

      case 5:
        grouped[principleKey].push(
          { qno: "1", fieldName: "Training on human rights issues and policies", report: ["humanRightsTraining"] },
          { qno: "3", fieldName: "Details of Remuneration/salary/wages (including for differently abled persons)", report: ["remunerationPractices"] },
          { qno: "6", fieldName: "Disclosure of complaints made by employees and workers on sexual harassment, discrimination at workplace, Child Labour, Forced Labour/Involuntary Labour, Wages or other human rights related issues", report: ["humanRightsComplaintsDisclosure"] }
        );
        break;

      case 6:
        grouped[principleKey].push(
          { qno: "1", fieldName: "Details of total energy consumption and energy intensity", report: ["totalEnergyConsumption"] },
          { qno: "2", fieldName: "PAT scheme of the Government of India", report: ["patSchemeParticipation"] },
          { qno: "3", fieldName: "Details of total water withdrawn, consumed and water intensity ratio", report: ["totalWaterUse"] },
          { qno: "4", fieldName: "Zero Liquid Discharge policy", report: ["zeroLiquidDischargePolicy"] },
          { qno: "5", fieldName: "Disclosure of air emissions (other than GHG emissions)", report: ["airEmissions"] },
          { qno: "6", fieldName: "Details of Scope 1 and Scope 2 greenhouse gas (GHG) emissions and GHG intensity", report: ["scope1And2Emissions"] },
          { qno: "8", fieldName: "Details of waste generated, recycled & re-used and disposed off", report: ["wasteGenerated"] },
          { qno: "9", fieldName: "Description of waste management practices", report: ["wasteManagementPractices"] },
          { qno: "11", fieldName: "Details of Environmental Impact Assessments (EIA)", report: ["eiaDetails"] },
          { qno: "1L", fieldName: "Break-up of the total energy consumed from renewable and non-renewable sources", report: ["renewableVsNonRenewable"] },
          { qno: "2L", fieldName: "Details of water discharged ", report: ["waterDischarge"] },
          { qno: "3L", fieldName: "Details of water withdrawn, consumed and water intensity ratio", report: ["totalWaterUse","waterStressAreas"] },
          { qno: "4L", fieldName: "Scope 3 emissions", report: ["scope3Emissions"] },
          { qno: "5L", fieldName: "Impact on biodiversity", report: ["biodiversityImpact"] }
        );
        break;

      case 7:
        grouped[principleKey].push(
          {
            qno: "1",
            fieldName: "Details of public policy positions advocated by the entity",
            report: [
              "policyIssuesAdvocated",
              "advocacyMethods",
              "isDisclosurePublic",
              "boardReviewFrequency",
              "disclosureLink"
            ]
          }
        );
        break;

      case 8:
        grouped[principleKey].push(
          { qno: "1", fieldName: "Details of Social Impact Assessments (SIA)", report: ["socialImpactAssessment"] },
          { qno: "3", fieldName: "Describe the mechanisms to receive grievances of the local community", report: ["localCommunityGrievance"] },
          { qno: "4", fieldName: "Percentage of inputs directly sourced from MSMEs / small producers", report: ["msmeSourcingPercent"] },
          { qno: "2L", fieldName: "CSR projects undertaken in aspirational districts", report: ["csrInAspirationalDistricts"] },
          { qno: "4L", fieldName: "Details of the benefits derived and shared from the intellectual properties owned/acquired based on traditional knowledge", report: ["iprTraditionalKnowledge"] },
          { qno: "6L", fieldName: "Details of beneficiaries of CSR Projects ", report: ["csrBeneficiaries"] }
        );
        break;

      case 9:
        grouped[principleKey].push(
          { qno: "4", fieldName: "Details of instances of product recalls on account of safety issues", report: ["productRecalls"] },
          {
            qno: "1L",
            fieldName: "Channels / platforms where information on goods and services of the business can be accessed",
            report: [
              "consumerInfoChannels",
              "consumerComplaintMechanism",
              "consumerAwarenessEfforts",
              "dataPrivacyPolicy"
            ]
          }
        );
        break;
    }
  }
console.log("grouped:",grouped);
  await BRSRSectionC.findOneAndUpdate(
    { userId, year },
    { userId, year, data: grouped },
    { upsert: true, new: true }
  );
}

module.exports = { generateBRSRSectionCData };


