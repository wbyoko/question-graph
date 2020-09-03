const { QuestionGraph } = require("./question-graph");
var csvjson = require('csvjson');
const { compile } = require('expression-eval');
const csvOptions = {
    delimiter: ',', // optional
    quote: '"' // optional
};
function isString(s) {
    return typeof s === "string";
}



const benefitResultsCSV = `identifier,provider,agency,name,url
lumpSumBenefit,Federal Government,Social Security,Lump-Sum Death Benefit,https://www.ssa.gov/forms/ssa-8.html
widowersBenefit,Federal Government,Social Security,Widow(er) or surviving divorced spouse benefits,https://www.ssa.gov/forms/ssa-10.html
childBenefit,Federal Government,Social Security,Child Benefits,https://www.ssa.gov/forms/ssa-4.html
motherFatherBenefit,Federal Government,Social Security,Mother's or Father's benefits,https://www.ssa.gov/forms/ssa-5.html
parentBenefit,Federal Government,Social Security,Parent's benefits,https://www.ssa.gov/forms/ssa-7.html
burialAllowance,Federal Government,Veterans Affairs,Burial allowance,https://www.va.gov/burials-memorials/veterans-burial-allowance/
burialNationalCemetery,Federal Government,Veterans Affairs,Burial in a national cemetery,https://www.va.gov/burials-memorials/eligibility/
verteransHeadstone,Federal Government,Veterans Affairs,Veterans headstone or grave marker,https://www.va.gov/burials-memorials/memorial-items/headstones-markers-medallions/
dependencyIndemnityCompensation,Federal Government,Veterans Affairs,VA Dependency and Indemnity Compensation,https://www.va.gov/disability/dependency-indemnity-compensation/
survivorsPersion,Federal Government,Veterans Affairs,Survivors Pension,https://www.va.gov/pension/survivors-pension/
healthCareBenefit,Federal Government,Veterans Affairs,Health care benefits,https://www.va.gov/health-care/family-caregiver-benefits/
educationalBenefit,Federal Government,Veterans Affairs,Educational benefits,https://www.va.gov/education/survivor-dependent-benefits/
homeLoan,Federal Government,Veterans Affairs,Home Loans,https://www.va.gov/housing-assistance/home-loans/surviving-spouse/
monthOfDeath,Federal Government,Veterans Affairs,Veterans Month of Death Benefits,https://www.benefits.va.gov/BENEFITS/docs/VASurvivorsKit.pdf
vaLifeInsurance,Federal Government,Veterans Affairs,VA Life Insurance - SGLI,https://www.va.gov/life-insurance/
groupLifeInsurance,Federal Government,Veterans Affairs,VA Family Servicemembers’ Group Life Insurance,
financialCounseling,Federal Government,Veterans Affairs,Beneficiary financial counseling services,
bereavementCounseling,Federal Government,Veterans Affairs,Bereavement counseling,http://www.vetcenter.va.gov/Bereavement_Counseling.asp
publicSafetyOfficerBenefitsDeath,Federal Government,Bureau of Justice Assitance,Public Safety Officers' Benefits - Death,https://psob.bja.ojp.gov/benefits/
publicSafetyOfficerBenefitsEducation,Federal Government,Bureau of Justice Assitance,Public Safety Officers' Benefits - Education,https://psob.bja.ojp.gov/benefits/
dodHomeownerAssistanceProgram,Federal Government,Department of Defense,DOD Homeowners Assistance Program,https://www.usace.army.mil/Missions/Military-Missions/Real-Estate/HAP/
dodSurvivorBenefitPlan,Federal Government,Department of Defense,DOD Survivor Benefit Plan,https://militarypay.defense.gov/Benefits/Survivor-Benefit-Program/
dodDeathGratuity,Federal Government,Department of Defense,DOD Death Gratuity,https://militarypay.defense.gov/Benefits/Death-Gratuity/`;

