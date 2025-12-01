// src/components/RiskChart.tsx
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Box, Heading, Text, VStack, Divider, Flex, Progress } from '@chakra-ui/react';
import type { LoanApplication } from '../services/api';

interface RiskFactor {
    feature: string;
    shap_score: number;
}

interface Props {
    factors: RiskFactor[];
    formData: LoanApplication;
}

// Helper to translate code to English with dynamic values
const getExplanation = (feature: string, score: number, data: LoanApplication) => {
    const impact = score > 0 ? "negative" : "positive";

    if (feature === "AMT_ANNUITY") return `Loan EMI is too high relative to monthly income ($${data.income}).`;
    if (feature === "YEARS_EMPLOYED") return `Employment Length (${data.years_employed} years) shows ${score > 0 ? "instability" : "consistent income"}.`;
    if (feature === "AGE_YEARS" || feature === "age") return `Applicant age (${data.age}) falls within a ${score > 0 ? "higher-risk" : "stable"} demographic.`;
    if (feature === "AMT_CREDIT") return `Requested Loan ($${data.loan_amount}) is ${score > 0 ? "high" : "reasonable"} for this profile.`;
    if (feature === "AMT_INCOME_TOTAL" || feature === "income") return `Annual Income ($${data.income}) is ${score > 0 ? "insufficient" : "sufficient"} for repayment.`;
    if (feature === "CODE_GENDER") return `Demographic statistical adjustment applied.`;
    if (feature === "EXT_SOURCE_3" || feature === "credit_score") return `External Bureau Score (${data.credit_score}) indicates ${score > 0 ? "poor" : "excellent"} credit history.`;

    return `${feature} value had a ${impact} impact on risk.`;
};

export const RiskChart = ({ factors, formData }: Props) => {
    if (!factors || factors.length === 0) return null;

    return (
        <Box mt={6} p={6} bg="gray.800" borderRadius="md" border="1px solid" borderColor="gray.700">
            {/* The Graph */}
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
                                <Cell key={`cell-${index}`} fill={entry.shap_score > 0 ? "#E53E3E" : "#48BB78"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            <Divider borderColor="gray.600" mb={6} />

            {/* The Explanation List */}
            <Box>
                <Flex align="center" mb={2}>
                    <Text fontSize="lg" mr={2}>📄</Text>
                    <Heading size="md" color="white">Decision Rationale (Explainable AI)</Heading>
                </Flex>
                <Text color="gray.500" fontSize="sm" mb={6}>
                    Top factors influencing this specific credit decision:
                </Text>

                <VStack align="stretch" spacing={4}>
                    {factors.map((f, i) => {
                        // Negative SHAP usually means lower risk (good) in many models, but let's stick to the color convention: Red (High Risk) vs Green (Low Risk). 
                        // Actually, typically High SHAP = High Probability of Default = Bad.
                        // So Score > 0 is BAD (Red), Score < 0 is GOOD (Green).

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
                                        {getExplanation(f.feature, f.shap_score, formData)}
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