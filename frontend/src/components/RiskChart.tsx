// src/components/RiskChart.tsx
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Box, Heading, Text, VStack, Divider, Flex, Progress } from '@chakra-ui/react';
import type { LoanApplication } from '../services/api';

interface RiskFactor {
    feature: string;
    shap_score?: number; // Optional now
    reason?: string;     // For Policy Rejections
}

interface Props {
    factors: RiskFactor[];
    formData: LoanApplication;
}

// Helper to translate code to English with dynamic values
const getExplanation = (factor: RiskFactor, data: LoanApplication) => {
    const { feature, shap_score, reason } = factor;

    // 1. Handle Policy Rejection
    if (feature === "Policy" && reason) {
        return `Application rejected by policy: ${reason}`;
    }

    // 2. Handle ML Explanations
    const score = shap_score || 0;
    const impact = score > 0 ? "negative" : "positive";
    const isHighRisk = score > 0;

    // Safety check for data
    if (!data) return `${feature} had a ${impact} impact.`;

    const income = data.income || 0;
    const loan = data.loan_amount || 0;
    const age = data.age || 0;
    const years = data.years_employed || 0;
    const monthlyIncome = income / 12;
    const estimatedEMI = loan / 12; // Simplified assumption from backend

    try {
        if (feature === "AMT_ANNUITY") {
            return isHighRisk
                ? `Estimated monthly obligation ($${Math.round(estimatedEMI)}) is high relative to monthly income ($${Math.round(monthlyIncome)}), straining repayment capacity.`
                : `Estimated monthly obligation is well within the safe debt-to-income ratio based on reported income.`;
        }

        if (feature === "YEARS_EMPLOYED") {
            return isHighRisk
                ? `Employment tenure of ${years} years suggests potential income instability, a key risk indicator.`
                : `Employment tenure of ${years} years demonstrates strong professional stability and consistent income generation.`;
        }

        if (feature === "AGE_YEARS" || feature === "age") {
            return isHighRisk
                ? `Applicant age (${age}) places them in a demographic segment with historically higher default rates.`
                : `Applicant age (${age}) falls within a low-risk demographic segment with stable repayment history.`;
        }

        if (feature === "AMT_CREDIT") {
            return isHighRisk
                ? `Requested loan amount of $${loan.toLocaleString()} is substantial relative to the applicant's current financial profile.`
                : `Requested loan amount of $${loan.toLocaleString()} is within a conservative range for this profile.`;
        }

        if (feature === "AMT_INCOME_TOTAL" || feature === "income") {
            return isHighRisk
                ? `Annual income of $${income.toLocaleString()} falls below the optimal threshold for this loan tier, increasing default probability.`
                : `Annual income of $${income.toLocaleString()} provides a strong financial buffer for loan repayment.`;
        }

        if (feature === "NAME_CONTRACT_TYPE") {
            return isHighRisk
                ? `Unsecured 'Cash Loans' carry a higher statistical risk weight compared to asset-backed financing.`
                : `Contract type aligns with lower-risk lending categories.`;
        }

        if (feature === "CODE_GENDER") {
            return `Demographic factors have been adjusted based on statistical risk models.`;
        }

        if (feature === "EXT_SOURCE_3" || feature === "credit_score") {
            return isHighRisk
                ? `External Bureau Score (${data.credit_score || 'N/A'}) indicates a history of credit management challenges.`
                : `External Bureau Score (${data.credit_score || 'N/A'}) reflects an excellent credit history and responsible borrowing.`;
        }

    } catch (e) {
        return `${feature} contributed to the risk score.`;
    }

    return `${feature} value had a ${impact} impact on the risk model.`;
};

export const RiskChart = ({ factors, formData }: Props) => {
    if (!factors || !Array.isArray(factors) || factors.length === 0) return null;

    // Check if it's a policy rejection (no shap_scores)
    const isPolicyRejection = factors.some(f => f.feature === "Policy");

    return (
        <Box mt={6} p={6} bg="gray.800" borderRadius="md" border="1px solid" borderColor="gray.700">
            {/* The Graph - Only show if NOT policy rejection and has scores */}
            {!isPolicyRejection && (
                <Box height="250px" width="100%" mb={8}>
                    <Heading size="sm" mb={4} color="gray.300" textTransform="uppercase" letterSpacing="wide">
                        Model Contribution (SHAP Values)
                    </Heading>
                    <ResponsiveContainer>
                        <BarChart data={factors} layout="vertical" margin={{ left: 10 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="feature" type="category" width={140} tick={{ fill: '#A0AEC0', fontSize: 11 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#171923', border: 'none' }} itemStyle={{ color: 'white' }} />
                            <Bar dataKey="shap_score" radius={[0, 4, 4, 0]} barSize={20}>
                                {factors.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={(entry?.shap_score || 0) > 0 ? "#E53E3E" : "#48BB78"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <Divider borderColor="gray.600" mb={6} mt={6} />
                </Box>
            )}

            {/* The Explanation List */}
            <Box>
                <Flex align="center" mb={2}>
                    <Text fontSize="lg" mr={2}>📄</Text>
                    <Heading size="md" color="white">Decision Rationale {isPolicyRejection ? "(Policy Engine)" : "(Explainable AI)"}</Heading>
                </Flex>
                <Text color="gray.500" fontSize="sm" mb={6}>
                    {isPolicyRejection ? "Automatic rejection based on lending rules:" : "Top factors influencing this specific credit decision:"}
                </Text>

                <VStack align="stretch" spacing={4}>
                    {factors.map((f, i) => {
                        // Handle Policy Case
                        if (f.feature === "Policy") {
                            return (
                                <Box
                                    key={i}
                                    bg="rgba(255,0,0,0.05)"
                                    p={4}
                                    borderRadius="md"
                                    borderLeft="4px solid"
                                    borderLeftColor="red.500"
                                >
                                    <Flex justify="space-between" align="center">
                                        <Text color="red.200" fontSize="sm" fontWeight="bold">
                                            ⛔ {getExplanation(f, formData)}
                                        </Text>
                                    </Flex>
                                </Box>
                            );
                        }

                        // Handle ML Case
                        if (typeof f.shap_score !== 'number') return null;

                        const color = f.shap_score > 0 ? "red.500" : "green.400";
                        const barColor = f.shap_score > 0 ? "red" : "green";

                        return (
                            <Box
                                key={i}
                                bg="rgba(255,255,255,0.03)"
                                p={4}
                                borderRadius="md"
                                borderLeft="4px solid"
                                borderLeftColor={color}
                                position="relative"
                            >
                                <Flex justify="space-between" align="center" mb={2}>
                                    <Text color="gray.300" fontSize="sm" fontWeight="medium">
                                        {getExplanation(f, formData)}
                                    </Text>
                                    <Text color={color} fontSize="xs" fontWeight="bold" whiteSpace="nowrap" ml={4}>
                                        {f.shap_score > 0 ? "+" : ""}{f.shap_score.toFixed(3)} Impact
                                    </Text>
                                </Flex>
                                <Progress
                                    value={Math.abs(f.shap_score) * 100} // Scale for visual
                                    size="xs"
                                    colorScheme={barColor}
                                    bg="rgba(255,255,255,0.1)"
                                    borderRadius="full"
                                />
                            </Box>
                        );
                    })}
                </VStack>
            </Box>
        </Box>
    );
};