const questionsCSV = `identifier,question,type,choices,dependencies
relationship,What is your relationship to the deceased?,multi-choice,"Parent, Spouse, Divorced Spouse, Parent to Child of the deceased, Child, Other",
work,Was the deceased ever have a job?,yes/no,,
lineOfDuty,Is the deceased a Service Member who died in the line of duty?,yes/no,,
veteran,Is the deceased a Veteran who died from a service related injury / illness?,yes/no,,
publicSafetyOfficer,Is the deceased a first responder / public safety officer?,yes/no,,"relationship = spouse, child"
age,What is your age as the survivor?,number,,
dependant,Are you a dependant of the deceased?,yes/no,,relationship = parent
disabled,Are you disabled?,yes/no,,"relationship = spouse, divorced spouse, child"
caringForChild,Are you taking care of a child less than 16 or disabled?,yes/no,,"relationship = spouse, divorced spouse, parent to child"
unmarried,are you unmarried?,yes/no,,"relationship = spouse, divorced spouse, parent to child, child"
married10Years,Did your marriage last for at least 10 years?,yes/no,,relationship = divorced spouse
fullTimeStudent,Are you a full time student?,yes/no,,relationship = child; age = 18-19
noSurvivingSpouse,Is there no surviving spouse?,yes/no,,relationship = child
disabledBefore18,Were you disabled before 18?,yes/no,,"relationship = child; age >= 18; deceased = veteran, service member"
disabledBefore22,Were you disabled before 22?,yes/no,,relationship = child; age >=19
studentAtVASchool,Are you a student at a VA approved school,yes/no,,relationship = child; age = 18-23; deceased = veteran
higherEducation,Are you enrolled in higher education?,yes/no,,relationship = child; age = 18-23; deceased = service member
survivingSpouseDIC,Is surviving spouse receiving DIC benefits?,yes/no,,"relationship = child; age <18, 18-23 (higher education = yes); unmarried = yes; deceased = veteran, service member; "`;

const edgesCSV = `from,to,when
relationship,age_parent,!!relationship['Parent'] 
age_parent,dependant_over62_parent,age > 62
dependant_over62_parent,parentBenefit,dependant
relationship,age_spouse,!!relationship['Spouse'] 
age_spouse,widowersBenefit,age >= 60
age_spouse,disabled_59-50_spouse,age < 60 && age >= 50
disabled_59-50_spouse,widowersBenefit,disabled
relationship,lumpSumBenefit,!!relationship['Spouse'] 
relationship,caringForChild,!!relationship['Spouse'] || !!relationship['Divorced Spouse'] ||  !!relationship['Parent to Child of the deceased']
caringForChild,unmarried_caringForChild,caringForChild
unmarried_caringForChild,motherFatherBenefit,unmarried
relationship,publicSafetyOfficer,!!relationship['Spouse'] 
publicSafetyOfficer,educationalBenefit,publicSafetyOfficer
relationship,age_divorcedSpouse, !!relationship['Divorced Spouse']
age_divorcedSpouse,married10Years,age >= 60
age_divorcedSpouse,disabled_59-50_divorcedSpouse,age < 60 && age >= 50
disabled_59-50_divorcedSpouse,married10Years,disabled`;

const benefitJson = csvjson.toObject(benefitResultsCSV, csvOptions);
const questionJson = csvjson.toObject(questionsCSV, csvOptions);
const edgeJson = csvjson.toObject(edgesCSV, csvOptions);


console.log(benefitJson, questionJson, edgeJson);


let benefitsGraph = new QuestionGraph();

for (const result of benefitJson) {
    benefitsGraph.addResult(result.identifier, result);
}

for (const question of questionJson) {
    if (question.choices) {
        question.choice = question.choices.split(',').map(s => s.trim());
    }
    benefitsGraph.addQuestion(question.identifier, question);
}


for (const edge of edgeJson) {

    const noop = () => { };
    const getCreateNodeFromLabel = (label) => {
        let node = benefitsGraph.nodeMap.get(label);
        let questionId;

        if (!node) {
            questionId = label.split('_')[0];
            console.log(questionId, 'new quesitons')
            const question = benefitsGraph.questionMap.get(questionId);
            if (question) {
                node = benefitsGraph.addVertex(label, questionId);
            } else {
                console.warn(`no node ${label} or question ${questionId} exists`);
                return {};
            }
        } else {
            if (node.data && isString(node.data)) {
                questionId = node.data;
            }
        }

        return { node, questionId };
    };

    let from = getCreateNodeFromLabel(edge.from);
    let to = getCreateNodeFromLabel(edge.to);


    console.log(edge.from, from, edge.to, to)
    if (from.node && to.node) {

        const when = ((from) => {
            const compiled = edge.when && compile(edge.when);

            return (data) => {
                if (data[from.questionId] != null) {
                    const res = (compiled || noop)(data);
                    console.log(from.node.id, from.questionId, edge.when, res)
                    return res;
                }
            };
        })(from);

        benefitsGraph.addEdge(edge.from, edge.to, when);
    }
}


console.log('benefitsGraph loaded', benefitsGraph);
benefitsGraph.finalize();

module.exports = { questionGraph: benefitsGraph };